import { UploadWithAI } from "@/app/services/BillService";
import { ErrorResponse, SuccessResponse } from "@/app/utils/responseHandler";
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id')!;
        const formData = await request.formData(); // Get form data from the request

        // Call the UploadWithAI function and pass formData and token
        const bill = await UploadWithAI(formData, userId);

        // Return success response
        if (!bill) {
            return ErrorResponse("Bill data is missing from the response", 500);
        }

        // Return success response with bill data
        return SuccessResponse(bill);

    } catch (error: any) {
        
        console.error("Error in API handler:", error.message);
        // Return error response with the error message
        return ErrorResponse(error.message,500);
    }
}
