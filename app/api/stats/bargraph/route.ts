import { ErrorResponse, SuccessResponse } from "@/app/utils/responseHandler";
import { NextRequest, NextResponse } from "next/server";
import { GraphData } from "@/app/services/DashBoardService";
import { BarGraphSchema } from "@/validation/bargraph";


export async function POST(request: NextRequest) {
    try{
        
        const userId = request.headers.get("x-user-id");  

        if (!userId) {
        return NextResponse.json({ message: "User ID missing from request" }, { status: 400 });
        }

        const body = await request.json();
        const result = await BarGraphSchema.safeParse(body);

        if(!result.success){
            return ErrorResponse(`Validation Error:+ ${result.error.flatten()}`, 400);
        }

        const Graph = await GraphData(userId, body.year);
        
        if (!GraphData) {
        return NextResponse.json({ message: "No bills found" }, { status: 404 });
        }

        return SuccessResponse(Graph);
              
    } catch(error){
        console.log("Error in GET api/stats/bargraph:",error);
        return ErrorResponse("Internal Server Error",500);
    }
  }
