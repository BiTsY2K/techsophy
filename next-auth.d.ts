// import { JWT } from "next-auth/jwt";
import NextAuth, { type DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";

export type ExtendedUser = {
  role: UserRole;
  isTwoFAEnabled: boolean;
  isOAuthAccount: boolean;
} & DefaultSession["user"];

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
  }
}
