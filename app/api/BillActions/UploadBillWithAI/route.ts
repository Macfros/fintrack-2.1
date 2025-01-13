import { uploadImageToCloudinary } from "@/app/utils/UploadToCloudinary";
import { getToken, JWT } from "next-auth/jwt";
import { NextRequest, NextResponse } from 'next/server';
import * as mindee from "mindee";
import { prisma } from '@/lib/database';
import { BillModel } from "@/app/Models/Models";
import { photo } from "@prisma/client";


const UploadWithAI = async (formData: FormData, token: JWT): Promise<boolean | photo> => {
    
    const mindeeClient = new mindee.Client({ apiKey: process.env.MINDEE_API_KEY });

    let image = formData.get("file");
    if (!image) {
        throw new Error("No image file found in the form data");
    }

    // Proceed with image upload if it exists
    const imageUrl = await uploadImageToCloudinary(image);
    if(!imageUrl){
        throw new Error("Issue in uploading the image to cloud");
    }

    try {
        const inputSource = await mindeeClient.docFromUrl(imageUrl);
        const apiResponse = await mindeeClient.parse(mindee.product.ReceiptV5, inputSource);

        // Handle the response from Mindee API
        const resp = await apiResponse;

        const bill = await prisma.photo.create({
            data: {
                name: resp.document.inference.prediction.supplierName.value || "",
                category: resp.document.inference.prediction.category.value || " ",
                amount: resp.document.inference.prediction.totalAmount.value || 0,
                authorId: token?.id as string,  // Assuming token contains user information
                secure_url: imageUrl,
                subitems: {
                    createMany: {
                        data: resp.document.inference.prediction.lineItems.map(item => ({
                            name: item.description || "",
                            amount: item.totalAmount || 0
                        }))
                    }
                }
            },
            include: {
                subitems: true
            }
        });

        return Promise.resolve(bill); 

    } catch (error) {
        console.error("Error processing with Mindee:", error);
        throw new Error("Failed to process image with AI");
    }
}

export async function POST(request: any) {
    try {
        const formData = await request.formData(); // Get form data from the request

        // Use getToken to retrieve the user's session token from the request
        const token = await getToken({ req: request });

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Call the UploadWithAI function and pass formData and token
        const bill = await UploadWithAI(formData, token);

        // Return success response
        return NextResponse.json({ bill, status: "success" }, { status: 200 });

    } catch (error: any) {
        
        console.error("Error in API handler:", error.message);
        // Return error response with the error message
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}
