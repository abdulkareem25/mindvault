export default function VaultFilters({ activeCategory, activeType, onCategoryChange, onTypeChange, className }) {
  const categories = [
    { value: 'all',    label: 'All categories' },
    { value: 'coding', label: 'Coding' },
    { value: 'deen',   label: 'Deen'   },
    { value: 'admin',  label: 'Admin'  },
    { value: 'life',   label: 'Life'   },
  ];

  const types = [
    { value: 'all',        label: 'All types'  },
    { value: 'decision',   label: 'Decision'   },
    { value: 'preference', label: 'Preference' },
    { value: 'learning',   label: 'Learning'   },
    { value: 'goal',       label: 'Goal'       },
    { value: 'fact',       label: 'Fact'       },
  ];

  const chipBase   = 'font-sans font-medium transition-colors duration-200 cursor-pointer rounded-lg';
  const chipActive = 'bg-ember text-cream';
  const chipInact  = 'bg-ink text-smoke border border-divide hover:border-ember/50 hover:text-mist';

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Category chips */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map(c => (
          <button
            key={c.value}
            onClick={() => onCategoryChange(c.value)}
            className={`${chipBase} text-13 px-3 py-1.5
              ${activeCategory === c.value ? chipActive : chipInact}`}
          >
            {c.label}
          </button>
        ))}
      </div>
      {/* Type chips */}
      <div className="flex flex-wrap gap-1.5">
        {types.map(t => (
          <button
            key={t.value}
            onClick={() => onTypeChange(t.value)}
            className={`${chipBase} text-12 px-2.5 py-1
              ${activeType === t.value
                ? 'bg-dusk text-cream border border-divide'
                : chipInact}`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
