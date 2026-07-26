import { History } from 'lucide-react';
import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';
import TimelineEvent from '../components/timeline/TimelineEvent';
import { timelineEvents } from '../services/mockData/timelineData';

/**
 * Timeline
 *
 * Route: "/timeline". Vertical chronological list of investigation events
 * with status badges. Currently reads from
 * src/services/mockData/timelineData.js.
 */
const Timeline = () => (
  <PageContainer>
    <PageHeader
      icon={History}
      title="Timeline"
      subtitle="Chronological view of investigation events and case activity."
    />

    <Card>
      {timelineEvents.length === 0 ? (
        <EmptyState
          title="No events recorded"
          description="Investigation events will appear here as they happen."
        />
      ) : (
        <ul>
          {timelineEvents.map((event, index) => (
            <TimelineEvent key={event.id} event={event} isLast={index === timelineEvents.length - 1} />
          ))}
        </ul>
      )}
    </Card>
  </PageContainer>
);

export default Timeline;