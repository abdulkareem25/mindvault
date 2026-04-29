import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import CategoryModal from '../components/CategoryModal';
import ChatMessages from '../components/ChatMessages';
import ChatSidebar from '../components/ChatSidebar';
import ChatTopBar from '../components/ChatTopBar';
import MessageComposer from '../components/MessageComposer';
import SidebarToggle from '../components/SidebarToggle';
import { useChat } from '../hooks/useChat';

const Dashboard = () => {

  const { initSocketConnection, loadChats, loadMessageHistory, sendMessageToChat } = useChat();
  const { chats, messageHistory, loading } = useSelector((state) => state.chat);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("");
  const [category, setCategory] = useState();
  const [inputValue, setInputValue] = useState("");
  const [activeChatId, setActiveChatId] = useState();
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    initSocketConnection();
    loadChats();
  }, []);

  const handleChat = async (chat) => {
    setActiveChatId(chat._id);
    setIsLoadingHistory(true);
    try {
      await loadMessageHistory(chat._id);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleNavClick = (id) => {
    setActiveNav(id);
    if (id === "new") {
      setActiveChatId(null);
    } else if (id === "chats") {
      setActiveChatId(null);
    } else if (id === "search") {
      // Implement search functionality here
    } else {
      // Handle other nav items if needed
    }
  };


  const handleSend = async () => {
    const message = inputValue.trim();
    if (!message || !activeChatId) return;
    setIsSendingMessage(true);
    try {
      await sendMessageToChat(activeChatId, message);
      setInputValue("");
      await loadMessageHistory(activeChatId);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isSendingMessage) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setShowCategoryModal(false);
  };

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div
      className="flex h-screen overflow-hidden bg-claude-deep-dark"
      style={{ fontFamily: "var(--font-sans)" }}
    >

      {/* ── Category Modal ── */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        selectedCategory={category}
        onSelectCategory={handleCategorySelect}
      />

      {/* ── Sidebar Toggle (Mobile backdrop & Desktop button) ── */}
      <SidebarToggle
        sidebarOpen={sidebarOpen}
        onOpenSidebar={() => setSidebarOpen(true)}
        onCloseSidebar={() => setSidebarOpen(false)}
      />

      {/* ══════════════════════════════
          SIDEBAR
      ══════════════════════════════ */}
      <ChatSidebar
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
        onNavClick={handleNavClick}
        chats={chats}
        onChatSelect={handleChat}
        activeNav={activeNav}
      />

      {/* ══════════════════════════════
          MAIN CONTENT
      ══════════════════════════════ */}
      <main className="flex-1 flex flex-col min-w-0 bg-claude-deep-dark relative">
        {/* ── Top Bar ── */}
        <ChatTopBar
          sidebarOpen={sidebarOpen}
          onOpenSidebar={() => setSidebarOpen(true)}
          activeChatId={activeChatId}
          messageHistory={messageHistory}
          chats={chats}
        />

        {/* ── Chat Messages Area ── */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex flex-col gap-6 max-w-3xl mx-auto justify-bottom h-full">
            <ChatMessages
              isLoadingHistory={isLoadingHistory}
              activeChatId={activeChatId}
              messageHistory={messageHistory}
            />
          </div>
        </div>

        {/* ── Message Composer ── */}
        <MessageComposer
          inputValue={inputValue}
          onInputChange={handleInput}
          onKeyDown={handleKeyDown}
          onSend={handleSend}
          isSendingMessage={isSendingMessage}
          category={category}
          onShowCategoryModal={() => setShowCategoryModal(true)}
        />

        {/* ── Bottom Bar ── */}
        <div className="px-4 pb-3 flex items-center justify-center">
          <p className="text-claude-stone" style={{ fontSize: "11.5px" }}>
            MindVault can make mistakes. Verify important info.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard
