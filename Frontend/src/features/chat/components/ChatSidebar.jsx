import {
  LogOut,
  MessageSquare,
  MessagesSquareIcon,
  MoreHorizontal,
  Pencil,
  Plus,
  SidebarCloseIcon,
  Star,
  Trash2
} from "lucide-react";
import { useRef, useState } from "react";
import useAuth from "../../auth/hooks/useAuth";
import { showToast } from "../../shared/components/Toast";
import { useChat } from "../hooks/useChat";

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
  user,
  onChatDelete
}) => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [chatMenuOpen, setChatMenuOpen] = useState(null);
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
        bg-claude-dark-surface-2
        border-r border-claude-border-subtle-dark
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        overflow-hidden
      `}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-claude-border-subtle-dark">
        <span
          className="text-claude-text-on-dark font-medium tracking-tight"
          style={{ fontFamily: "var(--font-serif)", fontSize: "18px" }}
        >
          MindVault
        </span>
        <button
          onClick={onCloseSidebar}
          className="flex items-center justify-center w-10 h-10 rounded-lg text-claude-stone hover:text-claude-coral transition-all duration-150"
        >
          <SidebarCloseIcon size={20} />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-4 py-3">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavClick(id)}
            className={`group
              flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left
              transition-all duration-150 text-body-sm
              text-claude-text-on-dark-soft hover:bg-claude-dark-surface-3 hover:text-claude-text-on-dark
              border border-transparent hover:border-claude-border-subtle-dark
            `}
          >
            <Icon size={20} strokeWidth={1.5} className="group-hover:text-claude-coral text-claude-stone" />
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
            <div
              key={chat._id}
              className="group relative flex items-center gap-2.5 px-3 py-2.5 rounded-base hover:bg-claude-dark-surface-3 transition-all duration-150 border border-transparent"
            >
              <button
                onClick={() => onChatSelect(chat)}
                className="flex items-center gap-2.5 flex-1 text-left
                text-claude-text-on-dark-soft
                group-hover:text-claude-text-on-dark
                transition-all duration-150"
              >
                <MessageSquare size={16} strokeWidth={1.75} className="text-claude-stone group-hover:text-claude-coral shrink-0" />
                <span className="truncate" style={{ fontSize: "15px" }}>{chat.title}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setChatMenuOpen(chatMenuOpen === chat._id ? null : chat._id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1 rounded hover:bg-claude-dark-surface-2 text-claude-stone hover:text-claude-coral shrink-0"
              >
                <MoreHorizontal size={18} strokeWidth={2} />
              </button>

              {/* Chat Menu Modal */}
              {chatMenuOpen === chat._id && (
                <div className="absolute top-full right-0 mt-1 bg-claude-dark-surface-2 border border-claude-border-dark rounded-lg shadow-lg z-50 p-5 w-fit">
                  <button
                    onClick={() => {
                      showToast("info", "Feature coming soon!");
                      setChatMenuOpen(null);
                    }}
                    className="w-full flex items-center gap-3 pl-1.5 pr-5 py-2.5 text-left text-claude-text-on-dark-soft hover:bg-claude-dark-surface-3 hover:text-claude-text-on-dark transition-all duration-150 rounded-base "
                  >
                    <Star size={16} strokeWidth={1.75} className="text-claude-stone" />
                    <span style={{ fontSize: "14px" }}>Star</span>
                  </button>
                  <button
                    onClick={() => {
                      showToast("info", "Feature coming soon!");
                      setChatMenuOpen(null);
                    }}
                    className="w-full flex items-center gap-3 px-5 py-2.5 text-left text-claude-text-on-dark-soft hover:bg-claude-dark-surface-3 hover:text-claude-text-on-dark transition-all duration-150 rounded-base"
                  >
                    <Pencil size={16} strokeWidth={1.75} className="text-claude-stone" />
                    <span style={{ fontSize: "14px" }}>Rename</span>
                  </button>

                  <div className="border-t border-claude-border-dark my-2" />

                  <button
                    onClick={() => onChatDelete(chat._id)}
                    className="w-full flex items-center gap-3 pl-1.5 pr-5 py-2.5 text-left text-red-400 hover:bg-red-950/30 transition-all duration-150 rounded-base"
                  >
                    <Trash2 size={16} strokeWidth={1.75} />
                    <span style={{ fontSize: "14px" }}>Delete</span>
                  </button>
                </div>
              )}
            </div>
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
            hover:bg-claude-dark-surface-3 transition-all duration-150
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
