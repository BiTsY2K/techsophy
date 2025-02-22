"use client";

import React from "react";
import { FaCircleUser } from "react-icons/fa6";
import { GoKebabHorizontal } from "react-icons/go";

import { auth, signOut } from "@/auth";
import UpdateProfileForm from "@/app/(protected)/_components/UpdateProfileForm";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserRole } from "@prisma/client";
import { Session, User } from "next-auth";

export default function Server({
  session,
  user,
}: {
  session: Session | null;
  user:
    | ({
        role: UserRole;
        isTwoFAEnabled: boolean;
        isOAuthAccount: boolean;
      } & User)
    | undefined;
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const openDeleteDialog = () => setIsDeleteDialogOpen(true);
  const closeDeleteDialog = () => setIsDeleteDialogOpen(false);

  const logout = () => {
    signOut();
    setIsDeleteDialogOpen(false);
  };

  const openEditDialog = () => setIsEditDialogOpen(true);

  return (
    <React.Fragment>
      <Card className="container mt-12">
        <CardHeader>
          <CardTitle className="text-2xl">Auth Master Server</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Two Factor Authentication</TableHead>
                <TableHead>OAuth Account</TableHead>
                <TableHead className="hidden md:table-cell">Session Expires</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="hidden sm:table-cell ">
                  <Avatar className="h-16 w-16 mx-auto">
                    <AvatarImage
                      src={user?.image || undefined} // "https://ui.shadcn.com/placeholder.svg"
                      alt=""
                      className="aspect-square rounded-md object-cover"
                    />
                    <AvatarFallback>
                      <FaCircleUser className="h-full w-full text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="user ">
                    <div className="user-name">{user?.name || "Laser Lemonade Machine"}</div>
                    <div className="user-id text-xs">ID: {user?.id}</div>
                  </div>
                </TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell>{user?.role}</TableCell>
                <TableCell>{user?.isTwoFAEnabled ? <Badge variant="outline">ON</Badge> : <Badge>OFF</Badge>}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user?.isOAuthAccount ? "YES" : "NO"}</Badge>
                </TableCell>
                <TableCell>
                  {session?.expires &&
                    new Date(new Date(session?.expires).getTime() + 5.5 * 60 * 60 * 1000)
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
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <GoKebabHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={openEditDialog}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={openDeleteDialog}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              <TableRow></TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={() => setIsDeleteDialogOpen(!isDeleteDialogOpen)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
          </DialogHeader>
          <DialogDescription className="">
            This action cannot be undone. It won't delete this record but you will logged out from your account.
          </DialogDescription>
          <Separator className="w-0" />
          <DialogFooter>
            <Button size="lg" variant="outline" onClick={closeDeleteDialog}>
              Close
            </Button>
            {/* <DialogClose>Dialog Close</DialogClose> */}
            <Button size="lg" variant="destructive" onClick={logout}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Profile */}
      <Dialog open={isEditDialogOpen} onOpenChange={() => setIsEditDialogOpen(false)}>
        <DialogContent className="p-0 w-full max-w-md">
          <UpdateProfileForm />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
