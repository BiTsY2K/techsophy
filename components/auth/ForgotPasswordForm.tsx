"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodForgotPasswordSchema } from "@/lib/schemas";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [isLoading, starTransition] = useTransition();

  const form = useForm<z.infer<typeof ZodForgotPasswordSchema>>({
    resolver: zodResolver(ZodForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: z.infer<typeof ZodForgotPasswordSchema>) => {
    starTransition(async () => {
      await axios
        .post("/api/forgot_password", data)
        .then((response) => {
          form.reset();
          toast.success(response.data.message);
          console.log("Response: ", response);
        })
        .catch((error) => {
          toast.error(error.response.data);
          console.log("Error: ", error);
        });
    });
  };

  return (
    <section className="flex flex-col min-h-screen items-center justify-between p-20">
      <Card className="w-full max-w-md mt-7 px-3">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password?</CardTitle>
          <CardDescription>No worries! Enter your email address and we'll send you a link to reset your password.</CardDescription>
          <Separator />
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <div className="grid gap-4">
                {/* Email field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid w-full max-w-sm items-center gap-2 space-y-0">
                      <Label htmlFor="email">Email address</Label>
                      <FormControl>
                        <Input type="email" {...field} aria-disabled={isLoading} disabled={isLoading} placeholder="john.doe@example.com" />
                      </FormControl>
                      <FormMessage className="leading-[1.2]" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4">
                {/* Send reset link button  */}
                <Button type="submit" size={"lg"} aria-disabled={isLoading} disabled={isLoading} className="w-full">
                  Send Reset Link
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
