import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
  const token = await getToken({ req });

  if (!token || !token.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = token.accessToken;

  // 1. Buscar top tracks do usuário
  const res = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (!data.items) {
    return NextResponse.json({ error: "Failed to fetch top tracks" }, { status: 500 });
  }

  // 2. Coletar todos os IDs de artistas únicos
  const artistIdsSet = new Set();
  data.items.forEach(track => {
    track.artists.forEach(artist => {
      artistIdsSet.add(artist.id);
    });
  });

  const artistIds = Array.from(artistIdsSet);
  const genreCounts = {};

  // 3. Buscar artistas em lotes de até 50
  for (let i = 0; i < artistIds.length; i += 50) {
    const idsBatch = artistIds.slice(i, i + 50).join(',');

    const artistsRes = await fetch(`https://api.spotify.com/v1/artists?ids=${idsBatch}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (artistsRes.status === 429) {
      const retryAfter = artistsRes.headers.get("Retry-After");
      console.warn(`Spotify rate limited. Retry after ${retryAfter} seconds`);
      await new Promise((r) => setTimeout(r, retryAfter));
    }

    if (!artistsRes.ok) {
      console.warn(`Erro ao buscar lote de artistas: ${artistsRes.status} ${artistsRes.statusText}`);
      continue;
    }

    const { artists } = await artistsRes.json();

    for (const artist of artists) {
      if (artist.genres) {
        for (const genre of artist.genres) {
          const normalized = genre.toLowerCase();
          genreCounts[normalized] = (genreCounts[normalized] || 0) + 1;
        }
      }
    }
  }

  // 4. Construir dados para gráfico radar
  const chartData = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre, value]) => ({
      genre,
      medium_term: Math.log(value + 3), // suavização
    }));

  return NextResponse.json(chartData);
}
