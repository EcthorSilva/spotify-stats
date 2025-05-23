'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import Image from "next/image"


import { useSession, signIn, signOut } from "next-auth/react"
import { ClipboardSignatureIcon } from "lucide-react"

export default function HomePage() {
  const { data: session, status } = useSession();

  if (!session) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <h1 className="text-2xl font-bold">Faça Login</h1>
          <p>Usuário não logado</p>
          <p className="text-sm text-muted-foreground"></p>
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center">
              <div className="grid gap-2">
                <Button onClick={() => signIn("spotify")} className="w-full bg-green-500 hover:bg-green-600 w-48">
                  <i className="bi bi-spotify text-2xl" />
                  Login with Spotify
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      {/* navbar */}
      <nav className="mb-4 flex justify-center top-0 z-40 w-full bg-background">
        <div className="container mx-auto px-5 py-4 flex h-full items-center">
          <nav className="hidden w-full items-center justify-between lg:flex">
            <div className="flex w-full items-center justify-between gap-6">
              <a href="/" className="group flex items-center gap-1.5 font-semibold">
                {/* <img src={session.user.image} class="w-6 transition-opacity duration-300 group-hover:opacity-65" alt="Shadcnblocks Logo" /> */}
                <span className="flex items-center gap-1 text-[16px] tracking-[-1px] transition-opacity duration-300 group-hover:opacity-65">
                  Um nome bacana aqui
                </span>
              </a>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarImage src={session.user.image} />
                      <AvatarFallback>{session.user.email}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mx-2">
                    <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Account Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuItem>Liscense</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="hover:bg-green-600 md:hover:bg-green-600">Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </nav>
          <div className="flex w-full items-center justify-between lg:hidden">
            <a href="/" className="group flex items-center gap-1.5 font-semibold">
              {/* <img src={session.user.image} class="w-6 transition-opacity duration-300 group-hover:opacity-65" alt="Shadcnblocks Logo" /> */}
              <span className="flex items-center gap-1 text-[16px] tracking-[-1px] transition-opacity duration-300 group-hover:opacity-65">
                Um nome bacana aqui
              </span>
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={session.user.image} />
                  <AvatarFallback>{session.user.email}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mx-2">
                <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Account Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem>Liscense</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="hover:bg-green-600 md:hover:bg-green-600">Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
      {/* main content */}
      <div className="container mx-auto px-5 py-1 justify-center">
        <Card className="shadow-md mb-4">
          <CardHeader>
            <ToggleGroup type="single" variant="outline" className="w-full" defaultValue="a">
              <ToggleGroupItem value="a">4 Weeks</ToggleGroupItem>
              <ToggleGroupItem value="b">6 Months</ToggleGroupItem>
              <ToggleGroupItem value="c">Lifetime</ToggleGroupItem>
            </ToggleGroup>
          </CardHeader>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Top Songs</CardTitle>
            <CardDescription>Your top songs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="w-full aspect-square relative rounded-md overflow-hidden mb-1">
                  <img src={session.user.image} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <div className="text-white text-sm font-semibold flex items-center justify-center gap-1">
                  <span>1. Song Name</span>
                </div>
              </div>

              <div className="text-center">
                <div className="w-full aspect-square relative rounded-md overflow-hidden mb-1">
                  <img src={session.user.image} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <div className="text-white text-sm font-semibold flex items-center justify-center gap-1">
                  <span>2. Song Name</span>
                </div>
              </div>

              <div className="text-center">
                <div className="w-full aspect-square relative rounded-md overflow-hidden mb-1">
                  <img src={session.user.image} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <div className="text-white text-sm font-semibold flex items-center justify-center gap-1">
                  <span>3. Song Name</span>
                </div>
              </div>

              <div className="text-center">
                <div className="w-full aspect-square relative rounded-md overflow-hidden mb-1">
                  <img src={session.user.image} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <div className="text-white text-sm font-semibold flex items-center justify-center gap-1">
                  <span>4. Song Name</span>
                </div>
              </div>

              <div className="text-center">
                <div className="w-full aspect-square relative rounded-md overflow-hidden mb-1">
                  <img src={session.user.image} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <div className="text-white text-sm font-semibold flex items-center justify-center gap-1">
                  <span>5. Song Name</span>
                </div>
              </div>
              <div className="text-center">
                <div className="w-full aspect-square relative rounded-md overflow-hidden mb-1">
                  <img src={session.user.image} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <div className="text-white text-sm font-semibold flex items-center justify-center gap-1">
                  <span>6. Song Name</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button className=" bg-green-500 hover:bg-green-600">
              <ClipboardSignatureIcon className="mr-2 h-4 w-4" />
              Share
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Bem-vindo, {session.user.name}</h1>
        <p className="text-sm text-muted-foreground"></p>
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center">
            <Avatar>
              <AvatarImage src={session.user.image} />
              <AvatarFallback>{session.user.name}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="grid gap-2">
          <Button onClick={() => signOut()} className="w-full bg-red-500 hover:bg-red-600 w-48">
            Sair
          </Button>
        </div>
      </div> */}
    </div>

  );
}
