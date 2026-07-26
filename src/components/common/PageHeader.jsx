/**
 * PageHeader
 *
 * Props:
 * - icon: optional Lucide icon component rendered next to the title.
 * - title: page title text.
 * - subtitle: optional supporting text under the title.
 * - actions: optional node (e.g. buttons) rendered on the right.
 */
const PageHeader = ({ icon: Icon, title, subtitle, actions }) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="flex items-center gap-2 text-xl font-semibold text-slate-100">
        {Icon && <Icon className="h-5 w-5 text-sky-500" aria-hidden="true" />}
        {title}
      </h1>
      {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

export default PageHeader;