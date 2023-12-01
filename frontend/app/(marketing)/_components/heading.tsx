"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Heading = () => {
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your life, finances, social media and travel plans. Unified. Welcome to{" "}
        <span className="underline">Emotion</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Emotion summarizes your life from your email so that <br /> you could go live it.
      </h3>
      <Button>
        Enter Emotion
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};
