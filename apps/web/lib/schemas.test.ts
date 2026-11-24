import { describe, it, expect } from 'vitest';
import { chatResponseSchema, medicalSourceSchema } from './schemas';

describe('Zod Schema Validation', () => {
  it('validates a correct medical source', () => {
    const validSource = {
      reference: 1,
      question: 'What is diabetes?',
      answer: 'Diabetes is a metabolic condition.',
      source: 'https://example.org/diabetes',
    };
    const parsed = medicalSourceSchema.safeParse(validSource);
    expect(parsed.success).toBe(true);
  });

  it('validates a well-formed chat response', () => {
    const validResponse = {
      success: true,
      answer: 'Diabetes is a metabolic disorder [1].',
      sources: [
        {
          reference: 1,
          question: 'What is diabetes?',
          answer: 'Medical evidence text',
          source: 'https://example.org',
        },
      ],
    };
    const parsed = chatResponseSchema.safeParse(validResponse);
    expect(parsed.success).toBe(true);
  });

  it('rejects empty answer in chat response', () => {
    const invalidResponse = {
      success: true,
      answer: '',
      sources: [],
    };
    const parsed = chatResponseSchema.safeParse(invalidResponse);
    expect(parsed.success).toBe(false);
  });
});
