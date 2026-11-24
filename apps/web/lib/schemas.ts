import { z } from 'zod';

export const medicalSourceSchema = z.object({
  reference: z.number().int().positive(),
  question: z.string().default(''),
  answer: z.string().default(''),
  source: z.string().url().or(z.string()),
});

export const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(4000, 'Message cannot exceed 4000 characters'),
});

export const chatResponseSchema = z.object({
  success: z.boolean().default(true),
  answer: z.string().min(1, 'Answer cannot be empty'),
  sources: z.array(medicalSourceSchema).default([]),
});

export const backendHealthSchema = z.object({
  status: z.string(),
});
