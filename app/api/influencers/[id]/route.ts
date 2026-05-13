import { NextResponse } from "next/server";
import { deleteInfluencer, updateInfluencer } from "../../../lib/influencer-store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const influencer = await updateInfluencer(id, body);

    if (!influencer) {
      return NextResponse.json({ error: "Influencer kaydi bulunamadi." }, { status: 404 });
    }

    return NextResponse.json({ influencer });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Kayit guncellenemedi." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await deleteInfluencer(id);

    if (!deleted) {
      return NextResponse.json({ error: "Influencer kaydi bulunamadi." }, { status: 404 });
    }

    return NextResponse.json({ status: "deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Kayit silinemedi." },
      { status: 500 },
    );
  }
}
