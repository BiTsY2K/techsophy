import { signOut } from "@/auth";

export async function GET() {
  console.log("signing out from server.");
  try {
    await signOut();
    return Response.json({ success: true, message: "LogOut successfully!" }, { status: 200 });
  } catch (error) {
    return new Response("Internal server error occured.", { status: 500 });
  }
}
