import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useBeforeUnload, useLocation, useNavigate, useParams } from 'react-router-dom';
import { CategoryBadge, SectionLabel } from '../../../shared/components/ui';
import { showToast } from '../../shared/components/Toast';
import { addMessageOptimistic, incrementMessageCount, setActiveChatId, setMessageHistory } from '../chat.slice';
import ContextPillsBar from '../components/ContextPillsBar';
import { MessageBubble } from '../components/MessageBubble';
import MessageComposer from '../components/MessageComposer';
import { useChat } from '../hooks/useChat';
import { getSocket } from '../services/chat.socket';

const CATEGORY_DOT = {
  coding: '#7099e8',
  deen: '#b88cdb',
  admin: '#d4a84c',
  life: '#5ec98a',
  global: '#524f4a',
};

const CATEGORY_LABELS = {
  coding: 'Coding',
  deen: 'Deen',
  admin: 'Admin',
  life: 'Life',
  global: 'Global',
};

export default function ChatPage() {
  const { id: chatId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    loadChats,
    loadMessageHistory,
    loadChatMemories,
    handleCreateChat,
    sendMessageToChat,
    sendMessageToChatStream,
  } = useChat();

  const { chats, messageHistory, activeChatId } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const scrollRef = useRef(null);

  // Set active chat ID in Redux store
  useEffect(() => {
    if (chatId && chatId !== 'new') {
      const skipSpinner = location.state?.skipHistoryLoad;
      dispatch(setActiveChatId(chatId));
      
      // Always load message history, but skip spinner for newly created chats
      if (!skipSpinner) {
        setIsLoadingHistory(true);
      }
      
      loadMessageHistory(chatId)
        .then(() => {
          // Load injected memories for this chat
          return loadChatMemories(chatId);
        })
        .finally(() => {
          setIsLoadingHistory(false);
        });
    } else {
      // Clear everything when starting a new chat
      dispatch(setActiveChatId(null));
      dispatch(setMessageHistory([]));
      setSelectedCategory(null);
    }
  }, [chatId, location.state, dispatch]);

  // Guard ref: ensure chat:closed fires exactly once per chatId
  const closedRef = useRef(false);

  const emitChatClosed = useCallback((id) => {
    if (closedRef.current) return;
    const socket = getSocket();
    if (socket && id && id !== 'new') {
      socket.emit('chat:closed', { chatId: id });
      closedRef.current = true;
    }
  }, []);

  // Reset guard whenever chatId changes (new chat opened)
  useEffect(() => {
    closedRef.current = false;
  }, [chatId]);

  // Socket join / leave / closed logic
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !chatId || chatId === 'new') return;

    socket.emit('chat:join', { chatId });

    return () => {
      emitChatClosed(chatId);
      socket.emit('chat:leave', { chatId });
    };
  }, [chatId, emitChatClosed]);

  // Handle browser close / refresh — backup trigger
  useBeforeUnload(useCallback(() => {
    emitChatClosed(chatId);
  }, [chatId, emitChatClosed]));

  // Auto-scroll messages to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messageHistory, isSending]);

  const activeChat = chats.find((c) => c._id === chatId);
  const chatCategory = activeChat?.category || selectedCategory;

  const handleSend = async (messageText) => {
    if (!chatCategory) {
      showToast('error', 'Please select a category first.');
      return;
    }

    setIsSending(true);
    try {
      if (chatId === 'new') {
        const result = await handleCreateChat(chatCategory, messageText);
        if (result?.data?._id) {
          // Set initial message history from creation response if available
          if (result?.data?.messages) {
            dispatch(setMessageHistory(result.data.messages));
          }
          await loadChats();
          navigate(`/chats/${result.data._id}`, { state: { skipHistoryLoad: true } });
        } else {
          showToast('error', 'Failed to start conversation');
        }
      } else {
        // Optimistic update: add user message immediately
        const tempMessageId = `temp_${Date.now()}`;
        dispatch(addMessageOptimistic({
          message: {
            _id: tempMessageId,
            sender: 'user',
            content: messageText,
            createdAt: new Date().toISOString()
          }
        }));

        dispatch(incrementMessageCount({ chatId, amount: 2 }));
        await sendMessageToChatStream(chatId, messageText);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoadingHistory) {
    return (
      <div className="h-full flex items-center justify-center bg-obsidian">
        <div className="flex items-center gap-3">
          <span className="inline-block w-6 h-6 border-2 border-ember border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-14 text-smoke">Loading conversation...</p>
        </div>
      </div>
    );
  }

  // Category picker for new chat
  if (chatId === 'new' && !selectedCategory) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 bg-obsidian animate-fade-in">
        <div className="mb-8 text-center">
          <SectionLabel>New Conversation</SectionLabel>
          <h1 className="font-display text-32 text-cream mt-2">
            What area of knowledge shall we explore?
          </h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-xl w-full">
          {[
            { id: 'coding', label: 'Coding', desc: 'Software engineering, algorithms, architectures.' },
            { id: 'deen', label: 'Deen', desc: 'Spiritual learnings, Quranic studies, Islamic history.' },
            { id: 'admin', label: 'Admin', desc: 'Tax files, schedules, finances, plans.' },
            { id: 'life', label: 'Life', desc: 'Personal journal entries, reflections, goals.' },
            { id: 'global', label: 'Global', desc: 'Cross-cutting topics, queries across all vaults.' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="bg-ink border border-divide rounded-xl p-5
                hover:border-ember/50 hover:shadow-card-hover
                transition-all duration-200 text-left cursor-pointer group"
            >
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: CATEGORY_DOT[cat.id] }}
              />
              <h3 className="font-display text-18 text-cream group-hover:text-ember
                transition-colors mt-2">
                {cat.label}
              </h3>
              <p className="font-sans text-12 text-smoke mt-1 leading-normal">
                {cat.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    /*
     * CRITICAL LAYOUT NOTE:
     * h-full fills the <main> element (flex-1, overflow-hidden in AppLayout).
     * Do NOT add top-level padding — sections handle their own.
     */
    <div className="flex flex-col h-full">

      {/* Chat header */}
      <div className="shrink-0 flex items-center gap-3 px-4 lg:px-6 h-14
        border-b border-divide bg-obsidian">
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: CATEGORY_DOT[chatCategory] || '#524f4a' }}
        />
        <h1 className="font-sans text-15 font-medium text-cream flex-1 truncate">
          {activeChat?.title || 'New conversation'}
        </h1>
        {chatCategory && <CategoryBadge category={chatCategory} />}
      </div>

      {/* Context pills — only shows when memories were injected */}
      <ContextPillsBar />

      {/* Message list — this is the ONLY scrollable region */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-5"
      >
        {messageHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full min-h-75
            text-center py-12 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-dusk border border-divide
              flex items-center justify-center text-smoke text-xl mb-4">
              ✦
            </div>
            <h3 className="font-display text-20 text-cream mb-2">Start the conversation</h3>
            <p className="font-sans text-14 text-smoke max-w-75 leading-relaxed">
              {chatCategory
                ? `This is your ${CATEGORY_LABELS[chatCategory] || chatCategory} workspace. Ask anything.`
                : 'Ask anything. Key takeaways go to your vault automatically.'}
            </p>
          </div>
        )}
        {messageHistory.map((m) => (
          <MessageBubble key={m._id} message={m} />
        ))}
      </div>

      {/* Composer — fixed to bottom of this flex column */}
      <div className="shrink-0 px-4 lg:px-6 py-4 border-t border-divide bg-obsidian">
        <MessageComposer
          onSend={handleSend}
          disabled={isSending}
          initialValue={location.state?.prefillContent || ''}
        />
      </div>
    </div>
  );
}
