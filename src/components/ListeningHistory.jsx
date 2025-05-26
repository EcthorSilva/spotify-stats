"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ListeningHistory() {
  const { data: session } = useSession();
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchRecentlyPlayed = async () => {
      try {
        const res = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=20", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        const data = await res.json();

        const parsedTracks = data.items.map((item) => ({
          id: item.track.id,
          name: item.track.name,
          artist: item.track.artists.map((a) => a.name).join(", "),
          albumImage: item.track.album?.images?.[0]?.url ?? "/placeholder/kijo.jpg",
          url: item.track.external_urls.spotify,
          playedAt: new Date(item.played_at).toLocaleString("pt-br", {
            dateStyle: "short",
            timeStyle: "short",
          }),
        }));

        setTracks(parsedTracks);
      } catch (error) {
        console.error("Failed to fetch recently played tracks:", error);
      }
    };

    fetchRecentlyPlayed();
  }, [session]);

  return (
    <Card className="p-4 max-w-md mx-auto bg-muted">
      <h2 className="text-xl font-semibold mb-1">Histórico de Musicas</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Suas faixas tocadas recentemente
      </p>

      <ScrollArea className="h-[500px] pr-2">
        <div className="relative ml-4 border-l border-gray-600 space-y-6">
          {tracks.map((track) => (
            <div key={track.id} className="relative flex gap-4 pl-6">
              <span className="absolute left-0 top-2.5 -ml-[7px] w-3 h-3 rounded-full bg-primary border-2 border-white z-10" />
              <Image
                src={track.albumImage}
                alt={track.name}
                width={100}
                height={100}
                className="rounded"
              />            
              <div className="flex flex-col">
                <Link
                  href={track.url}
                  target="_blank"
                  className="flex items-center gap-1 font-medium hover:underline"
                >
                  {track.name}
                </Link>
                <span className="text-sm text-muted-foreground">{track.artist}</span>
                <span className="text-xs text-muted-foreground">{track.playedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
