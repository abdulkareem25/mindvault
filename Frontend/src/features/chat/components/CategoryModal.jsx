const CATEGORIES = [
  { id: "development", label: "Development" },
  { id: "career", label: "Career" },
  { id: "admin", label: "Admin" },
  { id: "life", label: "Life" },
  { id: "deen", label: "Deen" }
];

const CategoryModal = ({ isOpen, onClose, selectedCategory, onSelectCategory }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="
          bg-claude-dark-surface
          border border-claude-border-dark
          rounded-2xl
          shadow-lg
          w-full max-w-xs
          overflow-hidden
          animate-in fade-in zoom-in duration-200
        ">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-claude-border-subtle-dark text-center">
            <h2 className="text-claude-text-on-dark font-medium text-lg">
              Select Category
            </h2>
          </div>

          {/* Modal Body - Categories Grid */}
          <div className="p-4 space-y-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-150
                  ${selectedCategory?.id === cat.id
                    ? "bg-claude-terracotta/20 border border-claude-terracotta text-claude-terracotta"
                    : "border border-transparent text-claude-text-on-dark-soft hover:bg-claude-dark-surface-2 hover:text-claude-text-on-dark"
                  }
                `}
              >
                <span className="font-medium w-full">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-claude-border-subtle-dark flex gap-3">
            <button
              onClick={onClose}
              className="
                flex-1 px-4 py-2 rounded-lg
                border border-claude-border-dark
                text-claude-text-on-dark-soft
                hover:bg-claude-dark-surface-2
                transition-all duration-150
              "
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryModal;
