"use client";

import {
  ChevronsLeftRight,
  Cloud,
  Github,
  LifeBuoy,
  LogOut,
} from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { getInitials } from "@/helpers/getInitialsFunc";
import { Spinner } from "@/components/spinner";
import Link from "next/link";

const UserItem = () => {
  const { data } = useSession();

  const handleLogout = () => {
    try {
      signOut();
    } catch (e) {
      console.log(e);
    }
  };

  if (data && data.user?.image && data.user.name) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            role="button"
            className="flex items-center text-sm p-3 w-full hover:bg-primary/5"
          >
            <div className="gap-x-2 flex items-center max-w-[150px]">
              <Avatar className="h-5 w-5">
                <AvatarImage src={data?.user?.image} />
                <AvatarFallback>{getInitials(data.user.name)}</AvatarFallback>
              </Avatar>
              <span className="text-start font-medium line-clamp-1">
                {data.user.name}&apos;s Emotion
              </span>
            </div>
            <ChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-80"
          align="start"
          alignOffset={11}
          forceMount
        >
          <div className="flex flex-col space-y-4 p-2">
            <p className="text-xs font-medium leading-none text-muted-foreground">
              {data.user.email}
            </p>
            <div className="flex items-center gap-x-2">
              <div className="rounded-md bg-inherit p-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={data.user.image} />
                  <AvatarFallback>{getInitials(data.user.name)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-1">
                <p className="text-sm line-clamp-1">
                  {data.user.name}&apos;s Emotion
                </p>
              </div>
            </div>
          </div>
          <DropdownMenuSeparator />
          <Link href="https://github.com/prateekgandhi718" target="_blank">
            <DropdownMenuItem className="cursor-pointer">
              <Github className="mr-2 h-4 w-4" />
              <span>GitHub</span>
            </DropdownMenuItem>
          </Link>
          <Link href="https://github.com/prateekgandhi718" target="_blank">
            <DropdownMenuItem className="cursor-pointer">
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem disabled>
            <Cloud className="mr-2 h-4 w-4" />
            <span>API</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    return <Spinner size="sm" />;
  }
};

export default UserItem;
