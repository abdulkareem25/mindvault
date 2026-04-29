import { Loader } from "lucide-react";
import MarkdownMessage from './MarkdownMessage';

const ChatMessages = ({
  isLoadingHistory,
  activeChatId,
  messageHistory,
  user
}) => {
  if (isLoadingHistory) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 pt-16">
        <div className="flex items-center justify-center gap-3">
          <Loader className="animate-spin text-claude-terracotta" size={28} />
          <p className="text-claude-text-on-dark-soft">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!activeChatId || messageHistory.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 pt-16">
        <h1
          className="text-claude-text-on-dark text-center font-medium mb-3"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(26px, 5vw, 42px)",
            lineHeight: 1.15,
          }}
        >
          Hey {user.name}, welcome back!
        </h1>
        <p
          className="text-claude-text-on-dark-soft text-center max-w-sm"
          style={{ fontSize: "15px", lineHeight: 1.6 }}
        >
          How can I help you today?
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {messageHistory.map(({ _id, sender, content }) => (
        <div
          key={_id}
          className={`
            flex items-start gap-4
            ${sender === "user" ? "justify-end" : "justify-start"}
          `}
        >
          <MarkdownMessage
            content={content}
            isUserMessage={sender === "user"}
          />
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
