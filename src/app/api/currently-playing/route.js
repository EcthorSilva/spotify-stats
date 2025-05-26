import { getToken } from "next-auth/jwt";

export async function GET(req) {
  const token = await getToken({ req });

  if (!token?.accessToken) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  // Busca música atual
  const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  });

  if (res.status === 204 || res.status > 400) {
    return new Response(JSON.stringify({ isPlaying: false }), { status: 200 });
  }

  const data = await res.json();

  const track = {
    isPlaying: data.is_playing,
    name: data.item.name,
    album: {
      name: data.item.album.name,
      images: data.item.album.images,
    },
    artists: data.item.artists.map((artist) => ({ name: artist.name })),
    url: data.item.external_urls.spotify,
  };

  return new Response(JSON.stringify(track), { status: 200 });
}
