import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

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
      return null; // Return null in case of an error
    }
}

export async function POST(request: Request) {
    try {
        const bill = await request.json(); // Make sure you're reading the body correctly
        const deletedBill = await DeleteBill(bill.id);

        if (!deletedBill) {
            return NextResponse.json({ message: "Error in deleting bill" }, { status: 500 });
        }

        return NextResponse.json({ message: "Bill successfully deleted", deletedBill }, { status: 200 }); // Return the deleted bill

    } catch (error) {
        console.error("Error deleting bill:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
