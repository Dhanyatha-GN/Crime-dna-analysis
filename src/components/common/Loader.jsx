import { Loader2 } from 'lucide-react';

/**
 * Loader
 *
 * Standard loading indicator used wherever a section is waiting on data.
 */
const Loader = ({ label = 'Loading...' }) => (
  <div className="flex min-h-[12rem] flex-col items-center justify-center gap-2 text-slate-500">
    <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
    <span className="text-sm">{label}</span>
  </div>
);

export default Loader;