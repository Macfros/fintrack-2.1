import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/database";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer"



export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }),
    Nodemailer({
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
  callbacks: {
    async signIn({ user }) {
      if (!user.name && user.email) {
        // Use the part before "@" as the default name
        const emailArray = user.email.split("@");
        user.name = emailArray[0];
      }
      return true;
    },
    async session({session, token, user}){
      return session;
    },
    jwt({token,account,user}){
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.username = (user).email;
      }
      return token;
    }
  },
  session: {
    strategy: "jwt",
},
secret: process.env.NEXTAUTH_SECRET,
debug: process.env.NODE_ENV === 'development'
},)
