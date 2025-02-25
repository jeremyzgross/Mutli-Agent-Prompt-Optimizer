export type AgentType = 'rewriter' | 'critic' | 'finalizer'

export type PromptPurpose =
  | 'article_writing'
  | 'social_media_post'
  | 'test_case_generation'
  | 'api_documentation'
  | 'non_technical_explanation'

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
