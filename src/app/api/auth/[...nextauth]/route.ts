import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { handlers } from "@/lib/auth";

export const {
  handlers: handler,
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
});

export const { GET, POST } = handlers;
