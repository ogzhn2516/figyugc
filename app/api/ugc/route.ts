import { NextResponse } from "next/server";
import { createInfluencer } from "../../lib/influencer-store";

export const runtime = "nodejs";

type UgcApplication = {
  fullName?: string;
  phone?: string;
  email?: string;
  province?: string;
  district?: string;
  address?: string;
  instagram?: string;
  followerCount?: string;
};

function clean(value: string | undefined) {
  return value?.trim() ?? "";
}

function normalizeInstagram(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return { username: "", url: "" };

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      const username = url.pathname.split("/").filter(Boolean)[0] ?? "";
      return {
        username: username ? `@${username}` : trimmed,
        url: trimmed,
      };
    } catch {
      return { username: trimmed, url: "" };
    }
  }

  const username = trimmed.replace(/^@+/, "");
  return {
    username: username ? `@${username}` : "",
    url: username ? `https://www.instagram.com/${username}/` : "",
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as UgcApplication;
    const fullName = clean(body.fullName);
    const phone = clean(body.phone);
    const email = clean(body.email);
    const province = clean(body.province);
    const district = clean(body.district);
    const address = clean(body.address);
    const followerCount = clean(body.followerCount);
    const instagram = normalizeInstagram(clean(body.instagram));

    if (!fullName || !phone || !email || !province || !district || !address || !instagram.username) {
      return NextResponse.json({ error: "Lutfen zorunlu alanlari doldurun." }, { status: 400 });
    }

    const influencer = await createInfluencer({
      fullName,
      platform: "Instagram",
      username: instagram.username,
      phone,
      email,
      city: `${province} / ${district}`,
      address,
      followerCount,
      niche: "UGC",
      status: "Aday",
      collaborationType: "UGC basvurusu",
      profileUrl: instagram.url,
      instagramUrl: instagram.url,
      notes: "UGC basvuru formundan geldi.",
    });

    return NextResponse.json({ influencer }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Basvuru kaydedilemedi: ${error.message}`
            : "Basvuru kaydedilemedi. Lutfen tekrar deneyin.",
      },
      { status: 500 },
    );
  }
}
