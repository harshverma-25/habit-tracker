import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { HabitModel } from "@/models/Habit";
import { UserModel } from "@/models/User";

// GET /api/habits — Fetch active habits for authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const habits = await HabitModel.find({ userId: user._id, isArchived: false })
      .sort({ createdAt: 1 })
      .lean();

    const formattedHabits = habits.map((h) => ({
      id: h._id.toString(),
      name: h.name,
      description: h.description || "",
      icon: h.icon,
      color: h.color,
      frequency: h.frequency,
      isArchived: h.isArchived,
      createdAt: h.createdAt.toISOString(),
      updatedAt: h.updatedAt.toISOString(),
    }));

    return NextResponse.json({ habits: formattedHabits });
  } catch (error) {
    console.error("GET /api/habits error:", error);
    return NextResponse.json({ error: "Failed to fetch habits" }, { status: 500 });
  }
}

// POST /api/habits — Create habit for authenticated user
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, icon, color } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Habit name is required" }, { status: 400 });
    }

    await connectToDatabase();
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newHabit = await HabitModel.create({
      userId: user._id,
      name: name.trim(),
      description: description ? description.trim() : "",
      icon: icon || "📖",
      color: color || "bg-blue-500/20 text-blue-400 border-blue-500/30",
      frequency: "daily",
      isArchived: false,
    });

    const formattedHabit = {
      id: newHabit._id.toString(),
      name: newHabit.name,
      description: newHabit.description || "",
      icon: newHabit.icon,
      color: newHabit.color,
      frequency: newHabit.frequency,
      isArchived: newHabit.isArchived,
      createdAt: newHabit.createdAt.toISOString(),
      updatedAt: newHabit.updatedAt.toISOString(),
    };

    return NextResponse.json({ habit: formattedHabit }, { status: 201 });
  } catch (error) {
    console.error("POST /api/habits error:", error);
    return NextResponse.json({ error: "Failed to create habit" }, { status: 500 });
  }
}
