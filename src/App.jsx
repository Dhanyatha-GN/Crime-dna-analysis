import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import CrimeDNA from './pages/CrimeDNA';
import Timeline from './pages/Timeline';
import NetworkGraph from './pages/NetworkGraph';
import Summary from './pages/Summary';

/**
 * App
 *
 * Root application component. Defines the route table for CrimeDNA-X.
 * AppLayout is registered as a layout route: every page below renders
 * inside it via <Outlet />, inheriting the Sidebar/Navbar shell.
 *
 * Route paths match the `to` values defined in Sidebar's NAV_ITEMS, so
 * navigation and routing stay in sync.
 */
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="search" element={<Search />} />
          <Route path="crime-dna" element={<CrimeDNA />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="network-graph" element={<NetworkGraph />} />
          <Route path="summary" element={<Summary />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;