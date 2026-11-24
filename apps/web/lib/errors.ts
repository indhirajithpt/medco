export class AppError extends Error {
  public readonly code: string;
  public readonly status?: number;
  public readonly retryable: boolean;

  constructor(message: string, code = 'UNKNOWN_ERROR', status?: number, retryable = true) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.retryable = retryable;
  }
}

export function formatErrorMessage(err: unknown): { message: string; retryable: boolean; code: string } {
  if (err instanceof AppError) {
    return {
      message: err.message,
      retryable: err.retryable,
      code: err.code,
    };
  }

  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes('abort') || msg.includes('cancelled')) {
      return {
        message: 'Request was cancelled.',
        retryable: true,
        code: 'REQUEST_CANCELLED',
      };
    }
    if (msg.includes('network') || msg.includes('failed to fetch') || msg.includes('econnrefused')) {
      return {
        message: 'MedCo backend is currently unreachable. Please ensure the local API server is running on port 8000.',
        retryable: true,
        code: 'NETWORK_ERROR',
      };
    }
    if (msg.includes('timeout')) {
      return {
        message: 'The medical synthesis request timed out. Please try again.',
        retryable: true,
        code: 'TIMEOUT',
      };
    }
    return {
      message: err.message || 'An unexpected error occurred.',
      retryable: true,
      code: 'GENERIC_ERROR',
    };
  }

  return {
    message: 'An unexpected error occurred while communicating with MedCo.',
    retryable: true,
    code: 'UNKNOWN_ERROR',
  };
}
