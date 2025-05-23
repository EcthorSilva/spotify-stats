import { Providers } from "./providers"

import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Spotify Stats",
  description: "A simple way to get your Spotify stats",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Aqui usa o Providers que já engloba SessionProvider e ThemeProvider */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
