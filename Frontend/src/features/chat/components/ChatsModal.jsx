import { Check, Inbox, MessageSquare, MoreHorizontal, Pencil, Plus, Search, Star, Trash2, X } from "lucide-react";
import { useState } from "react";
import { showToast } from "../../shared/components/Toast";

const ChatsModal = ({ 
  isOpen, 
  onClose, 
  chats, 
  onChatSelect, 
  onNewChat,
  onChatDelete
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMenuOpen, setChatMenuOpen] = useState(null);

  if (!isOpen) return null;

  // Filter chats based on search query
  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format the date to show relative time
  const formatDate = (date) => {
    const chatDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - chatDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleChatSelect = (chat) => {
    onChatSelect(chat);
    onClose();
  };

  const handleNewChat = () => {
    onNewChat();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="
          w-full max-w-2xl
          bg-claude-dark-surface
          border border-claude-border-dark
          rounded-lg
          shadow-2xl
          flex flex-col
          max-h-[80vh]
          overflow-hidden
        ">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-claude-border-dark">
            <h2 className="text-claude-text-on-dark font-semibold text-xl">
              Chats
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleNewChat}
                className="
                  flex items-center gap-2 px-4 py-2 rounded-md
                  bg-claude-coral text-white
                  hover:bg-claude-coral/80
                  transition-all duration-150
                  font-medium text-sm
                "
              >
                <Plus size={18} strokeWidth={2} />
                New chat
              </button>
              <button
                onClick={onClose}
                className="
                  
                  flex items-center justify-center
                  w-15 h-15 rounded-md
                  text-claude-stone hover:bg-claude-dark-surface-2
                  hover:text-claude-text-on-dark transition-all duration-150
                "
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-6 py-4 border-b border-claude-border-dark">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-claude-stone"
              />
              <input
                type="text"
                placeholder="Search your chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full pl-15 pr-4 py-2.5 rounded-md
                  bg-claude-dark-surface-2 border border-claude-border-subtle-dark
                  text-claude-text-on-dark placeholder-claude-stone
                  focus:outline-none focus:ring-2 focus:ring-claude-coral/50 focus:border-transparent
                  transition-all duration-150
                "
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="flex items-center justify-center p-12 text-center">
                <div>
                  <MessageSquare
                    size={40}
                    className="text-claude-stone opacity-50 mx-auto mb-3"
                  />
                  <p className="text-claude-stone">
                    {searchQuery ? "No chats found" : "No chats yet"}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                {/* Chat List Header */}
                <div className="px-6 py-4 border-b border-claude-border-dark flex items-center justify-between">
                  <span className="text-claude-stone text-sm font-medium">
                    Your chats with MindVault
                  </span>
                  {filteredChats.length > 0 && (
                    <button
                      onClick={() => showToast("info", "Select functionality coming soon!")}
                      className="
                      px-3 py-1 text-xs rounded
                      text-claude-coral hover:bg-claude-coral/10
                      transition-all duration-150
                    ">
                      Select
                    </button>
                  )}
                </div>

                {/* Chat Items */}
                <div className="divide-y divide-claude-border-subtle-dark">
                  {filteredChats.map((chat) => (
                    <div key={chat._id} className="relative">
                      <button
                        onClick={() => handleChatSelect(chat)}
                        className="
                          w-full px-6 py-4
                          hover:bg-claude-dark-surface-2
                          transition-all duration-150
                          text-left group flex items-center gap-3
                        "
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-claude-text-on-dark font-medium truncate group-hover:text-claude-coral transition-colors">
                            {chat.title}
                          </p>
                          <p className="text-claude-stone text-xs mt-1">
                            Last message {formatDate(chat.lastMessageAt)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setChatMenuOpen(chatMenuOpen === chat._id ? null : chat._id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1.5 rounded hover:bg-claude-dark-surface-3 text-claude-stone hover:text-claude-coral shrink-0"
                        >
                          <MoreHorizontal size={18} strokeWidth={2} />
                        </button>
                      </button>

                      {/* Chat Context Menu */}
                      {chatMenuOpen === chat._id && (
                        <div className="absolute top-full right-1 mt-1 bg-claude-dark-surface-2 border border-claude-border-dark rounded-lg shadow-lg z-50 p-5 w-fit">
                          <button
                            onClick={() => {
                              showToast("info", "Feature coming soon!");
                              setChatMenuOpen(null);
                            }}
                            className="w-full flex items-center gap-3 pl-1.5 pr-5 py-2.5 text-left text-claude-text-on-dark-soft hover:bg-claude-dark-surface-3 hover:text-claude-text-on-dark transition-all duration-150 rounded-base"
                          >
                            <Check size={16} strokeWidth={1.75} className="text-claude-stone" />
                            <span style={{ fontSize: "14px" }}>Select</span>
                          </button>
                          <button
                            onClick={() => {
                              showToast("info", "Feature coming soon!");
                              setChatMenuOpen(null);
                            }}
                            className="w-full flex items-center gap-3 pl-1.5 pr-5 py-2.5 text-left text-claude-text-on-dark-soft hover:bg-claude-dark-surface-3 hover:text-claude-text-on-dark transition-all duration-150 rounded-base"
                          >
                            <Star size={16} strokeWidth={1.75} className="text-claude-stone" />
                            <span style={{ fontSize: "14px" }}>Star</span>
                          </button>
                          <button
                            onClick={() => {
                              showToast("info", "Rename functionality coming soon!");
                              setChatMenuOpen(null);
                            }}
                            className="w-full flex items-center gap-3 pl-1.5 pr-5 py-2.5 text-left text-claude-text-on-dark-soft hover:bg-claude-dark-surface-3 hover:text-claude-text-on-dark transition-all duration-150 rounded-base"
                          >
                            <Pencil size={16} strokeWidth={1.75} className="text-claude-stone" />
                            <span style={{ fontSize: "14px" }}>Rename</span>
                          </button>

                          <div className="border-t border-claude-border-dark my-1" />

                          <button
                            onClick={() => onChatDelete(chat._id)}
                            className="w-full flex items-center gap-3 pl-1.5 pr-5 py-2.5 text-left text-red-400 hover:bg-red-950/30 transition-all duration-150 rounded-base"
                          >
                            <Trash2 size={16} strokeWidth={1.75} />
                            <span style={{ fontSize: "14px" }}>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatsModal;
