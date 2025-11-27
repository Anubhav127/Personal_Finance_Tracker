import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

// Default categories based on requirements
const DEFAULT_CATEGORIES = [
  'All',
  'Food',
  'Transport',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Bills',
  'Salary',
  'Freelance',
  'Investment',
  'Other',
];

function TransactionFilters({ onFilterChange, initialFilters }) {
  const [category, setCategory] = useState(initialFilters?.category || 'All');
  const [search, setSearch] = useState(initialFilters?.search || '');
  const [startDate, setStartDate] = useState(initialFilters?.startDate || '');
  const [endDate, setEndDate] = useState(initialFilters?.endDate || '');

  // Optimized handler using useCallback
  const handleCategoryChange = useCallback((e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    onFilterChange({
      category: newCategory === 'All' ? '' : newCategory,
      search,
      startDate,
      endDate,
    });
  }, [search, startDate, endDate, onFilterChange]);

  // Optimized handler using useCallback
  const handleSearchChange = useCallback((e) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    onFilterChange({
      category: category === 'All' ? '' : category,
      search: newSearch,
      startDate,
      endDate,
    });
  }, [category, startDate, endDate, onFilterChange]);

  // Optimized handler using useCallback
  const handleStartDateChange = useCallback((e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    onFilterChange({
      category: category === 'All' ? '' : category,
      search,
      startDate: newStartDate,
      endDate,
    });
  }, [category, search, endDate, onFilterChange]);

  // Optimized handler using useCallback
  const handleEndDateChange = useCallback((e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    onFilterChange({
      category: category === 'All' ? '' : category,
      search,
      startDate,
      endDate: newEndDate,
    });
  }, [category, search, startDate, onFilterChange]);

  // Reset all filters
  const handleReset = useCallback(() => {
    setCategory('All');
    setSearch('');
    setStartDate('');
    setEndDate('');
    onFilterChange({
      category: '',
      search: '',
      startDate: '',
      endDate: '',
    });
  }, [onFilterChange]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900">Filter Transactions</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category-filter"
            value={category}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white"
          >
            {DEFAULT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Search Description
          </label>
          <div className="relative">
            <input
              id="search-filter"
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div>
          <label htmlFor="start-date-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            id="start-date-filter"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          />
        </div>

        <div>
          <label htmlFor="end-date-filter" className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            id="end-date-filter"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          />
        </div>

        <div className="flex items-end">
          <button 
            onClick={handleReset} 
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

TransactionFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  initialFilters: PropTypes.shape({
    category: PropTypes.string,
    search: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }),
};

TransactionFilters.defaultProps = {
  initialFilters: {},
};

export default TransactionFilters;
