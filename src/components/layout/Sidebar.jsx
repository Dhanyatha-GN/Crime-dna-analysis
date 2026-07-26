import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Fingerprint,
  History,
  Share2,
  FileText,
  ShieldCheck,
  X,
} from 'lucide-react';

/**
 * Static navigation configuration for the sidebar.
 * `to` values match the routes that will be registered in App.jsx.
 */
const NAV_ITEMS = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard, end: true },
  { label: 'Search', to: '/search', icon: Search },
  { label: 'Crime DNA', to: '/crime-dna', icon: Fingerprint },
  { label: 'Timeline', to: '/timeline', icon: History },
  { label: 'Network Graph', to: '/network-graph', icon: Share2 },
  { label: 'Summary', to: '/summary', icon: FileText },
];

const navLinkClasses = ({ isActive }) =>
  [
    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-slate-800 text-white'
      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100',
  ].join(' ');

/**
 * Shared nav list rendered inside both the desktop rail and the mobile drawer.
 * `onNavigate` is optional and used on mobile to close the drawer after a
 * link is clicked.
 */
const NavList = ({ onNavigate }) => (
  <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Primary">
    {NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        onClick={onNavigate}
        className={navLinkClasses}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{label}</span>
      </NavLink>
    ))}
  </nav>
);

const BrandHeader = () => (
  <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-4">
    <ShieldCheck className="h-5 w-5 text-sky-500" aria-hidden="true" />
    <span className="text-sm font-semibold tracking-wide text-slate-100">
      CrimeDNA-X
    </span>
  </div>
);

/**
 * Sidebar
 *
 * Props:
 * - isOpen: whether the mobile drawer is open (ignored on desktop, where
 *   the sidebar is always visible).
 * - onClose: callback to close the mobile drawer, called on backdrop click,
 *   the close button, and after a nav item is selected.
 */
const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Desktop: persistent rail */}
      <aside className="hidden shrink-0 flex-col border-r border-slate-800 bg-slate-900 lg:flex lg:w-64">
        <BrandHeader />
        <NavList />
      </aside>

      {/* Mobile: slide-in drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-200 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-sky-500" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-wide text-slate-100">
              CrimeDNA-X
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <NavList onNavigate={onClose} />
      </aside>
    </>
  );
};

export default Sidebar;