import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

const NODE_COLORS = {
  case: '#0ea5e9',
  suspect: '#f43f5e',
  victim: '#f59e0b',
  evidence: '#22c55e',
};

/**
 * NetworkGraphCanvas
 *
 * Thin wrapper around a raw Cytoscape.js instance. Owns the instance's
 * lifecycle (create on mount / element change, destroy on unmount) so the
 * Network Graph page doesn't need to manage Cytoscape directly.
 *
 * Props:
 * - elements: Cytoscape-compatible elements array (nodes + edges), the
 *   same shape returned by GET /api/network/graph. Node `data.type` drives
 *   the node color via NODE_COLORS.
 */
const NetworkGraphCanvas = ({ elements }) => {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': (ele) => NODE_COLORS[ele.data('type')] ?? '#64748b',
            label: 'data(label)',
            color: '#e2e8f0',
            'font-size': 10,
            'text-valign': 'bottom',
            'text-margin-y': 6,
            width: 32,
            height: 32,
          },
        },
        {
          selector: 'edge',
          style: {
            width: 1.5,
            'line-color': '#334155',
            'target-arrow-color': '#334155',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
      ],
      layout: { name: 'cose', animate: false },
    });

    return () => {
      cyRef.current?.destroy();
    };
  }, [elements]);

  return (
    <div
      ref={containerRef}
      className="h-[28rem] w-full rounded-lg border border-slate-800 bg-slate-950"
      role="img"
      aria-label="Investigation relationship network graph"
    />
  );
};

export default NetworkGraphCanvas;