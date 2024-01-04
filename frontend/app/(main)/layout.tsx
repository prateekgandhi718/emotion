// This layout file is inside of the main folder. So whatever you put inside the main folder, this layout will be applied to it. Think of this as, an index.js for the code inside the main folder. Since this app contains auth, we need everything which is inside of the main folder to be protected. So do the redirection logic here.

// Also, it is not an antipattern if you use many client components. Since if there are large number of users in your app, you also have to have large number of client components to execute javascript on thier browsers. If there are a lot of server components, compute would happen on the server and they would charge you for it.

"use client";

import { Spinner } from "@/components/spinner";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Navigation from "./_components/navigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect to landing page, if not authenticated.
  if (status === "unauthenticated") {
    return redirect("/");
  }

  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
        <Navigation />
      <main className="flex-1 h-full overflow-y-auto">{children}</main>
    </div>
  );
};

export default MainLayout;
