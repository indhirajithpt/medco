import { chatResponseSchema, backendHealthSchema } from './schemas';
import type { ChatResponse, BackendHealthStatus, MedicalSource } from '../types/api';
import { AppError } from './errors';

const PROXY_BASE = '/api/proxy';

export async function checkBackendHealth(signal?: AbortSignal): Promise<BackendHealthStatus> {
  try {
    const res = await fetch(`${PROXY_BASE}/health`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
      cache: 'no-store',
    });

    if (!res.ok) {
      return { status: 'unhealthy', details: { statusCode: res.status } };
    }

    const data = await res.json();
    const parsed = backendHealthSchema.safeParse(data);
    if (!parsed.success) {
      return { status: 'degraded', details: parsed.error.format() };
    }

    return { status: 'healthy', details: parsed.data };
  } catch (err: unknown) {
    const error = err as { name?: string };
    if (error?.name === 'AbortError') {
      throw err;
    }
    return { status: 'unhealthy', details: { message: 'Connection refused or offline' } };
  }
}

export async function sendChatMessage(
  message: string,
  signal?: AbortSignal
): Promise<ChatResponse> {
  const cleanMessage = message.trim();
  if (!cleanMessage) {
    throw new AppError('Message cannot be empty.', 'EMPTY_MESSAGE', 400, false);
  }

  if (cleanMessage.length > 4000) {
    throw new AppError('Message exceeds maximum limit of 4,000 characters.', 'MESSAGE_TOO_LONG', 400, false);
  }

  let res: Response;
  try {
    res = await fetch(`${PROXY_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ message: cleanMessage }),
      signal,
    });
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string };
    if (error?.name === 'AbortError') {
      throw new AppError('Request was cancelled.', 'ABORTED', undefined, true);
    }
    throw new AppError(
      'MedCo is temporarily unavailable. Please verify the backend API server is running.',
      'NETWORK_ERROR',
      undefined,
      true
    );
  }

  if (!res.ok) {
    let errorDetail = 'Unable to generate medical response.';
    try {
      const errJson = await res.json();
      if (errJson && typeof errJson.detail === 'string') {
        errorDetail = errJson.detail;
      }
    } catch {
      // ignore
    }

    if (res.status === 429) {
      throw new AppError('MedCo has reached its current usage limit. Please wait a moment before trying again.', 'RATE_LIMITED', 429, true);
    }
    if (res.status === 400 || res.status === 422) {
      throw new AppError(errorDetail || 'Invalid question format.', 'VALIDATION_ERROR', res.status, false);
    }
    if (res.status === 504 || res.status === 408) {
      throw new AppError('The response is taking longer than expected. Please try again.', 'TIMEOUT', res.status, true);
    }
    if (res.status >= 500) {
      throw new AppError('MedCo encountered an internal service error while analyzing medical evidence.', 'SERVER_ERROR', res.status, true);
    }

    throw new AppError(errorDetail, `HTTP_${res.status}`, res.status, true);
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new AppError('Received malformed response from the medical assistant backend.', 'MALFORMED_RESPONSE', 502, true);
  }

  const parsed = chatResponseSchema.safeParse(data);
  if (!parsed.success) {
    // If backend returns a valid string answer without full schema
    const fallbackObj = data as Record<string, unknown> | null;
    if (fallbackObj && typeof fallbackObj.answer === 'string') {
      return {
        success: true,
        answer: fallbackObj.answer,
        sources: Array.isArray(fallbackObj.sources) ? (fallbackObj.sources as MedicalSource[]) : [],
      };
    }
    throw new AppError('Received ungrounded or incomplete medical response structure.', 'SCHEMA_ERROR', 500, false);
  }

  return parsed.data;
}
