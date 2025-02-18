import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { ErrorResponse, SuccessResponse } from '@/app/utils/responseHandler';
import { GetAllBills } from '@/app/Services/BillService';


// POST request handler
export async function POST(request: NextRequest) {
  try {
    // Extract user ID from NextAuth token
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const userId = token?.sub; 

    if (!userId) {
      return ErrorResponse("User not provided", 400);
    }

    // Fetch bills for the user
    const bills = await GetAllBills(userId);

    if (!bills.length) {
      console.warn(`No bills found for user: ${userId}`);
      return ErrorResponse("No bills found", 404);
    }

    return SuccessResponse(bills);
    
  } catch (error) {
    console.error("Error in API handler:", error);
    return ErrorResponse("Internal Server Error", 500);
  }
}
