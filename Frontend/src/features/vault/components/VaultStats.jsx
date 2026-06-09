import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Code, BookOpen, Briefcase, Heart } from 'lucide-react';
import { setFilters } from '../vaultSlice';

const CATEGORIES = [
  {
    id: 'coding',
    label: 'Coding',
    icon: Code,
    textColor: 'text-vault-terracotta',
    iconColor: 'text-vault-terracotta',
    bgColor: 'bg-vault-terracotta/5',
  },
  {
    id: 'deen',
    label: 'Deen',
    icon: BookOpen,
    textColor: 'text-vault-olive',
    iconColor: 'text-vault-olive',
    bgColor: 'bg-vault-olive/5',
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: Briefcase,
    textColor: 'text-vault-stone',
    iconColor: 'text-vault-stone',
    bgColor: 'bg-vault-stone/5',
  },
  {
    id: 'life',
    label: 'Life',
    icon: Heart,
    textColor: 'text-vault-coral',
    iconColor: 'text-vault-coral',
    bgColor: 'bg-vault-coral/5',
  },
];

const VaultStats = ({ stats = {} }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCardClick = (categoryId) => {
    dispatch(setFilters({ category: categoryId, type: 'all', isArchived: false }));
    navigate('/vault');
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {CATEGORIES.map((cat) => {
        const count = stats[cat.id] || 0;
        const IconComponent = cat.icon;

        return (
          <button
            key={cat.id}
            onClick={() => handleCardClick(cat.id)}
            className="flex flex-col items-start p-5 bg-vault-ivory border border-vault-border-cream rounded-xl text-left hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group w-full"
          >
            <div className={`p-2 rounded-lg ${cat.bgColor} mb-3 transition-colors duration-200 group-hover:bg-opacity-80`}>
              <IconComponent size={20} className={cat.iconColor} />
            </div>
            <span
              className="text-vault-black text-[32px] font-medium leading-none mb-1 font-serif select-none"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {count}
            </span>
            <span
              className={`text-[12px] font-medium tracking-wider uppercase ${cat.textColor}`}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default VaultStats;
