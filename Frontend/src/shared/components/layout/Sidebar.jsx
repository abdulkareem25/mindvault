import { Database, Home, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useMatch, useNavigate } from 'react-router-dom';
import { useChat } from '../../../features/chat/hooks/useChat';
import { useGetStatsQuery } from '../../../features/vault/vaultApi';
import { ConfirmModal } from '../ui/ConfirmModal';

const CATEGORY_DOT = {
  coding: '#7099e8',
  deen: '#b88cdb',
  admin: '#d4a84c',
  life: '#5ec98a',
};

const CATEGORY_LABELS = {
  coding: 'Coding',
  deen: 'Deen',
  admin: 'Admin',
  life: 'Life',
};

function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/**
 * Sidebar — works in two modes:
 *   desktopMode=true  → renders just the nav body (no positioning, used inside AppLayout's aside)
 *   desktopMode=false → renders the mobile slide-over overlay + backdrop
 */
export function Sidebar({ isOpen, onClose, desktopMode = false }) {
  const navigate = useNavigate();
  const { chats } = useSelector((state) => state.chat);
  const { loadChats, handleDeleteChat } = useChat();
  const { data: statsData } = useGetStatsQuery();

  const [chatToDelete, setChatToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  const stats = statsData || { coding: 0, deen: 0, admin: 0, life: 0, total: 0 };
  const totalMemoryCount = stats.total || 0;

  const handleNewChat = () => {
    navigate('/chats/new');
    if (onClose) onClose();
  };

  const confirmDelete = async () => {
    if (!chatToDelete) return;
    setDeleting(true);
    try {
      await handleDeleteChat(chatToDelete);
      setChatToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const sidebarBody = (
    <nav className="flex flex-col flex-1 py-3 overflow-y-auto">

      {/* Primary nav */}
      <div className="px-3 mb-1">
        <NavItem href="/" icon={<Home className="w-4 h-4" />} label="Dashboard" onClose={onClose} />
        <NavItem
          href="/vault"
          icon={<Database className="w-4 h-4" />}
          label="Knowledge Vault"
          badge={totalMemoryCount}
          onClose={onClose}
        />
      </div>

      <div className="mx-3 my-2 border-t border-divide" />

      {/* New chat */}
      <div className="px-3 mb-3">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg
            bg-ember/15 text-ember border border-ember/25
            hover:bg-ember/20 hover:border-ember/40
            font-sans text-14 font-medium
            transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          New Chat
        </button>
      </div>

      {/* Category stats */}
      <div className="px-3 mb-1">
        <p className="font-mono text-11 text-smoke uppercase tracking-wider px-2 mb-1">
          Vault
        </p>
        <CategoryTab category="coding" label="Coding" count={stats.coding} onClose={onClose} />
        <CategoryTab category="deen" label="Deen" count={stats.deen} onClose={onClose} />
        <CategoryTab category="admin" label="Admin" count={stats.admin} onClose={onClose} />
        <CategoryTab category="life" label="Life" count={stats.life} onClose={onClose} />
      </div>

      <div className="mx-3 my-2 border-t border-divide" />

      {/* Chat list */}
      <div className="px-3 flex-1 min-h-0">
        <p className="font-mono text-11 text-smoke uppercase tracking-wider px-2 mb-1">
          Recent
        </p>
        {chats.length === 0 ? (
          <p className="font-sans text-13 text-smoke px-2 py-3 italic">
            No chats yet
          </p>
        ) : (
          chats.map((chat) => (
            <ChatSidebarItem
              key={chat._id}
              chat={chat}
              onSelect={() => {
                navigate(`/chats/${chat._id}`);
                if (onClose) onClose();
              }}
              onDelete={(e) => {
                e.stopPropagation();
                setChatToDelete(chat._id);
              }}
            />
          ))
        )}
      </div>
    </nav>
  );

  // Desktop mode — just the nav body, no positioning wrapper
  if (desktopMode) {
    return (
      <>
        {sidebarBody}
        <ConfirmModal
          isOpen={!!chatToDelete}
          onClose={() => setChatToDelete(null)}
          onConfirm={confirmDelete}
          title="Delete this chat?"
          description="All messages in this conversation will be permanently removed. Memories extracted from this chat will remain in your vault."
          confirmLabel="Delete"
          loading={deleting}
        />
      </>
    );
  }

  // Mobile mode — overlay + slide-in panel
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-void/70 z-40 lg:hidden animate-fade-in"
        />
      )}

      {/* Slide-in panel */}
      <aside
        className={`
          fixed left-0 top-0 h-full w-70 bg-obsidian
          border-r border-divide z-50 flex flex-col
          transition-transform duration-200 ease-in-out lg:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
          <Link to="/" onClick={onClose} className="flex items-center gap-2">
            <span className="font-display text-17 text-cream">MindVault</span>
            <span className="font-mono text-11 bg-ember text-cream px-2 py-0.5 rounded-full">v2</span>
          </Link>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg
              text-smoke hover:text-cream hover:bg-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {sidebarBody}
      </aside>

      <ConfirmModal
        isOpen={!!chatToDelete}
        onClose={() => setChatToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete this chat?"
        description="All messages in this conversation will be permanently removed. Memories extracted from this chat will remain in your vault."
        confirmLabel="Delete"
        loading={deleting}
      />
    </>
  );
}

function NavItem({ href, icon, label, badge, onClose }) {
  const isActive = useMatch(href);
  return (
    <Link
      to={href}
      onClick={onClose}
      className={`
        flex items-center gap-2.5 px-3 py-2 rounded-lg
        font-sans text-14 font-medium
        transition-all duration-200
        ${isActive
          ? 'bg-cinder text-ember'
          : 'text-mist hover:bg-ink hover:text-cream'}
      `}
    >
      <span className="w-4 h-4 shrink-0">{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {badge > 0 && (
        <span className="font-mono text-11 bg-divide text-smoke
          px-1.5 rounded-full min-w-4 text-center">
          {badge}
        </span>
      )}
    </Link>
  );
}

function CategoryTab({ category, label, count, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeCategory = queryParams.get('category');
  const isActive = location.pathname === '/vault' && activeCategory === category;

  const handleClick = () => {
    navigate(`/vault?category=${category}`);
    if (onClose) onClose();
  };

  return (
    <button
      onClick={handleClick}
      className={`
        w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left
        font-sans text-13 transition-all duration-200 cursor-pointer
        ${isActive
          ? 'bg-cinder text-ember'
          : 'text-mist hover:bg-ink hover:text-cream'}
      `}
    >
      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: CATEGORY_DOT[category] }}
      />
      <span className="flex-1">{CATEGORY_LABELS[category]}</span>
      <span className="font-mono text-11 text-smoke">{count ?? 0}</span>
    </button>
  );
}

function ChatSidebarItem({ chat, onSelect, onDelete }) {
  const isActive = useMatch(`/chats/${chat._id}`);
  return (
    <div
      onClick={onSelect}
      className={`
        group flex items-start gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer
        transition-all duration-200
        ${isActive ? 'bg-cinder' : 'hover:bg-ink'}
      `}
    >
      {/* Category dot */}
      <div
        className="w-2 h-2 rounded-full mt-1.25 shrink-0"
        style={{ backgroundColor: CATEGORY_DOT[chat.category] || '#524f4a' }}
      />

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <p className={`font-sans text-13 font-medium truncate
          ${isActive ? 'text-ember' : 'text-cream'}`}>
          {chat.title || 'New conversation'}
        </p>
        <p className="font-mono text-11 text-smoke mt-0.5 flex items-center gap-1">
          {formatRelativeTime(chat.updatedAt)}
          {chat.extractionStatus === 'processing' && (
            <span className="flex gap-0.5 ml-1">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-1 h-1 rounded-full bg-smoke animate-blink"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </span>
          )}
        </p>
      </div>

      {/* Delete button (hover only) */}
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 shrink-0
          w-6 h-6 flex items-center justify-center rounded
          text-smoke hover:text-danger hover:bg-danger/15
          transition-all duration-200"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
