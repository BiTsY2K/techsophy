"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import { FaCircleUser } from "react-icons/fa6";
import { GoKebabHorizontal } from "react-icons/go";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UpdateProfileForm from "../_components/UpdateProfileForm";
import { DialogClose } from "@radix-ui/react-dialog";
import Client from "@/components/Client";

export default function AuthMasterClient() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <div className="">
      <Client />
    </div>
  );
}
