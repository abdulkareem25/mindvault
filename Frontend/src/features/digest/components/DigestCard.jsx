import React from 'react';
import { Sparkles, ArrowRight, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DigestCard = ({ digest, onDismiss }) => {
  const navigate = useNavigate();

  if (!digest || !digest.content) return null;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return '';
    }
  };

  // Split text by newlines and render as paragraphs
  const renderContent = (text) => {
    return text.split('\n\n').map((paragraph, index) => (
      <p key={index} className="text-vault-charcoal text-[14px] leading-relaxed font-sans mb-3 last:mb-0">
        {paragraph}
      </p>
    ));
  };

  return (
    <div className="relative overflow-hidden bg-vault-ivory border-y border-r border-vault-border-cream border-l-4 border-l-vault-terracotta rounded-xl shadow-whisper p-6 transition-all duration-200 hover:shadow-md animate-fade-in w-full text-left mb-6">
      {/* Sparkles background accent */}
      <div className="absolute right-3 -bottom-3 text-vault-terracotta/5 select-none pointer-events-none">
        <Sparkles size={120} strokeWidth={0.5} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-vault-border-cream/60">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-vault-terracotta/10 text-vault-terracotta animate-pulse">
            <Sparkles size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-[17px] font-semibold text-vault-black font-serif tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              Weekly AI Synthesis
            </h3>
            <span className="text-[11px] text-vault-stone font-mono uppercase tracking-wider block mt-0.5">
              Week of {formatDate(digest.weekStartDate)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/digests')}
            className="flex items-center gap-1 text-[12px] font-semibold text-vault-stone hover:text-vault-terracotta transition-colors duration-150 py-1 px-2.5 rounded hover:bg-vault-surface-2"
          >
            Past Digests
            <ArrowRight size={12} className="transition-transform duration-150 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-sm max-w-none mb-5 text-vault-text-soft">
        {renderContent(digest.content)}
      </div>

      {/* Footer / Dismiss */}
      <div className="flex justify-end pt-1">
        <button
          onClick={onDismiss}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-vault-surface-2 border border-vault-border-cream hover:bg-vault-surface-3 hover:border-vault-stone/30 text-vault-text-soft hover:text-vault-black text-xs font-semibold rounded-lg transition-all duration-150 active:scale-98 shadow-sm"
        >
          <EyeOff size={13} />
          Dismiss Digest
        </button>
      </div>
    </div>
  );
};

export default DigestCard;
