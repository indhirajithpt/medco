'use client';

import React, { createContext, useContext, useState } from 'react';
import { Conversation, ChatMessage } from '@/types/chat';
import { sendChatMessage } from '@/lib/api';
import { formatErrorMessage } from '@/lib/errors';

interface ChatContextType {
  conversations: Conversation[];
  activeConversationId: string | null;
  activeConversation: Conversation | null;
  isLoading: boolean;
  statusText: string;
  emergencyAlert: string | null;
  createNewConversation: () => string;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  sendMessage: (content: string) => Promise<void>;
  retryLastMessage: () => Promise<void>;
  cancelCurrentRequest: () => void;
  clearAllConversations: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState('MedCo is analyzing medical literature and synthesizing evidence...');
  const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null);

  const abortControllerRef = React.useRef<AbortController | null>(null);

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || null;

  const createNewConversation = (): string => {
    const newId = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newConv: Conversation = {
      id: newId,
      title: 'New Consultation',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
    setEmergencyAlert(null);
    return newId;
  };

  const selectConversation = (id: string) => {
    setActiveConversationId(id);
    setEmergencyAlert(null);
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  const renameConversation = (id: string, title: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title, updatedAt: Date.now() } : c))
    );
  };

  const clearAllConversations = () => {
    setConversations([]);
    setActiveConversationId(null);
    setEmergencyAlert(null);
  };

  const cancelCurrentRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const sendMessage = async (content: string) => {
    const text = content.trim();
    if (!text || isLoading) return;

    let targetConvId = activeConversationId;
    const targetConv = activeConversation;

    if (!targetConvId || !targetConv) {
      targetConvId = createNewConversation();
    }

    const userMsgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      createdAt: Date.now(),
    };

    // Update conversation with user message & set auto-title if first message
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === targetConvId) {
          const isFirst = c.messages.length === 0;
          const updatedTitle = isFirst
            ? text.length > 36
              ? `${text.substring(0, 36)}...`
              : text
            : c.title;
          return {
            ...c,
            title: updatedTitle,
            updatedAt: Date.now(),
            messages: [...c.messages, userMessage],
          };
        }
        return c;
      })
    );

    // Setup abort controller and loading
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsLoading(true);
    setStatusText('MedCo is analyzing medical literature and synthesizing evidence...');

    // Basic heuristic emergency check trigger for prominent safety alert
    const lower = text.toLowerCase();
    if (
      lower.includes('chest pain') ||
      lower.includes('heart attack') ||
      lower.includes('can not breathe') ||
      lower.includes('cannot breathe') ||
      lower.includes('stroke') ||
      lower.includes('overdose') ||
      lower.includes('severe bleeding')
    ) {
      setEmergencyAlert(
        'Possible high-urgency symptoms mentioned. If experiencing acute distress, immediately seek emergency medical care.'
      );
    } else {
      setEmergencyAlert(null);
    }

    try {
      const response = await sendChatMessage(text, controller.signal);

      const assistantMsgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const assistantMessage: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        createdAt: Date.now(),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === targetConvId) {
            return {
              ...c,
              updatedAt: Date.now(),
              messages: [...c.messages, assistantMessage],
            };
          }
          return c;
        })
      );
    } catch (err: unknown) {
      const formatted = formatErrorMessage(err);
      if (formatted.code === 'REQUEST_CANCELLED' || formatted.code === 'ABORTED') {
        return;
      }

      const errorMsgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const errorAssistantMessage: ChatMessage = {
        id: errorMsgId,
        role: 'assistant',
        content: '',
        error: formatted.message,
        createdAt: Date.now(),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === targetConvId) {
            return {
              ...c,
              updatedAt: Date.now(),
              messages: [...c.messages, errorAssistantMessage],
            };
          }
          return c;
        })
      );
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const retryLastMessage = async () => {
    if (!activeConversation || activeConversation.messages.length === 0 || isLoading) return;

    // Find the last user message
    const messages = [...activeConversation.messages];
    let lastUserMessage: ChatMessage | null = null;

    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserMessage = messages[i];
        break;
      }
    }

    if (!lastUserMessage) return;

    // Remove the trailing error or assistant message if present
    if (messages[messages.length - 1].role === 'assistant') {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConversation.id) {
            return {
              ...c,
              messages: c.messages.slice(0, -1),
            };
          }
          return c;
        })
      );
    }

    await sendMessage(lastUserMessage.content);
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        activeConversation,
        isLoading,
        statusText,
        emergencyAlert,
        createNewConversation,
        selectConversation,
        deleteConversation,
        renameConversation,
        sendMessage,
        retryLastMessage,
        cancelCurrentRequest,
        clearAllConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
