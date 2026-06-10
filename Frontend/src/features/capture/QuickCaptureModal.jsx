import { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
import { Modal, Button, CategoryBadge, TypeBadge } from '../../shared/components/ui';

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
    }, 800);
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
      const result = await createMemory({
        content,
        category: localCategory || classification?.category || 'life',
        type: localType || classification?.type || 'fact',
        tags: classification?.tags || [],
        source: 'quick_capture',
      }).unwrap();

      if (result && result.merged) {
        showToast('success', 'This memory already exists');
      } else {
        showToast('success', `Saved to ${CATEGORY_LABELS[localCategory || classification?.category || 'life']} vault`);
      }
      dispatch(closeModal());
    } catch {
      showToast('error', 'Failed to save memory. Please try again.');
    } finally {
      dispatch(setIsSaving(false));
    }
  };

  const handleExpandToChat = () => {
    dispatch(closeModal());
    navigate('/chats/new', { state: { prefillContent: content } });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => dispatch(closeModal())} size="sm">
      <div className="-mx-6 -mt-6">
        {/* Section 1: Text input */}
        <div className="px-5 pt-5 pb-4 text-left">
          <p className="font-sans text-12 font-medium uppercase tracking-[0.8px] text-ember mb-3">
            Capture a Thought
          </p>
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="What do you want to remember?"
            autoFocus
            rows={3}
            className="w-full font-sans text-15 text-cream bg-transparent
              placeholder:text-smoke resize-none outline-none leading-relaxed min-h-20"
          />
        </div>

        {/* Section 2: Classification */}
        <div className="px-5 py-3.5 bg-ink border-y border-divide text-left">
          <div className="flex items-center justify-between mb-2.5">
            <span className="font-mono text-11 text-smoke uppercase tracking-wider">
              AI Classification
            </span>
            {isClassifying && (
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 border-2 border-smoke border-t-transparent rounded-full animate-spin" />
                <span className="font-mono text-11 text-smoke">Classifying...</span>
              </div>
            )}
          </div>
          {classification && (
            <div className="flex flex-wrap gap-2 animate-fade-up">
              {/* Category Override Select */}
              <div className="relative">
                <select
                  value={localCategory}
                  onChange={(e) => {
                    setLocalCategory(e.target.value);
                    dispatch(overrideCategory(e.target.value));
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_LABELS[cat] || cat}
                    </option>
                  ))}
                </select>
                <CategoryBadge category={localCategory} />
              </div>

              {/* Type Override Select */}
              <div className="relative">
                <select
                  value={localType}
                  onChange={(e) => {
                    setLocalType(e.target.value);
                    dispatch(overrideType(e.target.value));
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                >
                  {MEMORY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {TYPE_LABELS[t] || t}
                    </option>
                  ))}
                </select>
                <TypeBadge type={localType} />
              </div>

              {classification.tags?.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-11 text-smoke bg-dusk border border-divide px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {!classification && !isClassifying && (
            <p className="font-sans text-13 text-smoke italic">
              Start typing to auto-classify...
            </p>
          )}
        </div>

        {/* Section 3: Actions */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-dusk rounded-b-xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExpandToChat}
            disabled={!content.trim()}
          >
            Expand to chat →
          </Button>
          <Button
            variant="primary"
            size="md"
            loading={isSaving}
            disabled={!content.trim() || isSaving}
            onClick={handleVaultIt}
          >
            Vault it →
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default QuickCaptureModal;
