import React, { useState } from 'react';
import { ReactFlow, Background, Controls, ReactFlowProvider } from '@xyflow/react';

const JsonTreeLayout = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [flowData, setFlowData] = useState({ nodes: [], edges: [] });

  const validateJson = () => {
    if (!jsonInput || jsonInput.trim() === '') {
      setError('JSON input cannot be empty');
      return false;
    }
    try {
      JSON.parse(jsonInput);
      setError('');
      return true;
    } catch (err) {
      setError('JSON input is invalid');
      return false;
    }
  };

  const handleGenerateTree = () => {
    const isValid = validateJson();
    if (!isValid) return;

    const { nodes, edges } = buildFlowFromJson(JSON.parse(jsonInput));
    setFlowData({ nodes, edges });
  };

  const handleSearch = () => {};
  console.log(flowData);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Paste or type JSON data</label>
        <textarea
          value={jsonInput}
          onChange={e => setJsonInput(e.target.value)}
          placeholder={`{
    "user": {
        "name": "Nandini",
        "age": 23,
        "address": {
            "city": "Vijayawada",
            "zip": "000000"
        }
    }
}`}
          className="h-64 w-full rounded border-2 border-gray-300 bg-white p-4 font-mono text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handleGenerateTree}
          className="mt-4 rounded bg-blue-500 px-6 py-2 font-medium text-white shadow transition-colors hover:bg-blue-600"
        >
          Generate Tree
        </button>
      </div>

      <div>
        <div className="mb-2 flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="$ user.address.city"
            className="flex-1 rounded border-2 border-gray-300 bg-white px-4 py-2 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="rounded bg-blue-500 px-6 py-2 font-medium text-white shadow transition-colors hover:bg-blue-600"
          >
            Search
          </button>
        </div>
        <div className="flex h-96 w-full rounded border-2 border-gray-300 bg-gray-50">
          <div className="h-full w-full">
            <ReactFlowProvider>
              <ReactFlow nodes={flowData.nodes} edges={flowData.edges} fitView>
                <Background />
                <Controls />
              </ReactFlow>
            </ReactFlowProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonTreeLayout;
function buildFlowFromJson(json, parentId = null, level = 0, posX = 0, posY = 0, counter = { id: 1 }) {
  const nodes = [];
  const edges = [];

  const baseX = posX;
  const baseY = posY + level * 150;

  const entries = Array.isArray(json) ? json.map((v, i) => [i, v]) : Object.entries(json);

  entries.forEach(([key, value], index) => {
    const nodeId = String(counter.id++);
    const x = baseX + index * 200;
    const y = baseY;

    const isObject = typeof value === 'object' && value !== null;
    const isArray = Array.isArray(value);

    let label = '';
    if (isArray || isObject) label = key;
    else label = `${key}: ${value}`;

    nodes.push({
      id: nodeId,
      position: { x, y },
      data: { label },
      type: 'default',
    });

    if (parentId) {
      edges.push({ id: `${parentId}-${nodeId}`, source: parentId, target: nodeId });
    }

    if (isObject || isArray) {
      const childXStart = x - (entries.length / 2) * 150;
      const { nodes: childNodes, edges: childEdges } = buildFlowFromJson(value, nodeId, level + 1, childXStart, y + 150, counter);
      nodes.push(...childNodes);
      edges.push(...childEdges);
    }
  });

  return { nodes, edges };
}
