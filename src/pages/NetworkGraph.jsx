import { Share2 } from 'lucide-react';
import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import NetworkGraphCanvas from '../components/network/NetworkGraphCanvas';
import { mockGraphElements } from '../services/mockData/networkGraphData';

const LEGEND = [
  { type: 'case', label: 'Case', color: '#0ea5e9' },
  { type: 'suspect', label: 'Suspect', color: '#f43f5e' },
  { type: 'victim', label: 'Victim', color: '#f59e0b' },
  { type: 'evidence', label: 'Evidence', color: '#22c55e' },
];

/**
 * NetworkGraph
 *
 * Route: "/network-graph". Renders relationship networks via
 * NetworkGraphCanvas (Cytoscape.js). Currently backed by
 * src/services/mockData/networkGraphData.js, shaped like the eventual
 * GET /api/network/graph response so swapping to a real fetch later only
 * touches this page, not the canvas component.
 */
const NetworkGraph = () => (
  <PageContainer>
    <PageHeader
      icon={Share2}
      title="Network Graph"
      subtitle="Visualized relationships between suspects, victims, organizations, and evidence."
    />

    <Card
      actions={
        <div className="flex flex-wrap items-center gap-3">
          {LEGEND.map((item) => (
            <span key={item.type} className="flex items-center gap-1.5 text-xs text-slate-400">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              {item.label}
            </span>
          ))}
        </div>
      }
    >
      <NetworkGraphCanvas elements={mockGraphElements} />
    </Card>
  </PageContainer>
);

export default NetworkGraph;