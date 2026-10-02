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

// POST /api/habits — Create habit(s) for authenticated user (single or bulk)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const itemsToCreate = Array.isArray(body.habits)
      ? body.habits
      : Array.isArray(body)
      ? body
      : [body];

    if (itemsToCreate.length === 0) {
      return NextResponse.json({ error: "No habits provided" }, { status: 400 });
    }

    for (const item of itemsToCreate) {
      if (!item.name || typeof item.name !== "string" || !item.name.trim()) {
        return NextResponse.json({ error: "Habit name is required for all entries" }, { status: 400 });
      }
    }

    await connectToDatabase();
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const docs = itemsToCreate.map((item: { name: string; description?: string; icon?: string; color?: string }) => ({
      userId: user._id,
      name: item.name.trim(),
      description: item.description ? item.description.trim() : "",
      icon: item.icon || "📖",
      color: item.color || "bg-neutral-800 text-white border-neutral-700",
      frequency: "daily",
      isArchived: false,
    }));

    const createdHabits = await HabitModel.insertMany(docs);

    const formattedHabits = createdHabits.map((newHabit) => ({
      id: newHabit._id.toString(),
      name: newHabit.name,
      description: newHabit.description || "",
      icon: newHabit.icon,
      color: newHabit.color,
      frequency: newHabit.frequency,
      isArchived: newHabit.isArchived,
      createdAt: newHabit.createdAt.toISOString(),
      updatedAt: newHabit.updatedAt.toISOString(),
    }));

    return NextResponse.json(
      {
        habits: formattedHabits,
        habit: formattedHabits[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/habits error:", error);
    return NextResponse.json({ error: "Failed to create habits" }, { status: 500 });
  }
}

