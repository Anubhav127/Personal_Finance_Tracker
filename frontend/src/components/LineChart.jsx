import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useMemo } from 'react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

function LineChart({ data }) {
  // Prepare chart data with multiple lines for income and expense
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [
          {
            label: 'Income',
            data: [0],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4,
          },
          {
            label: 'Expense',
            data: [0],
            borderColor: '#F44336',
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            tension: 0.4,
          },
        ],
      };
    }

    // Extract labels (months) and data points
    const labels = data.map((item) => {
      // Format month label (e.g., "2024-01" -> "Jan 2024")
      if (item.month) {
        const [year, month] = item.month.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[parseInt(month) - 1]} ${year}`;
      }
      return item.period || 'Unknown';
    });

    const incomeData = data.map((item) => item.income || 0);
    const expenseData = data.map((item) => item.expense || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Expense',
          data: expenseData,
          borderColor: '#F44336',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [data]);

  // Chart options with interactive tooltips
  const options = useMemo(() => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            padding: window.innerWidth < 768 ? 10 : 15,
            font: {
              size: window.innerWidth < 768 ? 10 : 12,
            },
            usePointStyle: true,
            pointStyle: 'circle',
          },
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function (context) {
              const label = context.dataset.label || '';
              const value = context.parsed.y || 0;
              return `${label}: $${value.toFixed(2)}`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: window.innerWidth < 768 ? 10 : 12,
            },
            maxRotation: window.innerWidth < 768 ? 45 : 0,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              size: window.innerWidth < 768 ? 10 : 12,
            },
            callback: function (value) {
              return '$' + value.toFixed(0);
            },
          },
        },
      },
    }), []);

  // Handle empty data gracefully
  if (!data || data.length === 0) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-500 text-sm">No monthly data available</p>
        </div>
        <div className="absolute inset-0 opacity-30">
          <Line data={chartData} options={options} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full p-4">
      <Line data={chartData} options={options} />
    </div>
  );
}

LineChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string,
      period: PropTypes.string,
      income: PropTypes.number,
      expense: PropTypes.number,
      net: PropTypes.number,
    })
  ),
};

LineChart.defaultProps = {
  data: [],
};

export default LineChart;
