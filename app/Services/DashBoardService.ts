import { prisma } from '@/lib/database';

export async function PieChartData(userId: string, month: number, year: number){
    try {
      const startOfMonth = new Date(year, month, 1); // Adjust month to 0-based index
      const startOfNextMonth = new Date(year, month + 1, 1);
      const startOfYear = new Date(year, 0, 1);
      const startOfNextYear = new Date(year + 1, 0, 1);
    
      // Parallel execution for better performance
      const [monthlyData, yearlyData] = await Promise.all([
        prisma.photo.groupBy({
          by: ["category"],
          where: {
            authorId: userId,
            createdAt: {
              gte: startOfMonth,
              lt: startOfNextMonth,
            },
          },
          _sum: { amount: true },
        }),
        prisma.photo.groupBy({
          by: ["category"],
          where: {
            authorId: userId,
            createdAt: {
              gte: startOfYear,
              lt: startOfNextYear,
            },
          },
          _sum: { amount: true },
        }),
      ]);
    
      return { monthly: monthlyData, yearly: yearlyData };

    } catch (e) {
      console.error("Error in PieChartData:", e);
      return [];
    }
  }


  export async function GraphData(userId: string, year: number) {
    try {
      const graphData = await prisma.photo.groupBy({
        by: ["createdAt"],
        where: {
          authorId: userId,
          createdAt: {
            gte: new Date(year, 0, 1),    // Start of the year
            lt: new Date(year + 1, 0, 1),  // Start of the next year
          },
        },
        _sum: {
          amount: true,
        },
      });
  
      // Create an array of 12 elements, each representing the total money spent in that month
      const monthlyData = Array.from({ length: 12 }, (_, month) => {
        const monthData = graphData.filter(
          (data) => new Date(data.createdAt).getMonth() === month
        );
        return monthData.length > 0 
          ? monthData.reduce((sum, data) => sum + (data._sum.amount ?? 0), 0)
          : 0;
      });
  
      return monthlyData;
    } catch (error) {
      console.log("Error in GraphData", error);
      throw error;
    }
  }
  
  