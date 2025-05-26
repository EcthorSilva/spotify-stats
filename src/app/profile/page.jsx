'use client'

import { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import Image from 'next/image'
import Navbar from "@/components/navbar"
import { CalendarIcon, UsersIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import ListeningHistory from "@/components/ListeningHistory";

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const { data: session } = useSession();

  console.log(user)

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/profile')
      const data = await res.json()
      setUser(data)

      console.log('User data fetched:', data)
    }

    fetchUser()
  }, [])

  const formatDateDistance = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 3600000)
    return `${diff} hours ago`
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Skeleton className="w-[200px] h-[24px] mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-[100px]" />
          <Skeleton className="h-[100px]" />
          <Skeleton className="h-[100px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* navbar */}
      <Navbar session={session} />
      {/* Top: User Info */}
      <div className="flex items-center space-x-6">
        <Image
          src={user.image}
          alt={user.name}
          width={100}
          height={100}
          className="rounded-xl object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            <span><strong>{user.followers}</strong> followers</span>
            <span><strong>{user.following}</strong> following</span>
          </div>
        </div>
      </div>

      {/* Activity Info */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Last listened */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="w-5 h-5 text-green-500" />
              <span className="text-muted-foreground text-sm">Last listened</span>
            </div>
            <p className="text-lg font-semibold">{formatDateDistance(user.lastPlayed)}</p>
          </CardContent>
        </Card>
        {/* Joined Spotify */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <UsersIcon className="w-5 h-5 text-green-500" />
              <span className="text-muted-foreground text-sm">Joined Spotfy</span>
            </div>
            <p className="text-lg font-semibold">{user.joined}</p>
          </CardContent>
        </Card>
        {/* Friends */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <UsersIcon className="w-5 h-5 text-green-500" />
              <span className="text-muted-foreground text-sm">Friends</span>
            </div>
            <p className="text-lg font-semibold">{user.friends}</p>
          </CardContent>
        </Card>
      </div>

      <div class="grid md:grid-cols-3 gap-4">
        {/* Public Playlists */}
        <Card className="p-4 max-w-md mx-auto ">
          <h2 className="text-xl font-semibold mb-3">Public Playlists</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Suas playlists publicas
          </p>
          <ScrollArea className="h-[250px] ">
              <div className="space-y-4">
                  {Array.isArray(user.playlists) && user.playlists.map((playlist) => (
                      <Card key={playlist.id}>
                          <CardContent className="flex items-center p-3 gap-4">
                              <Image
                                  src={playlist.image}
                                  alt={playlist.name}
                                  width={60}
                                  height={60}
                                  className="rounded w-16 h-16 shrink-0"
                              />
                              <div>
                                  <p className="font-medium">{playlist.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                      {playlist.tracks} tracks
                                  </p>
                              </div>
                              <Badge className="ml-auto">{playlist.public ? 'Public' : 'Private'}</Badge>
                          </CardContent>
                      </Card>
                  ))}
              </div>
          </ScrollArea>
        </Card>
        {/* Listening History */}
        <div className="shadow-md">
          <ListeningHistory />
        </div>
      </div>
    </div>
  )
}
