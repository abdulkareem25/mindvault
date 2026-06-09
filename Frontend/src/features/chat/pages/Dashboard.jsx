import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from 'react-router-dom';
import { showToast } from '../../shared/components/Toast';
import { setActiveChatId, incrementMessageCount } from '../chat.slice';
import CategoryModal from '../components/CategoryModal';
import ChatMessages from '../components/ChatMessages';
import ChatSidebar from '../components/ChatSidebar';
import ChatTopBar from '../components/ChatTopBar';
import ChatsModal from '../components/ChatsModal';
import MessageComposer from '../components/MessageComposer';
import ContextPillsBar from '../components/ContextPillsBar';
import SidebarToggle from '../components/SidebarToggle';
import QuickCaptureModal from '../../capture/QuickCaptureModal';
import { useChat } from '../hooks/useChat';
import { useSocket } from '../hooks/useSocket';
import { getSocket } from '../services/chat.socket';

const Dashboard = () => {
  useSocket();
  const location = useLocation();
  const navigate = useNavigate();

  const { initSocketConnection, loadChats, loadMessageHistory, handleCreateChat, sendMessageToChat, initialState, handleDeleteChat } = useChat();
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

  useEffect(() => {
    if (location.state?.prefillContent) {
      setInputValue(location.state.prefillContent);
      window.history.replaceState({}, document.title);
    }
    if (location.state?.activeNav) {
      handleNavClick(location.state.activeNav);
      window.history.replaceState({}, document.title);
    }
    if (location.state?.activeChatId && chats.length > 0) {
      const chat = chats.find(c => c._id === location.state.activeChatId);
      if (chat) {
        handleChat(chat);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state, chats]);

  useEffect(() => {
    const socket = getSocket();
    const currentChatId = activeChatId;

    return () => {
      if (currentChatId && socket) {
        socket.emit('chat:closed', { chatId: currentChatId });
      }
    };
  }, [activeChatId]);

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
    } else if (id === "vault") {
      navigate('/vault');
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
        dispatch(incrementMessageCount({ chatId: activeChatId, amount: 2 }));
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

  const handleDelete = async (chatId) => {
    try {
      await handleDeleteChat(chatId);
      setChatMenuOpen(null);
    } catch (error) {
      console.log("Delete chat failed:", error);
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden bg-vault-deep-dark"
      style={{ fontFamily: "var(--font-sans)" }}
    >

      {/* ── Quick Capture Modal ── */}
      <QuickCaptureModal />

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
        onChatDelete={handleDelete}
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
        onChatDelete={handleDelete}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-vault-deep-dark relative">
        {/* ── Top Bar ── */}
        <ChatTopBar
          sidebarOpen={sidebarOpen}
          onOpenSidebar={() => setSidebarOpen(true)}
          activeChatId={activeChatId}
          messageHistory={messageHistory}
          chats={chats}
        />

        {/* ── Context Pills (feature-flagged) ── */}
        {import.meta.env.VITE_ENABLE_CONTEXT_PILLS === 'true' && (
          <ContextPillsBar />
        )}

        {/* ── Chat Messages Area ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 px-6 py-6 max-w-4xl mx-auto h-full">
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
          <p className="text-vault-stone" style={{ fontSize: "11.5px" }}>
            MindVault can make mistakes. Verify important info.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard
