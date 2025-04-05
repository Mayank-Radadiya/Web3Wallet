import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const publicKey = data.data.publicKey;
    const network = data.data.network;

    if (!publicKey || publicKey === "") {
      return new NextResponse("Public key is required", { status: 400 });
    }

    const url =
      network === "Mainnet"
        ? "https://solana-mainnet.g.alchemy.com/v2/zeY7qraQHouGaPLnz8JXWKMLQOYc4PEQ"
        : "https://solana-devnet.g.alchemy.com/v2/zeY7qraQHouGaPLnz8JXWKMLQOYc4PEQ";

    const response = await axios.post(
      url,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "getAccountInfo",
        params: [`${publicKey}`, { encoding: "jsonParsed" }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return new NextResponse(JSON.stringify(response.data));
  } catch (error) {
    console.error("Error fetching balance:", error);
    return new NextResponse("Error fetching balance", { status: 500 });
  }
}
