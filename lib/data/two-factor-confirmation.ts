import prisma from "@/lib/prismaDB";

export async function getTwoFactorAuthConfirmationByUserId(userId: string) {
  try {
    const twoFactorConfirmation = await prisma.twoFactorAuthConfirmation.findUnique({ where: { userId } });
    return twoFactorConfirmation;
  } catch {
    return null;
  }
}
