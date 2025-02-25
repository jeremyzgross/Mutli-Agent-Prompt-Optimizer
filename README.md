# Multi-Agent Prompt Optimizer Chrome Extension

A Chrome extension that uses multiple AI agents to help optimize and improve your prompts for better results with language models.

## Features

- Three optimization modes:
  - **Sequential Optimization**: Agents work in sequence to improve the prompt
  - **Parallel Debate**: Agents propose different versions and vote on the best one
  - **Critique and Response**: One agent generates while another critiques
- Configurable number of iterations for tailored optimization
- Real-time feedback from each agent during the optimization process
- Beautiful Material-UI interface for a seamless user experience
- Support for multiple prompt purposes, including article writing, code generation, and more
- Enhanced error handling and user notifications for better usability

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
4. Build the extension:
   ```bash
   npm run build
   ```
5. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder from this project

## Usage

1. Click the extension icon in your Chrome toolbar
2. Enter your prompt in the text area
3. Choose an optimization mode:
   - Sequential: Best for step-by-step refinement
   - Parallel: Best for exploring multiple approaches
   - Critique: Best for detailed feedback and improvements
4. Adjust the number of iterations (more iterations = more refinement)
5. Click "Optimize Prompt" and wait for the results
6. Review the optimized prompt and agent feedback

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run watch` - Watch for changes and rebuild

## Architecture

The extension uses a multi-agent system where each agent specializes in different aspects of prompt optimization:

- Rewriter Agent: Improves clarity and structure
- Critic Agent: Analyzes and suggests improvements
- Finalizer Agent: Integrates feedback and creates the final version

The agents can work in different configurations based on the selected mode, allowing for flexible and powerful prompt optimization strategies.

## Technologies Used

- TypeScript
- React
- Material-UI
- OpenAI API
- Chrome Extensions API
- Webpack
