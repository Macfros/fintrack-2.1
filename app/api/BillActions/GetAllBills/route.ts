import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import getUser from '../../auth/[...nextauth]/Hooks/getUser';

export async function GetAllBills() {
  try {
    const user = await getUser(); // Ensure getUser is awaited if it's a promise
    const bills = await prisma.photo.findMany();

    if (bills.length === 0) {
      console.log("No Bills returned in GetAllBills");
    }

    return bills;
  } catch (e) {
    console.error("Error in GetAllBills:", e);
    return []; // Return an empty array in case of an error
  }
}

export async function POST(request: Request) {
  try {
    const bills = await GetAllBills(); // Await the async function

    if (!bills || bills.length === 0) {
      console.log("No Bills returned in POST Request server side");
      return NextResponse.json({ message: "No bills found" }, { status: 404 });
    }

    return NextResponse.json(bills); // Return the bills if found
  } catch (error) {
    console.error("Error in API handler:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
