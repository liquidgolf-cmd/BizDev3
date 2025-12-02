import { getAnthropicClient } from './client';
import Anthropic from '@anthropic-ai/sdk';

/**
 * Model fallback configuration for different use cases
 */
export const MODEL_PRIORITIES = {
  // Primary AI Coach - tries newest first, falls back to older models
  PRIMARY_COACH: [
    'claude-sonnet-4-5-20250929', // Claude Sonnet 4.5
    'claude-3-5-sonnet-20241022', // Claude 3.5 Sonnet, Oct 2024
    'claude-3-5-sonnet-20240620', // Claude 3.5 Sonnet, June 2024
    'claude-3-sonnet-20240229',   // Claude 3.0 Sonnet, fallback
  ],
  // Weekly Coaching Session
  WEEKLY_COACHING: ['claude-3-5-sonnet-20241022'],
  // Reports Generation
  REPORTS: ['claude-sonnet-4-20250514'],
} as const;

export type ModelPriorityType = keyof typeof MODEL_PRIORITIES;

/**
 * Tries to make an API call with multiple models in order until one succeeds
 */
export async function callWithModelFallback<T>(
  callFn: (model: string) => Promise<T>,
  modelPriority: ModelPriorityType = 'PRIMARY_COACH'
): Promise<{ result: T; model: string }> {
  const models = MODEL_PRIORITIES[modelPriority];
  const errors: Array<{ model: string; error: Error }> = [];

  for (const model of models) {
    try {
      const result = await callFn(model);
      return { result, model };
    } catch (error: any) {
      // Log the error but continue to next model
      console.warn(`Model ${model} failed:`, error?.message || error);
      errors.push({ model, error: error as Error });
      
      // If it's not an API/model-related error, don't try other models
      if (error?.status !== 400 && error?.status !== 404 && error?.status !== 429) {
        throw error;
      }
    }
  }

  // If all models failed, throw the last error
  const lastError = errors[errors.length - 1];
  throw new Error(
    `All models failed. Last error from ${lastError.model}: ${lastError.error.message}`
  );
}

/**
 * Helper to create a messages.create call with model fallback
 */
export async function createMessageWithFallback(
  options: Omit<Anthropic.Messages.MessageCreateParams, 'model'>,
  modelPriority: ModelPriorityType = 'PRIMARY_COACH'
): Promise<{ response: Anthropic.Messages.Message; model: string }> {
  const anthropic = getAnthropicClient();
  
  return callWithModelFallback(
    async (model) => {
      return await anthropic.messages.create({
        ...options,
        model,
      } as Anthropic.Messages.MessageCreateParams);
    },
    modelPriority
  );
}

