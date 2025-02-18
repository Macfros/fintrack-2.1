import { DeleteBill } from '@/app/Services/BillService';
import { SuccessResponse, ErrorResponse } from '@/app/utils/responseHandler';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { id } = await request.json(); // Destructure id directly

        if (!id) {
            return ErrorResponse("Bill ID is required", 400);
        }

        const deletedBill = await DeleteBill(id);

        if (!deletedBill) {
            return ErrorResponse("Error in deleting bill", 500);
        }

        return SuccessResponse(deletedBill, "Bill successfully deleted");

    } catch (error) {
        console.error("Error deleting bill:", error);
        return ErrorResponse("Internal Server Error", 500);
    }
}
