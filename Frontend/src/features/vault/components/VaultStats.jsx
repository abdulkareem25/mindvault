import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Code, BookOpen, Briefcase, Heart } from 'lucide-react';
import { setFilters } from '../vaultSlice';

const CATEGORY_DOT = {
  coding: '#7099e8',
  deen:   '#b88cdb',
  admin:  '#d4a84c',
  life:   '#5ec98a',
};

const CATEGORIES = [
  { id: 'coding', label: 'Coding', icon: Code    },
  { id: 'deen',   label: 'Deen',   icon: BookOpen },
  { id: 'admin',  label: 'Admin',  icon: Briefcase},
  { id: 'life',   label: 'Life',   icon: Heart    },
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
            className="flex flex-col items-start p-5 bg-ink border border-divide
              rounded-xl text-left hover:border-ember/50 hover:shadow-card-hover
              transition-all duration-200 hover:-translate-y-0.5 group w-full cursor-pointer"
          >
            <div className="p-2 rounded-lg bg-dusk mb-3 transition-colors duration-200
              group-hover:bg-fade">
              <IconComponent size={20} style={{ color: CATEGORY_DOT[cat.id] }} />
            </div>
            <span className="font-display text-32 text-cream leading-none mb-1 select-none
              group-hover:text-ember transition-colors duration-200">
              {count}
            </span>
            <span
              className="font-sans text-12 font-medium tracking-wider uppercase"
              style={{ color: CATEGORY_DOT[cat.id] }}
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
