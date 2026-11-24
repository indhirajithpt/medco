export interface MedicalSource {
  reference: number;
  question: string;
  answer: string;
  source: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  success: boolean;
  answer: string;
  sources: MedicalSource[];
}

export interface BackendHealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  details?: Record<string, unknown>;
}

export interface ApiError {
  code: string;
  message: string;
  status?: number;
  details?: unknown;
  retryable?: boolean;
}
