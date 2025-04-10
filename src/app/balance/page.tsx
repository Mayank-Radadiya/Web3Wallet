"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { ChevronDownIcon, Loader2 } from "lucide-react";
import { NextPage } from "next";
import { useRef, useState } from "react";

// Define the expected response structure
interface AccountData {
  result: {
    context: {
      apiVersion: string;
      slot: number;
    };
    value: {
      lamports?: number;
      owner?: string;
      executable?: boolean;
      rentEpoch?: number;
      space?: number;
    };
  };
  publicKey?: string; // We'll add this ourselves
}

const Page: NextPage = () => {
  const publicKeyRef = useRef<HTMLInputElement>(null);
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectNet, setSelectNet] = useState<string>("Mainnet");
  const [isLoading, setIsLoading] = useState(false);

  const checkBalance = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const publicKey = publicKeyRef.current?.value;
      if (!publicKey) {
        setError("Please enter a public key");
        return;
      }

      const response = await axios.post("/api/getBalance", {
        data: {
          publicKey,
          network: selectNet,
        },
      });

      // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
      const dataWithPublicKey = {
        ...response.data,
        publicKey,
      };
      setAccountData(dataWithPublicKey);
    } catch (err) {
      setError(
        "Failed to fetch balance. Please check the public key and try again."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert lamports to SOL
  const formatBalance = (lamports?: number) => {
    if (!lamports) return "0.000000000";
    return (lamports / 1_000_000_000).toFixed(9);
  };

  return (
    <main className="text-black dark:text-[#f7f7f7] p-5">
      <div className="flex flex-col px-10 pt-14 justify-start w-full">
        <h1 className="text-5xl font-bold">
          Check Solana Account Balance Instantly
        </h1>
        <p className="text-2xl mt-4 font-semibold">
          Enter any Solana public key to fetch real-time balance details
          securely and quickly.
        </p>
      </div>

      <div className="px-10">
        <div className="mt-2">
          <Label className="text-sm opacity-75">Enter Public Key</Label>
          <div className="flex gap-4 mt-2 ">
            <Input
              ref={publicKeyRef}
              className="flex-1 h-12 text-[17px]"
              placeholder="EDYJBBTojUG....."
              type="text"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-32 h-12 justify-between">
                  {selectNet}
                  <ChevronDownIcon
                    className="-me-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width)">
                <DropdownMenuItem
                  onSelect={() => setSelectNet("Mainnet")}
                  className="cursor-pointer"
                >
                  Mainnet
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setSelectNet("Devnet")}
                  className="cursor-pointer"
                >
                  Devnet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={checkBalance} className="h-12" type="submit">
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Check Balance"
              )}
            </Button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>

      <div className="mt-10 px-10">
        <h2 className="text-2xl font-semibold">Balance Details</h2>
        <div className="mt-4">
          {accountData && (
            <div className="flex flex-col gap-3 p-4 rounded-lg">
              <p className="text-lg">
                Public Key:{" "}
                <span className="font-semibold break-all">
                  {accountData.publicKey}
                </span>
              </p>
              <p className="text-lg">
                Balance:{" "}
                <span className="font-semibold">
                  {formatBalance(accountData?.result?.value?.lamports || 0)} SOL
                </span>{" "}
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ({accountData?.result?.value?.lamports || 0} lamports)
                </span>
              </p>
              <p className="text-lg">
                Owner Program:{" "}
                <span className="font-semibold">
                  {accountData?.result?.value?.owner || "-"}
                </span>
              </p>
              <p className="text-lg">
                Executable:{" "}
                <span className="font-semibold">
                  {accountData?.result?.value?.executable ? "Yes" : "No"}
                </span>
              </p>
              <p className="text-lg">
                Slot:{" "}
                <span className="font-semibold">
                  {accountData?.result?.context?.slot?.toLocaleString()}
                </span>
              </p>
              <p className="text-lg">
                Space:{" "}
                <span className="font-semibold">
                  {accountData?.result?.value?.space} bytes
                </span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                API Version: {accountData?.result?.context?.apiVersion}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Page;
