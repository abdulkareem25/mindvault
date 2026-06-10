import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export function Modal({ isOpen, onClose, title, size = 'md', footer, children }) {
  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxW = { sm: 'max-w-[400px]', md: 'max-w-[520px]', lg: 'max-w-[680px]' };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-void/75 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Container */}
      <div
        className={`relative w-full ${maxW[size]} bg-dusk rounded-xl
          shadow-modal border border-divide max-h-[90dvh] overflow-y-auto
          animate-fade-up`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-divide">
            <h2 className="font-display text-24 text-cream">{title}</h2>
            <Button variant="icon" size="sm" onClick={onClose} aria-label="Close">
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        {/* Body */}
        <div className="p-6">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-divide">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
