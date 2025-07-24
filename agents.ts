import { Agent } from '@openai/agents';
import { z } from 'zod';
import OpenAI from 'openai';

// Planner Agent - Creates search strategy for research query
const plannerPrompt = `You are a research planning assistant.
Given a research question, create a search strategy by generating 8-12 specific search queries.
Each query should target different aspects of the topic to ensure thorough coverage.
Focus on current, factual information and diverse perspectives.`;

export const WebSearchItem = z.object({
  reason: z
    .string()
    .describe('Explanation of why this search query is important for answering the research question'),
  query: z
    .string()
    .describe('The specific search term or phrase to use for web search'),
});

export type WebSearchItem = z.infer<typeof WebSearchItem>;

export const WebSearchPlan = z.object({
  searches: z
    .array(WebSearchItem)
    .describe('List of strategic web searches to comprehensively research the topic'),
});

export type WebSearchPlan = z.infer<typeof WebSearchPlan>;

export const plannerAgent = new Agent({
  name: 'ResearchPlannerAgent',
  instructions: plannerPrompt,
  model: 'gpt-4o-mini',
  outputType: WebSearchPlan,
});

// Note: Search functionality is now handled by WebSearchAgent class
// This eliminates the need for a separate search agent since we're using
// OpenAI's native web search capabilities directly

// Writer Agent - Synthesizes research into comprehensive report
const writerPrompt = `You are a professional research writer tasked with creating comprehensive, well-structured reports.
You will receive a research question and summaries from multiple web searches on the topic.

Your task:
1. Analyze all the research summaries
2. Create a structured, professional report in markdown format
3. Include an executive summary, main findings, analysis, and conclusions
4. Ensure the report is thorough (aim for 800-1500 words)
5. Cite key information and maintain objectivity
6. Structure the report logically with clear headings and sections

The report should be informative, well-organized, and provide valuable insights on the research topic.`;

export const ReportData = z.object({
  executiveSummary: z
    .string()
    .describe('A concise 2-3 sentence overview of the main findings'),
  markdownReport: z
    .string()
    .describe('The complete research report in markdown format with proper citations'),
  keyFindings: z
    .array(z.string())
    .describe('List of 3-5 most important discoveries or insights'),
  followUpQuestions: z
    .array(z.string())
    .describe('Suggested questions for further research or investigation'),
  sources: z
    .array(z.object({
      url: z.string(),
      title: z.string(),
      description: z.string().nullable(),
    }))
    .describe('List of all sources used in the research with proper attribution'),
});

export type ReportData = z.infer<typeof ReportData>;

export const writerAgent = new Agent({
  name: 'ReportWriterAgent',
  instructions: writerPrompt,
  model: 'gpt-4o-mini',
  outputType: ReportData,
});