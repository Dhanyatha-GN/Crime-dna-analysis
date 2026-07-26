/**
 * Maps known status/label strings used across the app to a Badge variant.
 * Centralized here so Dashboard, Search, Crime DNA, and Timeline all agree
 * on what a given status looks like.
 */
const STATUS_VARIANTS = {
  Open: 'info',
  'Under Review': 'warning',
  Closed: 'success',
  'Person of Interest': 'warning',
  Cleared: 'success',
  Completed: 'success',
  'In Progress': 'info',
  Pending: 'neutral',
};

export const getStatusVariant = (status) => STATUS_VARIANTS[status] ?? 'neutral';