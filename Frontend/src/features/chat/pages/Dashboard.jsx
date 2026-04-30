import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { showToast } from '../../shared/components/Toast';
import { setActiveChatId } from '../chat.slice';
import CategoryModal from '../components/CategoryModal';
import ChatMessages from '../components/ChatMessages';
import ChatSidebar from '../components/ChatSidebar';
import ChatTopBar from '../components/ChatTopBar';
import ChatsModal from '../components/ChatsModal';
import MessageComposer from '../components/MessageComposer';
import SidebarToggle from '../components/SidebarToggle';
import { useChat } from '../hooks/useChat';
;

const Dashboard = () => {

  const { initSocketConnection, loadChats, loadMessageHistory, handleCreateChat, sendMessageToChat, initialState } = useChat();
  const { chats, messageHistory, loading, activeChatId } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("");
  const [category, setCategory] = useState();
  const [inputValue, setInputValue] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showChatsModal, setShowChatsModal] = useState(false);

  useEffect(() => {
    initSocketConnection();
    loadChats();
  }, []);

  const handleChat = async (chat) => {
    dispatch(setActiveChatId(chat._id));
    setCategory(chat.category);
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
      setCategory(null);
      setInputValue("");
      initialState();
      setShowChatsModal(false);
    } else if (id === "chats") {
      setActiveChatId(null);
      setShowChatsModal(true);
    } else if (id === "search") {
      // Implement search functionality here
    } else {
      // Handle other nav items if needed
    }
  };


  const handleSend = async () => {
    const message = inputValue.trim();
    if (!message || !category) {
      return showToast("error", "Please enter a message and select a category before sending.");
    };
    setIsSendingMessage(true);
    try {
      let currentChatId = activeChatId;
      if (!activeChatId) {
        const chat = await handleCreateChat(category, message);
        currentChatId = chat.data._id;
        dispatch(setActiveChatId(currentChatId));
        await loadChats();
      } else {
        await sendMessageToChat(activeChatId, message);
      }
      if (currentChatId) {
        await loadMessageHistory(currentChatId);
      }
      setInputValue("");
    } catch (error) {
      console.error("Error sending message:", error);
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

      {/* ── Chats Modal ── */}
      <ChatsModal
        isOpen={showChatsModal}
        onClose={() => setShowChatsModal(false)}
        chats={chats}
        onChatSelect={handleChat}
        onNewChat={() => {
          setActiveNav("new");
          setCategory(null);
          setInputValue("");
          initialState();
          setShowChatsModal(false);
        }}
      />

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

      {/* SIDEBAR */}
      <ChatSidebar
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
        onNavClick={handleNavClick}
        chats={chats}
        onChatSelect={handleChat}
        activeNav={activeNav}
        user={user}
      />

      {/* MAIN CONTENT */}
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
              user={user}
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
          hasMessages={messageHistory.length > 0}
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
