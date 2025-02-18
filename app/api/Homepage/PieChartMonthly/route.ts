import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// Fetch all bills for a user
async function GetAllBills(userId: string) {
  try {
    const bills = await prisma.photo.findMany({
      where: { authorId: userId },
      include: { subitems: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!bills.length) console.log("No Bills returned in GetAllBills");

    return bills.map(bill => ({
      id: bill.id,
      name: bill.name,
      category: bill.category,
      amount: bill.amount,
      secure_url: bill.secure_url,
      createdAt: bill.createdAt,
      subItems: bill.subitems.map(subitem => ({
        name: subitem.name,
        amount: subitem.amount,
      })),
    }));
  } catch (e) {
    console.error("Error in GetAllBills:", e);
    return [];
  }
}

// POST request handler
export async function POST(request: NextRequest) {
  try {
    // Since middleware already ensures authentication, extract userId from request headers
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ message: "User ID missing from request" }, { status: 400 });
    }

    // Fetch bills
    const bills = await GetAllBills(userId);

    if (!bills.length) {
      return NextResponse.json({ message: "No bills found" }, { status: 404 });
    }

    return NextResponse.json(bills);
  } catch (error) {
    console.error("Error in API handler:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
