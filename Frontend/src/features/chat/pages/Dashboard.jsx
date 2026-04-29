import {
  ArrowUp,
  Loader,
  MessageSquare,
  MessagesSquareIcon,
  Plus,
  Search,
  SidebarCloseIcon,
  SidebarOpenIcon
} from "lucide-react";
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import MarkdownMessage from '../../shared/components/MarkdownMessage';
import Toast from '../../shared/components/Toast';
import { useChat } from '../hooks/useChat';

const NAV_ITEMS = [
  { id: "new", label: "New chat", icon: Plus },
  { id: "search", label: "Search", icon: Search },
  { id: "chats", label: "Chats", icon: MessagesSquareIcon }
];

const Dashboard = () => {

  const { initSocketConnection, loadChats, loadMessageHistory, sendMessageToChat } = useChat();
  const { chats, messageHistory, loading } = useSelector((state) => state.chat);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [activeChatId, setActiveChatId] = useState();
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

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

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div
      className="flex h-screen overflow-hidden bg-claude-deep-dark"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <Toast />
      {/* ── Mobile backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop show-sidebar button (when collapsed) */}
      {!sidebarOpen && (
        <div className="hidden md:block absolute top-6 left-6 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="
                flex items-center justify-center w-15 h-15 rounded-base
                text-claude-stone hover:text-claude-text-on-dark
                transition-all duration-150
              "
          >
            <SidebarOpenIcon />
          </button>
        </div>
      )}

      {/* ══════════════════════════════
          SIDEBAR
      ══════════════════════════════ */}
      <aside
        className={`
          fixed md:relative z-30 md:z-auto inset-y-0 left-0
          flex flex-col
          ${sidebarOpen ? "w-70" : "w-0 md:w-0"}
          shrink-0
          bg-claude-dark-surface
          border-r border-claude-border-subtle-dark
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          overflow-hidden
        `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-6">
          <span
            className="text-claude-text-on-dark font-medium text-2xl tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            MindVault
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="
              flex items-center justify-center
              w-15 h-15 rounded-base
              text-claude-stone hover:text-claude-text-on-dark-soft
              transition-all duration-150
            "
          >
            <SidebarCloseIcon />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-0.5 px-4">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className="group
                flex items-center gap-3 px-3 py-2.5 rounded-base w-full text-left
                transition-all duration-150 text-body-sm
                active:bg-claude-dark-surface-2 active:border active:border-claude-border-dark active:text-claude-text-on-dark
                text-claude-text-on-dark-soft hover:bg-claude-dark-surface-2 hover:text-claude-text-on-dark border border-transparent"
            >
              <Icon size={20} strokeWidth={1.75} className="group-active:text-claude-coral text-claude-stone" />
              <span style={{ fontSize: "15px" }}>{label}</span>
            </button>
          ))}
        </nav>

        {/* Recents section */}
        <div className="mt-6 px-4">
          <p
            className="px-3 mb-1 text-claude-stone uppercase"
            style={{ fontSize: "11px", letterSpacing: "0.06em", fontWeight: 500 }}
          >
            Recents
          </p>
          <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 h-[calc(100vh-270px)]">
            {chats.map((chat) => (
              <button
                key={chat._id}
                onClick={() => handleChat(chat)}
                className="group
                flex items-center gap-2.5 px-3 py-2.5 rounded-base w-full text-left
                text-claude-text-on-dark-soft
                hover:bg-claude-dark-surface-2 hover:text-claude-text-on-dark
                transition-all duration-150 border border-transparent
                truncate shrink-0"
              >
                <MessageSquare size={16} strokeWidth={1.75} className="text-claude-stone group-active:text-claude-coral shrink-0" />
                <span className="truncate" style={{ fontSize: "15px" }}>{chat.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Profile section */}
        <div className="fixed bottom-0 w-full px-4 py-3 border-t border-claude-border-subtle-dark">
          <button className="
            flex items-center gap-5 px-4 py-1.5 w-full rounded-base
            hover:bg-claude-dark-surface-2 transition-all duration-150
            border border-transparent
          ">
            <div className="
              h-20 w-20 rounded-full bg-claude-terracotta
              flex items-center justify-center
              text-white font-medium
            "
            >
              U
            </div>
            <div className="text-left min-w-0">
              <p className="text-claude-text-on-dark font-medium truncate">
                User
              </p>
              <p className="text-claude-stone truncate text-xs">
                Free plan
              </p>
            </div>
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════
          MAIN CONTENT
      ══════════════════════════════ */}
      <main className="flex-1 flex flex-col min-w-0 bg-claude-deep-dark relative">

        {/* Mobile top bar — hamburger && title */}
        {!sidebarOpen && (
          <div className="flex items-center p-4 border-b border-claude-border-subtle-dark md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="
                flex items-center justify-center w-15 h-15 rounded-base
                text-claude-stone hover:text-claude-text-on-dark
                transition-all duration-150
              "
            >
              <SidebarOpenIcon size={25} />
            </button>
            <span
              className="flex-1 text-claude-text-on-dark font-medium text-lg tracking-tight text-center"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {chats.find((chat) => chat.id === activeChatId)?.title || "Chat"}
            </span>
            <button className="w-15 h-15" />
          </div>
        )}

        {/* top bar */}
        {activeChatId && messageHistory && (
          <div className="hidden md:flex items-center justify-center p-6 border-b border-claude-border-subtle-dark">
            <span
              className="text-claude-text-on-dark font-medium text-lg tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {chats.find((chat) => chat._id === activeChatId)?.title || "Chat"}
            </span>
          </div>
        )}

        {/* Chat area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex flex-col gap-6 max-w-3xl mx-auto justify-bottom h-full">
            {isLoadingHistory ? (
              // {/* Loading state */}
              <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 pt-16">
                <div className="flex items-center justify-center gap-3">
                  <Loader className="animate-spin text-claude-terracotta" size={28} />
                  <p className="text-claude-text-on-dark-soft">Loading messages...</p>
                </div>
              </div>
            ) : !activeChatId || messageHistory.length === 0 ? (
              // {/* Greeting */}
              <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 pt-16">
                <h1
                  className="text-claude-text-on-dark text-center font-medium mb-3"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(26px, 5vw, 42px)",
                    lineHeight: 1.15,
                  }}
                >
                  Hey Rahul, welcome back!
                </h1>
                <p
                  className="text-claude-text-on-dark-soft text-center max-w-sm"
                  style={{ fontSize: "15px", lineHeight: 1.6 }}
                >
                  How can I help you today?
                </p>
              </div>
            ) : (
              // {/* Messages */}
              <div className="flex flex-col gap-6 w-full">
                {messageHistory.map(({ _id, sender, content }) => (
                  <div
                    key={_id}
                    className={`
                      flex items-start gap-4
                      ${sender === "user" ? "justify-end" : "justify-start"}
                    `}
                  >
                    <MarkdownMessage
                      content={content}
                      isUserMessage={sender === "user"}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Composer ── */}
        <div className="px-4 py-6 flex justify-center">
          <div
            className="
              w-full max-w-190 p-6
              bg-claude-dark-surface/90 backdrop-blur-md
              border border-claude-border-dark
              rounded-3xl
              shadow-whisper
              flex flex-col
              transition-all duration-200
            "
          >

            {/* Textarea row */}
            <textarea
              value={inputValue}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Type your message here..."
              className="
                  flex-1 bg-transparent outline-none border-none 
                  resize-none focus-visible:ring-0 text-md
                  text-claude-text-on-dark placeholder:text-claude-stone
                  leading-relaxed h-auto max-h-50 overflow-y-auto
                "
            />

            {/* Action buttons row */}
            <div className="flex items-center justify-between gap-2
              px-6 py-4
            ">
              {/* Attachment button */}
              <button
                className="
                flex items-center justify-center w-15 h-15 rounded-full shrink-0
                text-claude-stone
                hover:bg-claude-dark-surface-2 hover:text-claude-text-on-dark-soft
                transition-all duration-150
                "
              >
                <Plus size={25} strokeWidth={1.75} />
              </button>
              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isSendingMessage}
                className={`
                  flex items-center justify-center w-15 h-15 rounded-full shrink-0 transition-all duration-150
                  ${inputValue.trim() && !isSendingMessage
                    ? "bg-claude-terracotta hover:bg-claude-coral hover:scale-105 text-white"
                    : "bg-claude-dark-surface-2 text-claude-stone cursor-not-allowed"
                  }
                `}
              >
                {isSendingMessage ? (
                  <Loader size={25} strokeWidth={2} className="animate-spin" />
                ) : (
                  <ArrowUp size={25} strokeWidth={2} />
                )}
              </button>
            </div>

          </div>
        </div>
        {/* Bottom bar */}
        <div className="px-4 pb-3 flex items-center justify-center">
          <p className="text-claude-stone" style={{ fontSize: "11.5px" }}>
            MindVault can make mistakes. Verify important info.
          </p>
        </div>
      </main >
    </div >
  )
}

export default Dashboard
