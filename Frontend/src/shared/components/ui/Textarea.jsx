export function Textarea({ label, error, rows = 4, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="font-sans text-13 font-medium text-mist">{label}</label>
      )}
      <textarea
        rows={rows}
        {...props}
        className={`
          w-full px-3.5 py-2.5 bg-ink rounded-lg resize-y min-h-20
          font-sans text-14 text-cream placeholder:text-smoke
          border transition-all duration-200 outline-none
          ${error
            ? 'border-danger shadow-input-error'
            : 'border-divide focus:border-ember focus:shadow-input-focus'}
          ${className}
        `.replace(/\s+/g, ' ').trim()}
      />
      {error && <p className="font-sans text-12 text-danger">{error}</p>}
    </div>
  );
}
