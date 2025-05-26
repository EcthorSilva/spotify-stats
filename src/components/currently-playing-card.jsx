"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export default function CurrentlyPlayingCard() {
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(true); // padrão true para fallback otimista

  useEffect(() => {
    let intervalId;

    const fetchCurrentlyPlaying = async () => {
      try {
        const res = await fetch("/api/currently-playing");
        const data = await res.json();

        if (!data.isPremium) {
          setIsPremium(false);
          setTrack(null);
          return;
        }

        setIsPremium(true);

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
    intervalId = setInterval(fetchCurrentlyPlaying, 60000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (!isPremium) {
    return (
      <Card className="p-4 max-w-md bg-muted mt-4 mx-auto">
        <p className="text-sm text-muted-foreground">
          Esse recurso está disponível apenas para contas Premium do Spotify.
        </p>
      </Card>
    );
  }

  return (
    <Card className="flex items-center gap-4 p-4 max-w-md bg-muted mt-4 mx-auto">
      {track?.album?.images?.[0]?.url ? (
        <Image
          src={track.album.images[0].url}
          alt={track.name}
          width={64}
          height={64}
          className="rounded"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center text-gray-500 text-sm">
        </div>
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
  );
}
