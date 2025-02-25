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

  private async runParallelOptimization(
    prompt: string,
    config: OptimizationConfig,
    feedback: AgentFeedback[],
    onProgress?: (agent: AgentType) => void
  ): Promise<string> {
    const parallelResults = await Promise.all(
      config.selectedAgents.map(async (agentType) => {
        const agent = this.agents.get(agentType)
        if (!agent) return prompt

        onProgress?.(agentType as AgentType)
        const result = await agent.process(prompt, config.purpose)
        feedback.push({
          agentType: agent.type,
          feedback: result,
          suggestion: result,
          timestamp: Date.now(),
        })
        return result
      })
    )

    // Use the finalizer to combine parallel results
    const finalizer = this.agents.get('finalizer')
    if (!finalizer) return parallelResults[0] || prompt

    onProgress?.('finalizer')
    const combinedResult = await finalizer.process(
      JSON.stringify({ original: prompt, variations: parallelResults }),
      config.purpose
    )
    return combinedResult
  }

  private async runCritiqueOptimization(
    prompt: string,
    config: OptimizationConfig,
    feedback: AgentFeedback[],
    onProgress?: (agent: AgentType) => void
  ): Promise<string> {
    let currentPrompt = prompt
    const critic = this.agents.get('critic')
    const rewriter = this.agents.get('rewriter')

    if (!critic || !rewriter) return prompt

    for (let i = 0; i < config.maxIterations; i++) {
      onProgress?.('critic')
      const critique = await critic.process(currentPrompt, config.purpose)
      feedback.push({
        agentType: 'critic',
        feedback: critique,
        suggestion: '',
        timestamp: Date.now(),
      })

      onProgress?.('rewriter')
      const improved = await rewriter.process(
        JSON.stringify({ prompt: currentPrompt, critique }),
        config.purpose
      )
      feedback.push({
        agentType: 'rewriter',
        feedback: '',
        suggestion: improved,
        timestamp: Date.now(),
      })

      currentPrompt = improved
    }

    onProgress?.('finalizer')
    const finalizer = this.agents.get('finalizer')
    if (finalizer) {
      currentPrompt = await finalizer.process(currentPrompt, config.purpose)
    }

    return currentPrompt
  }
}
