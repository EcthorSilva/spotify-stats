'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"

export default function navbar({ session }) {
  return (
    <nav className="mb-4 flex justify-center top-0 z-40 w-full bg-background">
      <div className="container mx-auto px-5 py-4 flex h-full items-center">
        <nav className="hidden w-full items-center justify-between lg:flex">
          <div className="flex w-full items-center justify-between gap-6">
            <a href="/" className="group flex items-center gap-1.5 font-semibold">
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
  )
}