import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Database, Search } from 'lucide-react';
import { Button, SectionLabel, MemoryCardSkeleton } from '../../../shared/components/ui';
import { openModal } from '../../capture/captureSlice';
import { useGetMemoriesQuery, useSearchMemoriesQuery } from '../vaultApi';
import { setFilters, setSearchQuery } from '../vaultSlice';
import VaultSearchBar from './VaultSearchBar';
import VaultFilters from './VaultFilters';
import MemoryCard from './MemoryCard';
import { useEffect } from 'react';

export default function VaultPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const urlCategory = queryParams.get('category');

  const searchQuery = useSelector((state) => state.vault.searchQuery);
  const activeFilters = useSelector((state) => state.vault.activeFilters);

  useEffect(() => {
    if (urlCategory) {
      dispatch(setFilters({ ...activeFilters, category: urlCategory }));
    }
  }, [urlCategory]);

  const activeCategory = activeFilters.category;
  const activeType = activeFilters.type;

  const handleCategoryChange = (cat) => {
    dispatch(setFilters({ ...activeFilters, category: cat }));
    if (cat === 'all') navigate('/vault');
    else navigate(`/vault?category=${cat}`);
  };

  const handleTypeChange = (t) => {
    dispatch(setFilters({ ...activeFilters, type: t }));
  };

  const handleSearchChange = (q) => {
    dispatch(setSearchQuery(q));
  };

  const handleClearFilters = () => {
    dispatch(setSearchQuery(''));
    dispatch(setFilters({ category: 'all', type: 'all', isArchived: false }));
    navigate('/vault');
  };

  const getMemoriesArgs = {
    category: activeCategory,
    type: activeType,
    isArchived: activeFilters.isArchived,
  };

  const searchMemoriesArgs = {
    q: searchQuery,
    category: activeCategory,
    type: activeType,
    isArchived: activeFilters.isArchived,
  };

  const { data: browseData, isLoading: isBrowseLoading } =
    useGetMemoriesQuery(getMemoriesArgs, { skip: !!searchQuery });

  const { data: searchData, isLoading: isSearchLoading } =
    useSearchMemoriesQuery(searchMemoriesArgs, { skip: !searchQuery });

  const memories = searchQuery ? searchData : browseData?.memories;
  const isLoading = searchQuery ? isSearchLoading : isBrowseLoading;
  const resultCount = searchQuery ? (searchData?.length || 0) : null;

  const hasActiveFilters =
    searchQuery !== '' || activeCategory !== 'all' || activeType !== 'all';

  const newMemoryIds = useSelector((state) => state.vault.newMemoryIds) || [];

  return (
    <div className="px-6 lg:px-10 py-8 max-w-225 mx-auto animate-fade-in">

      {/* Page heading */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <SectionLabel>Knowledge Vault</SectionLabel>
          <h1 className="font-display text-32 text-cream mt-1">Your Vault</h1>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => dispatch(openModal())}
        >
          Quick capture
        </Button>
      </div>

      {/* Search bar */}
      <VaultSearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        isSearching={isLoading && !!searchQuery}
        resultCount={resultCount}
      />

      {/* Filters */}
      <VaultFilters
        activeCategory={activeCategory}
        activeType={activeType}
        onCategoryChange={handleCategoryChange}
        onTypeChange={handleTypeChange}
        className="mt-4 mb-6"
      />

      {/* Memory grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <MemoryCardSkeleton key={i} />
          ))}
        </div>
      ) : !memories || memories.length === 0 ? (
        <VaultEmptyState
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          onNewChat={() => navigate('/chats/new')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {memories.map((m) => (
            <MemoryCard
              key={m._id}
              memory={m}
              isNew={newMemoryIds.includes(m._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function VaultEmptyState({ hasActiveFilters, onClearFilters, onNewChat }) {
  if (hasActiveFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center
        border border-dashed border-divide rounded-xl bg-ink p-6 max-w-lg mx-auto">
        <Search className="w-10 h-10 text-smoke mb-4" />
        <h3 className="font-display text-20 text-cream mb-2">
          No memories match
        </h3>
        <p className="font-sans text-14 text-smoke mb-6">
          Try different wording, or browse all memories.
        </p>
        <button
          onClick={onClearFilters}
          className="font-sans text-14 text-ember hover:underline cursor-pointer font-medium"
        >
          Clear search & filters
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center
      border border-dashed border-divide rounded-xl bg-ink p-6 max-w-lg mx-auto">
      <Database className="w-12 h-12 text-smoke mb-4" />
      <h3 className="font-display text-24 text-cream mb-2">
        Your vault is empty
      </h3>
      <p className="font-sans text-14 text-smoke mb-6 leading-relaxed max-w-sm">
        Start a conversation in any category. After you close it, the key things you decided and learned will appear here automatically.
      </p>
      <Button variant="primary" size="md" onClick={onNewChat}>
        Start your first chat
      </Button>
    </div>
  );
}
