import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"; // Import your NextAuth options
import { prisma } from "@/lib/database";
import type { NextApiRequest, NextApiResponse } from "next";

export const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Get session using getServerSession with authOptions, req, and res
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user) {
      return null; // No user found in the session
    }

    // Fetch user from the database using the session email
    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email as string,
      },
    });

    return user; // Return the user if found

  } catch (error) {
    console.error("Error fetching user:", error);
    return null; // Handle the error gracefully
  }
};

// Default API handler using the getUser function
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await getUser(req, res);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
}
