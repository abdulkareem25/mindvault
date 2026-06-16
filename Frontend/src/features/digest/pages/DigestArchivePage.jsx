import { ArrowLeft, Calendar, Inbox, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ChatSidebar from '../../chat/components/ChatSidebar';
import SidebarToggle from '../../chat/components/SidebarToggle';
import { useChat } from '../../chat/hooks/useChat';
import { useGetAllDigestsQuery } from '../digestApi';

const DigestArchivePage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Chat/Sidebar state integration
  const { loadChats, initialState, handleDeleteChat } = useChat();
  const { chats } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    loadChats();
  }, []);

  const handleNavClick = (id) => {
    if (id === 'new') {
      initialState();
      navigate('/', { state: { activeNav: 'new' } });
    } else if (id === 'chats') {
      navigate('/', { state: { activeNav: 'chats' } });
    } else if (id === 'vault') {
      navigate('/vault');
    }
  };

  // Fetch past digests
  const { data, isLoading, error } = useGetAllDigestsQuery();
  const digests = data?.digests || [];

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden bg-vault-parchment"
      style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-vault-charcoal)' }}
    >
      <SidebarToggle
        sidebarOpen={sidebarOpen}
        onOpenSidebar={() => setSidebarOpen(true)}
        onCloseSidebar={() => setSidebarOpen(false)}
      />

      <ChatSidebar
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
        onNavClick={handleNavClick}
        chats={chats}
        onChatSelect={(chat) => {
          navigate('/', { state: { activeChatId: chat._id } });
        }}
        activeNav=""
        user={user}
        onChatDelete={handleDeleteChat}
      />

      {/* Main View Sheet */}
      <main className="flex-1 flex flex-col min-w-0 bg-vault-parchment overflow-y-auto px-6 md:px-12 py-8 relative text-left">
        <div className="max-w-4xl w-full mx-auto space-y-6">

          {/* Back Action / Header */}
          <div className="flex flex-col gap-2">
            <div>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 text-xs text-vault-stone hover:text-vault-terracotta font-semibold transition-colors duration-150 py-1"
              >
                <ArrowLeft size={13} />
                Back to Dashboard
              </button>
            </div>

            <div className="flex items-center justify-between border-b border-vault-border-cream pb-3">
              <div>
                <span className="text-[11px] font-bold text-vault-terracotta uppercase tracking-wider block font-sans">
                  Digest Archive
                </span>
                <h1 className="text-[32px] font-medium text-vault-black mt-1" style={{ fontFamily: 'var(--font-serif)' }}>
                  Past Weekly Digests
                </h1>
              </div>
              <div className="text-vault-stone/40">
                <Sparkles size={32} />
              </div>
            </div>
          </div>

          {/* Digests List */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-vault-ivory border border-vault-border-cream rounded-xl p-6 w-full animate-pulse space-y-3">
                    <div className="h-5 w-1/4 bg-vault-surface-3 rounded" />
                    <div className="h-4 w-full bg-vault-surface-3 rounded" />
                    <div className="h-4 w-5/6 bg-vault-surface-3 rounded" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                Failed to load past digests. Please try again.
              </div>
            ) : digests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 bg-vault-surface border border-vault-border-cream rounded-2xl text-center shadow-whisper">
                <div className="h-12 w-12 rounded-full bg-vault-stone/10 flex items-center justify-center text-vault-stone/60 mb-4">
                  <Inbox size={24} />
                </div>
                <h3 className="text-[18px] font-medium text-vault-black mb-2 font-serif" style={{ fontFamily: 'var(--font-serif)' }}>
                  No Digests Yet
                </h3>
                <p className="text-sm text-vault-text-soft max-w-xs leading-relaxed">
                  Digests generate automatically after 7 days of activity (with at least 3 new memories).
                </p>
              </div>
            ) : (
              digests.map((digest) => (
                <div key={digest._id} className="bg-vault-ivory border border-vault-border-cream rounded-xl shadow-whisper p-6 hover:border-vault-border-dark-strong/20 transition-all duration-150">
                  <div className="flex items-center gap-2 mb-4 text-vault-stone border-b border-vault-border-cream/40 pb-2">
                    <Calendar size={15} />
                    <span className="text-[12px] font-mono font-medium">
                      Week starting {formatDate(digest.weekStartDate)}
                    </span>
                    <span className="text-[10px] text-vault-stone/50 font-mono">
                      · Generated {formatDate(digest.createdAt)}
                    </span>
                  </div>

                  <div className="text-vault-charcoal text-[14px] leading-relaxed font-sans space-y-3">
                    {digest.content.split('\n\n').map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default DigestArchivePage;
