import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardSignatureIcon } from "lucide-react";
import Image from "next/image";

export default function topSongsCard({ songs }) {
  if (!songs || songs.length === 0) {
    return (
      <Card className="shadow-md mb-4">
        <CardHeader>
          <CardTitle className="text-xl">Top Songs</CardTitle>
          <CardDescription>Your top songs</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center w-full">No top songs found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md mb-4">
      <CardHeader>
        <CardTitle className="text-xl">Top Songs</CardTitle>
        <CardDescription>Your top songs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {songs.map((song, i) => (
            <div className="text-center" key={song.id || i}>
              <div className="w-full aspect-square relative rounded-md overflow-hidden mb-1">
                <Image
                  src={song.album?.images?.[0]?.url || "/placeholder.png"}
                  alt={song.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-white text-sm font-semibold flex items-center justify-center gap-1 text-center">
                <span>{i + 1}. {song.name}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button className="bg-green-500 hover:bg-green-600">
          <ClipboardSignatureIcon className="mr-2 h-4 w-4" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}