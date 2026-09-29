import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      issuer: "https://github.com/login/oauth",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "github" || !profile) return false;
      const githubProfile = profile as unknown as {
        id: number;
        login: string;
        avatar_url: string;
      };
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.githubId, String(githubProfile.id)))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(users).values({
          id: randomUUID(),
          githubId: String(githubProfile.id),
          githubUsername: githubProfile.login,
          name: user.name ?? null,
          avatarUrl: githubProfile.avatar_url ?? null,
          email: user.email ?? null,
        });
      } else {
        await db
          .update(users)
          .set({
            githubUsername: githubProfile.login,
            name: user.name ?? null,
            avatarUrl: githubProfile.avatar_url ?? null,
          })
          .where(eq(users.githubId, String(githubProfile.id)));
      }
      return true;
    },
    async session({ session, token }) {
      if (token?.sub && session.user) {
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.githubId, token.sub))
          .limit(1);
        if (dbUser[0]) {
          (session.user as typeof session.user & { id: string; githubUsername: string }).id =
            dbUser[0].id;
          (session.user as typeof session.user & { githubUsername: string }).githubUsername =
            dbUser[0].githubUsername;
        }
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile) {
        const githubProfile = profile as unknown as { id: number };
        token.sub = String(githubProfile.id);
      }
      return token;
    },
  },
});
