import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../../prisma/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  session: { strategy: "jwt" },
});
