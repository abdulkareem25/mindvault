import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, X, Sparkles } from 'lucide-react';
import { setSearchQuery } from '../vaultSlice';

const VaultSearchBar = () => {
  const dispatch = useDispatch();
  const reduxQuery = useSelector((state) => state.vault.searchQuery);
  const [localQuery, setLocalQuery] = useState(reduxQuery);
  const debounceTimerRef = useRef(null);

  // Sync local state if redux state changes (e.g. clicking "View Similar" from warning)
  useEffect(() => {
    setLocalQuery(reduxQuery);
  }, [reduxQuery]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      dispatch(setSearchQuery(value));
    }, 300000 / 1000); // Wait, 300ms is 300. (The formula 300000 / 1000 is 300, wait, let's just write 300 directly to avoid confusion).
  };

  // Wait, let's write 300 directly!
  // In Javascript: 300ms is just 300.
  
  const handleClear = () => {
    setLocalQuery('');
    dispatch(setSearchQuery(''));
  };

  const isSemanticEnabled = import.meta.env.VITE_ENABLE_SEMANTIC_SEARCH === 'true';

  return (
    <div className="w-full space-y-2">
      <div className="relative flex items-center">
        <div className="absolute left-4.5 text-vault-stone pointer-events-none">
          <Search size={18} strokeWidth={2} />
        </div>
        
        <input
          type="text"
          value={localQuery}
          onChange={(e) => {
            const value = e.target.value;
            setLocalQuery(value);
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = setTimeout(() => {
              dispatch(setSearchQuery(value));
            }, 300);
          }}
          placeholder="Search your memories..."
          className="w-full bg-vault-ivory text-vault-text border border-vault-border-cream rounded-xl py-3.5 pl-12 pr-12 text-[15px] shadow-whisper focus:border-vault-terracotta focus:ring-1 focus:ring-vault-terracotta focus:bg-white outline-none transition-all duration-200"
          style={{ color: 'var(--color-vault-charcoal)' }}
        />

        {localQuery && (
          <button
            onClick={handleClear}
            className="absolute right-4 text-vault-stone hover:text-vault-terracotta transition-colors p-1 rounded-full hover:bg-vault-surface-2"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isSemanticEnabled && (
        <div className="flex items-center gap-1.5 px-1 text-[11px] font-medium text-vault-terracotta font-sans animate-fade-in">
          <Sparkles size={12} className="animate-pulse" />
          <span>Semantic search active — matches concepts and intents</span>
        </div>
      )}
    </div>
  );
};

export default VaultSearchBar;
