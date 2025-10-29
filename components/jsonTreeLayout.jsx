import React, { useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import JsonInputPanel from './jsonInputPanel';
import SearchBox from './searchBox';
import JsonTreeViewer from './jsonTreeViewer';

const JsonTreeLayout = () => {
  const reactFlowInstance = useReactFlow();
  const [jsonInput, setJsonInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [flowData, setFlowData] = useState({ nodes: [], edges: [] });
  const [searchMessage, setSearchMessage] = useState('');

  const validateJson = () => {
    if (!jsonInput.trim()) {
      setError('JSON input cannot be empty');
      return false;
    }
    try {
      JSON.parse(jsonInput);
      setError('');
      return true;
    } catch {
      setError('JSON input is invalid');
      return false;
    }
  };

  const handleGenerateTree = () => {
    const isValid = validateJson();
    if (!isValid) return;
    const { nodes, edges } = buildTree(JSON.parse(jsonInput));
    setFlowData({ nodes, edges });
  };

  const getTargetNode = () => {
    const cleanPath = searchQuery.replace(/^\$\./, '').replace(/\[(\d+)\]/g, '.$1');
    const targetId = cleanPath.split('.').join('.');
    return flowData.nodes.find(n => n.id.endsWith(targetId));
  };

  const handleSearch = () => {
    if (!flowData.nodes.length) {
      setSearchMessage('Please enter JSON to generate tree');
      return;
    }
    if (!searchQuery.trim()) {
      setSearchMessage('Please enter a valid JSON path.');
      return;
    }

    const matchedNode = getTargetNode();

    if (matchedNode) {
      const formattedNodes = flowData.nodes.map(n =>
        n.id === matchedNode.id
          ? {
              ...n,
              style: {
                ...n.style,
                border: '3px solid #FFD700',
                boxShadow: '0 0 10px #FFD700',
              },
            }
          : n
      );
      setFlowData(prev => ({
        ...prev,
        nodes: formattedNodes,
      }));
      reactFlowInstance.setCenter(matchedNode.position.x, matchedNode.position.y, {
        zoom: 1.4,
        duration: 800,
      });
      setSearchMessage('Match found!');
    } else {
      handleReset();
      setSearchMessage('No match found.');
    }
  };

  const handleReset = () => {
    if (!searchQuery.trim() || !flowData.nodes) {
      return;
    }
    setFlowData(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => ({
        ...n,
        style: { ...n.style, border: 'none', boxShadow: 'none' },
      })),
    }));
    setSearchQuery('');
    setSearchMessage('');
    reactFlowInstance.fitView({ padding: 0.2, duration: 800 });
  };

  const handleResetAll = () => {
    setJsonInput('');
    setFlowData({ nodes: [], edges: [] });
    setError('');
    setSearchQuery('');
    setSearchMessage('');
  };

  return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <JsonInputPanel
          jsonInput={jsonInput}
          setJsonInput={setJsonInput}
          onGenerate={handleGenerateTree}
          handleReset={handleResetAll}
          error={error}
        />
        <div className="md:col-span-2">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onReset={handleReset}
            onSearch={handleSearch}
            searchMessage={searchMessage}
          />
          <JsonTreeViewer nodes={flowData.nodes} edges={flowData.edges} />
        </div>
      </div>
  );
};

export default JsonTreeLayout;

function buildTree(data, unitPx = 150, nodeGapUnits = 0.8, levelGapPx = 120) {
  const nodes = [];
  const edges = [];

  const leafCount = node => (node && typeof node === 'object' ? Object.values(node).reduce((a, v) => a + leafCount(v), 0) : 1);

  const getNodeBgColor = val =>
    val === 'Root' ? '#6A5ACD' : Array.isArray(val) ? '#2ECC71' : typeof val === 'object' && val !== null ? '#1E90FF' : '#FFA500';

  function traverse(node, nodeId, depth = 0, centerXunits = 0) {
    if (node === null || typeof node !== 'object') return { widthUnits: 1 };

    const entries = Array.isArray(node) ? node.map((v, i) => [String(i), v]) : Object.entries(node);

    const childrenMeta = entries.map(([key, val]) => {
      const lc = leafCount(val);
      const childUnits = typeof val === 'object' && val !== null ? Math.max(lc * 1.1, 1) : 0.8;
      return { key, val, leafs: lc, childUnits };
    });

    const totalUnits = childrenMeta.reduce((s, c) => s + c.childUnits, 0) + Math.max(0, childrenMeta.length - 1) * nodeGapUnits;

    let startXunits = centerXunits - totalUnits / 2;

    childrenMeta.forEach(meta => {
      const childId = nodeId ? `${nodeId}.${meta.key}` : `${meta.key}`;
      const childCenterUnits = startXunits + meta.childUnits / 2;
      const isObject = typeof meta.val === 'object' && meta.val !== null;
      const childLabel = isObject || Array.isArray(meta.val) ? `${meta.key}` : `${meta.key}: ${String(meta.val)}`;

      nodes.push({
        id: childId,
        type: 'default',
        data: {
          label: childLabel,
          path: childId,
          value: isObject ? JSON.stringify(meta.val) : String(meta.val),
        },
        position: { x: childCenterUnits * unitPx, y: depth * levelGapPx },
        style: {
          backgroundColor: getNodeBgColor(meta.val),
          color: '#fff',
          padding: '6px 10px',
          fontSize: '13px',
          minWidth: '60px',
        },
      });

      if (nodeId)
        edges.push({
          id: `${nodeId}-${childId}`,
          source: nodeId,
          target: childId,
          type: 'step',
        });

      if (meta.leafs > 0 && isObject) {
        traverse(meta.val, childId, depth + 1, childCenterUnits);
      }

      startXunits += meta.childUnits + nodeGapUnits;
    });

    return { widthUnits: totalUnits };
  }

  const rootKeys = Object.keys(data);

  if (rootKeys.length > 1) {
    // multiple keys - add root node
    const topMeta = rootKeys.map(k => {
      const v = data[k];
      const lc = leafCount(v);
      const w = typeof v === 'object' && v !== null ? Math.max(lc * 1.1, 1) : 0.8;
      return { key: k, val: v, leafs: lc, widthUnits: w };
    });

    const totalTopUnits = topMeta.reduce((s, t) => s + t.widthUnits, 0) + Math.max(0, topMeta.length - 1) * nodeGapUnits;

    const rootId = 'Root';
    nodes.push({
      id: rootId,
      type: 'default',
      data: { label: 'Root', path: 'Root', value: '' },
      position: { x: 0, y: 0 },
      style: {
        backgroundColor: getNodeBgColor('Root'),
        color: '#fff',
        padding: '6px 10px',
        fontSize: '13px',
        minWidth: '60px',
      },
    });

    let curXunits = -totalTopUnits / 2;

    topMeta.forEach(t => {
      const topId = t.key;
      const topCenterUnits = curXunits + t.widthUnits / 2;
      nodes.push({
        id: topId,
        type: 'default',
        data: {
          label: topId,
          path: topId,
          value: typeof t.val === 'object' && t.val !== null ? JSON.stringify(t.val) : String(t.val),
        },
        position: { x: topCenterUnits * unitPx, y: levelGapPx },
        style: {
          backgroundColor: getNodeBgColor(t.val),
          color: '#fff',
          padding: '6px 10px',
          fontSize: '13px',
          minWidth: '60px',
        },
      });
      edges.push({
        id: `${rootId}-${topId}`,
        source: rootId,
        target: topId,
        type: 'step',
      });
      traverse(t.val, topId, 2, topCenterUnits);
      curXunits += t.widthUnits + nodeGapUnits;
    });
  } else if (rootKeys.length === 1) {
    // single key - no root node
    const key = rootKeys[0];
    const val = data[key];

    nodes.push({
      id: key,
      type: 'default',
      data: {
        label: key,
        path: key,
        value: typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val),
      },
      position: { x: 0, y: 0 },
      style: {
        backgroundColor: getNodeBgColor(val),
        color: '#fff',
        padding: '6px 10px',
        fontSize: '13px',
        minWidth: '60px',
      },
    });

    traverse(val, key, 1, 0);
  }

  return { nodes, edges };
}
