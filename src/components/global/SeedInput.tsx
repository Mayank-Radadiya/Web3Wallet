// components/SeedInput.tsx

"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronDownIcon,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  TrashIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface SeedOutputProps {
  secretKey: string;
  publicKey: string;
}

export default function SeedInput() {
  const seedRef = useRef<HTMLInputElement>(null);
  const [seed, setSeed] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [walletCount, setWalletCount] = useState(0);
  const [seedBit, setSeedBit] = useState("Select seed bit");
  const [keys, setKeys] = useState<SeedOutputProps[]>([]);
  const [show, setShow] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const handleGenerateSeed = async () => {
    try {
      setIsLoading(true);
      const numOfWords = seedBit === "12 words (128 bit)" ? true : false;
      const { data } = await axios.post("/api/getSeed", {
        oldSeed: seedRef.current?.value,
        NumOfWords: numOfWords,
      });
      setSeed(data.mnemonicArray);
      setWalletCount(walletCount + 1);
      handleGenerateKeypair(data.mnemonicArray);
      toast.success("Seed generated");
    } catch (error) {
      console.error("Error generating seed:", error);
      toast.error("Failed to generate seed");
    }
  };

  const handleGenerateKeypair = async (currentSeed: string[]) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/newWallet", {
        i: walletCount,
        seed: currentSeed,
      });
      setKeys([
        ...keys,
        { secretKey: data.privateKey, publicKey: data.publicKey },
      ]);
      setWalletCount(walletCount + 1);
      toast.success("Secret key generated");
    } catch (error) {
      console.error("Error generating keypair:", error);
      toast.error("Failed to generate keypair");
    }
    setIsLoading(false);
  };

  const handleClearSeed = () => {
    setSeed([]);
    setKeys([]);
    toast.success("Seed cleared");
  };

  const copySeed = () => {
    navigator.clipboard.writeText(seed.join(" ") || "");
    toast.success("Seed copied to clipboard");
  };

  return (
    <div>
      {seed.length > 0 ? (
        <div>
          <Accordion
            type="single"
            collapsible
            className="w-full border p-4 px-6  rounded-lg"
          >
            <AccordionItem value="1">
              <AccordionTrigger className="text-xl h-10 font-semibold hover:opacity-80">
                Your Secret Seed
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-6 gap-2 mt-4">
                  {seed.map((word, index) => (
                    <Button
                      variant="outline"
                      key={index}
                      className={cn(
                        "p-6 text-[15px] font-semibold",
                        show ? "blur-0" : " blur-[3px]"
                      )}
                    >
                      {word}
                    </Button>
                  ))}
                </div>
                <div className="flex justify-end mt-4 gap-x-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShow(!show)}
                    className="text-sm text-muted-foreground flex items-center gap-2"
                  >
                    {show ? (
                      <>
                        {" "}
                        <EyeOff /> Hide
                      </>
                    ) : (
                      <>
                        <Eye /> Show
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={copySeed}
                    className="text-sm text-muted-foreground flex items-center gap-2"
                  >
                    <Copy /> Copy
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="flex justify-end mt-8 gap-x-5">
            <Button onClick={() => handleGenerateKeypair(seed)}>
              Add More Wallet
            </Button>
            <Button variant="destructive" onClick={handleClearSeed}>
              <TrashIcon className="-ms-1 opacity-60" size={16} /> Clear All
            </Button>
          </div>
          {keys.length > 0 &&
            keys.map((item, index) => (
              <div key={index} className="mt-6 p-4 border rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Solana Wallet {index + 1}
                </h3>
                <div className="p-3  rounded-lg border border-gray-300 dark:border-gray-700 shadow">
                  <div className="text-sm font-mono flex items-center justify-between break-all">
                    <div>
                      <strong className="text-gray-600 dark:text-gray-400">
                        Public Key:
                      </strong>{" "}
                      {item.publicKey}
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(item.publicKey);
                        toast.success("Public key copied to clipboard");
                      }}
                      className="text-sm text-muted-foreground flex items-center gap-2 m-0"
                    >
                      <Copy />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 p-3  rounded-lg border border-gray-300 dark:border-gray-700 shadow">
                  <div className="text-sm font-mono flex items-center justify-between text-red-600 dark:text-red-400 break-all">
                    <div>
                      <strong className="text-gray-600 dark:text-gray-400">
                        Secret Key:
                      </strong>{" "}
                      <span
                        className={cn(showSecretKey ? "blur-0" : " blur-[3px]")}
                      >
                        {" "}
                        {item.secretKey}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        className="text-sm text-muted-foreground flex items-center gap-2"
                        onClick={() => setShowSecretKey(!showSecretKey)}
                      >
                        {showSecretKey ? <EyeOff /> : <Eye />}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(item.secretKey);
                          toast.success("Secret key copied to clipboard");
                        }}
                        className="text-sm text-muted-foreground flex items-center gap-2 m-0"
                      >
                        <Copy />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="mt-2">
          <Label htmlFor="seedInput" className="text-sm opacity-80">
            Enter your master seed if you have one
          </Label>
          <div className="flex gap-4 mt-2">
            <Input
              ref={seedRef}
              className="flex-1 h-12 text-[17px]"
              placeholder="car, cat, apple ...(leave blank for random seed)"
              type="password"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-40 h-12">
                  {seedBit}
                  <ChevronDownIcon
                    className="-me-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width)">
                <DropdownMenuItem
                  onSelect={() => setSeedBit("12 words (128 bit)")}
                >
                  12 words (128 bit)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setSeedBit("24 words (256 bit)")}
                >
                  24 words (256 bit)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleGenerateSeed} className="h-12">
              {isLoading ? <Loader2 className="animate-spin" /> : "Generate"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}