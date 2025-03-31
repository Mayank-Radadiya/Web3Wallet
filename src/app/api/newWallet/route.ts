import { Keypair } from "@solana/web3.js";
import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { NextRequest, NextResponse } from "next/server";
import nacl from "tweetnacl";
import bs58 from "bs58";

interface RequestBody {
  seed: string[];
  i: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { seed, i } = body;

    if (!Array.isArray(seed) || seed.length === 0) {
      return NextResponse.json(
        { error: "Seed phrase must be a non-empty array of words" },
        { status: 400 }
      );
    }

    // Join seed phrase into a string
    const seedPhrase = seed.join(" ");

    // Convert mnemonic to seed buffer
    const seedBuffer = mnemonicToSeedSync(seedPhrase);

    // Use the standard Backpack Wallet derivation path
    const path = `m/44'/501'/${i}'/0'`;
    const derivedSeed = derivePath(path, seedBuffer.toString("hex")).key;

    // Generate keypair using the derived seed
    const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
    const keypair = Keypair.fromSecretKey(secretKey);

    // Encode private key in Base58 (Full 64-byte secret key, not just the seed)
    const privateKey = bs58.encode(secretKey);
    const publicKey = keypair.publicKey.toBase58();

    return NextResponse.json({ privateKey, publicKey }, { status: 200 });
  } catch (error) {
    console.error("Error generating keypair:", error);
    return NextResponse.json(
      {
        error: "Failed to generate keypair",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
