import { GOOGLE_CLIENT_SECRET } from "./constants/index";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../../prisma/prisma";
import { GOOGLE_CLIENT_ID } from "./constants";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    authorized: async ({ auth }: { auth: any }) => {
      return !!auth;
    },
    jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
