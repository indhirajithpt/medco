'use client';

  import React, { useState } from 'react';
  import { useChat } from '@/providers/chat-provider';
  import { Header } from '@/components/layout/header';
  import { Sidebar } from '@/components/layout/sidebar';
  import { MobileSidebar } from '@/components/layout/mobile-sidebar';
  import { LandingHero } from '@/components/landing/hero';
  import { ChatContainer } from '@/components/chat/chat-container';
  import { MedicalDisclaimer } from '@/components/safety/medical-disclaimer';

  export default function HomePage() {
    const {
      conversations,
      activeConversationId,
      activeConversation,
      createNewConversation,
      selectConversation,
      deleteConversation,
      renameConversation,
      sendMessage,
      isLoading,
    } = useChat();

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const hasActiveChat =
      Boolean(activeConversation && activeConversation.messages.length > 0);

    return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#050505] text-[#f5f5f7] relative">
            {/* Ambient background glows */}
            <div className="purple-glow-ambient absolute inset-0 pointer-events-none" />
            <div className="purple-glow-subtle absolute inset-0 pointer-events-none" />

            {/* Desktop Sidebar (hidden when in landing state if no conversations, or collapsible) */}
            <Sidebar
              conversations={conversations}
              activeId={activeConversationId || undefined}
              onSelectConversation={selectConversation}
              onNewConversation={createNewConversation}
              onDeleteConversation={deleteConversation}
              onRenameConversation={renameConversation}
              isCollapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex"
            />

            {/* Mobile Drawer */}
            <MobileSidebar
              isOpen={mobileSidebarOpen}
              onClose={() => setMobileSidebarOpen(false)}
              conversations={conversations}
              activeId={activeConversationId || undefined}
              onSelectConversation={selectConversation}
              onNewConversation={createNewConversation}
              onDeleteConversation={deleteConversation}
              onRenameConversation={renameConversation}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full relative z-10">
              <Header
                showSidebarToggle={true}
                onToggleSidebar={() => setMobileSidebarOpen(true)}
              />

            <main className="flex-1 flex flex-col overflow-hidden relative">
              {!hasActiveChat ? (
                <div className="flex-1 overflow-y-auto flex flex-col justify-between py-6">
                  <div className="flex-1 flex items-center justify-center">
                    <LandingHero
                      onSendMessage={sendMessage}
                      isLoading={isLoading}
                    />
                  </div>
                  <div className="pt-4 pb-2">
                    <MedicalDisclaimer variant="minimal" />
                  </div>
                </div>
              ) : (
                <ChatContainer />
              )}
            </main>
          </div>
      </div>
    );
  }
