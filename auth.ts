import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/database";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";

// Define NextAuth options
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    // Email Provider using nodemailer
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],

  // Callbacks
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false; // Ensure the user has an email
  
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { accounts: true },
      });
  
      if (!account) {
        // If account is null (email magic link sign-in), just allow it
        return true;
      }
  
      if (existingUser) {
        const hasGoogleAccount = existingUser.accounts.some(
          (acc) => acc.provider === "google"
        );
  
        if (!hasGoogleAccount && account.provider === "google") {
          // Update user with Google name & image if available
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              name: user.name || existingUser.name, // Update name only if Google provides one
              image: user.image || existingUser.image, // Update image only if Google provides one
              accounts: {
                create: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  type: account.type,
                  access_token: account.access_token ?? null,
                },
              },
            },
          });
        }
        return true;
      }
  
      // If user does not exist, create a new one with Google details
      const newUser = await prisma.user.create({
        data: {
          email: user.email,
          name: user.name || user.email.split("@")[0], // Use email prefix as fallback name
          image: user.image || null, // Store profile image if available
          accounts: {
            create: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: account.type,
              access_token: account.access_token ?? null,
            },
          },
        },
      });
  
      return !!newUser; // Ensure sign-in succeeds
    },
  

    async session({ session, token }) {
      (session.user as { id: string }).id = token.id as string;
      return session;
    },

    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.username = user.email; // Set username as email
      }
      return token;
    },
  },

  // Use JWT for sessions
  session: {
    strategy: "jwt",
  },

  // Secret for NextAuth
  secret: process.env.NEXTAUTH_SECRET,

  // Enable debug mode in development
  debug: process.env.NODE_ENV === "development",
};


