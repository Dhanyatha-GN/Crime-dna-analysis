import { Inbox } from 'lucide-react';

/**
 * EmptyState
 *
 * Standard "nothing to show" placeholder used across pages when a list,
 * table, or search result set is empty.
 */
const EmptyState = ({ icon: Icon = Inbox, title = 'Nothing here yet', description }) => (
  <div className="flex min-h-[12rem] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-800 bg-slate-900/40 px-4 text-center">
    <Icon className="h-6 w-6 text-slate-600" aria-hidden="true" />
    <p className="text-sm font-medium text-slate-300">{title}</p>
    {description && <p className="text-xs text-slate-500">{description}</p>}
  </div>
);

export default EmptyState;