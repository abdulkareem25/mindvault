// Button component — all variants and sizes
// variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon'
// size: 'sm' | 'md' | 'lg'

const SIZE = {
  sm: 'h-8 px-3.5 text-13 rounded',
  md: 'h-10 px-5 text-14 rounded-md',
  lg: 'h-12 px-7 text-15 rounded-lg',
};
const ICON_SIZE = { sm: 'h-8 w-8', md: 'h-9 w-9', lg: 'h-11 w-11' };
const VARIANT = {
  primary: 'bg-ember text-cream font-medium hover:bg-glow active:scale-[0.97] disabled:opacity-40',
  secondary: 'bg-transparent text-mist border border-divide hover:bg-ink hover:text-cream active:scale-[0.97] disabled:opacity-40',
  ghost: 'bg-transparent text-smoke hover:bg-ink hover:text-cream active:scale-[0.97] disabled:opacity-40',
  danger: 'bg-danger text-cream font-medium hover:opacity-85 active:scale-[0.97] disabled:opacity-40',
  icon: 'bg-transparent text-smoke hover:bg-ink hover:text-cream disabled:opacity-40 rounded-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  children,
  icon,
  iconAfter,
  className = '',
  ...props
}) {
  const isIcon = variant === 'icon';
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-sans cursor-pointer select-none whitespace-nowrap
        transition-all duration-200 disabled:cursor-not-allowed
        ${isIcon ? ICON_SIZE[size] : SIZE[size]}
        ${VARIANT[variant]}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span className="shrink-0 w-4 h-4">{icon}</span>}
          {children}
          {iconAfter && <span className="shrink-0 w-4 h-4">{iconAfter}</span>}
        </>
      )}
    </button>
  );
}
