import { prisma } from '@/lib/database';

export async function PieChartMonthly(userId: string, month: number){
    try {
      const result = await prisma.photo.groupBy({
        by: ["category"],
        where: {
          authorId: userId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), month, 1), // Start of the month
            lt: new Date(new Date().getFullYear(), month + 1, 1), // Start of next month
          },
        },
        _sum: {
          amount: true,
        },
      });
  
      // Transform the result into a key-value object
      
      return result ;

    } catch (e) {
      console.error("Error in GetAllBills:", e);
      return [];
    }
  }