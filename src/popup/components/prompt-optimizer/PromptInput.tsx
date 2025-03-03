import React, { useState, useEffect } from 'react'
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
  Menu,
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
  const [menuOpen, setMenuOpen] = useState(false)

  const handlePurposeChange = (event: SelectChangeEvent) => {
    onPurposeChange(event.target.value as PromptPurpose)
    setMenuOpen(false) // Close menu on selection
  }

  useEffect(() => {
    const handleScroll = () => {
      setMenuOpen(false) // Close menu on scroll
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Optimization Goal</InputLabel>
        <Select
          value={purpose}
          label="Optimization Goal"
          onChange={handlePurposeChange}
          open={menuOpen}
          onOpen={() => setMenuOpen(true)}
          onClose={() => setMenuOpen(false)}
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
            disableScrollLock: true,
          }}>
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
