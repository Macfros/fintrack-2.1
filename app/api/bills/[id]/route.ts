import { DeleteBill } from '@/app/services/BillService';
import { ErrorResponse, SuccessResponse } from '@/app/utils/responseHandler';
import { NextRequest } from 'next/server';

//TODO:MAKE this route (in getallbills, dont extract all info. extract just table level info. and when view bill button is clicked  then extract all info)
//FETCH BILL BY ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }){
    try {
        const userId = req.headers.get("x-user-id");
        const { id } = params;

        if (!id) return ErrorResponse("Bill ID is required", 400);

        const bill = "Hello";
        
        if(!bill){
            return ErrorResponse("Bill not found",400);
        }

        return SuccessResponse(bill);
        
    } catch (error) {
        console.log("GET /api/bills/[id] error",error);
        return ErrorResponse("Internal Server Error",500);
    }
}

//DELETE BILL 
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) return ErrorResponse("Bill ID is required", 400);

    const deletedBill = await DeleteBill(id);

    if (!deletedBill) return ErrorResponse("Bill not found or could not be deleted", 404);

    return SuccessResponse(deletedBill, "Bill successfully deleted");

  } catch (error) {
    console.error("DELETE /api/bills/[id] error:", error);
    return ErrorResponse("Internal Server Error", 500);
  }
}
