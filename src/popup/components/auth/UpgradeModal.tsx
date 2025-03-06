import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { UserTier } from '../../../firebase/auth'

interface UpgradeModalProps {
  open: boolean
  onClose: () => void
  onUpgrade: () => void
  remainingPrompts: number
  userTier: UserTier
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  open,
  onClose,
  onUpgrade,
  remainingPrompts,
  userTier,
}) => {
  const isFree = userTier === UserTier.FREE

  const premiumFeatures = [
    'Up to 100 optimized prompts per month',
    'Priority processing',
    'Advanced optimization techniques',
    'Save and organize your prompts',
    'Export optimized prompts',
  ]

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isFree ? 'Upgrade to Premium' : "You're on Premium!"}
      </DialogTitle>

      <DialogContent>
        {isFree ? (
          <>
            <Typography variant="body1" gutterBottom>
              You have used {5 - remainingPrompts} out of 5 free prompts.
            </Typography>

            <Typography variant="body1" paragraph>
              Upgrade to Premium to unlock unlimited optimizations and more
              features!
            </Typography>

            <Box sx={{ my: 2 }}>
              <Typography variant="h6" gutterBottom>
                Premium Features:
              </Typography>

              <List>
                {premiumFeatures.map((feature, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box
              sx={{ my: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom align="center">
                Premium Plan
              </Typography>

              <Typography variant="h4" align="center" gutterBottom>
                $9.99<Typography variant="caption">/month</Typography>
              </Typography>

              <Typography variant="body2" align="center">
                Cancel anytime
              </Typography>
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Thank you for being a Premium member!
            </Typography>

            <Typography variant="body1">
              You have access to all premium features and can optimize up to 100
              prompts per month.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {isFree ? 'Not Now' : 'Close'}
        </Button>

        {isFree && (
          <Button onClick={onUpgrade} variant="contained" color="primary">
            Upgrade Now
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
