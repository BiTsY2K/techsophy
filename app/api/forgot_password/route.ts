import { getUserByEmail } from "@/lib/data/user";
import { ZodForgotPasswordSchema } from "@/lib/schemas";
import { sendPasswordResetEmail } from "@/lib/send-mail";
import { generateResetToken } from "@/lib/tokens";

export async function POST(request: Request) {
  const body = await request.json();
  const validatedFields = ZodForgotPasswordSchema.safeParse(body);
  if (!validatedFields.success) return new Response("Invalid email. Please enter a valid email address.", { status: 403 });

  const { email } = validatedFields.data;
  const user = await getUserByEmail(email);
  if (!user) return new Response("Account Not Registered.", { status: 404 });

  // Generate new password reset token.
  const resetToken = await generateResetToken(user.email);

  // Send password reset email with reset link.
  const isResetEmailSent = await sendPasswordResetEmail({
    email: user.email,
    resetLink: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset_password?token=${resetToken.token}`,
  });

  if (!isResetEmailSent.ok)
    return Response.json({ success: false, message: "Internal server error occured. Please try again later." }, { status: 500 });
  return Response.json({ success: true, message: "A Password Reset Email Sent. Please check your inbox." }, { status: 200 });
}
