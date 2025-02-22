"use server";

import { auth } from "@/auth";
import { z } from "zod";
import { ZodSettingSchema } from "@/lib/schemas";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail, getUserById } from "@/lib/data/user";
import { sendVerificationEmail } from "@/lib/send-mail";
import prisma from "@/lib/prismaDB";
import bcrypt from "bcryptjs";

export const settings = async (data: z.infer<typeof ZodSettingSchema>) => {
  const session = await auth();
  const user = session?.user;
  if (!user) return { success: false, message: "Unathorized! User not found.", status: 403 };

  const DBUser = await getUserById(user.id);
  if (!DBUser) return { success: false, message: "Unathorized! User not found.", status: 403 };

  if (user.isOAuthAccount) {
    data.email = data.password = data.confirmPassword = data.isTwoFAEnabled = undefined;
  }

  if (data.email && data.email !== user.email) {
    const existingUser = await getUserByEmail(data.email);
    if (existingUser) return { success: false, message: "CONFLICT ERROR! Email already in use.", status: 409 };

    const verificationToken = await generateVerificationToken(data.email);
    const sendEmail = await sendVerificationEmail({
      email: data.email,
      confirmationLink: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify_email?token=${verificationToken.token}`,
    });
  }

  if (data.password && data.confirmPassword && DBUser.password) {
    const passwordMatch = await bcrypt.compare(data.password, DBUser.password);
    if (!passwordMatch) {
      return { success: false, message: "New password matches your previous one. Please choose a different password." };
    }
    const hashedPassword = await bcrypt.hash(data.password, 12);
    data.password = hashedPassword;
    data.confirmPassword = undefined;
  }

  try {
    await prisma.user.update({
      where: { id: DBUser.id },
      data: { ...data },
    });
    return { success: true, message: "Settings updated.", status: 200 };
  } catch (error) {
    return { success: false, message: "Internal server error.", status: 500 };
  }
};
