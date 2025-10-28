import React from 'react';
import { ReactFlow, Controls } from '@xyflow/react';
import DownloadButton from './downloadButton';

const JsonTreeViewer = ({ nodes, edges }) => {
  return (
    <div className="flex h-96 w-full rounded border-2 border-gray-300 bg-gray-50">
      <ReactFlow nodes={nodes} edges={edges} fitView nodesConnectable={false} className="download-image">
        <Controls />
        <DownloadButton isDisabled={!nodes.length} />
      </ReactFlow>
    </div>
  );
};

export default JsonTreeViewer;
