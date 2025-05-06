import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { BarGraphResponse } from '@/app/models/Models';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartComponentProps {
  data: BarGraphResponse | undefined;
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({ data }) => {
  const labels = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Add validation for data
  if (!data) {
    return <div>Loading or invalid data...</div>;
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Money Spent',
        data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 5, // Make points more visible
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom sizing
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Spending Line Chart',
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Month' }
      },
      y: {
        title: { display: true, text: 'Money Spent' },
        beginAtZero: true
      },
    },
  };

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChartComponent;