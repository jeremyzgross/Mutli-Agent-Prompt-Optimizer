import React from 'react'
import { Box, TextField, Button } from '@mui/material'

interface FeedbackFormProps {
  feedback: string
  isOptimizing: boolean
  onFeedbackChange: (value: string) => void
  onRegenerateWithFeedback: () => void
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  feedback,
  isOptimizing,
  onFeedbackChange,
  onRegenerateWithFeedback,
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        label="What would you like to improve about this prompt?"
        placeholder="e.g., 'Make it more conversational', 'Add more specific examples', 'Focus more on the technical aspects'"
        value={feedback}
        onChange={(e) => onFeedbackChange(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={onRegenerateWithFeedback}
        disabled={!feedback || isOptimizing}>
        Regenerate with Feedback
      </Button>
    </Box>
  )
}
