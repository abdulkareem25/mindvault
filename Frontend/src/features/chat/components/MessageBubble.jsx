import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';
import remarkGfm from 'remark-gfm';

export function MessageBubble({ message }) {
  const { user } = useSelector((state) => state.auth);
  const isUser = message.role === 'user' || message.sender === 'user';
  const userInitial = user?.name ? user.name.slice(0, 1).toUpperCase() : 'U';

  return (
    <div className={`flex gap-3 w-full items-start animate-fade-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full shrink-0
          flex items-center justify-center font-sans text-11 font-medium select-none
          ${isUser
            ? 'bg-ember text-cream'
            : 'bg-dusk border border-divide text-sienna'}`}
      >
        {isUser ? userInitial : '✦'}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[78%] rounded-xl px-4 py-3 leading-relaxed
          ${isUser
            ? 'bg-cinder border border-ember/25 text-cream rounded-tr-sm'
            : 'bg-ink border border-divide text-cream rounded-tl-sm'}`}
      >
        {isUser ? (
          <p className="font-sans text-14 whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose-ai">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

// Typing indicator (while waiting for AI)
export function TypingIndicator() {
  return (
    <div className="flex gap-3 w-full items-start animate-fade-up">
      <div className="w-7 h-7 rounded-full bg-dusk border border-divide
        flex items-center justify-center text-sienna text-11 shrink-0 select-none">
        ✦
      </div>
      <div className="bg-ink border border-divide rounded-xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1.5 items-center h-5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-smoke animate-blink"
              style={{ animationDelay: `${i * 230}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
