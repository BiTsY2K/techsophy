import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import React from "react";
import { FaCircleUser } from "react-icons/fa6";

export default function ProfileCard() {
  const session = useSession();
  const user = session.data?.user;
  console.log(session);
  return (
    <Card>
      <CardHeader>
        <Avatar className="h-20 w-20 mx-auto">
          <AvatarImage src={session?.data?.user.image || ""} />
          <AvatarFallback className="h-20 w-20">
            <FaCircleUser className="h-full w-full text-3xl text-primary rounded-full bg-secondary" />
          </AvatarFallback>
        </Avatar>
        <Separator className="w-0" />
        <div className="text-center mt-4">
          <CardTitle>{user?.name}</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-12  gap-1 items-center">
          <div className="col-span-2 font-semibold">ID</div>
          <div className="col-span-1">:</div>
          <div className="col-span-9">{user?.id}</div>
        </div>
        <div className="grid grid-cols-12 gap-1 items-center">
          <div className="col-span-2 font-semibold">Role</div>
          <div className="col-span-1">:</div>
          <div className="col-span-9">{user?.role}</div>
        </div>
        <div className="grid grid-cols-12 gap-1 items-center">
          <div className="col-span-2 font-semibold">2-FA</div>
          <div className="col-span-1">:</div>
          <div className="col-span-9">
            {user?.isTwoFAEnabled ? <Badge variant="secondary">ON</Badge> : <Badge variant="destructive">OFF</Badge>}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-1 items-center">
          <div className="col-span-2 font-semibold">OAuth </div>
          <div className="col-span-1">:</div>
          <div className="col-span-9">
            {user?.isOAuthAccount ? <Badge variant="secondary">YES</Badge> : <Badge variant="destructive">NO</Badge>}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-1 items-center">
          <div className="col-span-2 font-semibold">Expire </div>
          <div className="col-span-1">:</div>
          <div className="col-span-9">
            {session.data?.expires &&
              new Date(new Date(session.data?.expires).getTime() + 5.5 * 60 * 60 * 1000)
                .toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
                .replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$1-$2-$3")
                .replace(",", "")
                .toUpperCase()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
