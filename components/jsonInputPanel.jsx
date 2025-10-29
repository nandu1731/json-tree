import React from 'react';

const JsonInputPanel = ({ jsonInput, setJsonInput, error, onGenerate, handleReset }) => {
  return (
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
        className="h-80 w-full rounded border-2 border-gray-300 bg-white p-4 font-mono text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={onGenerate}
          className="mt-4 rounded bg-blue-500 px-6 py-2 font-medium text-white shadow transition-colors hover:bg-blue-600"
        >
          Generate Tree
        </button>
        <button
          onClick={handleReset}
          className="mt-4 rounded bg-gray-500 px-6 py-2 font-medium text-white shadow transition-colors hover:bg-gray-600"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default JsonInputPanel;
