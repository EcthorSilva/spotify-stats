'use client'

import { useEffect, useState  } from "react";
import { useSession } from "next-auth/react"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardHeader} from "@/components/ui/card"

import Navbar from "@/components/navbar"
import TopSongsCard from "@/components/top-songs-card"
import CurrentlyPlayingCard from "@/components/currently-playing-card";
import TimeRangeToggle from "@/components/time-range-toggle"

import ListeningHistory from "@/components/ListeningHistory";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [timeRange, setTimeRange] = useState("short_term");
  const [topSongs, setTopSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(topSongs)

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    fetch(`/api/top-songs?time_range=${timeRange}`)
      .then(res => res.json())
      .then(data => setTopSongs(data.items || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
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
        {/* time range toggle */}
        <Card className="shadow-md mb-4">
          <CardHeader className="p-3">
            <TimeRangeToggle timeRange={timeRange} setTimeRange={setTimeRange} />
          </CardHeader>
        </Card>
        {loading ? (
          // loading spinner
          <Card className="shadow-md mb-4">
            <CardHeader className="p-3">
              <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-muted" />
              </div>
            </CardHeader>
          </Card>
        ) : (
          // top songs card
          <TopSongsCard songs={topSongs} />
        )}
        {/* currently playing card */}
        <div className="mb-5">
          <CurrentlyPlayingCard className="pb-5 mb-5" />
        </div>
        {/* listening history */}
        <div className="shadow-md">
          <ListeningHistory />
        </div>
      </div>
    </div>
  );
}