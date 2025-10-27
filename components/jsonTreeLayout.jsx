import React, { useState } from 'react';

const JsonTreeLayout = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

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
    // TODO: Implement tree generation
  };

  const handleSearch = () => {};

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Paste or type JSON data
        </label>
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
          className="h-64 w-full rounded border-2 border-gray-300 bg-white p-4 font-mono text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="flex-1 rounded border-2 border-gray-300 bg-white px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="rounded bg-blue-500 px-6 py-2 font-medium text-white shadow transition-colors hover:bg-blue-600"
          >
            Search
          </button>
        </div>
        <div className="flex h-80 w-full items-center justify-center rounded border-2 border-gray-300 bg-gray-50">
          <p className="text-sm text-gray-500">
            Tree visualization will appear here
          </p>
        </div>
      </div>
    </div>
  );
};

export default JsonTreeLayout;
