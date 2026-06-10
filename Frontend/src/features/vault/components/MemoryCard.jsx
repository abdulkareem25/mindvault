import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Archive, Trash2, AlertTriangle } from 'lucide-react';
import { Button, CategoryBadge, TypeBadge } from '../../../shared/components/ui';
import { useUpdateMemoryMutation, useDeleteMemoryMutation, useToggleArchiveMutation } from '../vaultApi';
import { showToast } from '../../shared/components/Toast';

function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function MemoryCard({
  memory,
  compact = false,
  isNew = false,
  onEdit,
  onArchive,
  onDelete,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(memory.content);

  const [updateMemory] = useUpdateMemoryMutation();
  const [deleteMemory] = useDeleteMemoryMutation();
  const [toggleArchive] = useToggleArchiveMutation();

  const handleEdit = onEdit || (async (newContent) => {
    try {
      await updateMemory({ id: memory._id, content: newContent }).unwrap();
      showToast('success', 'Memory updated');
    } catch {
      showToast('error', 'Failed to update memory');
    }
  });

  const handleArchive = onArchive || (async () => {
    try {
      await toggleArchive(memory._id).unwrap();
      showToast('success', memory.isArchived ? 'Memory restored' : 'Memory archived');
    } catch {
      showToast('error', 'Failed to archive memory');
    }
  });

  const handleDelete = onDelete || (async () => {
    try {
      await deleteMemory({ id: memory._id, confirm: true }).unwrap();
      showToast('success', 'Memory deleted');
    } catch {
      showToast('error', 'Failed to delete memory');
    }
  });

  if (compact) return <CompactMemoryCard memory={memory} />;

  return (
    <article
      className={`
        group relative bg-ink border rounded-lg transition-all duration-200
        animate-fade-up text-left
        ${isNew
          ? 'border-ember/35 bg-cinder/40'
          : 'border-divide hover:border-ember/50 hover:-translate-y-0.5 hover:shadow-card-hover'}
      `}
    >
      {/* New dot */}
      {isNew && (
        <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-ember" />
      )}

      <div className="px-5 py-4">
        {/* Header row: badges + hover actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <CategoryBadge category={memory.category} />
            <TypeBadge type={memory.type} />
            {memory.confidence && (
              <span
                className={`font-mono text-11 px-2 py-0.5 rounded-full
                  ${memory.confidence === 'high'   ? 'text-ok bg-ok/10'     :
                    memory.confidence === 'medium' ? 'text-warn bg-warn/10' :
                                                     'text-smoke bg-divide'}`}
              >
                {memory.confidence}
              </span>
            )}
          </div>
          {/* Action buttons — visible on group hover */}
          <div className="flex items-center gap-0.5
            opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
            <Button
              variant="icon"
              size="sm"
              onClick={() => { setEditValue(memory.content); setIsEditing(true); }}
              aria-label="Edit memory"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="icon"
              size="sm"
              onClick={handleArchive}
              aria-label={memory.isArchived ? 'Unarchive' : 'Archive'}
            >
              <Archive className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="icon"
              size="sm"
              onClick={handleDelete}
              aria-label="Delete memory"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-3">
          {isEditing ? (
            <div>
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                rows={3}
                autoFocus
                className="w-full bg-transparent font-sans text-14 text-cream
                  leading-relaxed resize-none outline-none
                  border-b border-ember pb-1"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') { setEditValue(memory.content); setIsEditing(false); }
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleEdit(editValue);
                    setIsEditing(false);
                  }
                }}
              />
              <div className="flex gap-2 mt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => { handleEdit(editValue); setIsEditing(false); }}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setEditValue(memory.content); setIsEditing(false); }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p
              className="font-sans text-14 text-mist leading-relaxed cursor-text
                hover:text-cream transition-colors duration-200"
              onClick={() => { setEditValue(memory.content); setIsEditing(true); }}
            >
              {memory.content}
            </p>
          )}
        </div>

        {/* Tags */}
        {memory.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {memory.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-11 text-smoke bg-dusk border border-divide
                  px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-divide">
          <span className="font-mono text-11 text-smoke">
            {memory.sourceChatId ? (
              <Link
                to={`/chats/${memory.sourceChatId}`}
                className="hover:text-ember hover:underline transition-colors"
              >
                From chat
              </Link>
            ) : (
              'Quick capture'
            )}
          </span>
          <span className="font-mono text-11 text-smoke">
            {formatRelativeTime(memory.createdAt)}
          </span>
        </div>
      </div>

      {/* Possible duplicate warning */}
      {memory.isPossibleDuplicate && (
        <div className="px-5 pb-4">
          <p className="font-sans text-12 text-warn flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-warn" />
            Similar memory exists
          </p>
        </div>
      )}
    </article>
  );
}

function CompactMemoryCard({ memory }) {
  return (
    <div
      className="flex items-start gap-3 bg-ink border border-divide
        rounded-lg px-4 py-3 hover:border-ember/40 hover:shadow-card
        transition-all duration-200 text-left"
    >
      <CategoryBadge category={memory.category} size="sm" />
      <p className="font-sans text-13 text-mist leading-snug line-clamp-1 flex-1">
        {memory.content}
      </p>
      <span className="font-mono text-11 text-smoke shrink-0">
        {formatRelativeTime(memory.createdAt)}
      </span>
    </div>
  );
}
