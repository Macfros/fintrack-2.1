"use client";

import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: { category: string; _sum: { amount: number } }[];
}

const PieChartMonthly: React.FC<PieChartProps> = ({ data }) => {
  if (!data || data.length === 0) return <p>No data available</p>;

  const labels = data.map((item) => item.category);
  const values = data.map((item) => item._sum.amount);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[90%] h-[90%]">
        <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default PieChartMonthly;
