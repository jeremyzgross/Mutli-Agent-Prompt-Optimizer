import React, { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
} from '@mui/material'
import {
  PromptOptimizationResult,
  PromptPurpose,
  AgentType,
} from '../../types/agents'
import { OptimizationOrchestrator } from '../../services/OptimizationOrchestrator'

const orchestrator = new OptimizationOrchestrator()

const purposeLabels: Record<PromptPurpose, string> = {
  article_writing: 'Article Writing',
  social_media_post: 'Social Media Post',
  test_case_generation: 'Test Case Generation',
  api_documentation: 'API Documentation',
  non_technical_explanation: 'Non-Technical Explanation',
}

const purposeDescriptions: Record<PromptPurpose, string> = {
  article_writing:
    'Optimize prompts for generating articles, blog posts, or content',
  social_media_post:
    'Enhance prompts for creating engaging social media content',
  test_case_generation:
    'Improve prompts for generating comprehensive test cases',
  api_documentation: 'Optimize prompts for creating clear API documentation',
  non_technical_explanation:
    'Perfect prompts for explaining complex topics to non-technical audiences',
}

const agentDescriptions: Record<AgentType, string> = {
  rewriter: 'Improving clarity and structure',
  critic: 'Analyzing for potential improvements',
  finalizer: 'Creating optimized final version',
}

export const PromptOptimizer: React.FC = () => {
  const [prompt, setPrompt] = useState('')
  const [purpose, setPurpose] = useState<PromptPurpose>('article_writing')
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

  const getProgressMessage = () => {
    if (!currentAgent) return ''
    return agentDescriptions[currentAgent]
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Prompt Optimizer
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Select your goal and enter your prompt below. Our AI agents will work
        together to improve it, making it clearer and more effective for any
        LLM.
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Optimization Goal</InputLabel>
        <Select
          value={purpose}
          label="Optimization Goal"
          onChange={(e) => setPurpose(e.target.value as PromptPurpose)}>
          {Object.entries(purposeLabels).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          {purposeDescriptions[purpose]}
        </Typography>
      </FormControl>

      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        label="Enter your prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleOptimize}
        disabled={!prompt || isOptimizing}
        sx={{ mb: isOptimizing ? 1 : 2 }}>
        {isOptimizing ? 'Optimizing...' : 'Optimize Prompt'}
      </Button>

      {isOptimizing && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={(optimizationStep / 3) * 100}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, textAlign: 'center' }}>
            {getProgressMessage()}
          </Typography>
        </Box>
      )}

      {result && (
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Optimized Prompt:
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCopyToClipboard}
              size="small"
              sx={{ mr: 1 }}>
              Copy to Clipboard
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClearAll}
              size="small">
              Clear All
            </Button>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={result.optimizedPrompt}
            InputProps={{
              readOnly: true,
            }}
            sx={{ mb: 2 }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This optimized version is tailored for{' '}
            {purposeLabels[purpose].toLowerCase()} while maintaining your
            original intent. You can now use this improved prompt with any LLM
            of your choice.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <Button
              variant="text"
              color="primary"
              onClick={() => setShowFeedback(!showFeedback)}
              startIcon={showFeedback ? null : <span>+</span>}>
              {showFeedback ? 'Hide Feedback' : 'Provide Feedback & Regenerate'}
            </Button>
          </Box>

          {showFeedback && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                label="What would you like to improve about this prompt?"
                placeholder="e.g., 'Make it more conversational', 'Add more specific examples', 'Focus more on the technical aspects'"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleRegenerateWithFeedback}
                disabled={!feedback || isOptimizing}>
                Regenerate with Feedback
              </Button>
            </Box>
          )}
        </Paper>
      )}

      <Snackbar
        open={showCopySuccess}
        autoHideDuration={2000}
        onClose={() => setShowCopySuccess(false)}
        message="Copied to clipboard!"
      />
    </Box>
  )
}
