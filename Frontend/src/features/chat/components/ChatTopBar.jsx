import { SidebarOpenIcon } from 'lucide-react';

const ChatTopBar = ({ sidebarOpen, onOpenSidebar, activeChatId, messageHistory, chats }) => {
  const chatTitle = chats.find((chat) => chat._id === activeChatId)?.title || 'Chat';

  return (
    <>
      {/* Mobile top bar — hamburger & title */}
      {!sidebarOpen && (
        <div className="flex items-center px-4 py-4 border-b border-divide bg-obsidian md:hidden">
          <button
            onClick={onOpenSidebar}
            className="flex items-center justify-center w-10 h-10 rounded-lg
              text-smoke hover:text-cream hover:bg-ink transition-all duration-200"
          >
            <SidebarOpenIcon size={24} />
          </button>
          <span className="flex-1 font-display text-15 text-cream font-medium text-center truncate">
            {chatTitle}
          </span>
          <div className="w-10" />
        </div>
      )}

      {/* Desktop top bar */}
      {activeChatId && messageHistory && (
        <div className="hidden md:flex items-center justify-center px-6 py-5
          border-b border-divide bg-obsidian/50">
          <span className="font-display text-17 text-cream font-medium tracking-tight truncate">
            {chatTitle}
          </span>
        </div>
      )}
    </>
  );
};

export default ChatTopBar;
