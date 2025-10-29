import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ReactFlow, Controls, Background, useReactFlow } from '@xyflow/react';
import DownloadButton from './downloadButton';

const JsonTreeViewer = ({ nodes, edges }) => {
  const wrapperRef = useRef(null);
  const { fitView } = useReactFlow();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const throttle = (fn, limit) => {
    const inThrottle = useRef(false);
    return (...args) => {
      if (!inThrottle.current) {
        fn(...args);
        inThrottle.current = true;
        setTimeout(() => (inThrottle.current = false), limit);
      }
    };
  };

  const handleMouseMove = useCallback(
    throttle(e => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }, 300),
    []
  );
  const handleNodeClick = useCallback((_, node) => {
    if (node?.data?.path) {
      navigator.clipboard.writeText(node.data.path);
      alert(`Copied Path:${node.data.path}`);
    }
  }, []);

  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => fitView({ padding: 0.2 }), 300);
    }
  }, [nodes, edges, fitView]);  

  return (
    <div
      ref={wrapperRef}
      className="relative flex h-96 w-full overflow-hidden rounded border-2 border-gray-300 bg-gray-50"
      onMouseMove={handleMouseMove}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        minZoom={0.3}
        maxZoom={1.5}
        nodesConnectable={false}
        onNodeMouseEnter={(_, node) => setHoveredNode(node)}
        onNodeMouseLeave={() => setHoveredNode(null)}
        onNodeClick={handleNodeClick}
      >
        <Background />
        <Controls />
        <DownloadButton isDisabled={!nodes.length} />
      </ReactFlow>

      {hoveredNode && hoveredNode.data && (
        <div
          className="pointer-events-none absolute z-50 rounded bg-gray-700 px-2 py-2 text-sm text-white shadow-lg"
          style={{
            top: `${mousePos.y - 50}px`,
            left: `${mousePos.x + 15}px`,
            whiteSpace: 'nowrap',
            transition: 'top 0.05s, left 0.05s',
          }}
        >
          <div className="font-semibold">{hoveredNode.data.path}</div>
          <div className="text-gray-300">
            {hoveredNode.data.value.slice(0, 40) || ''}
            {hoveredNode.data.value.length > 40 ? '...' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default JsonTreeViewer;