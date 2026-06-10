import { useState, useRef } from 'react';
import { Send } from 'lucide-react';

export default function MessageComposer({ onSend, disabled, initialValue = '' }) {
  const [value, setValue] = useState(initialValue);
  const ref = useRef(null);

  const autoGrow = () => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = Math.min(ref.current.scrollHeight, 200) + 'px';
    }
  };

  const submit = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue('');
      if (ref.current) ref.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="relative max-w-180 mx-auto w-full">
      <textarea
        ref={ref}
        value={value}
        onChange={e => { setValue(e.target.value); autoGrow(); }}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything..."
        rows={1}
        disabled={disabled}
        className="
          w-full pl-4 pr-14 py-3.5 bg-ink border border-divide rounded-xl
          font-sans text-14 text-cream placeholder:text-smoke
          min-h-13 max-h-50 resize-none overflow-auto
          focus:border-ember focus:shadow-input-focus
          disabled:opacity-50 disabled:cursor-not-allowed
          outline-none transition-all duration-200
        "
      />
      {/* Send button */}
      <button
        onClick={submit}
        disabled={!value.trim() || disabled}
        className="absolute right-3 bottom-10 w-8 h-8 rounded-lg
          bg-ember text-cream flex items-center justify-center
          hover:bg-glow disabled:opacity-30 disabled:cursor-not-allowed
          transition-all duration-200 active:scale-95 cursor-pointer"
      >
        <Send className="w-4 h-4" />
      </button>
      <p className="font-mono text-11 text-smoke text-center mt-1.5 select-none">
        ↵ to send · ⇧↵ for new line
      </p>
    </div>
  );
}
