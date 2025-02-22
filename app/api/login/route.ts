import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/lib/data/user";
import { DEFAULT_REDIRECT } from "@/lib/routes";
import { ZodSignInSchema } from "@/lib/schemas";
import { getTwoFactorAuthTokenByIdentifier } from "@/lib/data/token";
import { generateTwoFactorAuthToken, generateVerificationToken } from "@/lib/tokens";
import { sendTwoFactorAuthenticationEmail, sendVerificationEmail } from "@/lib/send-mail";
import { getTwoFactorAuthConfirmationByUserId } from "@/lib/data/two-factor-confirmation";
import prisma from "@/lib/prismaDB";

export async function POST(request: Request) {
  const body = await request.json();
  const validatedFields = ZodSignInSchema.safeParse(body);
  if (!validatedFields.success) return new Response("Invalid field(s) input.", { status: 400 });

  const { email, password, twoFAOtp } = validatedFields.data;
  if (!email || !password) return new Response("CLIENT ERROR! Missing required fields", { status: 400 });

  //
  const existingUser = await getUserByEmail(email);
  if (!existingUser) return new Response("Account not found. No user exists with " + email, { status: 400 });

  //
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);
    const sendEmail_verify = await sendVerificationEmail({
      email: existingUser.email,
      confirmationLink: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify_email?token=${verificationToken.token}`,
    });

    if (!sendEmail_verify.ok) return new Response("Error sending verification email. Try Login again.", { status: 500 });
    return Response.json(
      { success: true, message: `Please verify your email first. A verification link has been sent to '${existingUser.email}'` },
      { status: 200 }
    );
  }

  if (twoFAOtp && existingUser.isTwoFAEnabled && existingUser.email) {
    const twoFAToken = await getTwoFactorAuthTokenByIdentifier(existingUser.email);
    if (!twoFAToken) return new Response("Missing 2FA code.", { status: 400 });
    if (twoFAOtp !== twoFAToken.token) return new Response("2FA one-time password mismatched.", { status: 403 });

    // Check if the 2FA token has expired by comparing the expiration date with the current date.
    const hasExpired = new Date(twoFAToken.expires) < new Date();
    // If the token has exired return a JSON response with a 401 status code indicating the token has expired.
    if (hasExpired) {
      return Response.json(
        { success: false, message: "OTP expired! Login again with your credentials to request a new one." },
        { status: 401 }
      );
    }
    await prisma.twoFactorAuthToken.delete({ where: { id: twoFAToken.id } });

    const existingTwoFAConfirmation = await getTwoFactorAuthConfirmationByUserId(existingUser.id);
    if (existingTwoFAConfirmation) {
      await prisma.twoFactorAuthConfirmation.delete({ where: { id: existingTwoFAConfirmation.id } });
    }

    await prisma.twoFactorAuthConfirmation.create({ data: { userId: existingUser.id } });
  }

  if (!twoFAOtp && existingUser.isTwoFAEnabled) {
    const twoFAToken = await generateTwoFactorAuthToken(existingUser.email);
    const sendEmail_twoFA = await sendTwoFactorAuthenticationEmail({ email: existingUser.email, twoFactorOtp: twoFAToken.token });

    if (!sendEmail_twoFA) return new Response("Error sending 2FA code. Try Login again.", { status: 500 });
    return Response.json(
      { success: true, message: "Your 2FA OTP has been sent on your email address.", twoFactorAuth: true },
      { status: 200 }
    );
  }

  try {
    const callback = await signIn("credentials", {
      email,
      password,
      redirect: false,
      redirectTo: DEFAULT_REDIRECT,
    });
    return Response.json({ success: true, message: "SignedIn Successful!", callbackUrl: callback }, { status: 200 });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "AccessDenied":
          return new Response("Access Denied.", { status: 403 });
        case "CredentialsSignin":
          return new Response("Invalid credentials.", { status: 401 });
        case "CallbackRouteError":
          return new Response(error?.cause?.err?.message, {
            status: error?.cause?.err?.message.toLowerCase().includes("not found") ? 404 : 403,
          });
        default:
          console.log("err: ", error);
          return new Response("Something went wrong. Please try again!", { status: 400 });
      }
    }
    throw error;
  }
}
