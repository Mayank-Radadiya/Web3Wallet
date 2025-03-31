// components/SeedInput.tsx

"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDownIcon, Copy, Eye, EyeOff, TrashIcon } from "lucide-react";
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
  const [checkbox, setCheckbox] = useState(true);
  const [seed, setSeed] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [walletCount, setWalletCount] = useState(0);
  const [seedBit, setSeedBit] = useState("Select seed bit");
  const [keys, setKeys] = useState<SeedOutputProps[]>([]);
  const [show, setShow] = useState(false);
  console.log(show);

  const handleGenerateSeed = async () => {
    try {
      const { data } = await axios.post("/api/getSeed", {
        oldSeed: seedRef.current?.value,
        NumOfWords: checkbox,
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
              <TrashIcon className="-ms-1 opacity-60" size={16} />
            </Button>
          </div>
          {keys.length > 0 &&
            keys.map((item, index) => (
              <div key={index} className="mt-4">
                <p className="w-full border p-2 text-sm font-mono rounded">
                  <strong>Public Key:</strong> {item.publicKey}
                </p>
                <p className="w-full border p-2 text-sm font-mono rounded mt-2">
                  <strong>Secret Key:</strong> {item.secretKey}
                </p>
              </div>
            ))}
        </div>
      ) : (
        <div className="mt-2">
          <Label htmlFor="seedInput" className="text-sm">
            Enter your master seed
          </Label>
          <div className="flex gap-4 mt-2">
            <Input
              ref={seedRef}
              className="flex-1 h-12 text-[17px]"
              placeholder="car, cat, apple ..."
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
            {/* <Checkbox onClick={() => setCheckbox(!checkbox)} defaultChecked /> */}
            <Button onClick={handleGenerateSeed} className="h-12">
              {isLoading ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
