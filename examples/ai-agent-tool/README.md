# Claude Code Tool Examples

This directory contains examples of how to use the **Claude Code Tool** with AI agents in n8n.

## 🤖 AI Agent Tool

The Claude Code Tool enables AI agents (like LangChain agents) to automatically use Claude Code for development tasks. Unlike the regular Claude Code node that you manually trigger, the tool allows agents to intelligently decide when and how to use coding capabilities.

## Basic Setup

1. Add a **Claude Code Tool** node to your workflow
2. Configure the tool's name and description
3. Connect it to an AI agent (LangChain Agent, etc.)
4. The agent will automatically call Claude Code when needed

## Example Workflow

```json
{
  "name": "AI Agent with Claude Code Tool",
  "nodes": [
    {
      "name": "Manual Chat Trigger",
      "type": "manualChatTrigger"
    },
    {
      "name": "LangChain Agent", 
      "type": "langChainAgent",
      "tools": ["Claude Code Tool"]
    },
    {
      "name": "Claude Code Tool",
      "type": "toolClaudeCode",
      "parameters": {
        "name": "claude-code",
        "description": "Execute AI-powered coding tasks using Claude Code SDK. Can analyze code, fix bugs, write new features, read/write files, execute bash commands, and perform various development tasks."
      }
    }
  ]
}
```

## Use Cases

### 1. Autonomous Code Review
**User**: "Please review the code in my project and suggest improvements"
**Agent**: *Automatically uses Claude Code Tool to analyze the codebase and provide detailed feedback*

### 2. Bug Fixing Assistant  
**User**: "There's an error in my Python script, can you help?"
**Agent**: *Uses Claude Code Tool to read the file, identify the issue, and propose fixes*

### 3. Development Helper
**User**: "Create a REST API for user management"
**Agent**: *Uses Claude Code Tool to generate the code, create files, and set up the project structure*

## Configuration Tips

- **Tool Name**: Use a descriptive name like "code-assistant" or "dev-helper"
- **Description**: Be specific about capabilities so the agent knows when to use it
- **Model**: Choose "opus" for complex tasks, "sonnet" for faster responses
- **Allowed Tools**: Enable only the tools your use case requires for security
- **Debug Mode**: Enable during development to see how the agent uses the tool

## Benefits

- **Autonomous Operation**: Agent decides when coding help is needed
- **Natural Interaction**: Users can request development tasks in plain language
- **Full Claude Code Power**: All SDK capabilities available to the agent
- **Workflow Integration**: Seamlessly fits into existing n8n automation patterns