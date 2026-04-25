import { useState } from 'react';
import { IoSearch } from 'react-icons/io5';

export default function SearchBar({ onSearch }) {
  // State to hold what user types in the input
  const [searchInput, setSearchInput] = useState('');

  // This function runs when user types in the input
  // Event object (e) gives us access to the input value
  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  // This function runs when user submits the form (hits Enter or clicks Search button)
  const handleSubmit = (e) => {
    // e.preventDefault() stops the form from refreshing the page
    e.preventDefault();

    // Check if user typed something
    if (searchInput.trim() === '') {
      alert('Please enter a city name');
      return;
    }

    // Send the city name to parent component (Home.jsx)
    onSearch(searchInput);

    // Clear the input field after searching
    setSearchInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-8 fade-in" style={{animationDelay: '120ms'}}>
      <div className="flex gap-3">
        {/* Input field */}
        <input
          type="text"
          value={searchInput}
          onChange={handleChange}
          placeholder="Search for a city... (e.g., London, New York, Tokyo)"
          className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200
                     border border-white/40 backdrop-blur-md
                     focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30
                     dark:bg-black/30 dark:border-gray-600 dark:text-white
                     transition-all duration-200 text-sm"
        />

        {/* Search Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-white/40 hover:bg-white/60 text-white rounded-lg
                     border border-white/40 backdrop-blur-md
                     flex items-center gap-2 font-semibold text-sm
                     dark:bg-black/40 dark:hover:bg-black/60 dark:border-gray-600
                     transition-all duration-200 transform hover:scale-105"
        >
          <IoSearch size={20} />
          Search
        </button>
      </div>

      {/* Helper text */}
      <p className="text-sm mt-2 text-white/70">
        💡 Tip: Press Enter or click the Search button
      </p>
    </form>
  );
}
