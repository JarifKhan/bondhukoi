"use client"
import { useState } from 'react';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query) return;

    setLoading(true);  // Set loading to true when searching
    setError(null);    // Reset any previous error

    try {
      const res = await fetch(`/api/search?=${query}`);
      if (!res.ok) {
        throw new Error('Failed to fetch results');
      }
      const data = await res.json();
      console.log(data)


    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('Error fetching search results');
      setResults([]); // Clear previous results on error
    } finally {
      setLoading(false);  // Set loading to false after the request completes
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold">Search</h1>
      <form onSubmit={handleSearch} className="my-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </form>

      
    </div>
  );
};

export default SearchPage;
