import { PieChartData } from '@/app/services/DashBoardService';
import { ErrorResponse, SuccessResponse } from '@/app/utils/responseHandler';
import { MonthlyPieChartSchema } from '@/validation/piechart.monthly';
import { YearlyPieChartSchema } from '@/validation/piechart.yearly';
import { NextRequest } from 'next/server';

//POST api/stats/yearly - get pie chart data for yearly 
export async function POST(request: NextRequest) {
    try {
      const userId = request.headers.get("x-user-id");
      if (!userId) return ErrorResponse("User not provided", 400);
    
      const body = await request.json();
      const result = YearlyPieChartSchema.safeParse(body);
  
      if (!result.success) {
        return ErrorResponse(`Validation Error:+ ${result.error.flatten()}`, 400);
      }
  
       const data = await PieChartData(userId, new Date().getMonth(), body.year);
       
      return SuccessResponse(data);
      
    } catch (error) {
      console.error("POST /api/stats/monthly error:", error);
      return ErrorResponse("Internal Server Error", 500);
    }
  }