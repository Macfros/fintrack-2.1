import { prisma } from '@/lib/database';
import { uploadImageToCloudinary } from '../utils/UploadToCloudinary';
import * as mindee from "mindee";
import { photo } from "@prisma/client";
import { JWT } from 'next-auth/jwt';

export async function DeleteBill(billId: string) {
    try {
        const result = await prisma.$transaction(async (prisma) => {
            // Delete the subitems associated with the bill
            await prisma.subitem.deleteMany({
              where: { photoId: billId }
            });

            // After subitems are deleted, delete the main photo entry
            const deletedBill = await prisma.photo.delete({
              where: { id: billId }
            });

            return deletedBill; // Return the deleted bill object
        });

        return result;

    } catch (e) {
      console.error("Error in DeleteBill:", e);
      throw new Error("Database Error");
    }
}



// Fetch all bills for a user
export async function GetAllBills(userId: string) {
  try {
    const bills = await prisma.photo.findMany({
      where: {
        authorId: userId, // Filter by the logged-in user's ID
      },
      include: {
        subitems: true, // Include the subItems relation
      },
      orderBy: {
        createdAt: 'desc', // Sort by createdDate in descending order
      },
    });

    if (bills.length === 0) {
      console.log("No Bills returned in GetAllBills");
    }

    // Map bills to exclude the subitem id
    const formattedBills = bills.map((bill) => ({
      id: bill.id,
      name: bill.name,
      category: bill.category,
      amount: bill.amount,
      secure_url: bill.secure_url,
      createdAt: bill.createdAt,
      subItems: bill.subitems.map((subitem) => ({
        name: subitem.name,
        amount: subitem.amount,
      })),
    }));

    return formattedBills;

  } catch (e: unknown) {
    console.error("Error in GetAllBills:", e);
    return []; // Return an empty array in case of an error
  }
}



const getCurrentAndPreviousMonths = () => {
    const currentMonth = new Date().getMonth(); // 0 = January, 11 = December
    const currentYear = new Date().getFullYear();
    
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1; // December is 11
    const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    return { currentMonth, currentYear, previousMonth, previousMonthYear };
  };
  
export async function getSpendingSummary(userId: string) {
    try {
        const now = new Date();
        const { currentMonth, currentYear, previousMonth, previousMonthYear } = getCurrentAndPreviousMonths();
        const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
        const startOfPreviousMonth = new Date(previousMonthYear, previousMonth, 1);
        const endOfPreviousMonth = new Date(currentYear, currentMonth, 0); // Last day of previous month

        // ✅ Single DB Query
        const result = await prisma.photo.groupBy({
            by: ['category'],
            _sum: { amount: true },
            where: { authorId: userId },
        });

        // ✅ Additional Query for Current & Previous Month Totals
        const monthlyResult = await prisma.photo.findMany({
            where: {
                authorId: userId,
                createdAt: { gte: startOfPreviousMonth },
            },
            select: { category: true, amount: true, createdAt: true },
        });

        // Initialize variables
        let totalSpent = 0;
        let currentMonthSpent = 0;
        let lastMonthSpent = 0;
        let mostSpentCategory = { category: "None", total: 0 };
        let miscellaneousSpent = 0;
        let lastMonthMiscellaneousSpent = 0;

        // Process grouped data
        for (const bill of result) {
            const category = bill.category;
            const amount = bill._sum.amount || 0;
            totalSpent += amount;

            // Most spent category
            if (amount > mostSpentCategory.total) {
                mostSpentCategory = { category, total: amount };
            }

            // Miscellaneous spent
            if (category === "Miscellaneous") {
                miscellaneousSpent = amount;
            }
        }

        // Process monthly data
        for (const bill of monthlyResult) {
            const billDate = new Date(bill.createdAt);
            if (billDate >= startOfCurrentMonth) {
                currentMonthSpent += bill.amount;
            } else if (billDate >= startOfPreviousMonth && billDate <= endOfPreviousMonth) {
                lastMonthSpent += bill.amount;
                if (bill.category === "Miscellaneous") {
                    lastMonthMiscellaneousSpent += bill.amount;
                }
            }
        }

        // ✅ Calculate Percentage Change for Current Month & Miscellaneous
        const currentMonthComparison =
            lastMonthSpent > 0
                ? ((currentMonthSpent - lastMonthSpent) / lastMonthSpent) * 100
                : 0;

        const miscellaneousComparison =
            lastMonthMiscellaneousSpent > 0
                ? ((miscellaneousSpent - lastMonthMiscellaneousSpent) / lastMonthMiscellaneousSpent) * 100
                : 0;

        return {
            totalAmount: totalSpent,    
            currentMonthAmount: {
                amount: currentMonthSpent,
                comparison: lastMonthSpent > 0
                    ? `${Math.abs(currentMonthComparison).toFixed(2)}% ${currentMonthComparison >= 0 ? "more" : "less"} than last month`
                    : "No data for last month",
            },
            mostSpentCategory,
            miscellaneousSpent: {
                amount: miscellaneousSpent,
                comparison: lastMonthMiscellaneousSpent > 0
                    ? `${Math.abs(miscellaneousComparison).toFixed(2)}% ${miscellaneousComparison >= 0 ? "more" : "less"} than last month`
                    : "No data for last month",
            }
        };
    } catch (error) {
        console.error("Error fetching spending summary:", error);
        throw new Error("Failed to fetch spending summary");
    }
}


export const uploadBillManually = async (formData: FormData, token: any) => {
    try {
        const name = formData.get('name') as string;
        const rawCategory = formData.get("category") as string;
        const category = rawCategory?.trim() ? rawCategory : "Miscellaneous";
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


export const UploadWithAI = async (formData: FormData, token: JWT): Promise<boolean | photo> => {
    
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
        const resp = await mindeeClient.parse(mindee.product.ReceiptV5, inputSource);

        const bill = await prisma.photo.create({
            data: {
                name: resp.document.inference.prediction.supplierName.value || " ",
                category: resp.document.inference.prediction.category.value || "Miscellaneous",
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