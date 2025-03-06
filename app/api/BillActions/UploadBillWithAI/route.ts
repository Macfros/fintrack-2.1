import { UploadWithAI } from "@/app/Services/BillService";
import { ErrorResponse, SuccessResponse } from "@/app/utils/responseHandler";
import { getToken } from "next-auth/jwt";

export async function POST(request: any) {
    try {
        const formData = await request.formData(); // Get form data from the request

        // Use getToken to retrieve the user's session token from the request
        const token = await getToken({ req: request });

        if (!token) {
            return ErrorResponse("Unauthorized", 401);
        }

        // Call the UploadWithAI function and pass formData and token
        const bill = await UploadWithAI(formData, token);

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
