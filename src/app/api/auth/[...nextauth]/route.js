import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

const handler = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization:
        "https://accounts.spotify.com/authorize?scope=" +
        [
          "user-read-email",
          "user-top-read",
          "user-read-recently-played",
          "user-read-playback-state", 
          "user-read-currently-playing"
        ].join(" "),
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        // Primeiro login, o objeto `user` só vem aqui no primeiro callback JWT após login.
        // Vamos tentar salvar no banco se não existir usuário com esse email.

        // Checar se o usuário já existe
        const existingUsers = await sql`SELECT * FROM users WHERE email = ${user.email}`;

        if (existingUsers.length === 0) {
          // Não existe, inserir novo usuário
          await sql`
            INSERT INTO users (email, name, first_login)
            VALUES (${user.email}, ${user.name}, NOW())
          `;
          console.log(`Usuário ${user.email} inserido no banco.`);
        } else {
          console.log(`Usuário ${user.email} já cadastrado.`);
        }
       
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