import { withTrace } from '@openai/agents';
import { Runner } from '@openai/agents';
import {
  plannerAgent,
  writerAgent,
  WebSearchPlan,
  WebSearchItem,
  ReportData,
} from './agents';
import { WebSearchAgent, SearchResult } from './web-search-agent';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as readline from 'node:readline/promises';

export class ResearchManager {
  private runner: Runner;
  private webSearchAgent: WebSearchAgent;

  constructor(runner: Runner = new Runner()) {
    this.runner = runner;
    this.webSearchAgent = new WebSearchAgent();
  }

  async conductResearch(query: string, interactive: boolean = false): Promise<void> {
    await withTrace('Research Agent Workflow', async (trace) => {
      console.log(`🔍 Starting research for: "${query}"`);
      console.log(`📊 Trace ID: https://platform.openai.com/traces/trace?trace_id=${trace.traceId}\n`);

      // Step 1: Plan the research strategy
      const searchPlan = await this.planResearchStrategy(query);
      
      // Step 2: Execute all searches
      const searchResults = await this.executeSearches(searchPlan);
      
      // Step 3: Generate comprehensive report
      const report = await this.generateReport(query, searchResults);
      
      // Step 4: Display results
      this.displayResults(report);

      // Step 5: Ask to save report if in interactive mode
      if (interactive) {
        await this.promptToSaveReport(report, query);
      }
    });
  }

  private async planResearchStrategy(query: string): Promise<WebSearchPlan> {
    console.log('📋 Planning research strategy...');
    
    const result = await this.runner.run(
      plannerAgent, 
      `Research Question: ${query}`
    );
    
    const searchPlan = result.finalOutput as WebSearchPlan;
    console.log(`✅ Generated ${searchPlan.searches.length} search queries\n`);
    
    return searchPlan;
  }

  private async executeSearches(searchPlan: WebSearchPlan): Promise<SearchResult[]> {
    console.log('🔎 Executing web searches...');
    
    const searchQueries = searchPlan.searches.map(item => ({
      query: item.query,
      reason: item.reason
    }));
    
    // Use WebSearchAgent for parallel searches with citations
    const results = await this.webSearchAgent.performMultipleSearches(searchQueries);
    
    // Log progress
    searchPlan.searches.forEach((item, index) => {
      const hasResult = index < results.length && results[index].content.length > 0;
      const status = hasResult ? '✓' : '✗';
      console.log(`   ${status} Search ${index + 1}/${searchPlan.searches.length}: "${item.query}"`);
    });
    
    console.log(`✅ Completed ${results.length}/${searchPlan.searches.length} searches\n`);
    
    return results;
  }

  // This method is no longer needed as we use WebSearchAgent directly

  private async generateReport(query: string, searchResults: SearchResult[]): Promise<ReportData> {
    console.log('📝 Generating comprehensive report...');
    
    // Collect all unique citations
    const allCitations = new Map<string, { url: string; title: string }>();
    
    searchResults.forEach(result => {
      result.citations.forEach(citation => {
        allCitations.set(citation.url, {
          url: citation.url,
          title: citation.title
        });
      });
    });
    
    // Truncate content to manage token usage
    const truncatedResults = searchResults.map((result, index) => ({
      content: result.content.substring(0, 800) + (result.content.length > 800 ? '...' : ''),
      citations: result.citations
    }));

    const reportInput = `Research Question: ${query}

Important Instructions:
- Create a comprehensive report with proper citations using [Source Title](URL) format
- Reference specific sources when making claims
- Include a Sources section at the end

Available Sources:
${Array.from(allCitations.values()).map((citation, index) => 
  `${index + 1}. [${citation.title}](${citation.url})`
).join('\n')}

Research Findings (truncated for efficiency):
${truncatedResults.map((result, index) => `
--- Result ${index + 1} ---
${result.content}
Citations: ${result.citations.map(cite => `[${cite.title}](${cite.url})`).join(', ')}
`).join('\n')}`;

    const result = await this.runner.run(writerAgent, reportInput);
    console.log('✅ Report generation complete\n');
    
    const reportData = result.finalOutput as ReportData;
    
    // Ensure sources are populated from citations
    if (!reportData.sources || reportData.sources.length === 0) {
      reportData.sources = Array.from(allCitations.values()).map(citation => ({
        url: citation.url,
        title: citation.title,
        description: 'Research source'
      }));
    }
    
    return reportData;
  }

  private displayResults(report: ReportData): void {
    console.log('=' .repeat(80));
    console.log('📄 RESEARCH REPORT');
    console.log('=' .repeat(80));
    
    console.log('\n🔍 EXECUTIVE SUMMARY');
    console.log('-' .repeat(40));
    console.log(report.executiveSummary);
    
    console.log('\n📋 KEY FINDINGS');
    console.log('-' .repeat(40));
    report.keyFindings.forEach((finding, index) => {
      console.log(`${index + 1}. ${finding}`);
    });
    
    console.log('\n📄 DETAILED REPORT');
    console.log('-' .repeat(40));
    console.log(report.markdownReport);
    
    console.log('\n🤔 SUGGESTED FOLLOW-UP QUESTIONS');
    console.log('-' .repeat(40));
    report.followUpQuestions.forEach((question, index) => {
      console.log(`${index + 1}. ${question}`);
    });
    
    console.log('\n📚 SOURCES CONSULTED');
    console.log('-' .repeat(40));
    report.sources.forEach((source, index) => {
      console.log(`${index + 1}. ${source.title}`);
      console.log(`   🔗 ${source.url}`);
      if (source.description) {
        console.log(`   📝 ${source.description}`);
      }
      console.log('');
    });
    
    console.log('=' .repeat(80));
    console.log('✅ Research complete with proper citations!');
  }

  private async promptToSaveReport(report: ReportData, originalQuery: string): Promise<void> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    try {
      const answer = await rl.question('\nWould you like to save this report as a markdown file? (y/n): ');
      
      if (answer.toLowerCase().trim() === 'y') {
        await this.saveReportToFile(report, originalQuery);
      }
    } finally {
      rl.close();
    }
  }

  private async saveReportToFile(report: ReportData, originalQuery: string): Promise<void> {
    try {
      // Generate timestamped filename
      const now = new Date();
      const timestamp = now.toISOString()
        .replace(/[:.]/g, '-')
        .replace('T', '-')
        .split('.')[0]; // Remove milliseconds
      
      const filename = `report_${timestamp}.md`;
      const filepath = path.join(process.cwd(), filename);

      // Create markdown content
      const markdownContent = this.generateMarkdownFile(report, originalQuery);

      // Save to file
      await fs.writeFile(filepath, markdownContent, 'utf-8');
      
      console.log(`\n✅ Report saved as: ${filename}`);
    } catch (error) {
      console.error(`\n❌ Failed to save report: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private generateMarkdownFile(report: ReportData, originalQuery: string): string {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `# Research Report

**Research Question:** ${originalQuery}
**Generated:** ${dateString}
**Research Agent:** AI-Powered Research Assistant

---

## Executive Summary

${report.executiveSummary}

---

## Key Findings

${report.keyFindings.map((finding, index) => `${index + 1}. ${finding}`).join('\n')}

---

${report.markdownReport}

---

## Follow-up Questions

${report.followUpQuestions.map((question, index) => `${index + 1}. ${question}`).join('\n')}

---

## Sources

${report.sources.map((source, index) => 
  `${index + 1}. [${source.title}](${source.url})${source.description ? `\n   - ${source.description}` : ''}`
).join('\n\n')}

---

*Report generated by AI Research Agent*
`;
  }
}