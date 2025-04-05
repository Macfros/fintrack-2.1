import { ErrorResponse, SuccessResponse } from "@/app/utils/responseHandler";
import { NextRequest, NextResponse } from "next/server";
import { GraphData } from "@/app/Services/DashBoardService";



  export async function GET(request: NextRequest) {
    try{

         const userId = request.headers.get("x-user-id");
        
        if (!userId) {
        return NextResponse.json({ message: "User ID missing from request" }, { status: 400 });
        }

        const month = new Date().getMonth();
        const year = new Date().getFullYear();
        // Fetch bills
        const Graph = await GraphData(userId, year);
        
        if (!GraphData) {
        return NextResponse.json({ message: "No bills found" }, { status: 404 });
        }

        return SuccessResponse(Graph);
              
    } catch(error)
    {
        console.log(error);
        return ErrorResponse("Internal Server Error",500);
    }
  }
