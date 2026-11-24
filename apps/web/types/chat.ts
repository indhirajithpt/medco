import { MedicalSource } from './api';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  sources?: MedicalSource[];
  createdAt: number;
  isStreaming?: boolean;
  error?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

export interface QuickActionItem {
  id: 'understand' | 'prevent' | 'learn' | 'summarize';
  title: string;
  subtitle: string;
  icon: string;
  prompt: string;
}
