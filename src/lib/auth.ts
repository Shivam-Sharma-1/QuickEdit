import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions as any);
export { handlers as GET, handlers as POST };
