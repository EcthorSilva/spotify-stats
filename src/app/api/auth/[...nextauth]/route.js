import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const handler = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email,user-top-read,user-read-recently-played",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        console.log("🔐 JWT callback - nova conta:", account);
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      console.log("📦 Sessão criada:", session);
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: true,
});

export { handler as GET, handler as POST }; 
