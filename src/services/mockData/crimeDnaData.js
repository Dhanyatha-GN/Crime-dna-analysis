export const caseInfo = {
  id: 'INV-1042',
  title: 'Downtown Warehouse Burglary',
  status: 'Open',
  openedAt: '2026-06-02',
  location: 'Downtown, Warehouse District',
  leadInvestigator: 'Det. R. Alvarez',
  description:
    'Break-in reported at a commercial storage facility with forced entry through a rear loading dock.',
};

export const suspects = [
  { id: 'SUS-01', name: 'Unidentified Male, ~30s', status: 'Person of Interest' },
  { id: 'SUS-02', name: 'Marcus D.', status: 'Cleared' },
];

export const victims = [{ id: 'VIC-01', name: 'Harborline Storage Co.', role: 'Property Owner' }];

export const evidenceItems = [
  { id: 'EVD-01', type: 'Fingerprint', description: 'Partial print recovered from loading dock door', collectedAt: '2026-06-02' },
  { id: 'EVD-02', type: 'CCTV Footage', description: 'External camera footage, 11:40 PM - 12:10 AM', collectedAt: '2026-06-02' },
  { id: 'EVD-03', type: 'Tool Mark', description: 'Pry-bar impression on door frame', collectedAt: '2026-06-03' },
];

export const aiInsights = [
  'Entry pattern is consistent with 3 prior unsolved cases in the Downtown corridor.',
  'Partial fingerprint has a 62% match confidence against an existing record.',
  'Recommend cross-referencing CCTV timestamps with nearby traffic camera logs.',
];