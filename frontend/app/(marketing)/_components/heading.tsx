"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export const Heading = () => {
  const {status} = useSession()
  const handleEnterEmotion = () => {
    try {
      signIn("google")
    } catch (e) {
      console.log(e)
    }
  }
  
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your life, finances, social media and travel plans. Unified. Welcome to{" "}
        <span className="underline">Emotion</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Emotion summarizes your life from your email so that <br /> you could go live it.
      </h3>
      {status === "loading" && (
        <div className="w-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {status !== "loading"&& status === "unauthenticated" && (
        <Button onClick={handleEnterEmotion}>
          Get Emotion Free
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      )}
      {status !== "loading" && status === "authenticated" && (
        <Button asChild>
          <Link href="/documents">
            Enter Emotion
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
    </div>
  );
};
