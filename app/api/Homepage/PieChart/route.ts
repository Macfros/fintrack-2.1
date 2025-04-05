import { NextRequest, NextResponse } from 'next/server';
import { ErrorResponse, SuccessResponse } from '@/app/utils/responseHandler';
import { PieChartData } from '@/app/Services/DashBoardService';

// Fetch all bills for a user


// POST request handler
  export async function GET(request: NextRequest) {
    try {
      // Since middleware already ensures authentication, extract userId from request headers
      const userId = request.headers.get("x-user-id");

      if (!userId) {
        return NextResponse.json({ message: "User ID missing from request" }, { status: 400 });
      }

      const month = new Date().getMonth();
      const year = new Date().getFullYear();
      // Fetch bills
      const piechartData = await PieChartData(userId, month, year);
      
      if (!piechartData) {
        return NextResponse.json({ message: "No bills found" }, { status: 404 });
      }

      return SuccessResponse(piechartData);

    } catch (error) {
      console.log(error);
      return ErrorResponse("Internal Server Error",500);
    }
  }
