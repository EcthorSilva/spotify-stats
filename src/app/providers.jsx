'use client'

import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "next-auth/react"

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <SessionProvider>
        {children}
      </SessionProvider>
    </ThemeProvider>
  )
}
