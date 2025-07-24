'use client'

import { useEffect, useState } from 'react'

interface LoadingStateProps {
  query: string
}

const loadingSteps = [
  "🧠 Planning research strategy...",
  "🔍 Searching the web for information...",
  "📊 Analyzing search results...",
  "✍️ Generating comprehensive report...",
  "📋 Organizing findings and citations...",
]

export function LoadingState({ query }: LoadingStateProps) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % loadingSteps.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Researching Your Question
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 italic">
          &ldquo;{query}&rdquo;
        </p>

        {/* Animated loading indicator */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Loading steps */}
        <div className="space-y-4">
          {loadingSteps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center justify-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                index === currentStep
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 font-medium'
                  : index < currentStep
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {index < currentStep && (
                <span className="text-green-500">✓</span>
              )}
              {index === currentStep && (
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              )}
              <span>{step}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          This may take 30-60 seconds depending on the complexity of your question...
        </div>
      </div>
    </div>
  )
}