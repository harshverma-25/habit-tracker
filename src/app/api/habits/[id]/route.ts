import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { authOptions, getUserIdFromSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { HabitModel } from "@/models/Habit";
import { HabitCompletionModel } from "@/models/HabitCompletion";

// PATCH /api/habits/[id] — Edit or archive a habit for authenticated user
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getUserIdFromSession(session);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid habit ID" }, { status: 400 });
    }

    const body = await request.json();
    const { name, description, icon, color, isArchived } = body;

    await connectToDatabase();
    const habit = await HabitModel.findOne({ _id: id, userId });
    if (!habit) {
      return NextResponse.json({ error: "Habit not found or unauthorized" }, { status: 404 });
    }

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ error: "Habit name cannot be empty" }, { status: 400 });
      }
      habit.name = name.trim();
    }
    if (description !== undefined) habit.description = typeof description === "string" ? description.trim() : "";
    if (icon !== undefined) habit.icon = typeof icon === "string" ? icon : "📖";
    if (color !== undefined) habit.color = typeof color === "string" ? color : "";
    if (isArchived !== undefined) habit.isArchived = Boolean(isArchived);

    await habit.save();

    const formattedHabit = {
      id: habit._id.toString(),
      name: habit.name,
      description: habit.description || "",
      icon: habit.icon,
      color: habit.color,
      frequency: habit.frequency,
      isArchived: habit.isArchived,
      createdAt: habit.createdAt.toISOString(),
      updatedAt: habit.updatedAt.toISOString(),
    };

    return NextResponse.json({ habit: formattedHabit });
  } catch (error) {
    console.error("PATCH /api/habits/[id] error:", error);
    return NextResponse.json({ error: "Failed to update habit" }, { status: 500 });
  }
}

// DELETE /api/habits/[id] — Permanent deletion of a habit & its associated completions
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getUserIdFromSession(session);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid habit ID" }, { status: 400 });
    }

    await connectToDatabase();
    const habit = await HabitModel.findOneAndDelete({ _id: id, userId });
    if (!habit) {
      return NextResponse.json({ error: "Habit not found or unauthorized" }, { status: 404 });
    }

    // Clean up all completion records associated with the deleted habit
    await HabitCompletionModel.deleteMany({ habitId: id, userId });

    return NextResponse.json({ message: "Habit and records deleted successfully", id });
  } catch (error) {
    console.error("DELETE /api/habits/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete habit" }, { status: 500 });
  }
}
