import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { HabitCompletionModel } from "@/models/HabitCompletion";
import { HabitModel } from "@/models/Habit";
import { UserModel } from "@/models/User";

// GET /api/completions?year=2026&month=10 — Fetch completions for authenticated user for specified month
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const yearStr = searchParams.get("year");
    const monthStr = searchParams.get("month");

    if (!yearStr || !monthStr) {
      return NextResponse.json({ error: "Year and month query parameters are required" }, { status: 400 });
    }

    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
    // Last day string calculation
    const daysInMonth = new Date(year, month, 0).getDate();
    const endDate = `${year}-${month.toString().padStart(2, "0")}-${daysInMonth.toString().padStart(2, "0")}`;

    await connectToDatabase();
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Query completion records filtered strictly by userId and month date range
    const completions = await HabitCompletionModel.find({
      userId: user._id,
      date: { $gte: startDate, $lte: endDate },
    }).lean();

    const formattedCompletions = completions.map((c) => ({
      id: c._id.toString(),
      habitId: c.habitId.toString(),
      date: c.date,
      completed: c.completed,
    }));

    return NextResponse.json({ completions: formattedCompletions });
  } catch (error) {
    console.error("GET /api/completions error:", error);
    return NextResponse.json({ error: "Failed to fetch completions" }, { status: 500 });
  }
}

// POST /api/completions — Toggle completion record (create or update/delete)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { habitId, date, completed } = body;

    if (!habitId || !date || typeof completed !== "boolean") {
      return NextResponse.json({ error: "habitId, date, and completed status are required" }, { status: 400 });
    }

    await connectToDatabase();
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify habit ownership
    const habit = await HabitModel.findOne({ _id: habitId, userId: user._id });
    if (!habit) {
      return NextResponse.json({ error: "Habit not found or unauthorized" }, { status: 404 });
    }

    // Upsert completion record using user isolation and unique compound key
    const result = await HabitCompletionModel.findOneAndUpdate(
      { userId: user._id, habitId, date },
      { $set: { completed } },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      completion: {
        id: result._id.toString(),
        habitId: result.habitId.toString(),
        date: result.date,
        completed: result.completed,
      },
    });
  } catch (error) {
    console.error("POST /api/completions error:", error);
    return NextResponse.json({ error: "Failed to update completion" }, { status: 500 });
  }
}
