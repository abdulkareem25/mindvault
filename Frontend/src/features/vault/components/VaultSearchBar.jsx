import { Search, X } from 'lucide-react';

export default function VaultSearchBar({ value, onChange, isSearching, resultCount }) {
  return (
    <div className="flex items-center gap-3 h-13 px-4
      bg-ink border border-divide rounded-xl
      focus-within:border-ember focus-within:shadow-input-focus
      transition-all duration-200">

      {/* Left icon */}
      <div className="shrink-0">
        {isSearching ? (
          <div className="w-4 h-4 border-2 border-smoke border-t-transparent
            rounded-full animate-spin" />
        ) : (
          <Search className={`w-4 h-4 ${value ? 'text-ember' : 'text-smoke'}`} />
        )}
      </div>

      {/* Input */}
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search your vault..."
        className="flex-1 bg-transparent font-sans text-15 text-cream
          placeholder:text-smoke outline-none"
      />

      {/* Status / clear */}
      {value && (
        <div className="flex items-center gap-2 shrink-0">
          {resultCount !== null && (
            <span className="font-sans text-12 text-smoke">
              {resultCount} result{resultCount !== 1 ? 's' : ''}
            </span>
          )}
          <button
            onClick={() => onChange('')}
            className="text-smoke hover:text-cream transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
