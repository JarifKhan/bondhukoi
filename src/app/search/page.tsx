"use client";
import { useState } from "react";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) return; // Prevent search if query is empty or whitespace

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        throw new Error("Failed to fetch results");
      }
      const data = await res.json();
      setResults(data); // Assume `data` is an array of results
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError("Error fetching search results");
      setResults([]); // Clear results on error
    } finally {
      setLoading(false);
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
          aria-label="Search"
        />
        <button
          type="submit"
          className="ml-2 p-2 bg-blue-500 text-white rounded"
          disabled={loading} // Disable button while loading
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {!loading && results.length > 0 && (
        <ul className="mt-4">
          {results.map((result, index) => (
            <li
              key={index}
              className="p-2 border-b border-gray-300"
            >
              {result.name} {/* Replace `name` with the appropriate field */}
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && results.length === 0 && query && (
        <p className="text-gray-500">No results found for "{query}".</p>
      )}
    </div>
  );
};

export default SearchPage;
