import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { MoreHorizontal, AlertTriangle, Trash2, Archive, X, Check, Eye } from 'lucide-react';
import { useUpdateMemoryMutation, useDeleteMemoryMutation, useToggleArchiveMutation } from '../vaultApi';
import { showToast } from '../../shared/components/Toast';
import { setSearchQuery } from '../vaultSlice';
import { useNavigate } from 'react-router-dom';

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

const MemoryCard = ({ memory, isNew }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const warningRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(memory.content);
  const [showMenu, setShowMenu] = useState(false);
  const [showWarningPopover, setShowWarningPopover] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [updateMemory, { isLoading: isUpdating }] = useUpdateMemoryMutation();
  const [deleteMemory] = useDeleteMemoryMutation();
  const [toggleArchive] = useToggleArchiveMutation();

  // Close dropdown menu and popover on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
        setShowDeleteConfirm(false);
      }
      if (warningRef.current && !warningRef.current.contains(event.target)) {
        setShowWarningPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEditClick = (e) => {
    // Prevent trigger if clicking on badges, buttons, etc.
    if (e.target.closest('button') || e.target.closest('.badge-item') || showWarningPopover) return;
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!editedContent.trim()) return;
    try {
      await updateMemory({ id: memory._id, content: editedContent.trim() }).unwrap();
      showToast('success', 'Memory updated successfully');
      setIsEditing(false);
    } catch {
      showToast('error', 'Failed to update memory');
    }
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setEditedContent(memory.content);
    setIsEditing(false);
  };

  const handleArchive = async (e) => {
    e.stopPropagation();
    try {
      await toggleArchive(memory._id).unwrap();
      showToast('success', memory.isArchived ? 'Memory restored from archive' : 'Memory archived successfully');
      setShowMenu(false);
    } catch {
      showToast('error', 'Failed to archive memory');
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await deleteMemory({ id: memory._id, confirm: true }).unwrap();
      showToast('success', 'Memory permanently deleted');
      setShowMenu(false);
    } catch {
      showToast('error', 'Failed to delete memory');
    }
  };

  const handleDismissWarning = async (e) => {
    e.stopPropagation();
    try {
      await updateMemory({
        id: memory._id,
        isPossibleDuplicate: false,
        possibleDuplicateOf: null
      }).unwrap();
      showToast('success', 'Warning dismissed');
      setShowWarningPopover(false);
    } catch {
      showToast('error', 'Failed to dismiss warning');
    }
  };

  const handleViewSimilar = (e) => {
    e.stopPropagation();
    if (!memory.possibleDuplicateOf) return;
    
    const targetId = `memory-card-${memory.possibleDuplicateOf._id || memory.possibleDuplicateOf}`;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-yellow-500');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-yellow-500');
      }, 2000);
      setShowWarningPopover(false);
    } else {
      // If the referenced memory is not on the screen, filter/search by the text of the duplicate if available
      const searchContent = typeof memory.possibleDuplicateOf === 'object' 
        ? memory.possibleDuplicateOf.content 
        : memory.content;
      dispatch(setSearchQuery(searchContent));
      navigate('/vault');
      setShowWarningPopover(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const catColor = CATEGORY_COLORS[memory.category] || CATEGORY_COLORS.life;
  const typeCls = TYPE_COLORS[memory.type] || TYPE_COLORS.fact;

  return (
    <div
      id={`memory-card-${memory._id}`}
      onClick={!isEditing ? handleEditClick : undefined}
      className={`relative group card bg-vault-dark-surface border border-vault-border-dark rounded-xl p-5 hover:border-vault-border-dark-strong transition-all duration-200 cursor-pointer ${
        isEditing ? 'ring-1 ring-vault-terracotta' : ''
      }`}
    >
      {/* Top badges */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`badge-item shrink-0 px-2 py-0.5 text-[11px] font-medium rounded-md border capitalize ${catColor.bg} ${catColor.text} ${catColor.border}`}>
            {memory.category}
          </span>
          <span className={`badge-item shrink-0 px-2 py-0.5 text-[11px] font-medium rounded-md border capitalize ${typeCls}`}>
            {memory.type}
          </span>
          {memory.reinforcementCount > 1 && (
            <span className="badge-item shrink-0 px-2 py-0.5 text-[11px] font-semibold rounded-md border bg-vault-terracotta/10 text-vault-terracotta border-vault-terracotta/20">
              Reinforced {memory.reinforcementCount}x
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* New Memory indicator */}
          {isNew && (
            <span className="h-2 w-2 rounded-full bg-vault-terracotta animate-pulse" title="New memory" />
          )}

          {/* Warning badge */}
          {memory.isPossibleDuplicate && (
            <div className="relative" ref={warningRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowWarningPopover(!showWarningPopover);
                }}
                className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
              >
                <AlertTriangle size={11} />
                Similar exists
              </button>

              {/* Warning Popover */}
              {showWarningPopover && (
                <div className="absolute right-0 mt-2 z-50 w-72 bg-vault-dark-surface-2 border border-vault-border-dark rounded-lg p-4 shadow-xl text-left cursor-default">
                  <h4 className="text-xs font-semibold text-yellow-500 uppercase tracking-wider mb-2">
                    ⚠ Similar Memory Found
                  </h4>
                  <p className="text-xs text-vault-text-on-dark-soft mb-3 leading-relaxed">
                    &ldquo;{memory.possibleDuplicateOf?.content || "Another very similar record exists in your vault."}&rdquo;
                  </p>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-vault-border-dark">
                    <button
                      onClick={handleViewSimilar}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded bg-vault-dark-surface-3 hover:bg-vault-dark-surface hover:text-vault-text-on-dark transition-colors text-vault-text-on-dark-soft border border-vault-border-dark"
                    >
                      <Eye size={12} />
                      View Similar
                    </button>
                    <button
                      onClick={handleDismissWarning}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded bg-vault-terracotta text-vault-ivory hover:bg-vault-coral transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="mb-4 text-left">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              autoFocus
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-vault-dark-surface-2 border border-vault-border-dark rounded-lg p-2.5 text-sm text-vault-text-on-dark placeholder-vault-stone focus:border-vault-terracotta focus:ring-1 focus:ring-vault-terracotta resize-none outline-none leading-relaxed"
              rows={3}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                disabled={isUpdating || !editedContent.trim()}
                onClick={handleSave}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded bg-vault-terracotta text-vault-ivory hover:bg-vault-coral transition-colors disabled:opacity-40"
              >
                <Check size={12} />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded bg-vault-dark-surface-2 text-vault-stone hover:text-vault-text-on-dark hover:bg-vault-dark-surface-3 border border-vault-border-dark transition-colors"
              >
                <X size={12} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[14px] text-vault-text-on-dark-soft font-normal leading-relaxed break-words whitespace-pre-wrap">
            {memory.content}
          </p>
        )}
      </div>

      {/* Bottom metadata */}
      <div className="flex items-center justify-between text-[11px] text-vault-stone font-mono mt-auto pt-2 border-t border-vault-border-subtle-dark/50">
        <div>
          <span>{formatDate(memory.createdAt)}</span>
          {memory.sourceChatId && (
            <span className="hidden sm:inline">
              {' · '}From:{' '}
              <span className="text-vault-text-on-dark-soft font-sans">
                {memory.source === 'extraction' ? 'Conversation' : 'Quick Capture'}
              </span>
            </span>
          )}
        </div>

        {/* Action dropdown menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded hover:bg-vault-dark-surface-2 text-vault-stone hover:text-vault-coral opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          >
            <MoreHorizontal size={14} />
          </button>

          {showMenu && (
            <div className="absolute right-0 bottom-full mb-1 z-40 w-44 bg-vault-dark-surface-2 border border-vault-border-dark rounded-lg shadow-lg py-1.5 text-left cursor-default">
              {showDeleteConfirm ? (
                <div className="px-3 py-2">
                  <p className="text-[11px] text-vault-text-on-dark mb-2">Delete permanently?</p>
                  <div className="flex gap-1.5">
                    <button
                      onClick={handleDelete}
                      className="px-2 py-1 bg-vault-error text-white rounded text-[10px] font-semibold hover:bg-red-500 transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(false);
                      }}
                      className="px-2 py-1 bg-vault-dark-surface-3 text-vault-stone rounded text-[10px] hover:text-vault-text-on-dark transition-colors border border-vault-border-dark"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleArchive}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-vault-text-on-dark-soft hover:bg-vault-dark-surface-3 hover:text-vault-text-on-dark transition-colors"
                  >
                    <Archive size={13} />
                    {memory.isArchived ? 'Restore' : 'Archive'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-vault-error hover:bg-red-950/20 transition-colors"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;
