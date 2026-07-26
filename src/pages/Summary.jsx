import { FileText } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import {
  aiSummaryText,
  summaryStats,
  caseStatusBreakdown,
  recommendations,
} from '../services/mockData/summaryData';

const PIE_COLORS = ['#38bdf8', '#f59e0b', '#22c55e'];

/**
 * Summary
 *
 * Route: "/summary". AI-generated case summary text, statistic cards, a
 * case status breakdown chart, and a recommendations list. Currently reads
 * from src/services/mockData/summaryData.js.
 */
const Summary = () => (
  <PageContainer>
    <PageHeader
      icon={FileText}
      title="Summary"
      subtitle="AI-generated case summary, key findings, and recommendations."
    />

    <Card title="AI-Generated Summary" className="mb-6">
      <p className="text-sm leading-relaxed text-slate-300">{aiSummaryText}</p>
    </Card>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {summaryStats.map((stat) => (
        <StatCard key={stat.id} label={stat.label} value={stat.value} />
      ))}
    </div>

    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card title="Case Status Breakdown" className="lg:col-span-2">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={caseStatusBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
              >
                {caseStatusBreakdown.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Recommendations">
        <ul className="space-y-3">
          {recommendations.map((rec) => (
            <li key={rec} className="rounded-md border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300">
              {rec}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  </PageContainer>
);

export default Summary;