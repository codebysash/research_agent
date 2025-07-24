# Research Agent

A TypeScript application that uses OpenAI agents to conduct thorough research on any topic and generate comprehensive reports.

## Features

- **Intelligent Research Planning**: Automatically generates strategic search queries for comprehensive topic coverage
- **Native Web Search with Citations**: Uses OpenAI's native web search API with proper source attribution
- **Multi-Agent Coordination**: Coordinates between planner and writer agents with direct web search integration
- **Comprehensive Reports with Citations**: Generates detailed markdown reports with proper citations, key findings, and follow-up questions
- **Source Attribution**: All claims are backed by clickable citations with full source information
- **Interactive CLI**: User-friendly command-line interface with help, examples, and report saving functionality

## Architecture

The application consists of these main components:

1. **Planner Agent** (`plannerAgent`): Analyzes research questions and creates strategic search plans
2. **Web Search Agent** (`WebSearchAgent`): Uses OpenAI's native web search API with citation extraction
3. **Writer Agent** (`writerAgent`): Synthesizes research into comprehensive reports with proper citations
4. **Research Manager** (`ResearchManager`): Coordinates the entire workflow with proper tracing and error handling

### Citation System

The application now uses OpenAI's native web search capabilities which provide:
- **Automatic Citations**: All search results include proper source attribution
- **URL Citations**: Clickable links to original sources
- **Source Verification**: Each claim is backed by verifiable sources
- **Citation Formatting**: Proper markdown formatting with inline citations

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up your OpenAI API key**:
   Create a `.env` file in the project root and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Usage

### Quick Demo

To see the research agent in action with a sample question:
```bash
npm run demo
```

This will demonstrate the complete research workflow using a predefined question about renewable energy technology.

### Interactive Mode

Run the full interactive application:
```bash
npm start
```

The application will start an interactive CLI where you can:

- Ask research questions on any topic
- Type `help` to see example questions
- Type `exit` to quit the application

### Example Research Questions

- "What are the latest developments in artificial intelligence?"
- "How is climate change affecting global food security?"
- "What are the current trends in renewable energy adoption?"
- "What is the impact of remote work on productivity?"
- "What are the newest treatments for diabetes?"

## Output Format

For each research question, the application provides:

1. **Executive Summary**: Concise overview of main findings
2. **Key Findings**: 3-5 most important discoveries with citations
3. **Detailed Report**: Comprehensive markdown-formatted analysis with inline citations
4. **Follow-up Questions**: Suggestions for further research
5. **Sources Consulted**: Complete list of all sources with clickable URLs
6. **Report Saving**: Option to save reports as timestamped markdown files

## Project Structure

```
research-agent/
├── main.ts              # CLI entry point
├── manager.ts           # Research workflow coordinator
├── agents.ts            # Agent definitions and types
├── web-search-agent.ts  # OpenAI web search integration with citations
├── demo.ts              # Demonstration script
├── example-queries.txt  # Sample research questions
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── .env                # Environment variables (not tracked)
```

## Requirements

- Node.js 18+
- OpenAI API key with access to web search functionality
- TypeScript support

## Development

To check TypeScript compilation:
```bash
npm run build-check
```

## Error Handling

The application includes comprehensive error handling for:
- Missing API keys
- Network failures during searches
- Invalid queries
- Agent execution errors

## License

This project is for educational and research purposes.