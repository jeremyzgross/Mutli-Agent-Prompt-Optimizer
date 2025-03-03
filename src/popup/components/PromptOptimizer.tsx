import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, Snackbar, Switch } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { PromptInput } from './prompt-optimizer/PromptInput'
import { ProgressIndicator } from './prompt-optimizer/ProgressIndicator'
import { OptimizedResult } from './prompt-optimizer/OptimizedResult'
import { useOptimization } from './prompt-optimizer/useOptimization'
import {
  purposeLabels,
  purposeDescriptions,
  agentDescriptions,
} from './prompt-optimizer/constants'
import { lightTheme, darkTheme } from '../../theme'
import { CssBaseline } from '@mui/material'

export const PromptOptimizer: React.FC = () => {
  const {
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
  } = useOptimization()

  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedTheme)
  }, [])

  const handleThemeChange = () => {
    setDarkMode(!darkMode)
    localStorage.setItem('darkMode', (!darkMode).toString())
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ p: 3, position: 'relative' }}>
        <Typography variant="h5" gutterBottom>
          Prompt Optimizer
        </Typography>

        <Switch checked={darkMode} onChange={handleThemeChange} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select your goal and enter your prompt below. Our AI agents will work
          together to improve it, making it clearer and more effective for any
          LLM.
        </Typography>

        <PromptInput
          prompt={prompt}
          purpose={purpose}
          purposeLabels={purposeLabels}
          purposeDescriptions={purposeDescriptions}
          onPromptChange={setPrompt}
          onPurposeChange={setPurpose}
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

        <ProgressIndicator
          isOptimizing={isOptimizing}
          currentAgent={currentAgent}
          optimizationStep={optimizationStep}
          agentDescriptions={agentDescriptions}
        />

        <OptimizedResult
          result={result}
          purpose={purpose}
          purposeLabels={purposeLabels}
          feedback={feedback}
          showFeedback={showFeedback}
          isOptimizing={isOptimizing}
          onCopyToClipboard={handleCopyToClipboard}
          onClearAll={handleClearAll}
          onFeedbackChange={setFeedback}
          onToggleFeedback={toggleFeedback}
          onRegenerateWithFeedback={handleRegenerateWithFeedback}
        />

        <Snackbar
          open={showCopySuccess}
          autoHideDuration={2000}
          onClose={() => setShowCopySuccess(false)}
          message="Copied to clipboard!"
        />
      </Box>
    </ThemeProvider>
  )
}
