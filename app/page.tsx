'use client'

import { useState } from 'react'
import { ResearchForm } from './components/ResearchForm'
import { ReportDisplay } from './components/ReportDisplay'
import { LoadingState } from './components/LoadingState'

export interface ReportData {
  executiveSummary: string
  markdownReport: string
  keyFindings: string[]
  followUpQuestions: string[]
  sources: Array<{
    url: string
    title: string
    description: string | null
  }>
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [report, setReport] = useState<ReportData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentQuery, setCurrentQuery] = useState<string>('')

  const handleResearch = async (query: string) => {
    setIsLoading(true)
    setError(null)
    setReport(null)
    setCurrentQuery(query)

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to conduct research')
      }

      setReport(data.report)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewResearch = () => {
    setReport(null)
    setError(null)
    setCurrentQuery('')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          🤖 AI Research Agent
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Ask any question and get comprehensive research with proper citations, 
          key findings, and follow-up questions.
        </p>
      </div>

      {/* Main Content */}
      {!report && !isLoading && (
        <ResearchForm onSubmit={handleResearch} />
      )}

      {isLoading && (
        <LoadingState query={currentQuery} />
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-2">
            <span className="text-red-500 text-xl mr-2">❌</span>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
              Research Failed
            </h3>
          </div>
          <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
          <button
            onClick={handleNewResearch}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {report && (
        <ReportDisplay 
          report={report} 
          query={currentQuery} 
          onNewResearch={handleNewResearch}
        />
      )}

      {/* Footer */}
      <footer className="text-center mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">
          Powered by OpenAI agents and web search technology
        </p>
      </footer>
    </div>
  )
}