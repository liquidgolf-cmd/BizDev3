import Anthropic from '@anthropic-ai/sdk';

let anthropic: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!anthropic) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set. Please add it to Vercel environment variables.');
    }
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropic;
}

// For backward compatibility
export const anthropic = new Proxy({} as Anthropic, {
  get(_target, prop) {
    return getAnthropicClient()[prop as keyof Anthropic];
  },
});

