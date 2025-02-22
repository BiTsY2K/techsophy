import bcrypt from "bcryptjs";
import prisma from "@/lib/prismaDB";
import { getResetTokenByToken } from "@/lib/data/token";
import { ZodPasswordResetSchema } from "@/lib/schemas";
import { getUserByEmail } from "@/lib/data/user";

export async function POST(request: Request) {
  const body = await request.json();
  const validatedFields = ZodPasswordResetSchema.safeParse(body);
  if (!validatedFields.success) return new Response("Invalid or mismatched password.", { status: 400 });

  const { new_password, token } = validatedFields.data;

  if (!token) return new Response("Invalid request! Token is missing.", { status: 400 });

  const existingToken = await getResetTokenByToken(token);
  if (!existingToken) return new Response("Not found! Token Does not exist.", { status: 404 });

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return new Response("The token has expired.", { status: 401 });

  const existingUser = await getUserByEmail(existingToken.identifier);
  if (!existingUser) return Response.json({ success: false, message: "It seems user has not signed up with us." }, { status: 404 });

  try {
    const hashedPassword = await bcrypt.hash(new_password, 12);
    await prisma.user.update({
      where: { email: existingToken.identifier },
      data: { password: hashedPassword },
    });
    await prisma.resetToken.delete({ where: { id: existingToken.id } });
    return Response.json({ success: true, message: "Password updated." }, { status: 200 });
  } catch (error) {
    return Response.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
