import prisma from "@/lib/prismaDB";

export async function getUserById(id: string | undefined) {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  } catch {
    return null;
  }
}

export async function getUserByEmail(email: string | undefined) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch {
    return null;
  }
}
