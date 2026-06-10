import {
  ArrowRight,
  Database,
  LogOut,
  MessageSquare,
  MessagesSquareIcon,
  MoreHorizontal,
  Pencil,
  Plus,
  SidebarCloseIcon,
  Star,
  Trash2,
} from 'lucide-react';
import { useRef, useState } from 'react';
import useAuth from '../../auth/hooks/useAuth';
import { showToast } from '../../shared/components/Toast';

const NAV_ITEMS = [
  { id: 'new', label: 'New chat', icon: Plus },
  { id: 'chats', label: 'Chats', icon: MessagesSquareIcon },
];

const ChatSidebar = ({
  sidebarOpen,
  onCloseSidebar,
  onNavClick,
  chats,
  onChatSelect,
  activeNav,
  user,
  onChatDelete,
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
      console.error('Logout failed:', error);
    }
  };

  const renderChatItem = (chat) => (
    <div
      key={chat._id}
      className="group relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg
        hover:bg-ink transition-all duration-200 border border-transparent"
    >
      <button
        onClick={() => onChatSelect(chat)}
        className="flex items-center gap-2.5 flex-1 text-left
          text-mist group-hover:text-cream transition-all duration-200"
      >
        <MessageSquare size={16} strokeWidth={1.75}
          className="text-smoke group-hover:text-ember shrink-0" />
        <span className="truncate font-sans text-14">{chat.title}</span>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setChatMenuOpen(chatMenuOpen === chat._id ? null : chat._id);
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200
          p-1 rounded hover:bg-dusk text-smoke hover:text-mist shrink-0"
      >
        <MoreHorizontal size={18} strokeWidth={2} />
      </button>

      {/* Chat Menu Modal */}
      {chatMenuOpen === chat._id && (
        <div className="absolute top-full right-0 mt-1 bg-dusk border border-divide
          rounded-lg shadow-modal z-50 p-1 w-40">
          <button
            onClick={() => { showToast('info', 'Feature coming soon!'); setChatMenuOpen(null); }}
            className="w-full flex items-center gap-3 px-3 py-2 text-left
              text-mist hover:bg-ink hover:text-cream transition-all duration-200 rounded"
          >
            <Star size={14} strokeWidth={1.75} className="text-smoke" />
            <span className="font-sans text-13">Star</span>
          </button>
          <button
            onClick={() => { showToast('info', 'Feature coming soon!'); setChatMenuOpen(null); }}
            className="w-full flex items-center gap-3 px-3 py-2 text-left
              text-mist hover:bg-ink hover:text-cream transition-all duration-200 rounded"
          >
            <Pencil size={14} strokeWidth={1.75} className="text-smoke" />
            <span className="font-sans text-13">Rename</span>
          </button>

          <div className="border-t border-divide my-1" />

          <button
            onClick={() => onChatDelete(chat._id)}
            className="w-full flex items-center gap-3 px-3 py-2 text-left
              text-danger hover:bg-danger/10 transition-all duration-200 rounded"
          >
            <Trash2 size={14} strokeWidth={1.75} />
            <span className="font-sans text-13">Delete</span>
          </button>
        </div>
      )}
    </div>
  );

  const globalChats = chats.filter((chat) => chat.category === 'global');
  const recentChats = chats.filter((chat) => chat.category !== 'global');

  return (
    <aside
      className={`
        fixed md:relative z-30 md:z-auto inset-y-0 left-0
        flex flex-col
        ${sidebarOpen ? 'w-70' : 'w-0 md:w-0'}
        shrink-0
        bg-obsidian
        border-r border-divide
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        overflow-hidden
      `}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-divide">
        <span className="font-display text-17 text-cream font-medium tracking-tight">
          MindVault
        </span>
        <button
          onClick={onCloseSidebar}
          className="flex items-center justify-center w-10 h-10 rounded-lg
            text-smoke hover:text-cream hover:bg-ink transition-all duration-200"
        >
          <SidebarCloseIcon size={20} />
        </button>
      </div>

      {/* Prominent Vault link */}
      <div className="px-4 pt-4 pb-1">
        <button
          onClick={() => onNavClick('vault')}
          className={`group flex items-center justify-between px-4 py-3 rounded-lg
            w-full text-left transition-all duration-200 font-sans text-14 border cursor-pointer
            ${activeNav === 'vault'
              ? 'bg-ember text-cream border-ember'
              : 'bg-ink text-mist hover:bg-dusk hover:text-cream border-divide'}
          `}
        >
          <div className="flex items-center gap-3">
            <Database size={18} strokeWidth={2}
              className={activeNav === 'vault' ? 'text-cream' : 'text-ember'} />
            <span className="font-medium">Knowledge Vault</span>
          </div>
          <ArrowRight size={14}
            className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5
              transition-all duration-200" />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-4 py-2">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavClick(id)}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg
              w-full text-left cursor-pointer font-sans text-14
              transition-all duration-200
              ${activeNav === id
                ? 'bg-ink text-cream border border-divide'
                : 'text-mist hover:bg-ink hover:text-cream border border-transparent hover:border-divide'}
            `}
          >
            <Icon size={18} strokeWidth={1.5}
              className="group-hover:text-ember text-smoke" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Scrollable chat list container */}
      <div className="mt-4 px-4 flex-1 overflow-y-auto space-y-5">
        {/* Recents section */}
        <div>
          <p className="font-mono text-11 text-smoke uppercase tracking-wider px-3 mb-1.5">
            Recents
          </p>
          <div className="flex flex-col gap-1">
            {recentChats.map((chat) => renderChatItem(chat))}
            {recentChats.length === 0 && (
              <p className="font-sans text-12 text-smoke italic px-3 py-2">No recent chats</p>
            )}
          </div>
        </div>

        {/* Global section */}
        {globalChats.length > 0 && (
          <div>
            <p className="font-mono text-11 text-smoke uppercase tracking-wider px-3 mb-1.5">
              Global
            </p>
            <div className="flex flex-col gap-1">
              {globalChats.map((chat) => renderChatItem(chat))}
            </div>
          </div>
        )}
      </div>

      {/* Profile section */}
      <div className="w-full px-4 py-3 border-t border-divide relative" ref={profileSectionRef}>
        {/* Profile Modal */}
        {profileModalOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-3 z-50 shadow-modal
            bg-dusk border border-divide rounded-lg">
            <div className="p-4 border-b border-divide">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-ember
                  flex items-center justify-center
                  text-cream font-sans font-medium text-13">
                  {user?.name?.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-14 text-cream font-medium truncate">
                    {user?.name}
                  </p>
                  <p className="font-mono text-11 text-smoke truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left
                  font-sans text-14 text-danger hover:bg-danger/10
                  transition-all duration-200 border border-transparent"
              >
                <LogOut size={16} strokeWidth={1.75} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Profile Button */}
        <button
          onClick={handleProfileClick}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg
            hover:bg-ink transition-all duration-200 border border-transparent cursor-pointer"
        >
          <div className="h-8 w-8 rounded-full bg-ember shrink-0
            flex items-center justify-center
            text-cream font-sans font-medium text-12">
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div className="text-left min-w-0 flex-1">
            <p className="font-sans text-13 text-cream font-medium truncate">
              {user?.name}
            </p>
            <p className="font-mono text-11 text-smoke">
              Free plan
            </p>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default ChatSidebar;
