  "use client";

  import { Pie } from "react-chartjs-2";
  import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

  Chart.register(ArcElement, Tooltip, Legend);

  interface PieChartProps {
    data: { category: string; _sum: { amount: number } }[];
  }

  const PieChart: React.FC<PieChartProps> = ({ data }) => {
    if (!data || data.length === 0) return <p>No data available</p>;

    const labels = data.map((item) => item.category);
    const values = data.map((item) => item._sum.amount);

    const chartData = {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF",
            "#8A2BE2", "#20B2AA", "#DC143C", "#FFD700", "#6495ED", "#FF4500"
          ],
          hoverBackgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF",
            "#8A2BE2", "#20B2AA", "#DC143C", "#FFD700", "#6495ED", "#FF4500"
          ],
        },
      ],
    };
    
    return (
      <div className="w-full h-[350px] flex justify-center items-center">  {/* Increased height */}
      <div className="w-[80%] h-[80%]">  {/* Adjust width & height */}
        <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
    );
  };

  export default PieChart;
