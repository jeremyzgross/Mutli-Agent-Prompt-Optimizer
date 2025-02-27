import React from 'react'
import { Box, LinearProgress, Typography } from '@mui/material'
import { AgentType } from '../../../types/agents'

interface ProgressIndicatorProps {
  isOptimizing: boolean
  currentAgent: AgentType | null
  optimizationStep: number
  agentDescriptions: Record<AgentType, string>
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  isOptimizing,
  currentAgent,
  optimizationStep,
  agentDescriptions,
}) => {
  if (!isOptimizing) return null

  const getProgressMessage = () => {
    if (!currentAgent) return ''
    return agentDescriptions[currentAgent]
  }

  return (
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
  )
}
