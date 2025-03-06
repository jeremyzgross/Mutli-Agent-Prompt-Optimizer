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
import { registerWithEmail, loginWithGoogle } from '../../../firebase/auth'

interface RegisterProps {
  onSuccess: () => void
  onLoginClick: () => void
}

export const Register: React.FC<RegisterProps> = ({
  onSuccess,
  onLoginClick,
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }

    return true
  }

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setError('')
    setLoading(true)

    try {
      await registerWithEmail(email, password, name)
      onSuccess()
    } catch (error: any) {
      setError(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setError('')
    setLoading(true)

    try {
      await loginWithGoogle()
      onSuccess()
    } catch (error: any) {
      setError(error.message || 'Failed to sign up with Google')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 2, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Create Account
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleEmailRegister}>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
        />
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
          helperText="Password must be at least 6 characters"
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
          required
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 2 }}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <Divider sx={{ my: 2 }}>or</Divider>

      <Button
        fullWidth
        variant="outlined"
        startIcon={<GoogleIcon />}
        onClick={handleGoogleRegister}
        disabled={loading}>
        Sign up with Google
      </Button>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2">
          Already have an account?{' '}
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={onLoginClick}>
            Sign In
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}
