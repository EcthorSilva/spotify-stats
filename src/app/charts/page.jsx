'use client'

import { useEffect, useState  } from "react";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";

import Navbar from "@/components/navbar";
import CurrentlyPlayingCard from "@/components/currently-playing-card";
import { minListenedChart as MinListenedChart } from "@/components/charts/MinListenedChart";
import { GenreRadarChart } from "@/components/charts/GenreRadarChart";
import { ArtistPopularityChart } from "@/components/charts/ArtistPopularityChart";
import { ListeningHoursChart } from "@/components/charts/ListeningHoursChart";

export default function ChartsPage() {
  const { data: session, status } = useSession();

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
        {/* currently playing card */}
        <div className="mb-5">
          <CurrentlyPlayingCard className="pb-5 mb-5" />
        </div>
        {/* chart Artist Popularity */}
        <div className="shadow-md mb-4">
          <ArtistPopularityChart />
        </div>
        {/* chart Genre Radar - 11 horas de timeout por too many request*/}
        <div className="shadow-md mb-4 ">
          {/* <GenreRadarChart /> */}
        </div>
        {/* chart Listening Hours */}
        <div className="shadow-md mb-4">
          <ListeningHoursChart />
        </div>
        {/* chart Min Listened 6 months */}
        <div className="shadow-md mb-4 blur-sm">
          <MinListenedChart />
        </div>
      </div>
    </div>
  );
}