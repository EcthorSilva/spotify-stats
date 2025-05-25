'use client'

import { useEffect, useState  } from "react";
import { useSession } from "next-auth/react"
import { Spinner } from "@/components/ui/spinner"

import Navbar from "@/components/navbar"
import CurrentlyPlayingCard from "@/components/currently-playing-card";
import { minListenedChart as MinListenedChart } from "@/components/charts/min-listened-chart"


export default function ChartsPage() {
  const { data: session, status } = useSession();

    // useEffect(() => {
    //   if (!session) return;
    //   setLoading(true);
    //   fetch(`/api/top-songs?time_range=${timeRange}`)
    //     .then(res => res.json())
    //     .then(data => setTopSongs(data.items || []))
    //     .catch(err => console.error(err))
    //     .finally(() => setLoading(false));
    // }, [session, timeRange]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div>
      {/* navbar */}
      <Navbar session={session} />
      <div className="container mx-auto px-5 py-1 justify-center">
        {/* currently playing card */}
        <div className="mb-5">
          <CurrentlyPlayingCard className="pb-5 mb-5" />
        </div>
        {/* chart Min Listened 6 months */}
        <div className="shadow-md mb-4">
          <MinListenedChart />
        </div>
      </div>
    </div>
  );
}