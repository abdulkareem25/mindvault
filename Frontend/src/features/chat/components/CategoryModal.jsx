const CATEGORIES = ['coding', 'deen', 'admin', 'life', 'global'];

const CategoryModal = ({ isOpen, onClose, selectedCategory, onSelectCategory }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-void/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-dusk border border-divide rounded-xl shadow-modal
          w-full max-w-xs overflow-hidden animate-fade-up">

          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-divide text-center">
            <h2 className="font-display text-20 text-cream">
              Select Category
            </h2>
          </div>

          {/* Modal Body */}
          <div className="p-4 space-y-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`
                  w-full flex flex-col items-start px-4 py-2.5 rounded-lg
                  font-sans transition-all duration-200 cursor-pointer
                  ${selectedCategory === cat
                    ? 'bg-ember/15 border border-ember/40 text-ember'
                    : 'border border-transparent text-mist hover:bg-ink hover:text-cream'}
                `}
              >
                <span className="font-medium capitalize">{cat}</span>
                {cat === 'global' && (
                  <span className="text-12 font-normal normal-case text-smoke mt-0.5 block">
                    Draws context from all four areas of your vault.
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-divide">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 rounded-lg font-sans text-14
                border border-divide text-mist hover:bg-ink hover:text-cream
                transition-all duration-200 cursor-pointer"
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
