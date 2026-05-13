import { NextResponse } from "next/server";
import { createInfluencer, listInfluencers } from "../../lib/influencer-store";

export const runtime = "nodejs";

export async function GET() {
  try {
    const influencers = await listInfluencers();
    return NextResponse.json({ influencers });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Liste alinamadi." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const influencer = await createInfluencer(body);

    return NextResponse.json({ influencer }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Kayit olusturulamadi." },
      { status: 500 },
    );
  }
}
