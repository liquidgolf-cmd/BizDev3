import Anthropic from '@anthropic-ai/sdk';

let anthropicInstance: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!anthropicInstance) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set. Please add it to Vercel environment variables.');
    }
    
    // Validate API key format (should start with sk-ant-)
    const apiKey = process.env.ANTHROPIC_API_KEY.trim();
    if (!apiKey.startsWith('sk-ant-')) {
      console.warn('[Anthropic Client] API key format may be incorrect. Expected format: sk-ant-...');
    }
    
    console.log('[Anthropic Client] Initializing client with API key (length:', apiKey.length, ')');
    
    anthropicInstance = new Anthropic({
      apiKey: apiKey,
    });
  }
  return anthropicInstance;
}

