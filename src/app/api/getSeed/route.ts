import { generateMnemonic } from "bip39";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // get number of wallet and which type of wallet
  const { oldSeed, NumOfWords } = body;

  const OldSeedArray = oldSeed.split(" ");

  if (!oldSeed) {
    const mnemonic = generateMnemonic(NumOfWords ? 128 : 256);
    const mnemonicArray = mnemonic.split(" ");
    return NextResponse.json({ mnemonicArray });
  } else {
    return NextResponse.json({ mnemonicArray: OldSeedArray });
  }
}
