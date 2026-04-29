import {
  MessageSquare,
  MessagesSquareIcon,
  Plus,
  Search,
  SidebarCloseIcon
} from "lucide-react";

const NAV_ITEMS = [
  { id: "new", label: "New chat", icon: Plus },
  { id: "search", label: "Search", icon: Search },
  { id: "chats", label: "Chats", icon: MessagesSquareIcon }
];

const ChatSidebar = ({
  sidebarOpen,
  onCloseSidebar,
  onNavClick,
  chats,
  onChatSelect,
  activeNav
}) => {
  return (
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
          onClick={onCloseSidebar}
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
            onClick={() => onNavClick(id)}
            className={`group
              flex items-center gap-3 px-3 py-2.5 rounded-base w-full text-left
              transition-all duration-150 text-body-sm
              active:bg-claude-dark-surface-2 active:border active:border-claude-border-dark active:text-claude-text-on-dark
              text-claude-text-on-dark-soft hover:bg-claude-dark-surface-2 hover:text-claude-text-on-dark border border-transparent
              ${activeNav === id ? "bg-claude-dark-surface-2 text-claude-text-on-dark" : ""}
            `}
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
              onClick={() => onChatSelect(chat)}
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
  );
};

export default ChatSidebar;
