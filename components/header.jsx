import React from 'react';

const Header = () => {
  return (
    <div className="mb-10 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-800">JSON Tree Visualizer</h1>
      <div className="flex items-center gap-2">
        <h4 className="text-md text-gray-800">Dark/Light</h4>
        <button
          className="relative h-6 w-12 rounded-full bg-gray-300 transition-colors"
        >
          <div className="absolute top-0.5 h-5 w-5 translate-x-0.5 transform rounded-full bg-white shadow-md transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default Header;
