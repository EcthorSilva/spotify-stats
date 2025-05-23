'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSession, signIn, signOut } from "next-auth/react"

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
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <img src={session.user.image} alt="Avatar" width={80} height={80} />
      <h1 className="text-2xl font-bold">Bem-vindo, {session.user.name}</h1>
      <p className="text-sm text-muted-foreground"></p>
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
