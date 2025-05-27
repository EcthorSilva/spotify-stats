"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function CurrentlyPlayingCard() {
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentlyPlaying = async () => {
      try {
        const res = await fetch("/api/currently-playing");
        const data = await res.json();

        if (data.isPlaying) {
          setTrack(data);
        } else {
          setTrack(null);
        }
      } catch (err) {
        console.error("Erro ao buscar música atual:", err);
        setTrack(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentlyPlaying();
    const intervalId = setInterval(fetchCurrentlyPlaying, 60000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Card className="flex items-center gap-4 p-4 max-w-md bg-muted mt-4 mx-auto cursor-pointer">
          {track?.album?.images?.[0]?.url ? (
            <Image
              src={track.album.images[0].url}
              alt={track.name}
              width={64}
              height={64}
              className="rounded"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center text-gray-500 text-sm" />
          )}

          <div>
            <CardHeader className="p-0 mb-1">
              <CardDescription className="text-sm text-muted-foreground">
                Tocando agora
              </CardDescription>
            </CardHeader>

            {track ? (
              <>
                <CardTitle className="text-base">{track.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {track.artists.map((a) => a.name).join(", ")}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma música está tocando no momento.
              </p>
            )}
          </div>
        </Card>
      </DrawerTrigger>

      {track && (
        <DrawerContent>
          <div className="p-4">
            <DrawerHeader>
              <div className="flex flex-col items-center gap-4">
                <Image
                  src={track.album.images?.[0]?.url || ""}
                  alt={track.name}
                  width={256}
                  height={256}
                  className="rounded-xl object-cover mb-4"
                />
              </div>
              <DrawerTitle>{track.name}</DrawerTitle>
              <DrawerDescription>
                {track.artists.map((a) => a.name).join(", ")}
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex flex-col items-center gap-4 mb-3">
              <div className="flex gap-4 mt-4 w-full justify-center">
                <Card className="w-1/3">
                  <CardContent className="p-4">
                    <span className="text-muted-foreground text-sm">
                      Popularidade
                    </span>
                    <p className="text-lg font-semibold">{track.popularity}</p>
                  </CardContent>
                </Card>

                <Card className="w-1/3">
                  <CardContent className="p-4">
                    <span className="text-muted-foreground text-sm">
                      Duração
                    </span>
                    <p className="text-lg font-semibold">
                      {formatDuration(track.duration_ms)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="w-1/3">
                  <CardContent className="p-4">
                    <span className="text-muted-foreground text-sm">No Top 50</span>
                    <p className="text-lg font-semibold">{track.topRank ? `#${track.topRank}` : "Não"}</p>
                    <span className="text-muted-foreground text-sm">{track.topPeriod || " "}</span>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </DrawerContent>
      )}
    </Drawer>
  );
}
