import NextAuth from "next-auth";
import { authOptions } from "@/auth";

// This is the proper way to export the NextAuth handler in Next.js 13+ with the new app directory.
const handler = NextAuth(authOptions);

// Explicitly export the HTTP methods
export { handler as GET, handler as POST };