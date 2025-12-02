import { getAnthropicClient } from './client';
import Anthropic from '@anthropic-ai/sdk';

/**
 * Model fallback configuration for different use cases
 */
export const MODEL_PRIORITIES = {
  // Primary AI Coach - tries newest first, falls back to older models
  PRIMARY_COACH: [
    'claude-3-5-sonnet-20240620', // Claude 3.5 Sonnet, June 2024 (most reliable)
    'claude-3-5-sonnet-20241022', // Claude 3.5 Sonnet, Oct 2024 (if available)
    'claude-3-sonnet-20240229',   // Claude 3.0 Sonnet, fallback
    'claude-3-opus-20240229',     // Claude 3 Opus as last resort
  ],
  // Weekly Coaching Session
  WEEKLY_COACHING: ['claude-3-5-sonnet-20240620'],
  // Reports Generation
  REPORTS: ['claude-3-5-sonnet-20240620'],
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
      console.log(`[Model Fallback] Attempting to use model: ${model}`);
      const result = await callFn(model);
      console.log(`[Model Fallback] Successfully used model: ${model}`);
      return { result, model };
    } catch (error: any) {
      // Log detailed error information
      const errorStatus = error?.status || error?.statusCode;
      const errorMessage = error?.message || String(error);
      
      // Check if error message contains "not_found_error" or "404" (Anthropic API format)
      const isNotFoundError = errorMessage.includes('not_found_error') || 
                             errorMessage.includes('model:') ||
                             errorStatus === 404;
      
      console.warn(`[Model Fallback] Model ${model} failed:`, {
        status: errorStatus,
        message: errorMessage,
        isNotFoundError,
        error: error,
      });
      errors.push({ model, error: error as Error });
      
      // If it's a model not found error (404), try next model
      if (isNotFoundError) {
        console.log(`[Model Fallback] Model ${model} not found, trying next model...`);
        continue; // Try next model
      }
      
      // Only try next model if it's a model-specific error
      // Status codes that indicate model issues: 400 (bad request), 404 (not found), 429 (rate limit)
      // Don't retry on: 401 (auth), 403 (forbidden), 500+ (server errors that won't be fixed by model change)
      if (errorStatus) {
        // If it's an authentication or permission error, don't try other models
        if ([401, 403].includes(errorStatus)) {
          throw error;
        }
        // If it's a server error (500+), only retry if it's a 503 (service unavailable)
        if (errorStatus >= 500 && errorStatus !== 503) {
          throw error;
        }
        // For 404, 400, 429 - continue to next model
        if ([400, 404, 429].includes(errorStatus)) {
          continue;
        }
      }
      
      // If error doesn't have a status, it might be a network error or other issue
      // Continue to next model in case it's model-specific
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
  
  const result = await callWithModelFallback(
    async (model) => {
      const response = await anthropic.messages.create({
        ...options,
        model,
      } as Anthropic.Messages.MessageCreateParams);
      
      // Ensure we return a Message, not a Stream
      if ('content' in response) {
        return response as Anthropic.Messages.Message;
      }
      throw new Error('Streaming response not supported');
    },
    modelPriority
  );
  
  return {
    response: result.result,
    model: result.model,
  };
}

