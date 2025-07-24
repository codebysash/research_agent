import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

export interface SearchResult {
  content: string;
  citations: Array<{
    url: string;
    title: string;
    startIndex: number;
    endIndex: number;
  }>;
}

export class WebSearchAgent {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async search(query: string, context?: string): Promise<SearchResult> {
    try {
      const searchPrompt = context 
        ? `Search for: ${query}\nContext: ${context}\n\nProvide a comprehensive summary of current information on this topic.`
        : `Search for: ${query}\n\nProvide a comprehensive summary of current information on this topic.`;

      const response = await this.client.responses.create({
        model: 'gpt-4o-mini',
        tools: [{ 
          type: 'web_search_preview',
          search_context_size: 'medium',
          user_location: {
            type: 'approximate',
            country: 'US'
          }
        }],
        input: searchPrompt,
      });

      // Extract content and citations from response
      const content = response.output_text || '';
      const citations: Array<{
        url: string;
        title: string;
        startIndex: number;
        endIndex: number;
      }> = [];

      // Parse response output for citations
      if (response.output && Array.isArray(response.output)) {
        for (const item of response.output) {
          if (item.type === 'message' && item.content && Array.isArray(item.content)) {
            for (const contentItem of item.content) {
              if (contentItem.type === 'output_text' && contentItem.annotations) {
                for (const annotation of contentItem.annotations) {
                  if (annotation.type === 'url_citation') {
                    citations.push({
                      url: annotation.url,
                      title: annotation.title || 'Source',
                      startIndex: annotation.start_index,
                      endIndex: annotation.end_index,
                    });
                  }
                }
              }
            }
          }
        }
      }

      return {
        content,
        citations,
      };

    } catch (error) {
      console.error('Web search failed:', error);
      return {
        content: `Search failed for query: "${query}". Error: ${error instanceof Error ? error.message : String(error)}`,
        citations: [],
      };
    }
  }

  async performMultipleSearches(queries: Array<{ query: string; reason: string }>): Promise<SearchResult[]> {
    const searchPromises = queries.map(async ({ query, reason }) => {
      return this.search(query, reason);
    });

    const results = await Promise.allSettled(searchPromises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<SearchResult> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
  }
}