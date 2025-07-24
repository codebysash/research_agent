import * as dotenv from 'dotenv';
import { ResearchManager } from './manager';

// Load environment variables
dotenv.config();

async function runDemo() {
  console.log('🚀 Research Agent Demonstration');
  console.log('=' .repeat(50));
  console.log('This demo will showcase the research agent\'s capabilities');
  console.log('by conducting research on a sample question.\n');

  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY not found in environment variables.');
    console.error('Please add your OpenAI API key to the .env file');
    process.exit(1);
  }

  // Sample research questions to demonstrate different capabilities
  const demoQuestions = [
    {
      question: "What are the latest developments in renewable energy technology in 2024?",
      description: "Demonstrates research on current technology trends"
    },
    {
      question: "How is artificial intelligence being used in healthcare today?",
      description: "Shows capability to research AI applications in specific industries"
    },
    {
      question: "What are the environmental impacts of electric vehicle adoption?",
      description: "Illustrates research on environmental and sustainability topics"
    }
  ];

  console.log('📋 Available Demo Questions:');
  console.log('-' .repeat(30));
  demoQuestions.forEach((demo, index) => {
    console.log(`${index + 1}. ${demo.question}`);
    console.log(`   → ${demo.description}\n`);
  });

  // For this demo, we'll use the first question
  const selectedDemo = demoQuestions[0];
  
  console.log(`🎯 Selected Demo Question:`);
  console.log(`"${selectedDemo.question}"\n`);
  
  console.log('⏳ Starting research demonstration...\n');
  console.log('This process will:');
  console.log('1. 📋 Plan strategic search queries');
  console.log('2. 🔎 Execute web searches in parallel');
  console.log('3. 📝 Generate a comprehensive report');
  console.log('4. 📊 Display results with key findings\n');

  const startTime = Date.now();
  const manager = new ResearchManager();

  try {
    await manager.conductResearch(selectedDemo.question);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    
    console.log('\n🎉 DEMONSTRATION COMPLETE!');
    console.log('=' .repeat(50));
    console.log(`⏱️  Total research time: ${duration} seconds`);
    console.log('✅ Successfully demonstrated:');
    console.log('   • Intelligent research planning');
    console.log('   • Parallel web search execution');
    console.log('   • Comprehensive report generation'); 
    console.log('   • Structured output formatting\n');
    
    console.log('💡 Next Steps:');
    console.log('   • Run "npm start" for interactive mode');
    console.log('   • Try your own research questions');
    console.log('   • Explore different topic areas\n');
    
  } catch (error) {
    console.error('\n❌ Demo failed with error:');
    console.error(error instanceof Error ? error.message : String(error));
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   • Check your OpenAI API key in .env file');
    console.log('   • Ensure you have internet connectivity');
    console.log('   • Try running "npm install" again\n');
    process.exit(1);
  }
}

// Handle graceful shutdown during demo
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Demo interrupted. Goodbye!');
  process.exit(0);
});

// Run the demonstration
if (require.main === module) {
  console.log('🔄 Initializing Research Agent Demo...\n');
  
  runDemo().catch((error) => {
    console.error('❌ Fatal demo error:', error);
    process.exit(1);
  });
}