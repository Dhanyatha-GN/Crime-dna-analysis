import { Menu, Bell, UserCircle } from 'lucide-react';

/**
 * Navbar
 *
 * Sticky top bar rendered inside AppLayout, above the routed page content.
 *
 * Props:
 * - onMenuClick: callback that opens the mobile sidebar drawer. The menu
 *   button is only shown below the `lg` breakpoint, where the sidebar is
 *   hidden by default.
 *
 * The right-hand side currently holds placeholder, non-interactive-data
 * icon buttons (notifications, account) reserved for future features.
 * They render no user-specific data and can be wired up later without
 * changing this component's structure.
 */
const Navbar = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <span className="text-sm font-medium text-slate-300">
          Investigation Dashboard
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          aria-label="Account"
        >
          <UserCircle className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;