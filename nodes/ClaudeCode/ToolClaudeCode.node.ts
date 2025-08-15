import type {
	ISupplyDataFunctions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { DynamicTool } from 'langchain/tools';
import { query } from '@anthropic-ai/claude-code';

export class ToolClaudeCode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Claude Code Tool',
		name: 'toolClaudeCode',
		icon: 'file:claudecode.svg',
		group: ['transform'],
		version: 1,
		description: 'Use Claude Code SDK as a tool for AI agents',
		defaults: {
			name: 'Claude Code Tool',
		},
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Tools'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://github.com/holt-web-ai/n8n-nodes-claudecode',
					},
				],
			},
		},
		inputs: [],
		outputs: ["ai_tool"] as any,
		outputNames: ['Tool'],
		properties: [
			{
				displayName: 'Tool Name',
				name: 'name',
				type: 'string',
				default: 'claude-code',
				placeholder: 'claude-code',
				description: 'Name of the tool that AI agents will see',
			},
			{
				displayName: 'Tool Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: 'Execute AI-powered coding tasks using Claude Code SDK. Can analyze code, fix bugs, write new features, and perform various development tasks.',
				description: 'Description of what the tool does (visible to AI agents)',
				placeholder: 'A powerful AI coding assistant that can...',
			},
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				options: [
					{
						name: 'Sonnet',
						value: 'sonnet',
						description: 'Fast and efficient model for most tasks',
					},
					{
						name: 'Opus',
						value: 'opus',
						description: 'Most capable model for complex tasks',
					},
				],
				default: 'sonnet',
				description: 'Claude model to use for processing',
			},
			{
				displayName: 'Max Turns',
				name: 'maxTurns',
				type: 'number',
				default: 50,
				description: 'Maximum number of conversation turns allowed',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
			},
			{
				displayName: 'Timeout (Seconds)',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Maximum time to wait for Claude Code response',
				typeOptions: {
					minValue: 30,
					maxValue: 600,
				},
			},
			{
				displayName: 'Allowed Tools',
				name: 'allowedTools',
				type: 'multiOptions',
				options: [
					{ name: 'Bash', value: 'Bash', description: 'Execute bash commands' },
					{ name: 'Edit', value: 'Edit', description: 'Edit files' },
					{ name: 'Multi Edit', value: 'MultiEdit', description: 'Edit multiple files' },
					{ name: 'Read', value: 'Read', description: 'Read files' },
					{ name: 'Task', value: 'Task', description: 'Launch agents for complex searches' },
					{ name: 'Todo Write', value: 'TodoWrite', description: 'Manage todo lists' },
					{ name: 'Web Fetch', value: 'WebFetch', description: 'Fetch web content' },
					{ name: 'Web Search', value: 'WebSearch', description: 'Search the web' },
					{ name: 'Write', value: 'Write', description: 'Write files' },
				],
				default: ['WebFetch', 'TodoWrite', 'WebSearch', 'exit_plan_mode', 'Task'],
				description: 'Select which built-in tools Claude Code is allowed to use during execution',
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'System Prompt',
						name: 'systemPrompt',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						default: '',
						description: 'Additional context or instructions for Claude Code',
						placeholder:
							'You are helping with a Python project. Focus on clean, readable code with proper error handling.',
					},
					{
						displayName: 'Project Path',
						name: 'projectPath',
						type: 'string',
						default: '',
						description: 'Working directory for Claude Code (optional)',
						placeholder: '/path/to/project',
					},
					{
						displayName: 'Require Permissions',
						name: 'requirePermissions',
						type: 'boolean',
						default: false,
						description: 'Whether to require permission for tool use',
					},
					{
						displayName: 'Debug Mode',
						name: 'debug',
						type: 'boolean',
						default: false,
						description: 'Whether to enable debug logging',
					},
				],
			},
		],
	};

	async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<{ response: DynamicTool }> {
		const name = this.getNodeParameter('name', itemIndex) as string;
		const description = this.getNodeParameter('description', itemIndex) as string;
		const model = this.getNodeParameter('model', itemIndex) as string;
		const maxTurns = this.getNodeParameter('maxTurns', itemIndex) as number;
		const timeout = this.getNodeParameter('timeout', itemIndex) as number;
		const allowedTools = this.getNodeParameter('allowedTools', itemIndex) as string[];
		const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex) as {
			systemPrompt?: string;
			projectPath?: string;
			requirePermissions?: boolean;
			debug?: boolean;
		};

		const tool = new DynamicTool({
			name,
			description,
			func: async (input: string): Promise<string> => {
				try {
					if (additionalOptions.debug) {
						console.log(`[ToolClaudeCode] Received input: ${input.substring(0, 100)}...`);
						console.log(`[ToolClaudeCode] Model: ${model}`);
						console.log(`[ToolClaudeCode] Max turns: ${maxTurns}`);
						console.log(`[ToolClaudeCode] Allowed tools: ${allowedTools.join(', ')}`);
					}

					// Create timeout controller
					const abortController = new AbortController();
					const timeoutMs = timeout * 1000;
					const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

					// Build query options
					const queryOptions = {
						prompt: input,
						abortController,
						options: {
							maxTurns,
							permissionMode: additionalOptions.requirePermissions ? 'default' : 'bypassPermissions' as any,
							model,
							systemPrompt: additionalOptions.systemPrompt,
							allowedTools,
							cwd: additionalOptions.projectPath || process.cwd(),
						},
					};

					if (additionalOptions.debug) {
						console.log(`[ToolClaudeCode] Working directory: ${queryOptions.options.cwd}`);
					}

					// Execute Claude Code query
					const messages: any[] = [];
					for await (const message of query(queryOptions)) {
						if (additionalOptions.debug) {
							console.log(`[ToolClaudeCode] Received message type: ${message.type}`);
						}
						messages.push(message);
					}

					clearTimeout(timeoutId);

					if (additionalOptions.debug) {
						console.log(`[ToolClaudeCode] Execution completed. Messages: ${messages.length}`);
					}

					// Find the result message
					const resultMessage = messages.find((m) => m.type === 'result') as any;
					if (resultMessage) {
						const result = resultMessage.result || resultMessage.error;
						if (typeof result === 'string') {
							return result;
						}
						return JSON.stringify(result);
					}

					// If no result message, try to extract from assistant messages
					const assistantMessages = messages.filter((m) => m.type === 'assistant');
					if (assistantMessages.length > 0) {
						const lastMessage = assistantMessages[assistantMessages.length - 1];
						const content = (lastMessage as any).message?.content?.[0];
						if (content?.text) {
							return content.text;
						}
					}

					return 'Claude Code executed successfully but no output was generated.';

				} catch (error) {
					if (additionalOptions.debug) {
						console.error(`[ToolClaudeCode] Error:`, error);
					}
					
					const errorMessage = error instanceof Error ? error.message : String(error);
					return `Error executing Claude Code: ${errorMessage}`;
				}
			},
		});

		return { response: tool };
	}
}