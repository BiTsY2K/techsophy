"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodPasswordResetSchema } from "@/lib/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { Label } from "../ui/label";
import Link from "next/link";

export default function PasswordResetForm() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof ZodPasswordResetSchema>>({
    resolver: zodResolver(ZodPasswordResetSchema),
    defaultValues: { new_password: "", confirm_new_password: "", token: searchParams.get("token") || undefined },
  });

  const onSubmit = async (data: z.infer<typeof ZodPasswordResetSchema>) => {
    setIsLoading(true);
    await axios
      .post("/api/reset_password", data)
      .then((response) => {
        toast.success(response.data, { position: "top-right" });
        console.log("Response: ", response);
      })
      .catch((error) => {
        toast.error(error.response.data, { position: "top-right" });
        console.log("Error: ", error);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <section className="flex flex-col min-h-screen items-center justify-between p-20">
      <Card className="w-full max-w-md mt-7 px-3">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>Create a new password for your account and confirm it to reset your password. </CardDescription>
          <Separator />
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <div className="field-container grid gap-4">
                {/* New password field */}
                <FormField
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem className="grid w-full max-w-sm items-center gap-2 space-y-0">
                      <Label htmlFor="new_password">New password</Label>
                      <FormControl>
                        <Input type="password" {...field} aria-disabled={isLoading} disabled={isLoading} placeholder="New password" />
                      </FormControl>
                      <FormMessage className="leading-[1.2]" />
                    </FormItem>
                  )}
                />

                {/* Confirm new password field */}
                <FormField
                  control={form.control}
                  name="confirm_new_password"
                  render={({ field }) => (
                    <FormItem className="grid w-full max-w-sm items-center gap-2 space-y-0">
                      <Label htmlFor="confirm_new_password">Confirm new password</Label>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          aria-disabled={isLoading}
                          disabled={isLoading}
                          placeholder="Confirm New password"
                        />
                      </FormControl>
                      <FormMessage className="leading-[1.2]" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4">
                {/* Reset password button */}
                <Button type="submit" size={"lg"} aria-disabled={isLoading} disabled={isLoading} className="w-full">
                  Reset to New Password
                </Button>

                {/* Back to login button  */}
                <Link href={"/"} className={`w-full bg-red ${isLoading ? "pointer-events-none" : ""}`}>
                  <Button size={"lg"} variant={"outline"} aria-disabled={isLoading} disabled={isLoading} className="w-full">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
