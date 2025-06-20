'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Spinner } from '@/components/ui/spinner';
import { useEffect, useState  } from "react";
import { useRouter } from "next/navigation"
import { useSession, signIn, signOut } from "next-auth/react"

export function LoginForm({ className, ...props }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      setIsRedirecting(true);
      router.push("/home");
    } else {
      setIsRedirecting(false);
    }
  }, [status, router]);

  if (status === "loading" || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-muted" />
      </div>
    );
  }
  
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <i className="bi bi-music-player text-green-500 text-3xl"></i>
              </div>
              <span className="sr-only">Spotify</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Spotify Stats</h1>
            <div className="text-center text-sm">
              <p>A simple way to track your Spotify stats and listening history.</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="grid gap-2">
              <Button onClick={() => signIn("spotify")} className="w-full bg-green-500 hover:bg-green-600">
                <i className="bi bi-spotify text-2xl" />
                Login with Spotify
              </Button>
            </div>
          </div>
        </div>
      <div
        className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}