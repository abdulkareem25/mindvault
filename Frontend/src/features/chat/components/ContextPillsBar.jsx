import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CategoryBadge } from '../../../shared/components/ui';
import { removePill } from '../chat.slice';

export default function ContextPillsBar() {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);

  const { activeChatId, injectedMemories, removedPillIds } = useSelector((state) => state.chat);

  const allMemories = injectedMemories?.[activeChatId] || [];
  const removed = removedPillIds?.[activeChatId] || [];
  const visibleMemories = allMemories.filter((m) => !removed.includes(m._id));

  if (!activeChatId || visibleMemories.length === 0) return null;

  const handleRemove = (memoryId) => {
    dispatch(removePill({ chatId: activeChatId, memoryId }));
  };

  const handleClearAll = () => {
    visibleMemories.forEach(m => {
      dispatch(removePill({ chatId: activeChatId, memoryId: m._id }));
    });
  };

  const truncate = (text, max = 50) =>
    text.length > max ? text.slice(0, max) + '...' : text;

  return (
    <div className="border-b border-divide bg-obsidian shrink-0">
      {/* Collapsed State Header */}
      <div className="h-9 px-4 flex items-center justify-between select-none">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 font-sans text-13 font-medium text-ember
            hover:opacity-80 transition-opacity cursor-pointer"
        >
          <span>⚡</span>
          <span>{visibleMemories.length} memories loaded</span>
          {expanded
            ? <ChevronDown className="w-3.5 h-3.5" />
            : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {expanded && (
          <button
            onClick={handleClearAll}
            className="font-sans text-12 text-smoke hover:text-danger
              transition-colors cursor-pointer"
          >
            Remove all context
          </button>
        )}
      </div>

      {/* Expanded State Pills Grid */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 flex flex-wrap gap-2 animate-fade-up">
          {visibleMemories.map((memory) => (
            <div
              key={memory._id}
              className="flex items-center gap-2 bg-ink border border-divide
                rounded-full pl-2 pr-3 py-1 text-12"
            >
              <CategoryBadge category={memory.category} size="sm" />
              <span className="font-sans text-mist font-normal leading-none
                max-w-62.5 truncate text-13">
                {truncate(memory.content)}
              </span>
              <button
                onClick={() => handleRemove(memory._id)}
                className="text-smoke hover:text-danger transition-colors
                  p-0.5 rounded cursor-pointer"
                title="Remove from context"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
