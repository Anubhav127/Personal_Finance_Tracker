import { useState, useEffect } from 'react';
import api from '../services/api';
import PropTypes from 'prop-types';
import LoadingSpinner from '../components/LoadingSpinner';
import PieChart from '../components/PieChart';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import Navigation from '../components/Navigation';

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [trendsData, setTrendsData] = useState([]);

  // Fetch analytics data from API endpoints
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all analytics data in parallel
        const [monthlyResponse, categoryResponse, trendsResponse] = await Promise.all([
          api.get('/analytics/monthly'),
          api.get('/analytics/category'),
          api.get('/analytics/trends'),
        ]);

        setMonthlyData(monthlyResponse.data.months || []);
        setCategoryData(categoryResponse.data.categories || []);
        setTrendsData(trendsResponse.data.trends || []);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Calculate summary statistics using useMemo for expensive calculations
  const summaryStats = () => {
    if (!monthlyData || monthlyData.length === 0) {
      return {
        totalIncome: 0,
        totalExpense: 0,
        netBalance: 0,
      };
    }

    const totalIncome = monthlyData.reduce((sum, month) => sum + (month.income || 0), 0);
    const totalExpense = monthlyData.reduce((sum, month) => sum + (month.expense || 0), 0);
    const netBalance = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      netBalance,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your financial performance and trends</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Income</h3>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">₹{summaryStats().totalIncome.toFixed(2)}</p>
                </div>
                <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Expense</h3>
                  <p className="text-xl sm:text-2xl font-bold text-red-600">₹{summaryStats().totalExpense.toFixed(2)}</p>
                </div>
                <div className="p-2 sm:p-3 bg-red-100 rounded-full">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                </div>
              </div>
            </div>
            <div className={`bg-white rounded-lg shadow-sm p-4 sm:p-6 border-l-4 sm:col-span-2 lg:col-span-1 ${summaryStats().netBalance >= 0 ? 'border-blue-500' : 'border-orange-500'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Net Balance</h3>
                  <p className={`text-xl sm:text-2xl font-bold ${summaryStats().netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    ₹{summaryStats().netBalance.toFixed(2)}
                  </p>
                </div>
                <div className={`p-2 sm:p-3 rounded-full ${summaryStats().netBalance >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 sm:w-6 sm:h-6 ${summaryStats().netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} fill='currentColor' stroke="currentColor" viewBox="0 0 16 16">
                    <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Expense Breakdown by Category</h2>
              <div className="h-64 sm:h-80">
                <PieChart data={categoryData} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Monthly Spending Trends</h2>
              <div className="h-64 sm:h-80">
                <LineChart data={monthlyData} />
              </div>
            </div>
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Income vs Expense Comparison</h2>
              <div className="h-64 sm:h-80">
                <BarChart data={trendsData} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

DashboardPage.propTypes = {};

export default DashboardPage;
