"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaCircleUser } from "react-icons/fa6";
import { WiAlien } from "react-icons/wi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ExitIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import clsx from "clsx";

export default function NavigationBar() {
  const session = useSession();
  const pathname = usePathname();

  const links = [
    { title: "Dashboard", href: "/admin" },
    { title: "Server", href: "/server" },
    { title: "Client", href: "/client" },
    { title: "Settings", href: "/settings" },
  ];

  const logOut = async () => {
    signOut();
  };

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <WiAlien className="h-10 w-10" />
          <span className="sr-only">Alien Inc</span>
        </Link>
        {links.map(({ href, title }, index) => (
          <Link
            key={index}
            href={href}
            className={clsx("transition-colors hover:text-foreground", pathname === href ? "text-foreground" : "text-muted-foreground")}
          >
            {title}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <HamburgerMenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
              <WiAlien className="h-6 w-6" />
              <span className="sr-only">Alien Inc</span>
            </Link>
            {links.map(({ href, title }, index) => (
              <Link
                key={index}
                href={href}
                className={clsx("transition-colors hover:text-foreground", pathname === href ? "text-foreground" : "text-muted-foreground")}
              >
                {title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="ml-auto">
            <Button variant="secondary" size="icon" className="p-0 rounded-full">
              <Avatar>
                <AvatarImage src={session?.data?.user.image || ""} />
                <AvatarFallback className="">
                  <FaCircleUser className="text-3xl text-primary rounded-full bg-secondary" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={"/server"}>Server</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={"/client"}>Client</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={"/settings"}>Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logOut()}>
              <ExitIcon className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
