const VARIANT_STYLES = {
  neutral: 'bg-slate-800 text-slate-300',
  success: 'bg-emerald-500/10 text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-400',
  danger: 'bg-rose-500/10 text-rose-400',
  info: 'bg-sky-500/10 text-sky-400',
};

/**
 * Badge
 *
 * Small status pill. `variant` picks the color treatment; see
 * src/utils/statusVariants.js for the status-string-to-variant mapping
 * used across the app.
 */
const Badge = ({ label, variant = 'neutral' }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
      VARIANT_STYLES[variant] ?? VARIANT_STYLES.neutral
    }`}
  >
    {label}
  </span>
);

export default Badge;