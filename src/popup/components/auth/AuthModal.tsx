import React, { useState } from 'react'
import { Dialog, DialogContent, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Login } from './Login'
import { Register } from './Register'

type AuthView = 'login' | 'register'

interface AuthModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export const AuthModal: React.FC<AuthModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [view, setView] = useState<AuthView>('login')

  const handleSuccess = () => {
    onSuccess()
    onClose()
  }

  const switchToLogin = () => setView('login')
  const switchToRegister = () => setView('register')

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}>
        <CloseIcon />
      </IconButton>

      <DialogContent>
        {view === 'login' ? (
          <Login onSuccess={handleSuccess} onRegisterClick={switchToRegister} />
        ) : (
          <Register onSuccess={handleSuccess} onLoginClick={switchToLogin} />
        )}
      </DialogContent>
    </Dialog>
  )
}
