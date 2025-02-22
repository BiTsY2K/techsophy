"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSettingSchema } from "@/lib/schemas";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { settings } from "@/actions/settings";
import { UserRole } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function UpdateProfileForm() {
  const [isPending, startTransition] = React.useTransition();
  const session = useSession();
  const user = session.data?.user;

  const form = useForm<z.infer<typeof ZodSettingSchema>>({
    resolver: zodResolver(ZodSettingSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      confirmPassword: undefined,
      isTwoFAEnabled: user?.isTwoFAEnabled,
      role: user?.role,
    },
  });

  const onSubmit = (data: z.infer<typeof ZodSettingSchema>) => {
    startTransition(async () => {
      settings(data).then((res) => {
        session.update();
        console.log("res:", res);
      });
    });
  };
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-2xl">Update Your Profile</CardTitle>
        <CardDescription>Modify your personal information to maintain accurate and current account records.</CardDescription>
        <Separator className="w-0" />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <div className="grid gap-4 place-items-center">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid md:grid-cols-4 w-full max-w-sm items-center gap-2 space-y-0">
                    <Label htmlFor="email">Name</Label>
                    <FormControl>
                      <React.Fragment>
                        <Input
                          type="name"
                          {...field}
                          className="md:col-span-3"
                          aria-disabled={isPending}
                          disabled={isPending}
                          placeholder="John Doe"
                        />
                        <FormMessage className="leading-[1.2]" />
                      </React.Fragment>
                    </FormControl>
                  </FormItem>
                )}
              />

              {!user?.isOAuthAccount && (
                <React.Fragment>
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid md:grid-cols-4 w-full max-w-sm items-center gap-2 space-y-0">
                        <Label htmlFor="email">Email</Label>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            className="md:col-span-3"
                            aria-disabled={isPending}
                            disabled={isPending}
                            placeholder="john.doe@example.com"
                          />
                        </FormControl>
                        <FormMessage className="leading-[1.2]" />
                      </FormItem>
                    )}
                  />

                  {/* Two-factor Authenticaton Field */}
                  <FormField
                    control={form.control}
                    name="isTwoFAEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start  justify-between max-w-sm">
                        <div className="space-y-0.5">
                          <Label>Two-Factor Authentication</Label>
                          <FormDescription className="leading-[1.2]">
                            Enable 2FA for added account security with a second verification step during login.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid md:grid-cols-4 w-full max-w-sm items-center gap-2 space-y-0">
                        <Label htmlFor="password">New password</Label>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            className="md:col-span-3"
                            aria-disabled={isPending}
                            disabled={isPending}
                            placeholder="************"
                          />
                        </FormControl>
                        <FormMessage className="leading-[1.2]" />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password Field */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="grid md:grid-cols-4 w-full max-w-sm items-center gap-2 space-y-0">
                        <Label htmlFor="confirmPassword">Confirm new password</Label>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            className="md:col-span-3"
                            aria-disabled={isPending}
                            disabled={isPending}
                            placeholder="************"
                          />
                        </FormControl>
                        <FormMessage className="leading-[1.2]" />
                      </FormItem>
                    )}
                  />
                </React.Fragment>
              )}

              {/* User role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="grid md:grid-cols-4 w-full max-w-sm items-center gap-2 space-y-0">
                    <Label htmlFor="role">Role</Label>
                    <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full md:col-span-3">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="col-span-3">
                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                        <SelectItem value={UserRole.USER}>User</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4">
              <Button size={"lg"} disabled={isPending}>
                Update details
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
