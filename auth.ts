import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ account }) {
            if (account?.provider === "discord" && account?.providerAccountId) {
                const existingUser = await prisma.user.findUnique({
                    where: { discordId: account.providerAccountId },
                });

                if (!existingUser) {
                    console.log(
                        `Unauthorized login attempt from Discord ID: ${account.providerAccountId}`,
                    );
                    return false; // Deny access - user not in database
                }
            }
            return true;
        },
        async jwt({ token, account, profile }) {
            // Store Discord info in JWT token on first sign in
            if (account?.provider === "discord" && profile) {
                token.discordId = account.providerAccountId;
                const discordProfile = profile as {
                    global_name?: string;
                    username?: string;
                    avatar?: string;
                    id?: string;
                };
                token.username =
                    discordProfile.global_name || discordProfile.username;
                if (discordProfile.avatar && discordProfile.id) {
                    token.picture = `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string;
                session.user.discordId = token.discordId as string;
                session.user.name = token.username as string;
                session.user.image = token.picture as string;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
});
