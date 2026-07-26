import Badge from '../common/Badge';
import { getStatusVariant } from '../../utils/statusVariants';

/**
 * TimelineEvent
 *
 * One entry in the vertical investigation timeline, with a connecting
 * line to the next event (omitted for the last item via `isLast`).
 */
const TimelineEvent = ({ event, isLast }) => (
  <li className="relative pl-8">
    {!isLast && (
      <span className="absolute left-[7px] top-4 h-full w-px bg-slate-800" aria-hidden="true" />
    )}
    <span
      className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-sky-500"
      aria-hidden="true"
    />

    <div className="pb-8">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-medium text-slate-200">{event.title}</p>
        <Badge label={event.status} variant={getStatusVariant(event.status)} />
      </div>
      <p className="mt-1 text-xs text-slate-500">{event.timestamp}</p>
      <p className="mt-1 text-sm text-slate-400">{event.description}</p>
    </div>
  </li>
);

export default TimelineEvent;