import { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { X, Loader2, ChevronDown, ArrowRight, MessageSquare } from 'lucide-react';
import { showToast } from '../shared/components/Toast';
import { useCreateMemoryMutation } from '../vault/vaultApi';
import {
  closeModal,
  setContent,
  setClassification,
  setIsClassifying,
  setIsSaving,
  overrideCategory,
  overrideType,
} from './captureSlice';
import { API_BASE_URL } from '../../constants';

const CATEGORIES = ['coding', 'deen', 'admin', 'life'];
const MEMORY_TYPES = ['decision', 'preference', 'learning', 'goal', 'fact'];

const CATEGORY_LABELS = {
  coding: 'Coding',
  deen: 'Deen',
  admin: 'Admin',
  life: 'Life',
};

const TYPE_LABELS = {
  decision: 'Decision',
  preference: 'Preference',
  learning: 'Learning',
  goal: 'Goal',
  fact: 'Fact',
};

const QuickCaptureModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const debounceRef = useRef(null);

  const { isOpen, content, classification, isClassifying, isSaving } = useSelector(
    (state) => state.capture
  );
  const { token } = useSelector((state) => state.auth);
  const [createMemory] = useCreateMemoryMutation();

  const [localCategory, setLocalCategory] = useState('');
  const [localType, setLocalType] = useState('');

  useEffect(() => {
    if (isOpen && classification) {
      setLocalCategory(classification.category);
      setLocalType(classification.type);
    }
  }, [isOpen, classification]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  const classifyContent = useCallback(
    async (text) => {
      if (!text.trim()) {
        dispatch(setClassification(null));
        return;
      }
      dispatch(setIsClassifying(true));
      try {
        const res = await fetch(`${API_BASE_URL}/memories/capture`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: text }),
        });
        const data = await res.json();
        if (data.classification) {
          dispatch(setClassification(data.classification));
          setLocalCategory(data.classification.category);
          setLocalType(data.classification.type);
        }
      } catch {
        dispatch(setClassification({ category: 'life', type: 'fact', tags: [] }));
      } finally {
        dispatch(setIsClassifying(false));
      }
    },
    [dispatch, token]
  );

  const handleContentChange = (e) => {
    const value = e.target.value;
    dispatch(setContent(value));

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      classifyContent(value);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleVaultIt = async () => {
    if (!content.trim()) return;
    dispatch(setIsSaving(true));
    try {
      await createMemory({
        content,
        category: localCategory || classification?.category || 'life',
        type: localType || classification?.type || 'fact',
        tags: classification?.tags || [],
        source: 'quick_capture',
      }).unwrap();
      showToast('success', `Saved to ${CATEGORY_LABELS[localCategory || classification?.category || 'life']} vault`);
      dispatch(closeModal());
    } catch {
      showToast('error', 'Failed to save memory. Please try again.');
      dispatch(setIsSaving(false));
    }
  };

  const handleExpandToChat = () => {
    dispatch(closeModal());
    navigate('/', { state: { prefillContent: content } });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-vault-dark-surface border border-vault-border-dark rounded-2xl shadow-lg w-full max-w-[480px] overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-vault-border-subtle-dark flex items-center justify-between">
            <h2 className="text-vault-text-on-dark font-medium text-base">
              CAPTURE A THOUGHT
            </h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-lg text-vault-stone hover:text-vault-text-on-dark hover:bg-vault-dark-surface-2 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              placeholder="What do you want to remember?"
              rows={4}
              className="w-full bg-transparent border-none outline-none resize-none text-vault-text-on-dark placeholder-vault-stone text-[15px] leading-relaxed focus:ring-0 p-0"
            />

            {/* Classification Section */}
            <div className="mt-4 pt-4 border-t border-vault-border-subtle-dark">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs tracking-wider text-vault-stone uppercase font-medium">
                  AI Classification
                </span>
                {isClassifying && (
                  <Loader2 size={14} className="text-vault-terracotta animate-spin" />
                )}
              </div>

              {classification ? (
                <div className="flex gap-2">
                  {/* Category Dropdown */}
                  <div className="relative flex-1">
                    <select
                      value={localCategory}
                      onChange={(e) => {
                        setLocalCategory(e.target.value);
                        dispatch(overrideCategory(e.target.value));
                      }}
                      className="w-full appearance-none bg-vault-dark-surface-2 border border-vault-border-dark rounded-lg px-3 py-2 pr-8 text-sm text-vault-text-on-dark cursor-pointer hover:border-vault-border-dark-strong transition-colors"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {CATEGORY_LABELS[cat]}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-vault-stone pointer-events-none"
                    />
                  </div>

                  {/* Type Dropdown */}
                  <div className="relative flex-1">
                    <select
                      value={localType}
                      onChange={(e) => {
                        setLocalType(e.target.value);
                        dispatch(overrideType(e.target.value));
                      }}
                      className="w-full appearance-none bg-vault-dark-surface-2 border border-vault-border-dark rounded-lg px-3 py-2 pr-8 text-sm text-vault-text-on-dark cursor-pointer hover:border-vault-border-dark-strong transition-colors"
                    >
                      {MEMORY_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {TYPE_LABELS[t]}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-vault-stone pointer-events-none"
                    />
                  </div>
                </div>
              ) : (
                !isClassifying && (
                  <p className="text-xs text-vault-stone italic">
                    Start typing to auto-classify...
                  </p>
                )
              )}

              {/* Tags */}
              {classification?.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {classification.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded-full bg-vault-dark-surface-3 text-vault-text-on-dark-soft border border-vault-border-dark"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-vault-border-subtle-dark flex items-center justify-between gap-3">
            <button
              onClick={handleExpandToChat}
              disabled={!content.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-vault-border-dark text-vault-text-on-dark-soft hover:bg-vault-dark-surface-2 hover:text-vault-text-on-dark transition-all duration-150 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <MessageSquare size={14} />
              Expand to Chat
            </button>
            <button
              onClick={handleVaultIt}
              disabled={!content.trim() || isSaving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-vault-terracotta text-vault-ivory font-semibold text-sm hover:bg-vault-coral transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  Vault it
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickCaptureModal;
