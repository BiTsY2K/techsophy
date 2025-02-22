"use client";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { BeatLoader } from "react-spinners";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";
import Link from "next/link";

export default function EmailVerificationForm() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verfication, setVerification] = useState({ verified: false, message: "Verifying" });
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (!token) {
      toast.error("Not found! Missing token.");
      setIsVerifying(false);
      return;
    }
    try {
      const response = await axios.get("/api/verify_email", { params: { token } });
      if (response.data.success) setVerification({ verified: true, message: response.data.message });
    } catch (error: any) {
      console.log("Error: ", error);
      setVerification({ verified: false, message: error.response.data.message || error.message });
    } finally {
      setIsVerifying(false);
    }
  }, [token]);

  useEffect(() => {
    const verifytoken = async () => await onSubmit();
    verifytoken();
  }, [onSubmit]);

  return (
    <section className="flex min-h-screen flex-col items-center justify-between p-20">
      <Card className="w-full max-w-md mt-7 px-3">
        <CardHeader>
          <CardTitle className="text-2xl">Verifiying Your Mail Address</CardTitle>
          <CardDescription>Please wait while we verify your email.</CardDescription>
          <Separator />
        </CardHeader>

        <CardContent className="flex justify-center">
          {isVerifying ? (
            <BeatLoader size={25} aria-label="Loading Spinner" />
          ) : (
            <div className="flex flex-col items-center gap-2 ">
              {verfication.verified ? (
                <IoCheckmarkCircleOutline className="text-7xl text-green-500 " />
              ) : (
                <IoCloseCircleOutline className="text-7xl text-red-500" />
              )}
              <div className="verification-text font-semibold text-center">{verfication.message}</div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Link href={"/"} className={`w-full ${isVerifying ? "pointer-events-none" : ""}`}>
            <Button size={"lg"} className="w-full" disabled={isVerifying} aria-disabled={isVerifying}>
              Back to Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
}
