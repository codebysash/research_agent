'use client'

import { useState } from 'react'

interface ResearchFormProps {
  onSubmit: (query: string) => void
}

const exampleQuestions = [
  "What are the latest developments in artificial intelligence?",
  "How is climate change affecting global food security?",
  "What are the current trends in renewable energy adoption?",
  "What is the impact of remote work on productivity?",
  "What are the newest treatments for diabetes?",
  "How is blockchain technology being used in supply chains?",
]

export function ResearchForm({ onSubmit }: ResearchFormProps) {
  const [query, setQuery] = useState('')
  const [showExamples, setShowExamples] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSubmit(query.trim())
    }
  }

  const handleExampleClick = (example: string) => {
    setQuery(example)
    setShowExamples(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="query" className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-3">
            What would you like me to research?
          </label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask any question and I'll conduct thorough research with citations..."
            className="w-full h-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={!query.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>🔍</span>
            Start Research
          </button>
          
          <button
            type="button"
            onClick={() => setShowExamples(!showExamples)}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Example Questions
          </button>
        </div>
      </form>

      {showExamples && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Click on any example to use it:
          </h3>
          <div className="grid gap-2">
            {exampleQuestions.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
              >
                <span className="text-blue-500 mr-2">•</span>
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}