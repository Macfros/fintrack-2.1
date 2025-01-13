import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database'; // Adjust the import path for your Prisma client
import { getToken } from 'next-auth/jwt'; // Use getToken for getting session in app directory
import { NextApiRequest } from 'next';
import { uploadImageToCloudinary } from '@/app/utils/UploadToCloudinary';

// Define the uploadBillManually function
const uploadBillManually = async (formData: FormData, token: any) => {
    try {
        const name = formData.get('name') as string;
        const category = formData.get('category') as string;
        const price = formData.get('amount') as string;
        const priceInt = parseFloat(price);
        const subItemsArray = JSON.parse(formData.get('subItems') as string);

        if (!token || !token.email) {
            throw new Error('User not authenticated');
        }

        // Fetch the user from the database using their email
        const user = await prisma.user.findUnique({
            where: {
                email: token.email,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }
        
        let secureUrl = "";
        const billImage = formData.get('billImage') as File | null;

        if (billImage) {
            // Upload the image to Cloudinary if it's provided
            secureUrl = await uploadImageToCloudinary(billImage) || "";
            console.log("API Secure url:",secureUrl);
        }
        
        // Create the photo record
        const newBill = await prisma.photo.create({
            data: {
                name: name,
                category: category,
                amount: priceInt,
                secure_url: secureUrl, // Add your logic to handle the secure_url if needed
                createdAt: new Date(),
                updatedAt: new Date(),
                authorId: user.id,
                subitems: {
                    create: subItemsArray.map((subitem: any) => ({
                        name: subitem.name,
                        amount: parseFloat(subitem.amount),
                    })),
                },
            },
            include: {
                subitems: true,  // Ensure that subitems are included in the result
            },
        });

        return newBill;

    } catch (error) {
        console.error("Error saving data:", error);
        return { message: "Error", status: 501 };
    }
};

// Handle the POST request
export async function POST(request: any) {
    try {
        const formData = await request.formData(); // Get form data from the request

        // Use getToken to retrieve the user's session token from the request
        const token = await getToken({ req: request });

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Pass the token to the uploadBillManually function
        const result = await uploadBillManually(formData, token);
        
        if (result == null) {
            return NextResponse.json({ message: "Error uploading bill" }, { status: 500 });
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error in API handler:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
