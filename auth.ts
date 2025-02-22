import NextAuth, { DefaultSession } from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prismaDB";
import { getTwoFactorAuthConfirmationByUserId } from "./lib/data/two-factor-confirmation";

// -------------- Session Extension: Manually creating data type for custom field -------------- //

import { JWT } from "next-auth/jwt";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
      isTwoFAEnabled: boolean;
      isOAuthAccount: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    isTwoFAEnabled?: boolean;
    isOAuthAccount?: boolean;
  }
}

// -------------- Session Extension: Manually creating data type for custom field -------------- //

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
    // error: "",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth signin without email verification.
      if (account?.provider !== "credentials" || account?.type !== "credentials") return true;

      const existingUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (!existingUser?.emailVerified) return false; // Prevent sing-in without email verification.

      // Check 2FA, if it is on prevent sign-in without 2FA confirmation.
      if (existingUser.isTwoFAEnabled) {
        const twoFAConfirmation = await getTwoFactorAuthConfirmationByUserId(existingUser.id);
        if (!twoFAConfirmation) return false;

        // Delete two factor authenticaton for next sign in.
        await prisma.twoFactorAuthConfirmation.delete({ where: { id: twoFAConfirmation.id } });
      }

      return true;
    },

    async jwt({ token, user }) {
      if (!token.sub) return token;

      const existingUser = await prisma.user.findUnique({ where: { id: token.sub } });
      if (!existingUser) return token;

      const existingOAuthAccount = await prisma.account.findFirst({ where: { userId: existingUser.id } });

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isOAuthAccount = !!existingOAuthAccount;
      token.isTwoFAEnabled = existingUser.isTwoFAEnabled;

      return token;
    },

    async session({ session, token, user }) {
      if (session.user && token.sub) session.user.id = token.sub;
      if (session.user && token.role) session.user.role = token.role;

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email || "";
        session.user.isTwoFAEnabled = token.isTwoFAEnabled || false;
        session.user.isOAuthAccount = token.isOAuthAccount || false;
      }

      return session;
    },
  },

  // debug: process.env.NODE_ENV !== "production",
});
