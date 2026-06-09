import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronRight, ChevronDown, Info, X } from 'lucide-react';
import { removePill } from '../chat.slice';

const CATEGORY_COLORS = {
  coding: { bg: 'bg-vault-terracotta/20', text: 'text-vault-terracotta', border: 'border-vault-terracotta/30' },
  deen: { bg: 'bg-vault-olive/20', text: 'text-vault-olive', border: 'border-vault-olive/30' },
  admin: { bg: 'bg-vault-stone/20', text: 'text-vault-stone', border: 'border-vault-stone/30' },
  life: { bg: 'bg-vault-warm-silver/20', text: 'text-vault-warm-silver', border: 'border-vault-warm-silver/30' },
};

const TYPE_COLORS = {
  decision: 'bg-vault-focus/15 text-vault-focus border-vault-focus/20',
  preference: 'bg-vault-coral/15 text-vault-coral border-vault-coral/20',
  learning: 'bg-green-600/15 text-green-600 border-green-600/20',
  goal: 'bg-vault-terracotta/15 text-vault-terracotta border-vault-terracotta/20',
  fact: 'bg-vault-stone/15 text-vault-stone border-vault-stone/20',
};

const ContextPillsBar = () => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);

  const { activeChatId, injectedMemories, removedPillIds } = useSelector((state) => state.chat);

  const allMemories = injectedMemories?.[activeChatId] || [];
  const removed = removedPillIds?.[activeChatId] || [];
  const visibleMemories = allMemories.filter((m) => !removed.includes(m._id));

  if (!activeChatId || visibleMemories.length === 0) return null;

  const toggleExpanded = () => setExpanded((prev) => !prev);

  const handleRemove = (memoryId) => {
    dispatch(removePill({ chatId: activeChatId, memoryId }));
  };

  const truncate = (text, max = 60) =>
    text.length > max ? text.slice(0, max) + '…' : text;

  return (
    <div className="border-b border-vault-border-subtle-dark bg-vault-dark-surface-2/20 px-6">
      {/* Collapsed / Header row */}
      <button
        onClick={toggleExpanded}
        className="flex items-center gap-1.5 py-2 w-full text-left group"
      >
        {expanded ? (
          <ChevronDown size={13} className="text-vault-stone" />
        ) : (
          <ChevronRight size={13} className="text-vault-stone" />
        )}
        <span
          className="text-vault-stone group-hover:text-vault-text-on-dark-soft transition-colors"
          style={{ fontSize: '13px', fontFamily: 'var(--font-sans)' }}
        >
          {visibleMemories.length} {visibleMemories.length === 1 ? 'memory' : 'memories'} loaded
        </span>
        <Info
          size={12}
          className="text-vault-stone/60 ml-0.5"
          title="These memories were injected as context for the AI"
        />
      </button>

      {/* Expanded pills list */}
      {expanded && (
        <div className="pb-3 space-y-1.5">
          {visibleMemories.map((memory) => {
            const cat = CATEGORY_COLORS[memory.category] || CATEGORY_COLORS.life;
            const typeCls = TYPE_COLORS[memory.type] || TYPE_COLORS.fact;

            return (
              <div
                key={memory._id}
                className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-vault-dark-surface-3/40 transition-colors group/pill"
              >
                {/* Category badge */}
                <span
                  className={`shrink-0 px-2 py-0.5 text-[11px] font-medium rounded-md border ${cat.bg} ${cat.text} ${cat.border} capitalize`}
                >
                  {memory.category}
                </span>

                {/* Type badge */}
                <span
                  className={`shrink-0 px-2 py-0.5 text-[11px] font-medium rounded-md border capitalize ${typeCls}`}
                >
                  {memory.type}
                </span>

                {/* Content */}
                <span className="flex-1 text-[13px] text-vault-text-on-dark-soft truncate">
                  &ldquo;{truncate(memory.content)}&rdquo;
                </span>

                {/* Remove button */}
                <button
                  onClick={() => handleRemove(memory._id)}
                  title="Remove from AI context for this conversation only"
                  className="shrink-0 p-0.5 rounded text-vault-stone/50 hover:text-vault-error hover:bg-vault-error/10 opacity-0 group-hover/pill:opacity-100 transition-all"
                >
                  <X size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContextPillsBar;
