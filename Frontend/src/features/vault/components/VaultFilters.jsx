import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../vaultSlice';

const CATEGORIES = ['all', 'coding', 'deen', 'admin', 'life'];
const MEMORY_TYPES = ['all', 'decision', 'preference', 'learning', 'goal', 'fact'];

const CATEGORY_LABELS = {
  all: 'All Categories',
  coding: 'Coding',
  deen: 'Deen',
  admin: 'Admin',
  life: 'Life',
};

const TYPE_LABELS = {
  all: 'All Types',
  decision: 'Decision',
  preference: 'Preference',
  learning: 'Learning',
  goal: 'Goal',
  fact: 'Fact',
};

const VaultFilters = () => {
  const dispatch = useDispatch();
  const activeFilters = useSelector((state) => state.vault.activeFilters);

  const handleCategorySelect = (category) => {
    dispatch(setFilters({ category }));
  };

  const handleTypeSelect = (type) => {
    dispatch(setFilters({ type }));
  };

  const handleArchiveToggle = () => {
    dispatch(setFilters({ isArchived: !activeFilters.isArchived }));
  };

  return (
    <div className="w-full space-y-4 py-2 text-left">
      {/* Category filters */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-vault-stone uppercase tracking-wider block font-sans">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeFilters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 capitalize ${
                  isActive
                    ? 'bg-vault-terracotta text-vault-ivory border-vault-terracotta shadow-sm'
                    : 'bg-vault-surface-2 text-vault-olive border-vault-border-cream hover:bg-vault-surface-3 hover:text-vault-text'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Type filters */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-vault-stone uppercase tracking-wider block font-sans">
          Memory Type
        </label>
        <div className="flex flex-wrap gap-2">
          {MEMORY_TYPES.map((t) => {
            const isActive = activeFilters.type === t;
            return (
              <button
                key={t}
                onClick={() => handleTypeSelect(t)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 capitalize ${
                  isActive
                    ? 'bg-vault-terracotta text-vault-ivory border-vault-terracotta shadow-sm'
                    : 'bg-vault-surface-2 text-vault-olive border-vault-border-cream hover:bg-vault-surface-3 hover:text-vault-text'
                }`}
              >
                {TYPE_LABELS[t]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggle Archive status */}
      <div className="flex items-center justify-between pt-2 border-t border-vault-border-cream/40">
        <div className="flex items-center gap-2">
          <button
            onClick={handleArchiveToggle}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
              activeFilters.isArchived
                ? 'bg-vault-stone text-vault-ivory border-vault-stone'
                : 'bg-vault-surface-2 text-vault-stone border-vault-border-cream hover:bg-vault-surface-3'
            }`}
          >
            {activeFilters.isArchived ? 'Viewing Archived' : 'View Archived'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VaultFilters;
