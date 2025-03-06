import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Snackbar,
  Switch,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material'
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
import { useAuth } from '../../firebase/AuthContext'
import { AuthModal } from './auth/AuthModal'
import { UpgradeModal } from './auth/UpgradeModal'
import {
  trackPromptUsage,
  logoutUser,
  upgradeUserToPremium,
  UserTier,
} from '../../firebase/auth'

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
    handleOptimize: originalHandleOptimize,
    handleRegenerateWithFeedback: originalHandleRegenerate,
    handleCopyToClipboard,
    handleClearAll,
    toggleFeedback,
  } = useOptimization()

  const { currentUser, userData } = useAuth()
  const [darkMode, setDarkMode] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [remainingPrompts, setRemainingPrompts] = useState(5)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedTheme)
  }, [])

  useEffect(() => {
    if (userData) {
      setRemainingPrompts(
        Math.max(0, userData.promptLimit - userData.promptsUsed)
      )
    }
  }, [userData])

  const handleThemeChange = () => {
    setDarkMode(!darkMode)
    localStorage.setItem('darkMode', (!darkMode).toString())
  }

  const handleOptimize = async () => {
    if (!currentUser) {
      setShowAuthModal(true)
      return
    }

    if (userData?.tier === UserTier.FREE) {
      const { canUse, remainingPrompts } = await trackPromptUsage(
        currentUser.uid
      )
      setRemainingPrompts(remainingPrompts)

      if (!canUse) {
        setShowUpgradeModal(true)
        return
      }
    }

    originalHandleOptimize()
  }

  const handleRegenerateWithFeedback = async () => {
    if (!currentUser) {
      setShowAuthModal(true)
      return
    }

    if (userData?.tier === UserTier.FREE) {
      const { canUse, remainingPrompts } = await trackPromptUsage(
        currentUser.uid
      )
      setRemainingPrompts(remainingPrompts)

      if (!canUse) {
        setShowUpgradeModal(true)
        return
      }
    }

    originalHandleRegenerate()
  }

  const handleUpgrade = async () => {
    if (!currentUser) return

    try {
      // Here you would integrate with your payment processor
      // For now, we'll just upgrade the user directly
      await upgradeUserToPremium(currentUser.uid)
      setShowUpgradeModal(false)
    } catch (error) {
      console.error('Error upgrading user:', error)
    }
  }

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await logoutUser()
    handleUserMenuClose()
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ p: 3, position: 'relative' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}>
          <Typography variant="h5">Prompt Optimizer</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Switch checked={darkMode} onChange={handleThemeChange} />

            {currentUser ? (
              <>
                <Avatar
                  sx={{ cursor: 'pointer', bgcolor: 'primary.main' }}
                  onClick={handleUserMenuOpen}>
                  {currentUser.displayName?.[0] ||
                    currentUser.email?.[0] ||
                    'U'}
                </Avatar>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}>
                  <MenuItem disabled>
                    <Typography variant="body2">
                      {userData?.tier === UserTier.PREMIUM
                        ? 'Premium User'
                        : `${remainingPrompts} prompts left`}
                    </Typography>
                  </MenuItem>
                  {userData?.tier === UserTier.FREE && (
                    <MenuItem onClick={() => setShowUpgradeModal(true)}>
                      Upgrade to Premium
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowAuthModal(true)}>
                Sign In
              </Button>
            )}
          </Box>
        </Box>

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

        <AuthModal
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />

        <UpgradeModal
          open={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={handleUpgrade}
          remainingPrompts={remainingPrompts}
          userTier={userData?.tier || UserTier.FREE}
        />
      </Box>
    </ThemeProvider>
  )
}
