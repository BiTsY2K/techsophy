"use client";

import React from "react";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { RiProhibitedLine } from "react-icons/ri";

export default function RoleGate({ children, allowedRole }: { children: React.ReactNode; allowedRole: UserRole }) {
  const session = useSession();
  const role = session.data?.user.role;
  if (role !== allowedRole) {
    return (
      <Alert variant={"destructive"}>
        <RiProhibitedLine className="h-4 w-4" />
        <AlertTitle>Access Denied!</AlertTitle>
        <AlertDescription>
          You need administrative privileges to view this content. Please contact your administrator for access.
        </AlertDescription>
      </Alert>
    );
  }
  return <React.Fragment>{children}</React.Fragment>;
}
