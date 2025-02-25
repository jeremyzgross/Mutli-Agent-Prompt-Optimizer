import { Agent, AgentType, PromptPurpose } from '../types/agents'

export class RewriterAgent implements Agent {
  type: AgentType = 'rewriter'
  name = 'Prompt Rewriter'
  description = 'Improves prompt clarity and structure'

  async process(input: string, purpose: PromptPurpose): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage(
          {
            type: 'OPTIMIZE_PROMPT',
            model: 'meta/llama-3.3-70b-instruct',
            messages: [
              {
                role: 'system',
                content:
                  'You are a prompt engineering expert. Your task is to rewrite the given prompt to be more effective for LLMs, specifically optimizing for ' +
                  purpose.replace('_', ' ') +
                  '. Focus on:\n' +
                  '1. Clear and precise language\n' +
                  '2. Proper context and constraints\n' +
                  '3. Structured format when beneficial\n' +
                  '4. Removing ambiguity\n' +
                  '5. Best practices for ' +
                  purpose.replace('_', ' ') +
                  '\n' +
                  'Maintain the original intent while making it more effective.',
              },
              {
                role: 'user',
                content: input,
              },
            ],
            temperature: 0.7,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message))
              return
            }
            if (!response) {
              reject(new Error('No response received'))
              return
            }
            if (!response.success) {
              reject(new Error(response.error || 'Unknown error'))
              return
            }
            resolve(response.data.choices[0].message.content || input)
          }
        )
      } catch (error) {
        reject(error)
      }
    })
  }
}

export class CriticAgent implements Agent {
  type: AgentType = 'critic'
  name = 'Prompt Critic'
  description = 'Analyzes and identifies improvements'

  async process(input: string, purpose: PromptPurpose): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage(
          {
            type: 'OPTIMIZE_PROMPT',
            model: 'meta/llama-3.3-70b-instruct',
            messages: [
              {
                role: 'system',
                content:
                  'You are a prompt critic specializing in LLM interactions, particularly for ' +
                  purpose.replace('_', ' ') +
                  '. Analyze the prompt and provide specific suggestions for improvement. Focus on:\n' +
                  '1. Identifying vague or ambiguous parts\n' +
                  '2. Missing context or constraints\n' +
                  '3. Potential misinterpretations by LLMs\n' +
                  '4. Specific improvements for ' +
                  purpose.replace('_', ' ') +
                  '\n' +
                  'Return your analysis in a clear, actionable format.',
              },
              {
                role: 'user',
                content: input,
              },
            ],
            temperature: 0.7,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message))
              return
            }
            if (!response) {
              reject(new Error('No response received'))
              return
            }
            if (!response.success) {
              reject(new Error(response.error || 'Unknown error'))
              return
            }
            resolve(response.data.choices[0].message.content || input)
          }
        )
      } catch (error) {
        reject(error)
      }
    })
  }
}

export class FinalizerAgent implements Agent {
  type: AgentType = 'finalizer'
  name = 'Prompt Finalizer'
  description = 'Creates final optimized version'

  async process(input: string, purpose: PromptPurpose): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage(
          {
            type: 'OPTIMIZE_PROMPT',
            model: 'meta/llama-3.3-70b-instruct',
            messages: [
              {
                role: 'system',
                content:
                  'You are a prompt finalizer expert specializing in ' +
                  purpose.replace('_', ' ') +
                  '. Your task is to take the original prompt and suggested improvements, then create the best possible version. Focus on:\n' +
                  '1. Incorporating valuable feedback while maintaining clarity\n' +
                  '2. Ensuring the prompt is optimized for ' +
                  purpose.replace('_', ' ') +
                  '\n' +
                  '3. Following best practices for this specific use case\n' +
                  '4. Maintaining the original intent while improving effectiveness\n' +
                  'Return only the improved prompt without any explanations or additional text.',
              },
              {
                role: 'user',
                content: input,
              },
            ],
            temperature: 0.5,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message))
              return
            }
            if (!response) {
              reject(new Error('No response received'))
              return
            }
            if (!response.success) {
              reject(new Error(response.error || 'Unknown error'))
              return
            }
            resolve(response.data.choices[0].message.content || input)
          }
        )
      } catch (error) {
        reject(error)
      }
    })
  }
}
