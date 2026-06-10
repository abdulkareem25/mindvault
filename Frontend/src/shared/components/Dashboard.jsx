import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, MessageSquare, FolderOpen, ArrowRight, Database } from 'lucide-react';
import { useGetStatsQuery, useGetMemoriesQuery } from '../../features/vault/vaultApi';
import { useGetLatestDigestQuery, useDismissDigestMutation } from '../../features/digest/digestApi';
import DigestCard from '../../features/digest/components/DigestCard';

import { openModal } from '../../features/capture/captureSlice';
import MemoryCard from '../../features/vault/components/MemoryCard';
import VaultStats from '../../features/vault/components/VaultStats';

const CATEGORY_DOT = {
  coding: '#7099e8',
  deen:   '#b88cdb',
  admin:  '#d4a84c',
  life:   '#5ec98a',
};

const StatCardSkeleton = () => (
  <div className="flex flex-col items-start p-5 bg-ink border border-divide rounded-xl w-full animate-pulse">
    <div className="w-10 h-10 bg-dusk rounded-lg mb-3" />
    <div className="h-8 w-12 bg-dusk rounded mb-2" />
    <div className="h-4 w-16 bg-dusk rounded" />
  </div>
);

const MemoryCardSkeleton = () => (
  <div className="bg-ink border border-divide rounded-xl p-5 w-full animate-pulse space-y-4">
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-dusk rounded" />
        <div className="h-5 w-16 bg-dusk rounded" />
      </div>
      <div className="h-3 w-8 bg-dusk rounded" />
    </div>
    <div className="space-y-2">
      <div className="h-4 w-full bg-dusk rounded" />
      <div className="h-4 w-5/6 bg-dusk rounded" />
    </div>
    <div className="pt-2 border-t border-divide flex justify-between">
      <div className="h-3 w-16 bg-dusk rounded" />
      <div className="h-3 w-8 bg-dusk rounded" />
    </div>
  </div>
);

const ChatItemSkeleton = () => (
  <div className="flex items-center gap-3.5 p-4 bg-ink border border-divide rounded-lg w-full animate-pulse">
    <div className="w-9 h-9 bg-dusk rounded-lg" />
    <div className="flex-1 space-y-2">
      <div className="h-4 w-3/4 bg-dusk rounded" />
      <div className="h-3 w-1/4 bg-dusk rounded" />
    </div>
  </div>
);

const EmptyState = ({ onStartChat, onCapture }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6
    bg-ink border border-dashed border-divide rounded-2xl text-center max-w-xl mx-auto shadow-card w-full">
    <div className="h-16 w-16 rounded-full bg-ember/5 flex items-center justify-center text-ember mb-6">
      <Database size={32} strokeWidth={1.5} />
    </div>
    <h2 className="font-display text-24 text-cream mb-3">
      Your knowledge vault is empty.
    </h2>
    <p className="font-sans text-14 text-smoke max-w-sm mb-8 leading-relaxed">
      Start your first conversation to begin building your personal knowledge base.
    </p>
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={onStartChat}
        className="px-6 py-2.5 bg-ember text-cream rounded-lg font-sans font-medium
          hover:bg-glow shadow-sm transition-colors text-14 flex items-center gap-2 cursor-pointer"
      >
        Start a Chat →
      </button>

      <div className="flex items-center gap-2 mt-2">
        <span className="font-sans text-13 text-smoke">Or capture a quick thought:</span>
        <button
          onClick={onCapture}
          className="px-3 py-1.5 text-ember font-sans font-medium
            hover:bg-ember/5 rounded-lg transition-colors text-13 cursor-pointer"
        >
          Capture
        </button>
      </div>
    </div>
  </div>
);

const DashboardView = ({ onStartChat }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { chats } = useSelector((state) => state.chat);

  const { data: stats, isLoading: isStatsLoading } = useGetStatsQuery();
  const { data: memoriesData, isLoading: isMemoriesLoading } = useGetMemoriesQuery({ limit: 5, isArchived: false });
  const { data: digestData } = useGetLatestDigestQuery();
  const [dismissDigest] = useDismissDigestMutation();
  const [showDigestCard, setShowDigestCard] = useState(false);

  const digest = digestData?.digest;

  useEffect(() => {
    if (digest) {
      const isSeenInSession = sessionStorage.getItem(`seen_digest_${digest._id}`) === 'true';
      if (!digest.isDismissed && (!digest.isRead || isSeenInSession)) {
        setShowDigestCard(true);
        if (!digest.isRead) {
          sessionStorage.setItem(`seen_digest_${digest._id}`, 'true');
        }
      } else {
        setShowDigestCard(false);
      }
    } else {
      setShowDigestCard(false);
    }
  }, [digest]);

  const handleDismissDigest = async () => {
    if (digest) {
      try {
        await dismissDigest(digest._id).unwrap();
        setShowDigestCard(false);
      } catch (err) {
        console.error('Failed to dismiss digest:', err);
      }
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleCapture = () => {
    dispatch(openModal());
  };

  const memorySummary = stats || user?.memorySummary || { coding: 0, deen: 0, admin: 0, life: 0 };
  const totalMemories = memorySummary.coding + memorySummary.deen + memorySummary.admin + memorySummary.life;
  const isEmpty = totalMemories === 0;

  const recentMemories = memoriesData?.memories || [];
  const recentChats = chats ? [...chats].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5) : [];

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto px-6 md:px-12 py-8 text-left">
      {/* Upper header segment */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="font-mono text-11 font-bold text-ember uppercase tracking-wider block">
            YOUR VAULT
          </span>
          <h1 className="font-display text-32 text-cream mt-1">
            {getGreeting()}, {user?.name || 'Friend'}.
          </h1>
        </div>

        <button
          onClick={handleCapture}
          className="flex items-center gap-1.5 px-4 py-2
            bg-ember text-cream rounded-lg font-sans text-14 font-medium
            hover:bg-glow shadow-sm transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Capture
        </button>
      </div>

      {isEmpty && !isStatsLoading ? (
        <EmptyState onStartChat={onStartChat} onCapture={handleCapture} />
      ) : (
        <>
          {/* Vault Stats Row */}
          <div>
            {isStatsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </div>
            ) : (
              <VaultStats stats={memorySummary} />
            )}
          </div>

          {/* Main Dashboard split */}
          <div className="flex flex-col lg:flex-row gap-8 w-full items-start">
            {/* Left side: Recent Memories */}
            <div className="w-full lg:w-[65%] shrink-0 space-y-4">
              {showDigestCard && (
                <DigestCard digest={digest} onDismiss={handleDismissDigest} />
              )}
              <h2 className="font-mono text-11 font-bold text-smoke uppercase tracking-wider block border-b border-divide pb-2">
                Recent Memories
              </h2>

              {isMemoriesLoading ? (
                <div className="grid grid-cols-1 gap-4">
                  <MemoryCardSkeleton />
                  <MemoryCardSkeleton />
                </div>
              ) : recentMemories.length === 0 ? (
                <p className="font-sans text-13 text-smoke py-4">No recent memories found.</p>
              ) : (
                <div className="flex lg:grid lg:grid-cols-1 overflow-x-auto lg:overflow-visible gap-4 pb-4 lg:pb-0 -mx-6 px-6 lg:mx-0 lg:px-0 scrollbar-none snap-x">
                  {recentMemories.map((memory) => (
                    <div key={memory._id} className="min-w-[80vw] sm:min-w-[320px] lg:min-w-0 snap-start shrink-0 lg:shrink">
                      <MemoryCard memory={memory} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right side: Recent Chats */}
            <div className="w-full lg:w-[35%] space-y-4">
              <h2 className="font-mono text-11 font-bold text-smoke uppercase tracking-wider block border-b border-divide pb-2">
                Recent Chats
              </h2>

              {recentChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6
                  bg-ink border border-divide rounded-lg text-center">
                  <p className="font-sans text-13 text-smoke mb-3">No recent conversations.</p>
                  <button
                    onClick={onStartChat}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-12
                      bg-ember text-cream rounded font-sans font-medium
                      hover:bg-glow transition-colors cursor-pointer"
                  >
                    Start a Chat
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5 w-full">
                  {recentChats.map((chat) => (
                    <button
                      key={chat._id}
                      onClick={() => navigate('/', { state: { activeChatId: chat._id } })}
                      className="flex items-center gap-3.5 p-4
                        bg-ink border border-divide hover:border-ember/40
                        rounded-lg text-left transition-all duration-200
                        hover:shadow-card group w-full cursor-pointer"
                    >
                      <div className="p-2 rounded-lg bg-ember/5 text-ember group-hover:bg-ember/10 transition-colors">
                        <MessageSquare size={18} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-sans text-14 font-medium text-cream truncate group-hover:text-ember transition-colors">
                          {chat.title || 'Untitled Chat'}
                        </h4>
                        <p className="font-mono text-11 text-smoke mt-0.5">
                          {new Date(chat.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          {chat.messageCount > 0 && ` · ${chat.messageCount} messages`}
                        </p>
                      </div>
                      <ArrowRight size={14} className="text-smoke opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardView;
