import { Sparkles, ArrowRight, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DigestCard = ({ digest, onDismiss }) => {
  const navigate = useNavigate();

  if (!digest || !digest.content) return null;

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const renderContent = (text) =>
    text.split('\n\n').map((paragraph, index) => (
      <p key={index} className="font-sans text-14 text-mist leading-relaxed mb-3 last:mb-0">
        {paragraph}
      </p>
    ));

  return (
    <div className="relative overflow-hidden bg-ink
      border border-divide border-l-4 border-l-ember
      rounded-xl shadow-card p-6
      transition-all duration-200 hover:shadow-card-hover
      animate-fade-in w-full text-left mb-6">

      {/* Background accent */}
      <div className="absolute right-3 -bottom-3 text-ember/5 select-none pointer-events-none">
        <Sparkles size={120} strokeWidth={0.5} />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4
        mb-4 pb-3 border-b border-divide">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-ember/10 text-ember">
            <Sparkles size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-display text-17 text-cream">
              Weekly AI Synthesis
            </h3>
            <span className="font-mono text-11 text-smoke uppercase tracking-wider block mt-0.5">
              Week of {formatDate(digest.weekStartDate)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/digests')}
            className="flex items-center gap-1 font-sans text-12 font-medium
              text-smoke hover:text-ember transition-colors duration-200
              py-1 px-2.5 rounded hover:bg-dusk cursor-pointer"
          >
            Past Digests
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-5">
        {renderContent(digest.content)}
      </div>

      {/* Footer / Dismiss */}
      <div className="flex justify-end pt-1">
        <button
          onClick={onDismiss}
          className="flex items-center gap-1.5 px-3 py-1.5
            bg-dusk border border-divide hover:bg-fade
            text-smoke hover:text-mist
            font-sans text-12 font-medium rounded-lg
            transition-all duration-200 cursor-pointer"
        >
          <EyeOff size={13} />
          Dismiss Digest
        </button>
      </div>
    </div>
  );
};

export default DigestCard;
