import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
  const token = await getToken({ req });

  if (!token || !token.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = token.accessToken;

  const res = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (!data.items) {
    return NextResponse.json({ error: "Failed to fetch top tracks" }, { status: 500 });
  }

  const genreCounts = {};

  for (const track of data.items) {
    for (const artist of track.artists) {
      const artistRes = await fetch(`https://api.spotify.com/v1/artists/${artist.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const artistData = await artistRes.json();

      if (artistData.genres) {
        for (const raw of artistData.genres) {
          const base = raw.toLowerCase();
          genreCounts[base] = (genreCounts[base] || 0) + 1;
        }
      }
    }
  }

  const chartData = Object.entries(genreCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .map(([genre, value]) => ({
    genre,
    medium_term: Math.log(value + 5), // +4 para evitar log(0)
  }));

  return NextResponse.json(chartData);
}
