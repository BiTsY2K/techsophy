import prisma from "@/lib/prismaDB";

export async function getVerificationTokenById(id: string) {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({ where: { id } });
    return verificationToken;
  } catch {
    return null;
  }
}

export async function getVerificationTokenByIdentifier(identifier: string) {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({ where: { identifier } });
    return verificationToken;
  } catch {
    return null;
  }
}

export async function getVerificationTokenByToken(token: string) {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({ where: { token } });
    return verificationToken;
  } catch {
    return null;
  }
}

export async function getResetTokenById(id: string) {
  try {
    const resetToken = await prisma.resetToken.findUnique({ where: { id } });
    return resetToken;
  } catch {
    return null;
  }
}

export async function getResetTokenByIdentifier(identifier: string) {
  try {
    const resetToken = await prisma.resetToken.findFirst({ where: { identifier } });
    return resetToken;
  } catch {
    return null;
  }
}

export async function getResetTokenByToken(token: string) {
  try {
    const resetToken = await prisma.resetToken.findFirst({ where: { token } });
    return resetToken;
  } catch {
    return null;
  }
}

/**
 * Retrieves a two-factor authentication token based on the provided token string.
 *
 * @param {string} token - The unique token string used to identify the two-factor authentication token.
 * @returns, A promise that resolves to the two-factor authentication token.
 */
export async function getTwoFactorAuthTokenByToken(token: string) {
  try {
    const twoFAToken = await prisma.twoFactorAuthToken.findUnique({ where: { token } });
    return twoFAToken;
  } catch {
    return null;
  }
}

/**
 * Retrieves a two-factor authentication token based on the provided identifier.
 *
 * @param {string} identifier - The unique identifier used to retrieve the two-factor authentication token.
 * @returns A promise that resolves to the two-factor authentication token.
 */
export async function getTwoFactorAuthTokenByIdentifier(identifier: string) {
  try {
    const twoFAToken = await prisma.twoFactorAuthToken.findFirst({ where: { identifier } });
    return twoFAToken;
  } catch {
    return null;
  }
}
