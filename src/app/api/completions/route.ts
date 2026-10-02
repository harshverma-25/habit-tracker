import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { authOptions, getUserIdFromSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { HabitCompletionModel } from "@/models/HabitCompletion";
import { HabitModel } from "@/models/Habit";

// GET /api/completions?year=2026&month=10 — Fetch completions for authenticated user for specified month
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getUserIdFromSession(session);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const yearStr = searchParams.get("year");
    const monthStr = searchParams.get("month");

    if (!yearStr || !monthStr) {
      return NextResponse.json({ error: "Year and month query parameters are required" }, { status: 400 });
    }

    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return NextResponse.json({ error: "Invalid year or month format" }, { status: 400 });
    }

    const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
    const daysInMonth = new Date(year, month, 0).getDate();
    const endDate = `${year}-${month.toString().padStart(2, "0")}-${daysInMonth.toString().padStart(2, "0")}`;

    await connectToDatabase();
    // Query completion records filtered strictly by userId and month date range with field projection
    const completions = await HabitCompletionModel.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    })
      .select("_id habitId date completed")
      .lean();

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

// POST /api/completions — Toggle completion record (create or update)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getUserIdFromSession(session);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { habitId, date, completed } = body;

    if (!habitId || !date || typeof completed !== "boolean") {
      return NextResponse.json({ error: "habitId, date, and completed status are required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(habitId)) {
      return NextResponse.json({ error: "Invalid habit ID" }, { status: 400 });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json({ error: "Date must be in YYYY-MM-DD format" }, { status: 400 });
    }

    await connectToDatabase();
    // Verify habit ownership quickly with exists query
    const habitExists = await HabitModel.exists({ _id: habitId, userId });
    if (!habitExists) {
      return NextResponse.json({ error: "Habit not found or unauthorized" }, { status: 404 });
    }

    // Upsert completion record using user isolation and unique compound key
    const result = await HabitCompletionModel.findOneAndUpdate(
      { userId, habitId, date },
      { $set: { completed } },
      { upsert: true, new: true, select: "_id habitId date completed" }
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
