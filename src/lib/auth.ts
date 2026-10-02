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
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
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
          // Allow sign in to succeed even if DB sync encounters temporary error
          return true;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id || token.sub) as string;
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
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET || "habitflow_default_secret_key_2026",
};
