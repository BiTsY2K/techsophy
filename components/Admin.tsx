"use client";

import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { LuCheckCircle } from "react-icons/lu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { UserRole } from "@prisma/client";
import { admin } from "@/actions/admin";
import RoleGate from "@/components/auth/RoleGate";

export default function Admin() {
  const session = useSession();
  const user = session.data?.user;

  const [isPending, startTransition] = React.useTransition();

  const onAPIRouteClick = () => {
    startTransition(async () => {
      await axios
        .get("/api/admin")
        .then(() => toast.success("Allowed API Route!"))
        .catch(() => toast.error("Forbidden API Route!"));
    });
  };

  const onServerActionClick = async () => {
    startTransition(() => {
      admin().then((data) => {
        data.success ? toast.success(data.message) : toast.error(data.message);
      });
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="w-full max-w-5xl mx-auto grid gap-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <Alert className="border-emerald-500 text-emerald-500 ">
            <LuCheckCircle className="h-4 w-4 stroke-emerald-500" />
            <AlertTitle>Permission Granted!</AlertTitle>
            <AlertDescription>You have the necessary permissions to view this content.</AlertDescription>
          </Alert>
        </RoleGate>

        <div className="flex gap-4">
          <Alert className="flex  items-center justify-between shadow-md">
            <AlertTitle>Admin-only API route</AlertTitle>
            <Button onClick={onAPIRouteClick} disabled={isPending} aria-disabled={isPending}>
              Click to test
            </Button>
          </Alert>
          <Alert className="flex  items-center justify-between shadow-md">
            <AlertTitle>Admin-only server action</AlertTitle>
            <Button onClick={onServerActionClick} disabled={isPending} aria-disabled={isPending}>
              Click to test
            </Button>
          </Alert>
        </div>
      </div>
    </main>
  );
}
