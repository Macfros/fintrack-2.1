import { uploadBillManually } from '@/app/Services/BillService';
import { ErrorResponse, SuccessResponse } from '@/app/utils/responseHandler';
import { getToken } from 'next-auth/jwt'; // Use getToken for getting session in app directory

// Define the uploadBillManually function


// Handle the POST request
export async function POST(request: any) {
    try {
        const formData = await request.formData(); // Get form data from the request

        // Use getToken to retrieve the user's session token from the request
        const token = await getToken({ req: request });

        if (!token) {
            return ErrorResponse("Unauthorized",401);
        }

        // Pass the token to the uploadBillManually function
        const result = await uploadBillManually(formData, token);
        
        if (result == null) {
            return ErrorResponse("Error uploading bill",500);
        }

        return SuccessResponse(result);

    } catch (error) {
        console.error("Error in API handler:", error);
        return ErrorResponse("Internal Server Error",500);
    }
}
