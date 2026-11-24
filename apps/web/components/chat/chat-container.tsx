'use client';

import React from 'react';
import { useChat } from '@/providers/chat-provider';
import { UserMessage } from './user-message';
import { AssistantMessage } from './assistant-message';
import { LoadingMessage } from './loading-message';
import { MessageComposer } from './message-composer';
import { EmergencyAlert } from '@/components/safety/emergency-alert';
import { MedicalDisclaimer } from '@/components/safety/medical-disclaimer';

export function ChatContainer() {
  const {
    activeConversation,
    isLoading,
    statusText,
    emergencyAlert,
    sendMessage,
    retryLastMessage,
    cancelCurrentRequest,
  } = useChat();

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages.length, isLoading]);

  const messages = activeConversation?.messages || [];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Scrollable messages container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {emergencyAlert && <EmergencyAlert reason={emergencyAlert} />}

          {messages.map((message, idx) => {
            const isLatest = idx === messages.length - 1;
            return message.role === 'user' ? (
              <UserMessage key={message.id} message={message} />
            ) : (
              <AssistantMessage
                key={message.id}
                message={message}
                isLatest={isLatest}
                onRetry={isLatest ? retryLastMessage : undefined}
              />
            );
          })}

          {isLoading && (
            <LoadingMessage
              statusText={statusText}
              onCancel={cancelCurrentRequest}
            />
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Sticky Bottom Composer Area */}
      <div className="sticky bottom-0 z-20 border-t border-white/5 bg-[#050505]/85 backdrop-blur-2xl p-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-2">
          <MessageComposer
            onSendMessage={sendMessage}
            isLoading={isLoading}
            onCancel={cancelCurrentRequest}
            placeholder="Ask a follow-up healthcare question..."
          />
          <MedicalDisclaimer variant="minimal" />
        </div>
      </div>
    </div>
  );
}
