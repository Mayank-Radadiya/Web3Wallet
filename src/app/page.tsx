"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className=" text-black dark:text-[#f7f7f7] p-5">
        <div className="flex flex-col  px-10 pt-14  justify-start w-full">
          <h1 className="text-5xl font-bold">Supports multiple blockchains</h1>
          <p className="text-2xl mt-4 font-semibold">
            Choose a blockchain to get started.
          </p>
        </div>
        <div className="flex  gap-4 py-4 px-10  justify-start w-full">
          <Link href={`/solana`}>
            <Button className="px-8 py-5 text-[20px]">Solana</Button>
          </Link>
          <Link href={`#`}>
            <Button className="px-8 py-5">More coming soon...</Button>
          </Link>
        </div>
      </main>
    </>
  );
}
