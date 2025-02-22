"use client";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import UpdateProfileForm from "../_components/UpdateProfileForm";
import Image from "next/image";
import ProfileCard from "../_components/ProfileCard";

export default function Setting() {
  return (
    <Card className="container mt-12">
      <CardHeader>
        <CardTitle className="text-2xl">Auth Master Settings</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex justify-around items-start">
        {/*  */}
        <div className="w-full max-w-sm mt-7 px-3 mx-auto">
          <ProfileCard />
        </div>

        <div className="w-full max-w-md mt-7 px-3 md:ml-auto">
          <UpdateProfileForm />
        </div>
      </CardContent>
    </Card>
  );
}
