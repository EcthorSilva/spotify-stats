import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
  const token = await getToken({ req });
  if (!token || !token.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = token.accessToken;

  const res = await fetch("https://api.spotify.com/v1/me/top/artists?limit=5&time_range=medium_term", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    console.warn(`Erro ao buscar artistas: ${res.status} ${res.statusText}`);
    return NextResponse.json({ error: "Failed to fetch top artists" }, { status: 500 });
  }

  const data = await res.json();

  if (!data.items) {
    return NextResponse.json({ error: "Failed to fetch top artists" }, { status: 500 });
  }

  // Mapeia para o formato { artist: string, popularity: number }
  const artistsPopularity = data.items.map(artist => ({
    artist: artist.name,
    popularity: artist.popularity,
  }));

  return NextResponse.json(artistsPopularity);
}
