import { ArrowUp, Loader, Plus } from "lucide-react";

const MessageComposer = ({
  inputValue,
  onInputChange,
  onKeyDown,
  onSend,
  isSendingMessage,
  category,
  onShowCategoryModal
}) => {
  return (
    <div className="px-4 py-6 flex justify-center">
      <div
        className="
          w-full max-w-190 p-6
          bg-claude-dark-surface/90 backdrop-blur-md
          border border-claude-border-dark
          rounded-3xl
          shadow-whisper
          flex flex-col
          transition-all duration-200
        "
      >
        {/* Textarea row */}
        <textarea
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder="Type your message here..."
          className="
            flex-1 bg-transparent outline-none border-none 
            resize-none focus-visible:ring-0 text-md
            text-claude-text-on-dark placeholder:text-claude-stone
            leading-relaxed h-auto max-h-50 overflow-y-auto
          "
        />

        {/* Action buttons row */}
        <div className="flex items-center justify-between gap-2 px-6 py-4">
          {/* Category button */}
          <button
            onClick={onShowCategoryModal}
            title="Category"
            className="
              flex items-center justify-center w-15 h-15 rounded-full shrink-0
              text-claude-stone
              hover:bg-claude-dark-surface-2 hover:text-claude-text-on-dark-soft
              transition-all duration-150
            "
          >
            <Plus size={25} strokeWidth={1.75} />
          </button>

          {/* Selected category badge */}
          {category && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-claude-dark-surface-2 border border-claude-border-dark">
              <span className="text-xs text-claude-text-on-dark">
                {category.label}
              </span>
            </div>
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
