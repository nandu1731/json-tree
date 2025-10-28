const SearchBox = ({ searchQuery, setSearchQuery, onSearch, onReset, searchMessage }) => {
  return (
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
          className="rounded bg-blue-500 px-6 py-2 font-medium text-white shadow transition-colors hover:bg-blue-600"
          onClick={onSearch}
        >
          Search
        </button>
        <button
          className="rounded bg-gray-400 px-6 py-2 font-medium text-white shadow transition-colors hover:bg-gray-600"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
      {searchMessage && <p className={searchMessage === 'Match found!' ? 'text-green-500' : 'text-red-500'}>{searchMessage}</p>}
    </div>
  );
};

export default SearchBox;
