/**
 * SearchFilters
 *
 * Controlled category/status select filters for the Search page.
 */
const SearchFilters = ({ categories, statuses, category, status, onCategoryChange, onStatusChange }) => (
  <div className="flex flex-col gap-3 sm:flex-row">
    <select
      value={category}
      onChange={(event) => onCategoryChange(event.target.value)}
      className="rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
      aria-label="Filter by category"
    >
      {categories.map((option) => (
        <option key={option} value={option}>
          {option === 'All' ? 'All Categories' : option}
        </option>
      ))}
    </select>

    <select
      value={status}
      onChange={(event) => onStatusChange(event.target.value)}
      className="rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
      aria-label="Filter by status"
    >
      {statuses.map((option) => (
        <option key={option} value={option}>
          {option === 'All' ? 'All Statuses' : option}
        </option>
      ))}
    </select>
  </div>
);

export default SearchFilters;