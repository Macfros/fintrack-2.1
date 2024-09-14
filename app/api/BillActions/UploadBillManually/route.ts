// app/api/uploadBill/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database'; // Adjust the import path for your Prisma client
import getUser from '../../auth/[...nextauth]/Hooks/getUser';
// Adjust the import path for your user retrieval function

// Define the uploadBillManually function
const uploadBillManually = async (formData: FormData) => {
    try {
        const name = formData.get('name') as string;
        const category = formData.get('category') as string;
        const price = formData.get('amount') as string;
        const priceInt = parseFloat(price);
        const subItemsArray = JSON.parse(formData.get('subItems') as string);

        const user = await getUser();

        if (!user || !user.id) {
            throw new Error('User not authenticated');
        }

        // Create the photo record
        const photo = await prisma.photo.create({
            data: {
                name: name,
                category: category,
                amount: priceInt,
                secure_url: "", // Add your logic to handle the secure_url if needed
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
        });

        return { message: "Done", status: 200 };

    } catch (error) {
        console.error("Error saving data:", error);
        return { message: "Error", status: 501 };
    }
};

// Handle the POST request
export async function POST(request: Request) {
    try {
        const formData = await request.formData(); // Get form data from the request
        const result = await uploadBillManually(formData); // Call the function
        return NextResponse.json(result, { status: result.status });
    } catch (error) {
        console.error("Error in API handler:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}