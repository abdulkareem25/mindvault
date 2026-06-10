export function Input({ label, error, helperText, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="font-sans text-13 font-medium text-mist">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`
          h-11 w-full px-3.5 bg-ink rounded-lg
          font-sans text-14 text-cream
          placeholder:text-smoke
          border transition-all duration-200 outline-none
          ${error
            ? 'border-danger shadow-input-error'
            : 'border-divide focus:border-ember focus:shadow-input-focus'}
          disabled:bg-fade disabled:text-smoke disabled:cursor-not-allowed disabled:opacity-60
          ${className}
        `.replace(/\s+/g, ' ').trim()}
      />
      {error      && <p className="font-sans text-12 text-danger">{error}</p>}
      {helperText && !error && <p className="font-sans text-12 text-smoke">{helperText}</p>}
    </div>
  );
}
