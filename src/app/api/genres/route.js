import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
  const token = await getToken({ req });

  if (!token || !token.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = token.accessToken;

  const { searchParams } = new URL(req.url);
  const term = searchParams.get("term") || "medium_term";

  const res = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?time_range=${term}&limit=50`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await res.json();

  if (!data.items) {
    return NextResponse.json({ error: "Failed to fetch top tracks" }, { status: 500 });
  }

  const artistIdsSet = new Set();
  data.items.forEach(track => {
    track.artists.forEach(artist => {
      artistIdsSet.add(artist.id);
    });
  });

  const artistIds = Array.from(artistIdsSet);

  const genreToArtistsMap = {};

  for (let i = 0; i < artistIds.length; i += 50) {
    const idsBatch = artistIds.slice(i, i + 50).join(',');

    const artistsRes = await fetch(`https://api.spotify.com/v1/artists?ids=${idsBatch}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (artistsRes.status === 429) {
      // Tratamento de rate limit (aguarda o Retry-After)
      const retryAfter = artistsRes.headers.get("Retry-After");
      console.warn(`Spotify rate limited. Retry after ${retryAfter} seconds`);
      await new Promise((r) => setTimeout(r, (retryAfter || 1) * 1000));
      continue;
    }

    if (!artistsRes.ok) {
      console.warn(`Erro ao buscar lote de artistas: ${artistsRes.status} ${artistsRes.statusText}`);
      continue;
    }

    const { artists } = await artistsRes.json();

    // Para cada artista, adicionar os gêneros no map
    for (const artist of artists) {
      if (artist.genres) {
        for (const genre of artist.genres) {
          const normalized = genre.toLowerCase();
          if (!genreToArtistsMap[normalized]) {
            genreToArtistsMap[normalized] = new Set();
          }
          genreToArtistsMap[normalized].add(artist.id);
        }
      }
    }
  }

  // Total de artistas analisados
  const totalArtists = artistIds.length;

  const chartData = Object.entries(genreToArtistsMap)
    .map(([genre, artistSet]) => ({
      genre,
      medium_term: (artistSet.size / totalArtists) * 100,
    }))
    .sort((a, b) => b.medium_term - a.medium_term)
    .slice(0, 5) // top 5 gêneros
    .map(({ genre, medium_term }) => ({
      genre,
      medium_term: Math.round(medium_term + 0), // arredondar para inteiro
    }));

  return NextResponse.json(chartData);
}
