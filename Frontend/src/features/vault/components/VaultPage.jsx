import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ChatSidebar from '../../chat/components/ChatSidebar';
import SidebarToggle from '../../chat/components/SidebarToggle';
import QuickCaptureModal from '../../capture/QuickCaptureModal';
import VaultSearchBar from './VaultSearchBar';
import VaultFilters from './VaultFilters';
import MemoryGrid from './MemoryGrid';
import { useChat } from '../../chat/hooks/useChat';
import { useGetMemoriesQuery, useSearchMemoriesQuery } from '../vaultApi';
import { setFilters, setSearchQuery } from '../vaultSlice';

const VaultPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Chat/Sidebar state
  const { loadChats, initialState, handleDeleteChat } = useChat();
  const { chats } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  // Vault state
  const searchQuery = useSelector((state) => state.vault.searchQuery);
  const activeFilters = useSelector((state) => state.vault.activeFilters);

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
      handleClearFilters();
    }
  };

  const handleClearFilters = () => {
    dispatch(setSearchQuery(''));
    dispatch(setFilters({ category: 'all', type: 'all', isArchived: false }));
  };

  // Fetch queries
  const getMemoriesArgs = {
    category: activeFilters.category,
    type: activeFilters.type,
    isArchived: activeFilters.isArchived,
  };

  const searchMemoriesArgs = {
    q: searchQuery,
    category: activeFilters.category,
    type: activeFilters.type,
    isArchived: activeFilters.isArchived,
  };

  const {
    data: browseData,
    isLoading: isBrowseLoading,
    error: browseError,
  } = useGetMemoriesQuery(getMemoriesArgs, { skip: !!searchQuery });

  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchMemoriesQuery(searchMemoriesArgs, { skip: !searchQuery });

  const memories = searchQuery ? searchData : browseData?.memories;
  const isLoading = searchQuery ? isSearchLoading : isBrowseLoading;
  const error = searchQuery ? searchError : browseError;

  return (
    <div
      className="flex h-screen overflow-hidden bg-vault-parchment"
      style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-vault-charcoal)' }}
    >
      <QuickCaptureModal />

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
        activeNav="vault"
        user={user}
        onChatDelete={handleDeleteChat}
      />

      {/* Main View Sheet */}
      <main className="flex-1 flex flex-col min-w-0 bg-vault-parchment overflow-y-auto px-6 md:px-12 py-8 relative text-left">
        <div className="max-w-6xl w-full mx-auto space-y-6">
          
          {/* Header */}
          <div className="text-left">
            <span className="text-[11px] font-bold text-vault-terracotta uppercase tracking-wider block font-sans">
              Knowledge Vault
            </span>
            <h1 className="text-[32px] font-medium text-vault-black mt-1" style={{ fontFamily: 'var(--font-serif)' }}>
              Your Vault
            </h1>
          </div>

          {/* Search bar and Filters */}
          <div className="bg-vault-surface border border-vault-border-cream rounded-2xl p-5 md:p-6 space-y-4 shadow-whisper">
            <VaultSearchBar />
            <VaultFilters />
          </div>

          {/* Memory Grid */}
          <div className="pt-2">
            <MemoryGrid
              memories={memories}
              isLoading={isLoading}
              error={error}
              onClearFilters={handleClearFilters}
            />
          </div>

        </div>
      </main>
    </div>
  );
};

export default VaultPage;
