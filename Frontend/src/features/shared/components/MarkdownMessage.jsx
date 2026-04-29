import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownMessage = ({ content, isUserMessage }) => {
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = (code, codeId) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(codeId);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const customComponents = {
    p: ({ children }) => (
      <p className={`${isUserMessage ? "" : "mb-3"} leading-relaxed text-inherit`}>
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1 className="text-xl font-bold mb-3 mt-4 text-inherit">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-lg font-bold mb-2 mt-3 text-inherit">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-base font-bold mb-2 mt-3 text-inherit">
        {children}
      </h3>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-3 space-y-1 text-inherit">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-3 space-y-1 text-inherit">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-inherit">
        {children}
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-claude-terracotta/50 pl-4 py-1 my-3 italic text-claude-text-on-dark-soft">
        {children}
      </blockquote>
    ),
    code: ({ inline, className, children }) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : 'text';
      const codeString = String(children).replace(/\n$/, '');
      const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;

      if (!inline) {
        return (
          <div className="relative mb-4 rounded-lg overflow-hidden bg-[#1e1e1e] border border-claude-border-dark">
            {/* Language label and copy button */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-claude-border-dark">
              <span className="text-xs font-mono text-claude-stone uppercase tracking-wide">
                {language}
              </span>
              <button
                onClick={() => copyToClipboard(codeString, codeId)}
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[#3d3d3d] transition-colors text-claude-stone hover:text-claude-text-on-dark"
                title="Copy code"
              >
                {copiedCode === codeId ? (
                  <>
                    <Check size={14} />
                    <span className="text-xs">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code content */}
            <pre className="overflow-x-auto p-4 text-sm">
              <code
                className={`language-${language} font-mono text-claude-text-on-dark`}
                dangerouslySetInnerHTML={{
                  __html: hljs.highlight(codeString, {
                    language: language,
                    ignoreIllegals: true
                  }).value
                }}
              />
            </pre>
          </div>
        );
      }

      return (
        <code className="px-2 py-1 rounded bg-[#2d2d2d] text-claude-terracotta font-mono text-sm border border-claude-border-dark">
          {children}
        </code>
      );
    },
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-claude-coral hover:text-claude-terracotta underline transition-colors"
      >
        {children}
      </a>
    ),
    table: ({ children }) => (
      <table className="border-collapse mb-3 w-full text-sm">
        {children}
      </table>
    ),
    thead: ({ children }) => (
      <thead className="bg-[#2d2d2d]">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody>
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr className="border border-claude-border-dark">
        {children}
      </tr>
    ),
    td: ({ children }) => (
      <td className="px-3 py-2 border border-claude-border-dark text-inherit">
        {children}
      </td>
    ),
    th: ({ children }) => (
      <th className="px-3 py-2 border border-claude-border-dark text-left font-semibold text-inherit">
        {children}
      </th>
    ),
    hr: () => (
      <hr className="my-4 border-t border-claude-border-dark" />
    ),
  };

  return (
    <div className={`
      px-4 py-3 rounded-lg
      ${isUserMessage
        ? "bg-claude-terracotta/90 text-white max-w-[80%]"
        : "text-claude-text-on-dark max-w-[90%]"
      }
    `}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={customComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownMessage;
