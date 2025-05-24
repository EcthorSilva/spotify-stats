import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const SPOTIFY_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks";

export async function GET(req) {
  const token = await getToken({ req });
  if (!token || !token.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const time_range = searchParams.get("time_range") || "short_term";

  try {
    const res = await fetch(`${SPOTIFY_ENDPOINT}?limit=6&time_range=${time_range}`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch top songs" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ items: data.items });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
