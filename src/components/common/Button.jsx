const VARIANT_STYLES = {
  primary: 'bg-sky-600 text-white hover:bg-sky-500',
  secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700',
  ghost: 'bg-transparent text-slate-300 hover:bg-slate-800',
};

/**
 * Button
 *
 * Props:
 * - variant: 'primary' | 'secondary' | 'ghost' (default 'primary').
 * - icon: optional Lucide icon component rendered before the label.
 * - All other props (onClick, type, disabled, aria-*, ...) pass through
 *   to the underlying <button>.
 */
const Button = ({ children, variant = 'primary', icon: Icon, className = '', ...rest }) => (
  <button
    type="button"
    className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
      VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary
    } ${className}`}
    {...rest}
  >
    {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
    {children}
  </button>
);

export default Button;