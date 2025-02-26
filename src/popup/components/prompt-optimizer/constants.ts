import { PromptPurpose, AgentType } from '../../../types/agents'

export const purposeLabels: Record<PromptPurpose, string> = {
  article_writing: 'Article Writing',
  social_media_post: 'Social Media Post',
  test_case_generation: 'Test Case Generation',
  api_documentation: 'API Documentation',
  non_technical_explanation: 'Non-Technical Explanation',
}

export const purposeDescriptions: Record<PromptPurpose, string> = {
  article_writing:
    'Optimize prompts for generating articles, blog posts, or content',
  social_media_post:
    'Enhance prompts for creating engaging social media content',
  test_case_generation:
    'Improve prompts for generating comprehensive test cases',
  api_documentation: 'Optimize prompts for creating clear API documentation',
  non_technical_explanation:
    'Perfect prompts for explaining complex topics to non-technical audiences',
}

export const agentDescriptions: Record<AgentType, string> = {
  rewriter: 'Improving clarity and structure',
  critic: 'Analyzing for potential improvements',
  finalizer: 'Creating optimized final version',
}
