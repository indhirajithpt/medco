import { describe, it, expect } from 'vitest';
import { sanitizeUrl, getDomain } from './utils';

describe('Utility Functions', () => {
  it('sanitizes valid HTTP and HTTPS URLs', () => {
    expect(sanitizeUrl('https://example.com/test')).toBe('https://example.com/test');
    expect(sanitizeUrl('http://nih.gov/health')).toBe('http://nih.gov/health');
  });

  it('rejects unsafe schemes', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBeNull();
    expect(sanitizeUrl('data:text/html;base64,123')).toBeNull();
    expect(sanitizeUrl('file:///etc/passwd')).toBeNull();
  });

  it('extracts domain correctly', () => {
    expect(getDomain('https://www.niddk.nih.gov/health-topics')).toBe('niddk.nih.gov');
    expect(getDomain('https://cdc.gov/diabetes')).toBe('cdc.gov');
    expect(getDomain('invalid-url')).toBe('Medical Reference');
  });
});
