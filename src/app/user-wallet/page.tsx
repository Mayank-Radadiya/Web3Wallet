"use client";
import { Button } from "@/components/ui/button";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Loader2, Plane, WalletIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { PublicKey } from "@solana/web3.js";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const publickeyRef = useRef<string | null>(null);

  const airdrop = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh

    const inputPublicKey = publickeyRef.current || publicKey?.toBase58();
    if (!inputPublicKey) {
      toast.error("Please enter a valid public key or connect a wallet");
      return;
    }

    let newPublicKey: PublicKey;
    try {
      newPublicKey = new PublicKey(inputPublicKey); // Convert string to PublicKey object
    } catch (err) {
      toast.error("Invalid public key format");
      return;
    }

    setLoading(true);
    try {
      if (!connected || !publicKey) {
        throw new Error("Wallet not connected");
      }

      // Request airdrop of 1 SOL (1_000_000_000 lamports) on Devnet
      await connection.requestAirdrop(newPublicKey, 1_000_000_000);
      toast.success("Airdrop successful! 1 SOL added to your wallet.");
    } catch (error) {
      console.error("Airdrop failed:", error);
      toast.error(`Airdrop failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {connected && (
        <div className="w-full p-6 px-10  text-black dark:text-[#f7f7f7]">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Plane className="w-8 h-8 text-black dark:text-[#f7f7f7]" />
            <h2 className="text-3xl font-semibold">Airdrop</h2>
          </div>

          {/* Airdrop Input Section */}
          <div className="w-full max-w-2xl mx-auto bg-black/90 border border-gray-700 rounded-xl p-6 shadow-lg">
            <form
              className="flex flex-col sm:flex-row items-center gap-4"
              onSubmit={airdrop}
            >
              <Input
                placeholder="Enter your public key"
                className="w-full bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:ring-gray-500 focus:border-gray-500"
                defaultValue={publicKey?.toBase58() || ""}
                onChange={(e) => {
                  publickeyRef.current = e.target.value;
                }}
                disabled={loading}
              />
              <Button
                type="submit"
                variant="default"
                className="w-full sm:w-auto bg-black border border-gray-800 text-white hover:bg-gray-800 disabled:bg-gray-700 disabled:text-gray-400 disabled:border-gray-700 transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <>
                    <Plane className="w-5 h-5 mr-2" />
                    Request Airdrop
                  </>
                )}
              </Button>
            </form>

            {/* Status/Info */}
            <p className="mt-4 text-sm text-gray-500 text-center">
              {publicKey
                ? "Enter a public key above to request testnet tokens"
                : "Please connect your wallet to request an airdrop"}
            </p>
          </div>
        </div>
      )}
      {/* Wallet connection card */}
      <div className="flex items-center justify-center p-4">
        <div className="bg-black/90 rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <WalletIcon className="w-8 h-8 text-white" />
              Solana Wallet
            </h1>
            <p className="text-gray-400">
              Connect your wallet to access the dApp
            </p>
          </div>

          {/* Wallet Button */}
          <div className="space-y-6 w-full items-center justify-center">
            <div className="w-full flex items-center justify-center">
              <WalletMultiButton
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 border ${
                  connected
                    ? "!bg-gray-700 !border-gray-600 hover:!bg-gray-600"
                    : "!bg-black !border-gray-800 hover:!bg-gray-800"
                }`}
              />
            </div>

            {/* Status Message */}
            <div className="text-center">
              <p className="text-sm text-gray-500 transition-all duration-300">
                {connected
                  ? "Wallet connected successfully!"
                  : "Please connect your Solana wallet"}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-600">
              Powered by Solana | Secure Web3 Connection
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
