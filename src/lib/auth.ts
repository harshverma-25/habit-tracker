import { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/mongodb";
import { UserModel } from "@/models/User";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          if (process.env.MONGODB_URI) {
            await connectToDatabase();
            const existingUser = await UserModel.findOne({ email: user.email });
            if (!existingUser) {
              await UserModel.create({
                name: user.name || "User",
                email: user.email,
                image: user.image || "",
                provider: "google",
              });
            } else {
              // Update user name and avatar if changed
              await UserModel.updateOne(
                { email: user.email },
                {
                  $set: {
                    name: user.name || existingUser.name,
                    image: user.image || existingUser.image,
                  },
                }
              );
            }
          }
        } catch (error) {
          console.error("Error persisting user to MongoDB during sign in:", error);
          // Allow sign in even if DB sync fails temporarily
          return true;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "habitflow_default_secret_key_2026",
};
