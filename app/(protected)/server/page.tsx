import { auth } from "@/auth";
import Server from "@/components/Server";

export default async function AuthMasterServer() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="">
      <Server session={session} user={user} />
    </div>
  );
}
