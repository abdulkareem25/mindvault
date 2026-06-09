import { useSelector, useDispatch } from 'react-redux';
import { Plus, ArchiveX, Database, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MemoryCard from './MemoryCard';
import { setFilters, setSearchQuery, clearNewMemoryIds } from '../vaultSlice';
import { useEffect } from 'react';

const MemoryGrid = ({ memories, isLoading, error, onClearFilters }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const newMemoryIds = useSelector((state) => state.vault.newMemoryIds);
  const activeFilters = useSelector((state) => state.vault.activeFilters);
  const searchQuery = useSelector((state) => state.vault.searchQuery);

  // Clear new memory indicator dot when visiting the vault
  useEffect(() => {
    if (newMemoryIds.length > 0) {
      // Clear after 4 seconds to let user notice what's new
      const timer = setTimeout(() => {
        dispatch(clearNewMemoryIds());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [newMemoryIds, dispatch]);

  const handleStartChat = () => {
    navigate('/', { state: { activeNav: "new" } });
  };

  const hasActiveFilters =
    searchQuery ||
    activeFilters.category !== 'all' ||
    activeFilters.type !== 'all' ||
    activeFilters.isArchived;

  // Render Skeletons
  if (isLoading) {
    return (
      <div
        className="w-full"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-vault-dark-surface/50 border border-vault-border-dark/60 rounded-xl p-5 h-44 animate-pulse flex flex-col justify-between"
          >
            <div className="flex gap-2">
              <div className="h-5 w-16 bg-vault-dark-surface-3 rounded-md" />
              <div className="h-5 w-16 bg-vault-dark-surface-3 rounded-md" />
            </div>
            <div className="space-y-2.5 my-4">
              <div className="h-4 w-full bg-vault-dark-surface-3 rounded" />
              <div className="h-4 w-5/6 bg-vault-dark-surface-3 rounded" />
            </div>
            <div className="h-3 w-24 bg-vault-dark-surface-3 rounded mt-auto" />
          </div>
        ))}
      </div>
    );
  }

  // Render Error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-vault-border-cream/60 rounded-xl bg-vault-surface/40 p-6 max-w-lg mx-auto">
        <Database size={40} className="text-vault-error mb-4" />
        <h3 className="text-lg font-semibold text-vault-charcoal mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
          Failed to Load Vault
        </h3>
        <p className="text-sm text-vault-stone mb-6">
          There was an error communicating with the memory database. Please try reloading.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-vault-terracotta text-vault-ivory font-semibold text-sm hover:bg-vault-coral transition-all duration-150"
        >
          <RefreshCw size={14} />
          Reload Page
        </button>
      </div>
    );
  }

  // Render Empty State
  if (!memories || memories.length === 0) {
    if (hasActiveFilters) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-vault-border-cream rounded-xl bg-vault-surface p-6 max-w-lg mx-auto">
          <ArchiveX size={40} className="text-vault-stone mb-4" />
          <h3 className="text-lg font-semibold text-vault-charcoal mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            No Memories Match Filters
          </h3>
          <p className="text-sm text-vault-stone mb-6">
            Try resetting your filters or clearing your search query to see other vault memories.
          </p>
          <button
            onClick={onClearFilters}
            className="px-5 py-2.5 rounded-lg bg-vault-terracotta text-vault-ivory font-semibold text-sm hover:bg-vault-coral transition-all duration-150"
          >
            Clear Filters & Search
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-vault-border-cream rounded-xl bg-vault-surface p-6 max-w-lg mx-auto">
        <Database size={40} className="text-vault-terracotta mb-4" />
        <h3 className="text-lg font-semibold text-vault-charcoal mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
          Your Vault is Empty
        </h3>
        <p className="text-sm text-vault-stone mb-6">
          Start a conversation and key memories, preferences, and facts will appear here automatically.
        </p>
        <button
          onClick={handleStartChat}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-vault-terracotta text-vault-ivory font-semibold text-sm hover:bg-vault-coral transition-all duration-150"
        >
          <Plus size={16} />
          Start a Chat
        </button>
      </div>
    );
  }

  // Render Grid
  return (
    <div
      className="w-full"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
      }}
    >
      {memories.map((memory) => (
        <MemoryCard
          key={memory._id}
          memory={memory}
          isNew={newMemoryIds.includes(memory._id)}
        />
      ))}
    </div>
  );
};

export default MemoryGrid;
