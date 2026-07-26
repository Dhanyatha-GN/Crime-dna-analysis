import { useEffect, useMemo, useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/search/SearchBar';
import SearchFilters from '../components/search/SearchFilters';
import ResultsTable from '../components/search/ResultsTable';
import {
  investigations,
  investigationCategories,
  investigationStatuses,
} from '../services/mockData/investigationsData';

const PAGE_SIZE = 5;

/**
 * Search
 *
 * Route: "/search". Search bar + category/status filters + paginated
 * results table, with loading and empty states. Currently reads from
 * src/services/mockData/investigationsData.js; the simulated delay below
 * stands in for a real API round trip.
 */
const Search = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timeoutId);
  }, [query, category, status, page]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return investigations.filter((item) => {
      const matchesQuery =
        normalizedQuery === '' ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.id.toLowerCase().includes(normalizedQuery);
      const matchesCategory = category === 'All' || item.category === category;
      const matchesStatus = status === 'All' || item.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [query, category, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageResults = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  return (
    <PageContainer>
      <PageHeader
        icon={SearchIcon}
        title="Search"
        subtitle="Search and filter investigations, records, and case data."
      />

      <Card>
        <div className="flex flex-col gap-4">
          <SearchBar value={query} onChange={handleFilterChange(setQuery)} />
          <SearchFilters
            categories={investigationCategories}
            statuses={investigationStatuses}
            category={category}
            status={status}
            onCategoryChange={handleFilterChange(setCategory)}
            onStatusChange={handleFilterChange(setStatus)}
          />
        </div>

        <div className="mt-6">
          {isLoading ? (
            <Loader label="Searching investigations..." />
          ) : pageResults.length === 0 ? (
            <EmptyState
              title="No matching investigations"
              description="Try adjusting your search term or filters."
            />
          ) : (
            <>
              <ResultsTable results={pageResults} />
              <div className="mt-4">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
              </div>
            </>
          )}
        </div>
      </Card>
    </PageContainer>
  );
};

export default Search;