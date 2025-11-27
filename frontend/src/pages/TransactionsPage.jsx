import { useState, useCallback, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import TransactionList from '../components/TransactionList';
import TransactionFilters from '../components/TransactionFilter';
import TransactionForm from '../components/TransactionForm';
import Navigation from '../components/Navigation';
import api from '../services/api';

function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filter state
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    startDate: '',
    endDate: '',
  });

  // Edit state
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch transactions from API
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        limit: 20,
      };

      if (filters.category) {
        params.category = filters.category;
      }
      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.startDate) {
        params.startDate = filters.startDate;
      }
      if (filters.endDate) {
        params.endDate = filters.endDate;
      }

      const response = await api.get('/transactions', { params });
      const { transactions: data, total: totalCount, pages } = response.data;

      setTransactions(data);
      setTotal(totalCount);
      setTotalPages(pages);
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to fetch transactions';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  // Fetch transactions when dependencies change
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Handle filter changes with useCallback
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  // Handle page changes with useCallback
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle edit transaction
  const handleEdit = useCallback((transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  }, []);

  // Handle delete transaction
  const handleDelete = useCallback(async (transactionId) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await api.delete(`/transactions/${transactionId}`);
      // Refresh transactions list
      fetchTransactions();
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to delete transaction';
      alert(errorMessage);
    }
  }, [fetchTransactions]);

  // Handle form submission (create or update)
  const handleFormSubmit = useCallback((transaction) => {
    // Refresh transactions list
    fetchTransactions();
    // Close form and clear editing state
    setShowForm(false);
    setEditingTransaction(null);
  }, [fetchTransactions]);

  // Handle form cancel
  const handleFormCancel = useCallback(() => {
    setShowForm(false);
    setEditingTransaction(null);
  }, []);

  // Handle new transaction button
  const handleNewTransaction = useCallback(() => {
    setEditingTransaction(null);
    setShowForm(true);
  }, []);

  // Determine user role
  const userRole = user?.role || 'read-only';

  // Determine whether user can create transactions
  const canCreate = () => {
    return userRole === 'admin' || userRole === 'user';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
                <p className="text-gray-600">Manage your income and expenses</p>
              </div>
              {canCreate() && (
                <button
                  onClick={handleNewTransaction}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Transaction
                </button>
              )}
            </div>

            {total > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Total transactions: <span className="font-medium ml-1">{total}</span>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Transaction Form Modal */}
          {showForm && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                  className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                  style={{ zIndex: -1 }}
                  onClick={handleFormCancel}
                  aria-hidden="true"
                ></div>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>

                {/* Modal panel */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                  <TransactionForm
                    transaction={editingTransaction}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    userRole={userRole}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="mb-6">
            <TransactionFilters
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
          </div>

          {/* Transaction List */}
          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={loading}
            userRole={userRole}
          />
        </div>
      </main>
    </div>
  );
}

export default TransactionsPage;
