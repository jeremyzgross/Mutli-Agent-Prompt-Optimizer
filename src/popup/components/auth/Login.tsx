import React, { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Divider,
  Alert,
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import {
  loginWithEmail,
  loginWithGoogle,
  resetPassword,
} from '../../../firebase/auth'

interface LoginProps {
  onSuccess: () => void
  onRegisterClick: () => void
}

export const Login: React.FC<LoginProps> = ({ onSuccess, onRegisterClick }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await loginWithEmail(email, password)
      onSuccess()
    } catch (error: any) {
      setError(error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      await loginWithGoogle()
      onSuccess()
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setError('')
    setLoading(true)

    try {
      await resetPassword(email)
      setResetSent(true)
    } catch (error: any) {
      setError(error.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 2, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Sign In
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {resetSent && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Password reset email sent!
        </Alert>
      )}

      <form onSubmit={handleEmailLogin}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />

        <Box
          sx={{
            mt: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={handleResetPassword}
            disabled={loading}>
            Forgot password?
          </Link>
        </Box>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 2 }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <Divider sx={{ my: 2 }}>or</Divider>

      <Button
        fullWidth
        variant="outlined"
        startIcon={<GoogleIcon />}
        onClick={handleGoogleLogin}
        disabled={loading}>
        Sign in with Google
      </Button>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2">
          Don't have an account?{' '}
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={onRegisterClick}>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}
