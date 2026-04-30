import {
  LogOut,
  MessageSquare,
  MessagesSquareIcon,
  Plus,
  Search,
  SidebarCloseIcon
} from "lucide-react";
import { useRef, useState } from "react";
import useAuth from "../../auth/hooks/useAuth";

const NAV_ITEMS = [
  { id: "new", label: "New chat", icon: Plus },
  // { id: "search", label: "Search", icon: Search }, // Uncomment when search functionality is implemented
  { id: "chats", label: "Chats", icon: MessagesSquareIcon }
];

const ChatSidebar = ({
  sidebarOpen,
  onCloseSidebar,
  onNavClick,
  chats,
  onChatSelect,
  activeNav,
  user
}) => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const profileSectionRef = useRef(null);
  const { logoutUser } = useAuth();

  const handleProfileClick = () => {
    setProfileModalOpen(!profileModalOpen);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setProfileModalOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
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
      <div className="flex items-center justify-between p-6 border-b border-claude-border-dark">
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
              "active:bg-claude-dark-surface-2 active:text-claude-text-on-dark"
            `}
          >
            <Icon size={20} strokeWidth={1.75} className="group-hover:text-claude-coral text-claude-stone" />
            <span style={{ fontSize: "15px" }}>{label}</span>
          </button>
        ))}
      </nav>

      {/* Recents section */}
      <div className="mt-6 px-4 flex flex-col flex-1 overflow-hidden">
        <p
          className="px-3 mb-1 text-claude-stone uppercase"
          style={{ fontSize: "11px", letterSpacing: "0.06em", fontWeight: 500 }}
        >
          Recents
        </p>
        <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto py-2.5 pr-1">
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
              <MessageSquare size={16} strokeWidth={1.75} className="text-claude-stone group-hover:text-claude-coral shrink-0" />
              <span className="truncate" style={{ fontSize: "15px" }}>{chat.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Profile section */}
      <div className="w-full px-4 py-3 border-t border-claude-border-subtle-dark relative" ref={profileSectionRef}>
        {/* Profile Modal */}
        {profileModalOpen && (
          <div className={`
            absolute bottom-full left-4 right-4 mb-3 z-50 shadow-lg 

            bg-claude-dark-surface-2 border border-claude-border-dark rounded-base
            transition-all duration-300 ease-in-out overflow-hidden
            ${profileModalOpen ? "translate-y-0" : "-translate-y-full"}
          `}
          >
            <div className="p-4 border-b border-claude-border-dark">
              <div className="flex items-center gap-3 mb-3">
                <div className="
                  h-16 w-16 rounded-full bg-claude-terracotta
                  flex items-center justify-center
                  text-white font-medium text-sm
                ">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-claude-text-on-dark font-medium truncate text-sm">
                    {user.name}
                  </p>
                  <p className="text-claude-stone truncate text-xs">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={handleLogout}
                className="
                  flex items-center gap-3 px-3 py-2.5 rounded-base w-full text-left
                  text-red-400 hover:bg-red-950/30
                  transition-all duration-150 text-body-sm
                  border border-transparent
                "
              >
                <LogOut size={18} strokeWidth={1.75} />
                <span style={{ fontSize: "15px" }}>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Profile Button */}
        <button
          onClick={handleProfileClick}
          className="
            flex items-center gap-5 px-4 py-1.5 w-full rounded-base
            hover:bg-claude-dark-surface-2 transition-all duration-150
            border border-transparent
          "
        >
          <div className="
            h-20 w-20 rounded-full bg-claude-terracotta
            flex items-center justify-center
            text-white font-medium
          "
          >
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="text-left min-w-0">
            <p className="text-claude-text-on-dark font-medium truncate">
              {user.name}
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
