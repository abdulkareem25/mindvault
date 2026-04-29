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
        <div className="flex items-center p-4 border-b border-claude-border-subtle-dark md:hidden">
          <button
            onClick={onOpenSidebar}
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
            {chatTitle}
          </span>
          <button className="w-15 h-15" />
        </div>
      )}

      {/* Desktop top bar */}
      {activeChatId && messageHistory && (
        <div className="hidden md:flex items-center justify-center p-6 border-b border-claude-border-subtle-dark">
          <span
            className="text-claude-text-on-dark font-medium text-lg tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {chatTitle}
          </span>
        </div>
      )}
    </>
  );
};

export default ChatTopBar;
