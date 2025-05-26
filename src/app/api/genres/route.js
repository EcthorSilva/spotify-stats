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

  const genreMap = {
    pop: "Pop",
    rock: "Rock",
    rap: "Rap",
    hip_hop: "Rap",
    indie: "Indie",
    electronic: "Electronic",
    edm: "Electronic",
    dance: "Electronic",
  };

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
          for (const key in genreMap) {
            if (base.includes(key)) {
              const genre = genreMap[key];
              genreCounts[genre] = (genreCounts[genre] || 0) + 1;
              break;
            }
          }
        }
      }
    }
  }

  const chartData = Object.entries(genreCounts).map(([genre, value]) => ({
    genre,
    medium_term: value,
  }));

  return NextResponse.json(chartData);
}
