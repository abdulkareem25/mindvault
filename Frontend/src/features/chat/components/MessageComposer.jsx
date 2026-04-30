import { ArrowUp, Loader, Plus } from "lucide-react";
import { useEffect, useRef } from "react";

const MessageComposer = ({
  inputValue,
  onInputChange,
  onKeyDown,
  onSend,
  isSendingMessage,
  category,
  onShowCategoryModal,
  hasMessages
}) => {
  const textareaRef = useRef(null);

  // Auto-expand textarea height based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 192); // 192px = max-h-48
      textarea.style.height = `${newHeight}px`;
    }
  }, [inputValue]);

  const handleInputChange = (e) => {
    onInputChange(e);
  };

  const handleKeyDown = (e) => {
    onKeyDown(e);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 192);
      textarea.style.height = `${newHeight}px`;
    }
  };

  return (
    <div className="px-6 py-5 flex justify-center">
      <div
        className="
          w-full max-w-4xl p-5
          bg-claude-dark-surface
          border border-claude-border-dark
          rounded-2xl
          shadow-whisper
          flex flex-col
          transition-all duration-200
          focus-within:border-claude-terracotta/50 focus-within:shadow-lg
        "
      >
        {/* Textarea row */}
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className="
            bg-transparent outline-none border-none 
            resize-none focus-visible:ring-0 text-md
            text-claude-text-on-dark placeholder:text-claude-stone/70
            leading-relaxed min-h-6 max-h-48 overflow-y-auto
            transition-colors duration-200
          "
          style={{
            height: "auto",
            maxHeight: "192px"
          }}
          spellCheck="true"
          aria-label="Message input"
        />

        {/* Action buttons row */}
        <div className="flex items-center justify-between gap-2 pt-3 px-1">
          {/* Category button */}

          {category ? (
            <button
              onClick={onShowCategoryModal}
              disabled={hasMessages}
              title={hasMessages ? "Category cannot be changed after sending a message" : "Click to change category"}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-150
                ${hasMessages
                  ? "bg-claude-dark-surface-2/50 border border-claude-border-dark text-claude-stone cursor-not-allowed opacity-50"
                  : "bg-claude-terracotta/20 border border-claude-terracotta text-claude-terracotta hover:bg-claude-terracotta/30"
                }
              `}
            >
              <span className="text-sm font-medium capitalize">{category}</span>
            </button>
          ) : (
            <button
              onClick={onShowCategoryModal}
              disabled={hasMessages}
              title={hasMessages ? "Category cannot be changed after sending a message" : "Click to add category"}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-150
                ${hasMessages
                  ? "border border-claude-border-dark text-claude-stone cursor-not-allowed opacity-50"
                  : "border border-claude-dark-surface-2 text-claude-stone hover:bg-claude-dark-surface-2 hover:text-claude-text-on-dark"
                }
              `}
            >
              <Plus size={16} />
              <span className="text-sm font-medium">Category</span>
            </button>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Send button */}
          <button
            onClick={onSend}
            disabled={!inputValue.trim() || isSendingMessage}
            className={`
              flex items-center justify-center w-15 h-15 rounded-full shrink-0 transition-all duration-150
              ${inputValue.trim() && !isSendingMessage
                ? "bg-claude-terracotta hover:bg-claude-coral hover:scale-105 text-white"
                : "bg-claude-dark-surface-2 text-claude-stone cursor-not-allowed"
              }
            `}
          >
            {isSendingMessage ? (
              <Loader size={25} strokeWidth={2} className="animate-spin" />
            ) : (
              <ArrowUp size={25} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;
