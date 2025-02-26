import React from 'react'
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
} from '@mui/material'
import { PromptPurpose } from '../../../types/agents'

interface PromptInputProps {
  prompt: string
  purpose: PromptPurpose
  purposeLabels: Record<PromptPurpose, string>
  purposeDescriptions: Record<PromptPurpose, string>
  onPromptChange: (value: string) => void
  onPurposeChange: (value: PromptPurpose) => void
}

export const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  purpose,
  purposeLabels,
  purposeDescriptions,
  onPromptChange,
  onPurposeChange,
}) => {
  const handlePurposeChange = (event: SelectChangeEvent) => {
    onPurposeChange(event.target.value as PromptPurpose)
  }

  return (
    <>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Optimization Goal</InputLabel>
        <Select
          value={purpose}
          label="Optimization Goal"
          onChange={handlePurposeChange}>
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
        onChange={(e) => onPromptChange(e.target.value)}
        sx={{ mb: 2 }}
      />
    </>
  )
}
