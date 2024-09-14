import getUser from "../auth/[...nextauth]/Hooks/getUser";
import { prisma } from "@/lib/database";



const uploadBillManually = async (formData: FormData) => {
    try {
        const name = formData.get('name') as string;
        const category = formData.get('category') as string;
        const price = formData.get('amount') as string;
        const priceInt = parseFloat(price);
        const subItemsArray = JSON.parse(formData.get('subitems') as string);

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
                createdAt: new Date(), // Ensure the date is in the correct format
                updatedAt: new Date(),
                authorId: user.id, // Use authorId to link to the User
                subitems: {
                    create: subItemsArray.map((subitem: any) => ({
                        name: subitem.name,
                        amount: parseFloat(subitem.amount), // Ensure amount is a number
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



