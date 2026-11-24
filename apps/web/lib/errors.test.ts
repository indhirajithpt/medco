import { describe, it, expect, vi } from 'vitest';
import { formatErrorMessage, AppError } from './errors';

describe('Error Handling', () => {
  it('formats AppError correctly', () => {
    const error = new AppError('Usage limit reached', 'RATE_LIMITED', 429, true);
    const formatted = formatErrorMessage(error);
    expect(formatted.message).toBe('Usage limit reached');
    expect(formatted.code).toBe('RATE_LIMITED');
    expect(formatted.retryable).toBe(true);
  });

  it('handles network failure gracefully', () => {
    const netError = new Error('Failed to fetch');
    const formatted = formatErrorMessage(netError);
    expect(formatted.code).toBe('NETWORK_ERROR');
    expect(formatted.message).toContain('backend is currently unreachable');
    expect(formatted.retryable).toBe(true);
  });

  it('handles abort error gracefully', () => {
    const abortErr = new Error('The user aborted a request.');
    const formatted = formatErrorMessage(abortErr);
    expect(formatted.code).toBe('REQUEST_CANCELLED');
    expect(formatted.message).toBe('Request was cancelled.');
  });
});
