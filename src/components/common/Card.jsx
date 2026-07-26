/**
 * Card
 *
 * Generic bordered content container used throughout the dashboard for
 * KPI groupings, charts, tables, and lists.
 *
 * Props:
 * - title: optional heading rendered in the card header.
 * - actions: optional node rendered on the right of the header (e.g. a
 *   legend, a button).
 * - className: optional extra classes (e.g. grid column spans).
 */
const Card = ({ title, actions, children, className = '' }) => (
  <div className={`rounded-lg border border-slate-800 bg-slate-900/60 p-4 sm:p-5 ${className}`}>
    {(title || actions) && (
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        {title && <h2 className="text-sm font-semibold text-slate-200">{title}</h2>}
        {actions}
      </div>
    )}
    {children}
  </div>
);

export default Card;