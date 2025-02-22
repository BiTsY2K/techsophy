import crypto from "crypto";
import prisma from "@/lib/prismaDB";
import { getResetTokenByIdentifier, getTwoFactorAuthTokenByIdentifier, getVerificationTokenByIdentifier } from "./data/token";

export async function generateVerificationToken(email: string) {
  const token = crypto.randomUUID({ disableEntropyCache: false });
  const expires = new Date(new Date().getTime() + 24 * 3600 * 1000);

  const existingToken = await getVerificationTokenByIdentifier(email);
  if (existingToken) await prisma.verificationToken.delete({ where: { id: existingToken.id } });

  const verificationToken = await prisma.verificationToken.create({
    data: { identifier: email, token, expires },
  });

  return verificationToken;
}

export async function generateResetToken(email: string) {
  const token = crypto.randomUUID({ disableEntropyCache: false });
  const expires = new Date(new Date().getTime() + 24 * 3600 * 1000);

  const existingToken = await getResetTokenByIdentifier(email);
  if (existingToken) await prisma.resetToken.delete({ where: { id: existingToken.id } });

  const resetToken = await prisma.resetToken.create({
    data: { identifier: email, token, expires },
  });

  return resetToken;
}

export async function generateTwoFactorAuthToken(email: string) {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + (3600 / 4) * 1000);

  const existingToken = await getTwoFactorAuthTokenByIdentifier(email);
  if (existingToken) await prisma.twoFactorAuthToken.delete({ where: { id: existingToken.id } });

  const twoFactorAuthToken = await prisma.twoFactorAuthToken.create({
    data: { identifier: email, token, expires },
  });

  return twoFactorAuthToken;
}
