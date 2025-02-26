import { useState, useEffect } from 'react'
import {
  PromptOptimizationResult,
  PromptPurpose,
  AgentType,
} from '../../../types/agents'
import { OptimizationOrchestrator } from '../../../services/OptimizationOrchestrator'

const orchestrator = new OptimizationOrchestrator()

export const useOptimization = (
  initialPurpose: PromptPurpose = 'article_writing'
) => {
  const [prompt, setPrompt] = useState('')
  const [purpose, setPurpose] = useState<PromptPurpose>(initialPurpose)
  const [result, setResult] = useState<PromptOptimizationResult | null>(null)
  const [showCopySuccess, setShowCopySuccess] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [currentAgent, setCurrentAgent] = useState<AgentType | null>(null)
  const [optimizationStep, setOptimizationStep] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)

  // Load saved state from storage when component mounts
  useEffect(() => {
    chrome.storage.local.get(
      ['savedPrompt', 'savedPurpose', 'savedResult', 'savedFeedback'],
      (result) => {
        if (result.savedPrompt) setPrompt(result.savedPrompt)
        if (result.savedPurpose)
          setPurpose(result.savedPurpose as PromptPurpose)
        if (result.savedResult) setResult(JSON.parse(result.savedResult))
        if (result.savedFeedback) setFeedback(result.savedFeedback)
      }
    )
  }, [])

  // Save state to storage whenever it changes
  useEffect(() => {
    chrome.storage.local.set({ savedPrompt: prompt })
  }, [prompt])

  useEffect(() => {
    chrome.storage.local.set({ savedPurpose: purpose })
  }, [purpose])

  useEffect(() => {
    if (result) {
      chrome.storage.local.set({ savedResult: JSON.stringify(result) })
    }
  }, [result])

  useEffect(() => {
    chrome.storage.local.set({ savedFeedback: feedback })
  }, [feedback])

  const handleOptimize = async () => {
    if (!prompt) return
    setIsOptimizing(true)
    setResult(null)
    setOptimizationStep(0)
    setShowFeedback(false)

    const agents: AgentType[] = ['rewriter', 'critic', 'finalizer']
    try {
      const optimizationResult = await orchestrator.optimizePrompt(
        prompt,
        {
          mode: 'sequential',
          selectedAgents: agents,
          maxIterations: 1,
          temperature: 0.7,
          purpose,
        },
        (agent: AgentType) => {
          setCurrentAgent(agent)
          setOptimizationStep((prev) => prev + 1)
        }
      )
      setResult(optimizationResult)
    } catch (error) {
      console.error('Optimization error:', error)
    } finally {
      setIsOptimizing(false)
      setCurrentAgent(null)
    }
  }

  const handleRegenerateWithFeedback = async () => {
    if (!prompt || !feedback || !result) return
    setIsOptimizing(true)
    setOptimizationStep(0)

    try {
      // Create a combined prompt with the original, the current optimized version, and user feedback
      const feedbackPrompt = `
Original prompt: ${prompt}

Current optimized version: ${result.optimizedPrompt}

User feedback: ${feedback}

Please create an improved version based on this feedback.`

      const optimizationResult = await orchestrator.optimizePrompt(
        feedbackPrompt,
        {
          mode: 'sequential',
          selectedAgents: ['finalizer'], // Just use the finalizer for feedback-based regeneration
          maxIterations: 1,
          temperature: 0.7,
          purpose,
        },
        (agent: AgentType) => {
          setCurrentAgent(agent)
          setOptimizationStep((prev) => prev + 1)
        }
      )

      // Update the result with the new optimized prompt but keep the original feedback
      setResult({
        ...result,
        optimizedPrompt: optimizationResult.optimizedPrompt,
        agentFeedback: [
          ...result.agentFeedback,
          {
            agentType: 'finalizer',
            feedback: `Regenerated based on user feedback: ${feedback}`,
            suggestion: optimizationResult.optimizedPrompt,
            timestamp: Date.now(),
          },
        ],
      })

      // Clear the feedback field after using it
      setFeedback('')
      setShowFeedback(false)
    } catch (error) {
      console.error('Regeneration error:', error)
    } finally {
      setIsOptimizing(false)
      setCurrentAgent(null)
    }
  }

  const handleCopyToClipboard = async () => {
    if (result?.optimizedPrompt) {
      await navigator.clipboard.writeText(result.optimizedPrompt)
      setShowCopySuccess(true)
    }
  }

  const handleClearAll = () => {
    setPrompt('')
    setResult(null)
    setFeedback('')
    setShowFeedback(false)
    chrome.storage.local.remove([
      'savedPrompt',
      'savedPurpose',
      'savedResult',
      'savedFeedback',
    ])
  }

  const toggleFeedback = () => {
    setShowFeedback(!showFeedback)
  }

  return {
    prompt,
    setPrompt,
    purpose,
    setPurpose,
    result,
    isOptimizing,
    currentAgent,
    optimizationStep,
    feedback,
    setFeedback,
    showFeedback,
    showCopySuccess,
    setShowCopySuccess,
    handleOptimize,
    handleRegenerateWithFeedback,
    handleCopyToClipboard,
    handleClearAll,
    toggleFeedback,
  }
}
