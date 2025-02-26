import React from 'react'
import { Box, Typography, Button, Snackbar } from '@mui/material'
import { PromptInput } from './prompt-optimizer/PromptInput'
import { ProgressIndicator } from './prompt-optimizer/ProgressIndicator'
import { OptimizedResult } from './prompt-optimizer/OptimizedResult'
import { useOptimization } from './prompt-optimizer/useOptimization'
import {
  purposeLabels,
  purposeDescriptions,
  agentDescriptions,
} from './prompt-optimizer/constants'

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
  )
}
