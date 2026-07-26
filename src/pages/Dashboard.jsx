import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Plus, FileText, Search as SearchIcon } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { dashboardStats, caseVolumeTrend, recentInvestigations } from '../services/mockData/dashboardData';
import { getStatusVariant } from '../utils/statusVariants';

/**
 * Dashboard
 *
 * Landing page (route: "/"). Overview statistics, case volume trend,
 * quick actions, and recent investigations. All content is currently
 * backed by mock data in src/services/mockData/dashboardData.js, isolated
 * so it can be swapped for real API calls with minimal changes.
 */
const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <PageHeader
        icon={LayoutDashboard}
        title="Dashboard"
        subtitle="Overview of ongoing investigations and system activity."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.id} label={stat.label} value={stat.value} trend={stat.trend} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Case Volume Trend" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={caseVolumeTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', fontSize: 12 }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="opened" stroke="#38bdf8" strokeWidth={2} name="Opened" />
                <Line type="monotone" dataKey="closed" stroke="#22c55e" strokeWidth={2} name="Closed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="flex flex-col gap-2">
            <Button icon={SearchIcon} variant="secondary" className="justify-start" onClick={() => navigate('/search')}>
              New Search
            </Button>
            <Button icon={Plus} variant="secondary" className="justify-start" onClick={() => navigate('/crime-dna')}>
              Open Investigation
            </Button>
            <Button icon={FileText} variant="secondary" className="justify-start" onClick={() => navigate('/summary')}>
              Generate Report
            </Button>
          </div>
        </Card>
      </div>

      <Card title="Recent Investigations" className="mt-6">
        <ul className="divide-y divide-slate-800">
          {recentInvestigations.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-200">{item.title}</p>
                <p className="text-xs text-slate-500">
                  {item.id} · Updated {item.updatedAt}
                </p>
              </div>
              <Badge label={item.status} variant={getStatusVariant(item.status)} />
            </li>
          ))}
        </ul>
      </Card>
    </PageContainer>
  );
};

export default Dashboard;