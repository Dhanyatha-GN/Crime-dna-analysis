import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

/**
 * AppLayout
 *
 * Root layout for the entire application. Every route is rendered
 * as a child of this layout via React Router's <Outlet />.
 *
 * Responsibilities:
 * - Compose Sidebar (navigation) and Navbar (top bar) around the routed content.
 * - Own and control mobile sidebar open/close state.
 * - Provide a responsive shell: persistent sidebar on desktop, slide-in
 *   drawer with backdrop on mobile/tablet.
 * - Provide the single scrollable content region that all pages render into.
 *
 * Props contract with children:
 * - Sidebar receives { isOpen, onClose } and is responsible for its own
 *   desktop-vs-mobile presentation (e.g. always visible at the `lg` breakpoint,
 *   translated off-screen below it unless `isOpen` is true).
 * - Navbar receives { onMenuClick } to trigger opening the mobile sidebar.
 *
 * This contract is intentionally minimal and stable so that Sidebar and
 * Navbar can be implemented (or later restyled) without requiring changes
 * to this file.
 */
const AppLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const openMobileSidebar = () => setIsMobileSidebarOpen(true);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  // Close the mobile sidebar on Escape for keyboard accessibility.
  useEffect(() => {
    if (!isMobileSidebarOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMobileSidebar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileSidebarOpen]);

  // Prevent background scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = isMobileSidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar isOpen={isMobileSidebarOpen} onClose={closeMobileSidebar} />

      {/* Backdrop overlay, mobile only, shown while the drawer is open */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={openMobileSidebar} />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto focus:outline-none"
          tabIndex={-1}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;