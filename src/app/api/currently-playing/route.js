import { getToken } from "next-auth/jwt";

export async function GET(req) {
  const token = await getToken({ req });

  if (!token?.accessToken) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  // Busca a música atual
  const currentlyPlayingRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  });

  if (currentlyPlayingRes.status === 204 || currentlyPlayingRes.status >= 400) {
    return new Response(JSON.stringify({ isPlaying: false }), { status: 200 });
  }

  const currentlyPlaying = await currentlyPlayingRes.json();
  const trackId = currentlyPlaying?.item?.id;

  if (!trackId) {
    return new Response(JSON.stringify({ isPlaying: false }), { status: 200 });
  }

  // Busca detalhes da música
  const trackRes = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  });

  if (!trackRes.ok) {
    return new Response(JSON.stringify({ error: "Failed to fetch track" }), { status: 500 });
  }

  const trackData = await trackRes.json();

  const periods = [
    { label: "nas últimas 4 semanas", range: "short_term" },
    { label: "nos últimos 6 meses", range: "medium_term" },
    { label: "de todos os tempos", range: "long_term" },
  ];

  let topRank = null;
  let topPeriod = null;

  for (const period of periods) {
    const topRes = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${period.range}&limit=50`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    if (!topRes.ok) continue;

    const topData = await topRes.json();
    const index = topData.items.findIndex((item) => item.id === trackId);

    if (index !== -1) {
      topRank = index + 1;
      topPeriod = period.label;
      break;
    }
  }

  const track = {
    isPlaying: currentlyPlaying.is_playing,
    name: trackData.name,
    id: trackData.id,
    popularity: trackData.popularity,
    duration_ms: trackData.duration_ms,
    preview_url: trackData.preview_url,
    url: trackData.external_urls.spotify,
    album: {
      name: trackData.album.name,
      images: trackData.album.images,
    },
    artists: trackData.artists.map((artist) => ({
      name: artist.name,
      url: artist.external_urls.spotify,
    })),
    topRank,   // posição numérica no top 50, ou null
    topPeriod, // texto do período correspondente, ou null
  };

  return new Response(JSON.stringify(track), { status: 200 });
}
