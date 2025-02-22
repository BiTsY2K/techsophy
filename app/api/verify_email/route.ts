// Import the Prisma client instance to interact with the database
import prisma from "@/lib/prismaDB";

// Import helper functions to get user data and verification token data
import { getUserByEmail } from "@/lib/data/user";
import { getVerificationTokenByToken } from "@/lib/data/token";

/**
 * Handle GET request for email verification.
 * @param {Request} request - The incoming HTTP request object.
 * @returns {Promise<Response>} - The HTTP response object.
 */
export async function GET(request: Request): Promise<Response> {
  // Parse the URL and extract the 'token' query parameter.
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  //
  if (!token) return Response.json({ success: false, message: "Not found! Token is missing" }, { status: 400 });

  // Fetch the verification token details, and check whether if the token exists in the database.
  // If the token does not exist, return a JSON response with a 404 status code.
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) return Response.json({ success: false, message: "Invalid token! Token does not exist." }, { status: 404 });

  // Check if the token has expired by comparing the expiration date with the current date.
  const hasExpired = new Date(existingToken.expires) < new Date();
  // If the token has exired return a JSON response with a 401 status code indicating the token has expired.
  if (hasExpired) {
    return Response.json(
      { success: false, message: "Token expired! Login with your credentials to get a new verification link." },
      { status: 401 }
    );
  }

  // Fetch the user details using the email identifier from the token, and check whether the user exists in the database
  const existingUser = await getUserByEmail(existingToken.identifier);
  // If the user does not exist, return a JSON response with a 404 status code indicating the user has not signed up.
  if (!existingUser) {
    return Response.json({ success: false, message: "It seems user has not signed up with us." }, { status: 404 });
  }

  try {
    // Attempt to update the user's email verification status and email address in the database.
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { emailVerified: new Date(), email: existingToken.identifier },
    });

    // If update successful, delete the verification token from the database.
    await prisma?.verificationToken.delete({ where: { id: existingToken.id } });

    // Return a JSON response indicating the email verification was successful with a 200 status code.
    return Response.json({ success: true, message: "Email verified." }, { status: 200 });
  } catch (error) {
    // If an error occurs return a JSON response with a 500 status code indicating an internal server error.
    return Response.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
