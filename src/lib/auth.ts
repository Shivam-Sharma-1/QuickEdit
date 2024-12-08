import { GOOGLE_CLIENT_SECRET } from "./constants/index";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../../prisma/prisma";
import { GOOGLE_CLIENT_ID } from "./constants";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
