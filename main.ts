import * as dotenv from 'dotenv';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { ResearchManager } from './manager';

// Load environment variables
dotenv.config();

async function main() {
  console.log('🤖 Research Agent');
  console.log('================');
  console.log('Ask me any question and I will research it thoroughly for you!\n');

  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY not found in environment variables.');
    console.error('Please add your OpenAI API key to the .env file');
    process.exit(1);
  }

  const rl = readline.createInterface({ input, output });

  try {
    while (true) {
      console.log('💭 What would you like me to research?');
      console.log('   (Type "exit" to quit, "help" for examples)\n');
      
      const query = await rl.question('Your question: ');
      
      // Handle special commands
      if (query.toLowerCase() === 'exit') {
        console.log('\n👋 Goodbye! Thanks for using Research Agent.');
        break;
      }
      
      if (query.toLowerCase() === 'help') {
        displayHelp();
        continue;
      }
      
      if (query.trim() === '') {
        console.log('⚠️  Please enter a research question.\n');
        continue;
      }

      console.log('\n🚀 Starting research...\n');
      
      const startTime = Date.now();
      const manager = new ResearchManager();
      
      try {
        await manager.conductResearch(query, true); // Enable interactive mode
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`⏱️  Research completed in ${duration} seconds\n`);
        
      } catch (error) {
        console.error('❌ An error occurred during research:');
        console.error(error instanceof Error ? error.message : String(error));
        console.log('');
      }
    }
  } catch (error) {
    console.error('❌ An unexpected error occurred:', error);
  } finally {
    rl.close();
  }
}

function displayHelp() {
  console.log('\n📚 Example Research Questions:');
  console.log('─────────────────────────────');
  console.log('• "What are the latest developments in artificial intelligence?"');
  console.log('• "How is climate change affecting global food security?"');
  console.log('• "What are the current trends in renewable energy adoption?"');
  console.log('• "What is the impact of remote work on productivity?"');
  console.log('• "What are the newest treatments for diabetes?"');
  console.log('• "How is blockchain technology being used in supply chains?"');
  console.log('\n💡 Tips:');
  console.log('• Ask specific, focused questions for better results');
  console.log('• Questions about current events and trends work best');
  console.log('• The more specific your question, the more targeted the research\n');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Research Agent shutting down. Goodbye!');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Research Agent shutting down. Goodbye!');
  process.exit(0);
});

// Start the application
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}