# Ralph Loop: Versatility Test — AI-Native SaaS Product

## Simulated Client Request
"I want to build an AI writing assistant SaaS. Needs a rich text editor interface, integration with an LLM API (stub is fine), usage-based billing (tokens consumed), team workspaces with shared documents, a REST API for enterprise customers, and a prompt template library."

## Success Criteria
- Documents table: user_id, workspace_id, title, content (rich text), token_count
- Prompt templates table: name, prompt_text, category, is_public
- Editor page with textarea and "Generate" button that calls a stub LLM endpoint
- Token usage tracking per user
- Usage-based billing calculation (show tokens used × rate)
- API route: `/api/v1/generate` with API key auth (stub)
- `npm run build` succeeds
- Write coverage analysis + COMPLETE to progress.txt
