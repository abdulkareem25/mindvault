import { useSelector, useDispatch } from 'react-redux';
import { Plus, ArchiveX, Database, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MemoryCard from './MemoryCard';
import { setFilters, setSearchQuery, clearNewMemoryIds } from '../vaultSlice';
import { useEffect } from 'react';
import { Button, MemoryCardSkeleton } from '../../../shared/components/ui';

const MemoryGrid = ({ memories, isLoading, error, onClearFilters }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const newMemoryIds = useSelector((state) => state.vault.newMemoryIds);
  const activeFilters = useSelector((state) => state.vault.activeFilters);
  const searchQuery = useSelector((state) => state.vault.searchQuery);

  // Clear new memory indicator dot when visiting the vault
  useEffect(() => {
    if (newMemoryIds.length > 0) {
      const timer = setTimeout(() => {
        dispatch(clearNewMemoryIds());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [newMemoryIds, dispatch]);

  const handleStartChat = () => {
    navigate('/chats/new');
  };

  const hasActiveFilters =
    searchQuery ||
    activeFilters.category !== 'all' ||
    activeFilters.type !== 'all' ||
    activeFilters.isArchived;

  // Render Skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <MemoryCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Render Error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center
        border border-dashed border-divide rounded-xl bg-ink p-6 max-w-lg mx-auto">
        <Database size={40} className="text-danger mb-4" />
        <h3 className="font-display text-20 text-cream mb-2">
          Failed to Load Vault
        </h3>
        <p className="font-sans text-14 text-smoke mb-6">
          There was an error communicating with the memory database. Please try reloading.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg
            bg-ember text-cream font-sans font-medium text-14
            hover:bg-glow transition-all duration-200 cursor-pointer"
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
        <div className="flex flex-col items-center justify-center py-16 text-center
          border border-dashed border-divide rounded-xl bg-ink p-6 max-w-lg mx-auto">
          <ArchiveX size={40} className="text-smoke mb-4" />
          <h3 className="font-display text-20 text-cream mb-2">
            No Memories Match Filters
          </h3>
          <p className="font-sans text-14 text-smoke mb-6">
            Try resetting your filters or clearing your search query to see other vault memories.
          </p>
          <Button variant="secondary" size="md" onClick={onClearFilters}>
            Clear Filters & Search
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-16 text-center
        border border-dashed border-divide rounded-xl bg-ink p-6 max-w-lg mx-auto">
        <Database size={40} className="text-ember mb-4" />
        <h3 className="font-display text-24 text-cream mb-2">
          Your Vault is Empty
        </h3>
        <p className="font-sans text-14 text-smoke mb-6 max-w-sm leading-relaxed">
          Start a conversation and key memories, preferences, and facts will appear here automatically.
        </p>
        <Button variant="primary" size="md" onClick={handleStartChat}
          icon={<Plus size={16} />}>
          Start a Chat
        </Button>
      </div>
    );
  }

  // Render Grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
