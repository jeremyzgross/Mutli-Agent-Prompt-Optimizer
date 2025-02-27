import React from 'react'
import ReactDOM from 'react-dom/client'
import { PromptOptimizer } from './components/PromptOptimizer'

const root = document.getElementById('root')
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <PromptOptimizer />
    </React.StrictMode>
  )
}
