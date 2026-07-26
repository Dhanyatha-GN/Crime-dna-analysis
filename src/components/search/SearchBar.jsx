import { Search as SearchIcon } from 'lucide-react';

/**
 * SearchBar
 *
 * Controlled text input for searching investigations by title or ID.
 */
const SearchBar = ({ value, onChange }) => (
  <div className="relative">
    <SearchIcon
      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
      aria-hidden="true"
    />
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search investigations by title or ID..."
      className="w-full rounded-md border border-slate-800 bg-slate-900 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
      aria-label="Search investigations"
    />
  </div>
);

export default SearchBar;