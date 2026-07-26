// Shape mirrors the Cytoscape-compatible elements array that
// GET /api/network/graph is expected to return: each entry is either a
// node ({ data: { id, label, type } }) or an edge
// ({ data: { id, source, target } }).
export const mockGraphElements = [
  { data: { id: 'case-1042', label: 'INV-1042', type: 'case' } },
  { data: { id: 'sus-01', label: 'Unidentified Male', type: 'suspect' } },
  { data: { id: 'sus-02', label: 'Marcus D.', type: 'suspect' } },
  { data: { id: 'vic-01', label: 'Harborline Storage Co.', type: 'victim' } },
  { data: { id: 'evd-01', label: 'Fingerprint', type: 'evidence' } },
  { data: { id: 'evd-02', label: 'CCTV Footage', type: 'evidence' } },

  { data: { id: 'e1', source: 'case-1042', target: 'sus-01' } },
  { data: { id: 'e2', source: 'case-1042', target: 'sus-02' } },
  { data: { id: 'e3', source: 'case-1042', target: 'vic-01' } },
  { data: { id: 'e4', source: 'case-1042', target: 'evd-01' } },
  { data: { id: 'e5', source: 'case-1042', target: 'evd-02' } },
  { data: { id: 'e6', source: 'evd-01', target: 'sus-01' } },
];