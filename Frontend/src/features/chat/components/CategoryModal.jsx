const CATEGORIES = [
  "coding",
  "deen",
  "admin",
  "life",
  "global"
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
          bg-vault-dark-surface
          border border-vault-border-dark
          rounded-2xl
          shadow-lg
          w-full max-w-xs
          overflow-hidden
          animate-in fade-in zoom-in duration-200
        ">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-vault-border-subtle-dark text-center">
            <h2 className="text-vault-text-on-dark font-medium text-lg">
              Select Category
            </h2>
          </div>

          {/* Modal Body - Categories Grid */}
          <div className="p-4 space-y-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`
                  w-full flex flex-col items-start px-4 py-2.5 rounded-lg
                  transition-all duration-150
                  ${selectedCategory === cat
                    ? "bg-vault-terracotta/20 border border-vault-terracotta text-vault-terracotta"
                    : "border border-transparent text-vault-text-on-dark-soft hover:bg-vault-dark-surface-2 hover:text-vault-text-on-dark"
                  }
                `}
              >
                <span className="font-medium w-full text-left capitalize">{cat}</span>
                {cat === 'global' && (
                  <span className="text-left text-xs font-normal normal-case opacity-80 mt-1 block">
                    Draws context from all four areas of your vault.
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-vault-border-subtle-dark flex gap-3">
            <button
              onClick={onClose}
              className="
                flex-1 px-4 py-2 rounded-lg
                border border-vault-border-dark
                text-vault-text-on-dark-soft
                hover:bg-vault-dark-surface-2
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
