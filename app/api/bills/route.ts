import { NextRequest } from 'next/server';
import { GetAllBills  } from '@/app/services/BillService';
import { SuccessResponse, ErrorResponse } from '@/app/utils/responseHandler';


// Fetch All Bills
export async function GET(request: NextRequest){
    try{
        //check for authenticated request
        const userId = request.headers.get('x-user-id');
        if(!userId){
            return ErrorResponse("Unauthenticated", 401);
        }

        //fetch bills
        const bills = await GetAllBills(userId);
        return SuccessResponse(bills);

    }catch (error: unknown) {
        console.error("GET api/bills", error);
        return ErrorResponse("Internal Server Error", 500);
    }
}

