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
            const existingUser = await UserModel.findOne({ email: user.email }).select("_id name image").lean();
            if (!existingUser) {
              const created = await UserModel.create({
                name: user.name || "User",
                email: user.email,
                image: user.image || "",
                provider: "google",
              });
              user.id = created._id.toString();
            } else {
              user.id = existingUser._id.toString();
              await UserModel.updateOne(
                { _id: existingUser._id },
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
          return true;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id && /^[0-9a-fA-F]{24}$/.test(user.id)) {
        token.id = user.id;
      } else if (token.email && (!token.id || !/^[0-9a-fA-F]{24}$/.test(token.id as string))) {
        try {
          if (process.env.MONGODB_URI) {
            await connectToDatabase();
            const dbUser = await UserModel.findOne({ email: token.email }).select("_id").lean();
            if (dbUser) {
              token.id = dbUser._id.toString();
            }
          }
        } catch (error) {
          console.error("Error fetching user ID in jwt callback:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id || token.sub) as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET || "the_habit_tracker_default_secret_key_2026",
};

/**
 * Fast helper to resolve MongoDB User ID from session without extra DB queries when token ID is present.
 */
export async function getUserIdFromSession(session: { user?: { id?: string; email?: string | null } } | null): Promise<string | null> {
  if (!session?.user) return null;
  if (session.user.id && /^[0-9a-fA-F]{24}$/.test(session.user.id)) {
    return session.user.id;
  }
  if (session.user.email) {
    await connectToDatabase();
    const user = await UserModel.findOne({ email: session.user.email }).select("_id").lean();
    return user ? user._id.toString() : null;
  }
  return null;
}
