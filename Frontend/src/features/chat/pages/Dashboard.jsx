import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useGetStatsQuery, useGetMemoriesQuery } from '../../vault/vaultApi';
import { useChat } from '../hooks/useChat';
import { SectionLabel, MemoryCardSkeleton } from '../../../shared/components/ui';
import MemoryCard from '../../vault/components/MemoryCard';

const CATEGORY_DOT = {
  coding: '#7099e8',
  deen:   '#b88cdb',
  admin:  '#d4a84c',
  life:   '#5ec98a',
};

const CATEGORY_LABELS = {
  coding: 'Coding',
  deen:   'Deen',
  admin:  'Admin',
  life:   'Life',
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

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const { chats } = useSelector((state) => state.chat);
  const { loadChats } = useChat();

  const { data: statsData } = useGetStatsQuery();
  const { data: memoriesData, isLoading: memoriesLoading } = useGetMemoriesQuery({ limit: 5 });

  const stats = statsData || { coding: 0, deen: 0, admin: 0, life: 0, total: 0 };
  const recentMemories = memoriesData?.memories || [];
  const recentChats = chats.slice(0, 6);

  useEffect(() => {
    loadChats();
  }, []);

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

  return (
    <div className="px-6 lg:px-10 py-8 max-w-225 mx-auto animate-fade-in">

      {/* Page header */}
      <div className="mb-8">
        <SectionLabel>Dashboard</SectionLabel>
        <h1 className="font-display text-32 text-cream mt-1">
          Good {timeOfDay}, {firstName}.
        </h1>
      </div>

      {/* Vault stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {[
          { cat: 'coding', label: 'Coding', count: stats.coding  },
          { cat: 'deen',   label: 'Deen',   count: stats.deen    },
          { cat: 'admin',  label: 'Admin',  count: stats.admin   },
          { cat: 'life',   label: 'Life',   count: stats.life    },
        ].map(({ cat, label, count }) => (
          <Link
            to={`/vault?category=${cat}`}
            key={cat}
            className="bg-ink border border-divide rounded-lg p-5
              hover:border-ember/50 hover:shadow-card-hover
              transition-all duration-200 group"
          >
            <p className="font-display text-32 text-cream group-hover:text-ember
              transition-colors duration-200">
              {count ?? '—'}
            </p>
            <p
              className="font-sans text-12 font-medium uppercase tracking-[0.6px] mt-1"
              style={{ color: CATEGORY_DOT[cat] }}
            >
              {label}
            </p>
          </Link>
        ))}
      </div>

      {/* Two-column lower section */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

        {/* Recent memories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-20 text-cream">Recent Memories</h2>
            <Link to="/vault" className="font-sans text-13 text-ember hover:underline">
              View all →
            </Link>
          </div>
          {memoriesLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => <MemoryCardSkeleton key={i} />)}
            </div>
          ) : recentMemories.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-divide rounded-xl">
              <span className="text-3xl select-none">🧠</span>
              <h3 className="font-display text-18 text-cream mt-3 mb-1">Vault is empty</h3>
              <p className="font-sans text-13 text-smoke">
                Close your first chat to start building memories.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentMemories.map(m => (
                <MemoryCard key={m._id} memory={m} compact />
              ))}
            </div>
          )}
        </section>

        {/* Recent chats */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-20 text-cream">Recent Chats</h2>
            <Link to="/chats/new" className="font-sans text-13 text-ember hover:underline">
              New +
            </Link>
          </div>
          <div className="space-y-1.5">
            {recentChats.length === 0 ? (
              <p className="font-sans text-13 text-smoke italic py-3">No chats yet.</p>
            ) : (
              recentChats.map(chat => (
                <Link
                  to={`/chats/${chat._id}`}
                  key={chat._id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-divide
                    bg-ink hover:border-ember/40 hover:shadow-card
                    transition-all duration-200"
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1.25 shrink-0"
                    style={{ backgroundColor: CATEGORY_DOT[chat.category] || '#524f4a' }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-13 font-medium text-cream truncate">
                      {chat.title || 'New conversation'}
                    </p>
                    <p className="font-mono text-11 text-smoke mt-0.5 capitalize">
                      {CATEGORY_LABELS[chat.category] || chat.category} · {formatRelativeTime(chat.updatedAt)}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
