# n8n Claude Code Community Node

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

This is an n8n community node that integrates Claude Code SDK functionality into n8n workflows. The node allows users to execute Claude Code operations (queries and continuations) within their automation workflows.

## Working Effectively

### Bootstrap, Build and Test the Repository:
```bash
# Install dependencies - takes ~6 seconds
npm ci

# Build the project - takes ~2 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
npm run build

# Run linting - takes ~2 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
npm run lint

# Format code - takes <1 second
npm run format

# Type check - takes ~1.3 seconds
npx tsc --noEmit
```

### Development Workflow:
```bash
# Start TypeScript watch mode for development
npm run dev

# Full prepublish check (build + lint with stricter rules) - takes ~4 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
npm run prepublishOnly

# Package for distribution - takes <1 second
npm pack
```

## Manual Testing and Validation

**CRITICAL**: This project has no automated test suite. Testing requires manual validation with n8n.

### Prerequisites for Full Testing:
1. **Claude Code CLI** (required):
   ```bash
   # Install globally
   npm install -g @anthropic-ai/claude-code
   
   # Verify installation
   npx @anthropic-ai/claude-code --help
   
   # Authentication requires Claude Pro/Team subscription
   claude  # Follow authentication prompts
   ```

2. **n8n** (for testing the node):
   ```bash
   # Available via npx
   npx n8n --version
   ```

### Testing Process:
1. **Build and link the node**:
   ```bash
   npm run build
   npm link
   ```

2. **Test with n8n** (if available):
   ```bash
   # Start n8n with the linked node
   n8n start
   # Navigate to http://localhost:5678
   # Create a workflow with the Claude Code node
   # Test both "Query" and "Continue" operations
   ```

3. **Validate node structure**:
   ```bash
   # Verify the built files exist
   ls -la dist/nodes/ClaudeCode/
   # Should contain: ClaudeCode.node.js, ClaudeCode.node.d.ts, claudecode.svg, .js.map
   ```

## Validation Scenarios

**ALWAYS manually validate any changes via these scenarios:**

### Scenario 1: Basic Node Functionality
- Create a new n8n workflow
- Add a Manual Trigger node
- Add the Claude Code node (should appear under "Claude Code" category)
- Configure with a simple prompt: "List the files in the current directory"
- Set Project Path to a test directory
- Execute and verify the output format is correct

### Scenario 2: Project Path Configuration  
- Test with different project paths
- Verify Claude Code respects the working directory
- Ensure file operations happen in the correct location

### Scenario 3: Tool Access Control
- Test with different allowedTools configurations
- Verify tools are properly restricted/enabled
- Test Debug mode functionality

## Common Build Tasks

### File Structure:
```
n8n-nodes-claudecode/
├── nodes/ClaudeCode/           # Main node implementation
│   ├── ClaudeCode.node.ts     # Node logic and configuration
│   └── claudecode.svg         # Node icon
├── dist/                      # Built output (auto-generated)
├── examples/                  # Configuration examples
├── workflow-templates/        # Sample n8n workflows
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── gulpfile.js              # Icon copying task
└── .eslintrc.js             # Linting rules (n8n-specific)
```

### Key Development Files:
- **nodes/ClaudeCode/ClaudeCode.node.ts**: Main node implementation - edit this for functionality changes
- **package.json**: Scripts and dependencies - contains all build commands
- **.eslintrc.js**: Linting configuration with n8n-specific rules
- **tsconfig.json**: TypeScript build configuration targeting CommonJS/ES2019
- **gulpfile.js**: Copies SVG icons to dist during build

### Output Validation:
Always verify these after building:
- `dist/nodes/ClaudeCode/ClaudeCode.node.js` exists and is properly compiled
- `dist/nodes/ClaudeCode/ClaudeCode.node.d.ts` contains type definitions  
- `dist/nodes/ClaudeCode/claudecode.svg` icon is copied correctly
- No TypeScript compilation errors
- Linting passes without errors

## CI/CD Integration

The `.github/workflows/ci.yml` runs these validations:
- Build on Node.js 20.x and 22.x
- Lint with `npm run lint`
- Build with `npm run build`
- Type check with `npx tsc --noEmit`
- Format check with `npx prettier --check nodes`
- Package installation test

**Always run these locally before committing:**
```bash
npm run build
npm run lint
npm run format
npx tsc --noEmit
```

## Architecture Notes

### n8n Node Structure:
- Implements `INodeType` interface from n8n-workflow
- Provides "Query" and "Continue" operations
- Supports Claude models: sonnet, opus, haiku
- Configurable timeout, project path, and tool access
- Multiple output formats: structured JSON, messages array, plain text

### Dependencies:
- **@anthropic-ai/claude-code**: Latest Claude Code SDK
- **n8n-workflow**: Peer dependency for n8n integration
- **TypeScript**: Compiled to CommonJS for n8n compatibility

### Project Path Feature:
- Allows setting working directory for Claude Code operations
- Enables access to specific project files and repositories
- Automatically loads MCP configurations from target directory

## Troubleshooting

### Common Issues:
1. **Build fails**: Ensure `npm ci` completed successfully and TypeScript is properly installed
2. **Node not appearing in n8n**: Verify `npm link` succeeded and n8n was restarted
3. **Claude Code errors**: Check Claude CLI authentication and subscription status
4. **Permission errors**: Review `.claude/settings.json` configuration in project path

### Debug Mode:
Enable Debug Mode in the node parameters to see detailed execution logs:
- Working directory information
- Tool access details
- Message type logging
- Execution timing

## Important Notes

- **No automated tests**: All validation must be done manually via n8n
- **External dependencies**: Requires Claude Code CLI and valid authentication
- **Fast builds**: All build operations complete in under 5 seconds
- **n8n-specific linting**: Uses specialized ESLint rules for n8n community nodes
- **CommonJS output**: TypeScript compiles to CommonJS modules for n8n compatibility