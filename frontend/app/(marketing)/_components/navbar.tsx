"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import Logo from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import Link from "next/link";
import DropdownMenuDemo from "@/components/profileDropdown";

const Navbar = () => {
  const scrolled = useScrollTop();
  const { data, status } = useSession();

  const handleEnterEmotion = () => {
    try {
      signIn("google")
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div
      className={cn(
        "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        {status === "loading" && <Spinner />}
        {status !== "loading" && status === "unauthenticated" && (
          <>
            <Button variant="ghost" size="sm" onClick={handleEnterEmotion}>
              Log in
            </Button>
          </>
        )}
        {status !== "loading" && status === "authenticated" && data.user?.image && data.user?.name && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/documents">Enter Emotion</Link>
            </Button>
            <DropdownMenuDemo data={data} />
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
