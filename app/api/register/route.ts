import bcrypt from "bcryptjs";
import prisma from "@/lib/prismaDB";
import { ZodSignUpSchema } from "@/lib/schemas";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/send-mail";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, confirmPassword } = {
    ...ZodSignUpSchema.safeParse(body).data,
  };

  if (!email || !password || !confirmPassword) {
    return new Response("CLIENT ERROR! Missing required fields", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return new Response("CONFLICT ERROR! Email already in use", { status: 409 });

  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    // Generate new email verification token.
    const verificationToken = await generateVerificationToken(user.email);

    // Send verification email wth verification link.
    const sendEmail = await sendVerificationEmail({
      email: user.email,
      confirmationLink: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify_email?token=${verificationToken.token}`,
    });

    return Response.json({ success: true, message: "A verification email Sent. Please check your inbox." }, { status: 200 });
  } catch (error: any) {
    return new Response("Internal server error occured. Please try again later.", { status: 500 });
  }
}
