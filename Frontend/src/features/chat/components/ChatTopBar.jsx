import { SidebarOpenIcon } from "lucide-react";

const ChatTopBar = ({
  sidebarOpen,
  onOpenSidebar,
  activeChatId,
  messageHistory,
  chats
}) => {
  const chatTitle = chats.find((chat) => chat._id === activeChatId)?.title || "Chat";

  return (
    <>
      {/* Mobile top bar — hamburger && title */}
      {!sidebarOpen && (
        <div className="flex items-center px-4 py-4 border-b border-claude-border-subtle-dark md:hidden bg-claude-dark-surface-2/50">
          <button
            onClick={onOpenSidebar}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-claude-stone hover:text-claude-coral transition-all duration-150"
          >
            <SidebarOpenIcon size={24} />
          </button>
          <span
            className="flex-1 text-claude-text-on-dark font-medium text-center"
            style={{ fontFamily: "var(--font-serif)", fontSize: "16px" }}
          >
            {chatTitle}
          </span>
          <div className="w-10" />
        </div>
      )}

      {/* Desktop top bar */}
      {activeChatId && messageHistory && (
        <div className="hidden md:flex items-center justify-center px-6 py-5 border-b border-claude-border-subtle-dark bg-claude-dark-surface-2/30">
          <span
            className="text-claude-text-on-dark font-medium tracking-tight truncate"
            style={{ fontFamily: "var(--font-serif)", fontSize: "17px" }}
          >
            {chatTitle}
          </span>
        </div>
      )}
    </>
  );
};

export default ChatTopBar;
