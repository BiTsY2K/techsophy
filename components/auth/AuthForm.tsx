"use client";

// Importing custom components for UI enhancements.
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import * as z from "zod"; // Importing Zod for schema validation.
import { ZodSignInSchema, ZodSignUpSchema } from "@/lib/schemas"; // Importing custom Zod schemas for sign-in and sign-up forms.
import { useForm } from "react-hook-form"; // Importing react-hook-form for form state management.
import { zodResolver } from "@hookform/resolvers/zod"; // Importing zodResolver to integrate Zod with react-hook-form.

import axios from "axios"; // HTTP client for making API requests.
import toast from "react-hot-toast"; // Library for displaying toast notifications.
import Link from "next/link";
import React from "react"; // React hooks for managing state and transitions.
import { BsGithub, BsGoogle } from "react-icons/bs";

// Importing custom component for rendering social login buttons.
import { SocialButton } from "./SocialButton";
import { useRouter, useSearchParams } from "next/navigation";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export default function OnboardingAuthForm() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [isLoading, setIsLoading] = React.useState(false);
  const [showTwoFactor, setShowTwoFactor] = React.useState(false);
  const [requestNewCode, setRequestNewCode] = React.useState(false);
  const [variant, setVariant] = React.useState<"LOGIN" | "REGISTER">("LOGIN");

  const form = useForm<z.infer<typeof ZodSignUpSchema> | z.infer<typeof ZodSignInSchema>>(
    variant === "LOGIN"
      ? { resolver: zodResolver(ZodSignInSchema), defaultValues: { email: "", password: "" } }
      : { resolver: zodResolver(ZodSignUpSchema), defaultValues: { email: "", password: "", confirmPassword: "" } }
  );

  const toggleVariant = React.useCallback(() => {
    form.reset();
    setVariant(variant === "LOGIN" ? "REGISTER" : "LOGIN");
  }, [variant]);

  const onSubmit = async (data: z.infer<typeof ZodSignUpSchema> | z.infer<typeof ZodSignInSchema>) => {
    setIsLoading(true);
    if (variant === "REGISTER") {
      await axios
        .post("/api/register", data)
        .then((response) => {
          form.reset();
          console.log("Registration successful:", response.data);
          setVariant("LOGIN");
          // TODO: Toast the success message...
          // toast.success(
          //   <span>
          //     User successfully registered! <br />
          //     <span className="text-xs">{response.data.message}</span>
          //   </span>
          // );
        })
        .catch((error) => {
          // TODO: Toast the error message...
          console.error("Registration failed:", error.response.data);
          toast.error(
            <span>
              Registration failed! <br />
              <span className="text-xs">{error.response.data}</span>
            </span>
          );
        })
        .finally(() => setIsLoading(false));
    } else {
      if ("twoFAOtp" in data && data.twoFAOtp && requestNewCode) {
        data.twoFAOtp = undefined;
      }

      await axios
        .post("/api/login", data)
        .then((response) => {
          // TODO: Toast the success message...
          console.log("Auth Login Response:", response);
          toast.success(response.data.message);
          response.data?.twoFactorAuth ? setShowTwoFactor(true) : (window.location.href = callbackUrl || response.data?.callbackUrl);
        })
        .catch((error) => {
          form.reset();
          setShowTwoFactor(false);
          console.log("Login failed: ", error.response.data);
          // TODO: Toast the error message...
          toast.error(error.response.data);
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <Card className="w-full max-w-md mt-7 px-3">
      <CardHeader>
        {showTwoFactor ? (
          // Header and Description for Two-Factor Athentication From.
          <React.Fragment>
            <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
            <CardDescription>Please enter the One-Time Password (OTP) sent to your email to complete the login process.</CardDescription>
          </React.Fragment>
        ) : (
          // Header and Description for SignIn/SignUp From.
          <React.Fragment>
            <CardTitle className="text-2xl">{variant === "LOGIN" ? "Access" : "Create"} an account</CardTitle>
            <CardDescription>Enter your email below to {variant === "LOGIN" ? "access" : "create"} your account.</CardDescription>
          </React.Fragment>
        )}
        <Separator />
      </CardHeader>

      <CardContent className="grid gap-4">
        <Form {...form}>
          <form id="authform" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            {!showTwoFactor ? (
              // SignIn/SignUp form fields.
              <div className="grid gap-4">
                {/* Email field. */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid w-full max-w-sm items-center gap-2 space-y-0">
                      <Label htmlFor="email">Email</Label>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          aria-disabled={isLoading || showTwoFactor}
                          disabled={isLoading || showTwoFactor}
                          placeholder="john.doe@example.com"
                        />
                      </FormControl>
                      <FormMessage className="leading-[1.2]" />
                    </FormItem>
                  )}
                />

                {/* Password field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid w-full max-w-sm items-center gap-1.5 space-y-0">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        {variant === "LOGIN" && (
                          <Link tabIndex={1} href="/auth/forgot_password" className="ml-auto text-sm underline">
                            Forgot password?
                          </Link>
                        )}
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          aria-disabled={isLoading || showTwoFactor}
                          disabled={isLoading || showTwoFactor}
                          placeholder="********"
                        />
                      </FormControl>
                      <FormMessage className="leading-[1.2]" />
                    </FormItem>
                  )}
                />

                {/* Confirm Password field - Only for Registration form */}
                {variant === "REGISTER" && (
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="grid w-full max-w-sm items-center gap-1.5 space-y-0">
                        <Label htmlFor="password">Confirm Password</Label>
                        <FormControl>
                          <Input type="password" {...field} aria-disabled={isLoading} disabled={isLoading} placeholder="********" />
                        </FormControl>
                        <FormMessage className="leading-[1.2]" />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            ) : (
              // Two-Factor Authenticaton form OTP field.
              <FormField
                control={form.control}
                name="twoFAOtp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS} className="flex justify-between ">
                        <Label className="text-sm" htmlFor="twoFAOtp">
                          One-Time Password
                        </Label>
                        <InputOTPGroup className="ml-auto">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Haven't received yet?&nbsp;
                      <Button variant="ghost" className="h-0 px-0 underline font-normal hover:bg-transparent ">
                        <span className="text-primary">Request a new code.</span>
                      </Button>
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}

            <div className="grid gap-4">
              {/* Submit button */}
              <Button type="submit" size={"lg"} disabled={isLoading} className="w-full">
                {showTwoFactor ? "Verify Sign In Security Code" : variant === "LOGIN" ? "Sing in" : "Create account"}
              </Button>

              {/* Back to login button only in 2FA form */}
              {showTwoFactor && (
                <Button variant={"outline"} size={"lg"} disabled={isLoading} className="w-full" onClick={() => setShowTwoFactor(false)}>
                  Back to Login
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>

      {!showTwoFactor && (
        // SignIn/SignUp form footer.
        <CardFooter className="grid gap-4">
          <div className="grid gap-4">
            {/* Horizontal rule  */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or continue with</span>
              </div>
            </div>

            {/* Social SignIn Methods */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Github */}
              <SocialButton icon={BsGithub} provider="github">
                <span className="btn-label">Github</span>
              </SocialButton>

              {/* Google */}
              <SocialButton icon={BsGoogle} provider="google">
                <span className="btn-label">Google</span>
              </SocialButton>
            </div>
          </div>

          <div className="flex items-center text-sm justify-center">
            <div className="text-center" onClick={() => !isLoading && toggleVariant()}>
              <span className="variant_toggler">
                <span className="text-muted-foreground">{variant === "LOGIN" ? "Don't" : "Already!"} have an account?&nbsp;</span>
                <span className="cursor-pointer underline">
                  <Button variant="ghost" className="h-0 px-0 underline font-normal hover:bg-transparent ">
                    {variant === "LOGIN" ? "Sign Up." : "Sign In."}
                  </Button>
                </span>
              </span>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
