/**
 * StatCard
 *
 * Small KPI card: a label, a large value, and an optional icon/trend line.
 * Used on both Dashboard and Summary so the two pages read consistently.
 */
const StatCard = ({ icon: Icon, label, value, trend }) => (
  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
      {Icon && <Icon className="h-4 w-4 text-sky-500" aria-hidden="true" />}
    </div>
    <p className="mt-2 text-2xl font-semibold text-slate-100">{value}</p>
    {trend && <p className="mt-1 text-xs text-slate-500">{trend}</p>}
  </div>
);

export default StatCard;