import React from 'react'
import { Box, Paper, Typography, Button, TextField } from '@mui/material'
import { PromptOptimizationResult, PromptPurpose } from '../../../types/agents'
import { FeedbackForm } from './FeedbackForm'

interface OptimizedResultProps {
  result: PromptOptimizationResult | null
  purpose: PromptPurpose
  purposeLabels: Record<PromptPurpose, string>
  feedback: string
  showFeedback: boolean
  isOptimizing: boolean
  onCopyToClipboard: () => void
  onClearAll: () => void
  onFeedbackChange: (value: string) => void
  onToggleFeedback: () => void
  onRegenerateWithFeedback: () => void
}

export const OptimizedResult: React.FC<OptimizedResultProps> = ({
  result,
  purpose,
  purposeLabels,
  feedback,
  showFeedback,
  isOptimizing,
  onCopyToClipboard,
  onClearAll,
  onFeedbackChange,
  onToggleFeedback,
  onRegenerateWithFeedback,
}) => {
  if (!result) return null

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Optimized Prompt:
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={onCopyToClipboard}
          size="small"
          sx={{ mr: 1 }}>
          Copy to Clipboard
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClearAll}
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
        {purposeLabels[purpose].toLowerCase()} while maintaining your original
        intent. You can now use this improved prompt with any LLM of your
        choice.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
        <Button
          variant="text"
          color="primary"
          onClick={onToggleFeedback}
          startIcon={showFeedback ? null : <span>+</span>}>
          {showFeedback ? 'Hide Feedback' : 'Provide Feedback & Regenerate'}
        </Button>
      </Box>

      {showFeedback && (
        <FeedbackForm
          feedback={feedback}
          isOptimizing={isOptimizing}
          onFeedbackChange={onFeedbackChange}
          onRegenerateWithFeedback={onRegenerateWithFeedback}
        />
      )}
    </Paper>
  )
}
