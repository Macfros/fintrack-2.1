import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

import { getToken } from 'next-auth/jwt'; // Import getToken from next-auth/jwt


// Helper function to get current and previous month information
const getCurrentAndPreviousMonths = () => {
    const currentMonth = new Date().getMonth(); // 0 = January, 11 = December
    const currentYear = new Date().getFullYear();
    
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1; // December is 11
    const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    return { currentMonth, currentYear, previousMonth, previousMonthYear };
  };
  
async function getSpendingSummary(userId: string) {
    try {
        const now = new Date();
        const { currentMonth, currentYear, previousMonth, previousMonthYear } = getCurrentAndPreviousMonths();
        const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
        const startOfPreviousMonth = new Date(previousMonthYear, previousMonth, 1);
        const endOfPreviousMonth = new Date(currentYear, currentMonth, 0); // Last day of previous month

        // ✅ Single DB Query
        const result = await prisma.photo.groupBy({
            by: ['category'],
            _sum: { amount: true },
            where: { authorId: userId },
        });

        // ✅ Additional Query for Current & Previous Month Totals
        const monthlyResult = await prisma.photo.findMany({
            where: {
                authorId: userId,
                createdAt: { gte: startOfPreviousMonth },
            },
            select: { category: true, amount: true, createdAt: true },
        });

        // Initialize variables
        let totalSpent = 0;
        let currentMonthSpent = 0;
        let lastMonthSpent = 0;
        let mostSpentCategory = { category: "None", total: 0 };
        let miscellaneousSpent = 0;
        let lastMonthMiscellaneousSpent = 0;

        // Process grouped data
        for (const bill of result) {
            const category = bill.category;
            const amount = bill._sum.amount || 0;
            totalSpent += amount;

            // Most spent category
            if (amount > mostSpentCategory.total) {
                mostSpentCategory = { category, total: amount };
            }

            // Miscellaneous spent
            if (category === "Miscellaneous") {
                miscellaneousSpent = amount;
            }
        }

        // Process monthly data
        for (const bill of monthlyResult) {
            const billDate = new Date(bill.createdAt);
            if (billDate >= startOfCurrentMonth) {
                currentMonthSpent += bill.amount;
            } else if (billDate >= startOfPreviousMonth && billDate <= endOfPreviousMonth) {
                lastMonthSpent += bill.amount;
                if (bill.category === "Miscellaneous") {
                    lastMonthMiscellaneousSpent += bill.amount;
                }
            }
        }

        // ✅ Calculate Percentage Change for Current Month & Miscellaneous
        const currentMonthComparison =
            lastMonthSpent > 0
                ? ((currentMonthSpent - lastMonthSpent) / lastMonthSpent) * 100
                : 0;

        const miscellaneousComparison =
            lastMonthMiscellaneousSpent > 0
                ? ((miscellaneousSpent - lastMonthMiscellaneousSpent) / lastMonthMiscellaneousSpent) * 100
                : 0;

        return {
            totalAmount: totalSpent,
            currentMonthAmount: {
                amount: currentMonthSpent,
                comparison: lastMonthSpent > 0
                    ? `${Math.abs(currentMonthComparison).toFixed(2)}% ${currentMonthComparison >= 0 ? "more" : "less"} than last month`
                    : "No data for last month",
            },
            mostSpentCategory,
            miscellaneousSpent: {
                amount: miscellaneousSpent,
                comparison: lastMonthMiscellaneousSpent > 0
                    ? `${Math.abs(miscellaneousComparison).toFixed(2)}% ${miscellaneousComparison >= 0 ? "more" : "less"} than last month`
                    : "No data for last month",
            }
        };
    } catch (error) {
        console.error("Error fetching spending summary:", error);
        throw new Error("Failed to fetch spending summary");
    }
}



export async function POST(request: NextRequest) {
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        
     
      const userId = token?.sub; 
      //console.log("userID from token"+userId);
      if (!userId) {
        return NextResponse.json({ message: "User not provided" }, { status: 400 });
      }
  
      // Fetch bills for the user
      const spendingSummary = await getSpendingSummary(userId);
  
      // Handle case when no bills are found
    //   if (!bills || bills.length === 0) {
    //     console.log("No Bills returned in POST Request server side");
    //     return NextResponse.json({ message: "No bills found" }, { status: 404 });
    //   }
  
      // Return the bills if found
      return NextResponse.json(spendingSummary);
  
    } catch (error: unknown) {
      console.error("Error in API handler:", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  }
  