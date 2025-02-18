import { NextRequest } from 'next/server';
import { getSpendingSummary } from "@/app/Services/BillService";
import { ErrorResponse, SuccessResponse } from '@/app/utils/responseHandler';
import { getToken } from 'next-auth/jwt'; // Import getToken from next-auth/jwt



export async function POST(request: NextRequest) {
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        
     
      const userId = token?.sub; 
      //console.log("userID from token"+userId);
      if (!userId) {
        return ErrorResponse( "User not provided" ,400);
      }
  
      // Fetch bills for the user
      const spendingSummary = await getSpendingSummary(userId);
  
      // Handle case when no bills are found
    //   if (!bills || bills.length === 0) {
    //     console.log("No Bills returned in POST Request server side");
    //     return NextResponse.json({ message: "No bills found" }, { status: 404 });
    //   }
  
      // Return the bills if found
      return SuccessResponse(spendingSummary);
  
    } catch (error: unknown) {
      console.error("Error in API handler:", error);
      return ErrorResponse("Internal Server Error", 500 );
    }
  }
  