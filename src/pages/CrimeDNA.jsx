import { Fingerprint } from 'lucide-react';
import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Tabs from '../components/common/Tabs';
import { caseInfo, suspects, victims, evidenceItems, aiInsights } from '../services/mockData/crimeDnaData';
import { getStatusVariant } from '../utils/statusVariants';

const PeopleList = ({ people, emptyLabel }) =>
  people.length === 0 ? (
    <p className="text-sm text-slate-500">{emptyLabel}</p>
  ) : (
    <ul className="divide-y divide-slate-800">
      {people.map((person) => (
        <li key={person.id} className="flex items-center justify-between py-3">
          <span className="text-sm text-slate-200">{person.name}</span>
          <Badge label={person.status ?? person.role} variant={getStatusVariant(person.status)} />
        </li>
      ))}
    </ul>
  );

const EvidenceList = ({ items }) => (
  <ul className="space-y-3">
    {items.map((item) => (
      <li key={item.id} className="rounded-md border border-slate-800 bg-slate-950/60 p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-200">{item.type}</span>
          <span className="text-xs text-slate-500">{item.collectedAt}</span>
        </div>
        <p className="mt-1 text-sm text-slate-400">{item.description}</p>
      </li>
    ))}
  </ul>
);

const AIInsights = ({ insights }) => (
  <ul className="space-y-3">
    {insights.map((insight) => (
      <li key={insight} className="rounded-md border border-sky-900/50 bg-sky-500/5 p-3 text-sm text-slate-300">
        {insight}
      </li>
    ))}
  </ul>
);

/**
 * CrimeDNA
 *
 * Route: "/crime-dna". Case information header plus tabbed sections for
 * Suspects, Victims, Evidence, and AI Insights. Currently reads from
 * src/services/mockData/crimeDnaData.js.
 */
const CrimeDNA = () => {
  const tabs = [
    {
      id: 'suspects',
      label: `Suspects (${suspects.length})`,
      content: <PeopleList people={suspects} emptyLabel="No suspects identified yet." />,
    },
    {
      id: 'victims',
      label: `Victims (${victims.length})`,
      content: <PeopleList people={victims} emptyLabel="No victims recorded." />,
    },
    {
      id: 'evidence',
      label: `Evidence (${evidenceItems.length})`,
      content: <EvidenceList items={evidenceItems} />,
    },
    { id: 'insights', label: 'AI Insights', content: <AIInsights insights={aiInsights} /> },
  ];

  return (
    <PageContainer>
      <PageHeader
        icon={Fingerprint}
        title="Crime DNA"
        subtitle="Detailed investigation profile, evidence, and AI-generated analysis."
      />

      <Card title="Case Information" className="mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Case ID</p>
            <p className="mt-1 text-sm font-medium text-slate-200">{caseInfo.id}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
            <Badge label={caseInfo.status} variant={getStatusVariant(caseInfo.status)} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Opened</p>
            <p className="mt-1 text-sm font-medium text-slate-200">{caseInfo.openedAt}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Lead Investigator</p>
            <p className="mt-1 text-sm font-medium text-slate-200">{caseInfo.leadInvestigator}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-400">{caseInfo.description}</p>
      </Card>

      <Card>
        <Tabs tabs={tabs} />
      </Card>
    </PageContainer>
  );
};

export default CrimeDNA;