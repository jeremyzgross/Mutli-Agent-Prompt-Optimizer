import {
  Agent,
  OptimizationConfig,
  PromptOptimizationResult,
  AgentFeedback,
  AgentType,
} from '../types/agents'
import {
  RewriterAgent,
  CriticAgent,
  FinalizerAgent,
} from '../agents/implementations'

export class OptimizationOrchestrator {
  private agents: Map<string, Agent>

  constructor() {
    this.agents = new Map()
    this.agents.set('rewriter', new RewriterAgent())
    this.agents.set('critic', new CriticAgent())
    this.agents.set('finalizer', new FinalizerAgent())
  }

  async optimizePrompt(
    prompt: string,
    config: OptimizationConfig,
    onProgress?: (agent: AgentType) => void
  ): Promise<PromptOptimizationResult> {
    const feedback: AgentFeedback[] = []
    let optimizedPrompt = prompt

    optimizedPrompt = await this.runSequentialOptimization(
      prompt,
      config,
      feedback,
      onProgress
    )

    return {
      originalPrompt: prompt,
      optimizedPrompt,
      agentFeedback: feedback,
    }
  }

  private async runSequentialOptimization(
    prompt: string,
    config: OptimizationConfig,
    feedback: AgentFeedback[],
    onProgress?: (agent: AgentType) => void
  ): Promise<string> {
    let currentPrompt = prompt

    for (let i = 0; i < config.maxIterations; i++) {
      for (const agentType of config.selectedAgents) {
        const agent = this.agents.get(agentType)
        if (!agent) continue

        onProgress?.(agentType as AgentType)
        const result = await agent.process(currentPrompt, config.purpose)
        feedback.push({
          agentType: agent.type,
          feedback: result,
          suggestion: result,
          timestamp: Date.now(),
        })
        currentPrompt = result
      }
    }

    return currentPrompt
  }
}
