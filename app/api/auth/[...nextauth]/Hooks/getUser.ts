import { auth } from "@/auth";
import type { NextApiRequest, NextApiResponse } from 'next';

export const getUser = async() => {
    const session = await auth();
        
    if(!session?.user) return null;

    const user = prisma?.user.findFirst({
        where: {
            email: session?.user?.email as string
        }
    });

    return user; 
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      const user = await getUser();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user' });
    }
  }


