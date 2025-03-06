import React from 'react'
import ReactDOM from 'react-dom/client'
import { PromptOptimizer } from './components/PromptOptimizer'
import { AuthProvider } from '../firebase/AuthContext'
import './index.css'

const root = document.getElementById('root')
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <AuthProvider>
        <PromptOptimizer />
      </AuthProvider>
    </React.StrictMode>
  )
}
