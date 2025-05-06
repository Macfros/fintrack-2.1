//POST api/stats/monthly - get pie chart data for monthly
import { PieChartData } from '@/app/services/DashBoardService';
import { ErrorResponse, SuccessResponse } from '@/app/utils/responseHandler';
import { MonthlyPieChartSchema } from '@/validation/piechart.monthly';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
      const userId = request.headers.get("x-user-id");
      if (!userId) return ErrorResponse("User not provided", 400);
    
      const body = await request.json();
      const result = await MonthlyPieChartSchema.safeParse(body);
  
      if (!result.success) {
        return ErrorResponse(`Validation Error:+ ${result.error.flatten()}`, 400);
      }
      
      const data = await PieChartData(userId, body.month, body.year);
  
      return SuccessResponse(data);
      
    } catch (error) { 
      console.error("POST /api/stats/monthly error:", error);
      return ErrorResponse("Internal Server Error", 500);
    }
  }