import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prismaDB";
import { ZodSignInSchema } from "@/lib/schemas";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = ZodSignInSchema.safeParse(credentials);
        if (!validatedFields.success) {
          throw new Error("Invalid credentials.");
        }

        const { email, password } = validatedFields.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) throw new Error("Not found! User has not signed up.");

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) throw new Error("Access denied! Incorrect password.");

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
