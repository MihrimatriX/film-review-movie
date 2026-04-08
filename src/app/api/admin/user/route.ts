import { readUserData, writeUserData } from "@/lib/data-file";
import type { UserData } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await readUserData();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  let body: Partial<UserData>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const current = await readUserData();
  const next: UserData = {
    profile: {
      ...current.profile,
      ...body.profile,
      username: body.profile?.username?.trim() || current.profile.username,
      email: body.profile?.email?.trim() ?? current.profile.email,
      firstName: body.profile?.firstName?.trim() ?? current.profile.firstName,
      lastName: body.profile?.lastName?.trim() ?? current.profile.lastName,
      country: body.profile?.country?.trim() ?? current.profile.country,
      state: body.profile?.state?.trim() ?? current.profile.state,
      avatar: body.profile?.avatar?.trim() || current.profile.avatar,
    },
    favoriteSlugs: Array.isArray(body.favoriteSlugs)
      ? body.favoriteSlugs.map((s) => String(s).trim()).filter(Boolean)
      : current.favoriteSlugs,
    ratings: Array.isArray(body.ratings) ? body.ratings : current.ratings,
  };

  await writeUserData(next);
  return NextResponse.json(next);
}
