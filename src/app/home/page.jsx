'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import { Card, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Navbar from "@/components/navbar"
import TopSongsCard from "@/components/top-songs-card"
import TopArtistsCard from "@/components/top-artists-card";
import CurrentlyPlayingCard from "@/components/currently-playing-card";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [timeRange, setTimeRange] = useState("short_term");
  const [topSongs, setTopSongs] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(topSongs)

  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [songsRes, artistsRes] = await Promise.all([
          fetch(`/api/top-songs?time_range=${timeRange}`),
          fetch(`/api/top-artists?time_range=${timeRange}`),
        ]);

        const [songsData, artistsData] = await Promise.all([
          songsRes.json(),
          artistsRes.json(),
        ]);

        setTopSongs(songsData.items || []);
        setTopArtists(artistsData.items || []);
      } catch (err) {
        console.error("Failed to fetch top songs or artists:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, timeRange]);


  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-muted" />
      </div>
    );
  }

  return (
    <div>
      {/* navbar */}
      <Navbar session={session} />
      <div className="container mx-auto px-5 py-1 justify-center">
        {/* currently playing */}
        <div className="mb-5">
          <CurrentlyPlayingCard className="pb-5 mb-5" />
        </div>
        {/* Time Filter */}
        <div className="mb-4">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="short_term">4 Weeks</TabsTrigger>
              <TabsTrigger value="medium_term">6 Months</TabsTrigger>
              <TabsTrigger value="long_term">Lifetime</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {/* top music */}
        {loading ? (
          <Card className="shadow-md mb-4">
            <CardHeader className="p-3">
              <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-muted" />
              </div>
            </CardHeader>
          </Card>
        ) : (
          <>
            <TopSongsCard songs={topSongs} />
            <TopArtistsCard artists={topArtists} />
          </>
        )}
      </div>
    </div>
  );
}