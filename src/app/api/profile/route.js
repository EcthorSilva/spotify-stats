import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
  const token = await getToken({ req });

  if (!token || !token.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const headers = {
    Authorization: `Bearer ${token.accessToken}`,
  };

  try {
    // Get user profile
    const profileRes = await fetch("https://api.spotify.com/v1/me", { headers });
    if (!profileRes.ok) throw new Error("Failed to fetch user profile");
    const profile = await profileRes.json();

    // Get playlists
    const playlistsRes = await fetch("https://api.spotify.com/v1/me/playlists?limit=5", { headers });
    const playlistsData = await playlistsRes.json();
    const playlists = playlistsData.items.map(p => ({
      id: p.id,
      name: p.name,
      image: p.images[0]?.url || "/placeholder.jpg",
      tracks: p.tracks.total,
      public: p.public,
    }));

    // Fake/mock some data for now
    const lastPlayed = new Date(Date.now() - 2 * 3600 * 1000); // 2 hours ago
    const joined = "March 2023";
    const friends = 12;

    return NextResponse.json({
      name: profile.display_name,
      image: profile.images[0]?.url || "/placeholder.jpg",
      followers: profile.followers.total,
      following: 0, // Spotify API does not return "following" directly
      lastPlayed,
      joined,
      friends,
      playlists,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Failed to load user profile" }, { status: 500 });
  }
}
