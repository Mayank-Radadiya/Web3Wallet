"use client";

import { useEffect, useId, useState } from "react";
import { MoonIcon, SunIcon, Wallet } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "../ui/button";

const Navbar = () => {
  const id = useId();
  const { theme, setTheme } = useTheme();
  const [checked, setChecked] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <div className="flex items-center justify-between bg-transparent px-10 py-14 w-full h-16 text-black dark:text-[#f7f7f7]">
        <div className="flex items-center">
          <Link className="flex items-center" href="/">
            <Wallet className="text-black dark:text-white" />
            <h1 className="text-2xl font-bold text-black dark:text-[#f7f7f7] ml-2">
              Web3Wallet
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/user-wallet" className="rounded-md  ">
            <Button variant="ghost" className="text-black dark:text-[#f7f7f7]">
              Your wallet
            </Button>
          </Link>
          <Link href="/balance" className="rounded-md  ">
            <Button variant="ghost" className="text-black dark:text-[#f7f7f7]">
              Balance
            </Button>
          </Link>
          <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium">
            <Switch
              onClick={toggleTheme}
              id={id}
              checked={checked}
              onCheckedChange={setChecked}
              className="peer data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
            />
            <span className="pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full">
              <MoonIcon size={16} aria-hidden="true" />
            </span>
            <span className="peer-data-[state=checked]:text-background pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full">
              <SunIcon size={16} aria-hidden="true" />
            </span>
          </div>
          <Label htmlFor={id} className="sr-only">
            Labeled switch
          </Label>
        </div>
      </div>
    </>
  );
};

export default Navbar;
