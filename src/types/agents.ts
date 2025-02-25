export type AgentType = 'rewriter' | 'critic' | 'finalizer'

export type PromptPurpose =
  | 'article_writing'
  | 'code_generation'
  | 'code_debugging'
  | 'code_review'
  | 'technical_explanation'
  | 'data_analysis'
  | 'api_documentation'
  | 'test_case_generation'

export interface Agent {
  type: AgentType
  name: string
  description: string
  process: (input: string, purpose: PromptPurpose) => Promise<string>
}

export interface PromptOptimizationResult {
  originalPrompt: string
  optimizedPrompt: string
  agentFeedback: AgentFeedback[]
}

export interface AgentFeedback {
  agentType: AgentType
  feedback: string
  suggestion: string
  timestamp: number
}

export interface OptimizationConfig {
  mode: 'sequential' | 'parallel' | 'critique'
  selectedAgents: AgentType[]
  maxIterations: number
  temperature: number
  purpose: PromptPurpose
}
