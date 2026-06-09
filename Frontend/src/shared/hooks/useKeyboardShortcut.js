import { useEffect } from 'react';

export function useKeyboardShortcut(keys, callback) {
  useEffect(() => {
    const handler = (e) => {
      const match = keys.every(key => {
        if (key === 'Meta' || key === 'Control') return e.metaKey || e.ctrlKey;
        if (key === 'Shift') return e.shiftKey;
        return e.key === key;
      });
      if (match) {
        e.preventDefault();
        callback();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [keys, callback]);
}
