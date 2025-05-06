import { NextRequest } from 'next/server';
import { getSpendingSummary } from "@/app/services/BillService";
import { ErrorResponse, SuccessResponse } from '@/app/utils/responseHandler';
import { MonthlyPieChartSchema } from '@/validation/piechart.monthly';

//GET api/stats - get stats on top 4 cards.
export async function GET(request: NextRequest) {
    try {
        
        const userId = request.headers.get('x-user-id');
        
        if (!userId) {
            return ErrorResponse( "User not provided" ,400);
        }
    
        // Fetch stats of user
        const spendingSummary = await getSpendingSummary(userId);
    
        return SuccessResponse(spendingSummary);
  
    } catch (error: unknown) {
        console.error("Error GET api/bills/stats:", error);
        return ErrorResponse("Internal Server Error", 500);
    }
  }
  





