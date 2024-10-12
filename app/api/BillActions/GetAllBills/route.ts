import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { getServerSession } from 'next-auth'; // Import getServerSession from next-auth

import { getToken } from 'next-auth/jwt'; // Import getToken from next-auth/jwt
import { authOptions } from '@/auth';

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

// POST request handler
export async function POST(request: NextRequest) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);

    // Get token from request using next-auth/jwt
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    // Extract userId from the token
    const userId = token?.sub; // 'sub' usually contains the user ID in JWT
    console.log("userID from tokem"+userId);

    // If no user is provided, return an error
    if (!userId) {
      return NextResponse.json({ message: "User not provided" }, { status: 400 });
    }

    // Fetch bills for the user
    const bills = await GetAllBills(userId);

    // Handle case when no bills are found
    if (!bills || bills.length === 0) {
      console.log("No Bills returned in POST Request server side");
      return NextResponse.json({ message: "No bills found" }, { status: 404 });
    }

    // Return the bills if found
    return NextResponse.json(bills);

  } catch (error: unknown) {
    console.error("Error in API handler:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
