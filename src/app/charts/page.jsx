'use client'

import { useEffect, useState  } from "react";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";

import Navbar from "@/components/navbar";
import CurrentlyPlayingCard from "@/components/currently-playing-card";
import { minListenedChart as MinListenedChart } from "@/components/charts/min-listened-chart";
import { GenreRadarChart } from "@/components/charts/GenreRadarChart";

export default function ChartsPage() {
  const { data: session, status } = useSession();

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
        <div className="shadow-md mb-4 blur-sm">
          <MinListenedChart />
        </div>
        {/* chart Genre Radar */}
        <div className="shadow-md mb-4 ">
          <GenreRadarChart />
        </div>
      </div>
    </div>
  );
}