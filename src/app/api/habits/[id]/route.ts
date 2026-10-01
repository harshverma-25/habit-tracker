import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { HabitModel } from "@/models/Habit";
import { UserModel } from "@/models/User";

// PATCH /api/habits/[id] — Edit or archive a habit
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, icon, color, isArchived } = body;

    await connectToDatabase();
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const habit = await HabitModel.findOne({ _id: id, userId: user._id });
    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    if (name !== undefined) habit.name = name.trim();
    if (description !== undefined) habit.description = description.trim();
    if (icon !== undefined) habit.icon = icon;
    if (color !== undefined) habit.color = color;
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

// DELETE /api/habits/[id] — Permanent deletion of a habit
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectToDatabase();
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const habit = await HabitModel.findOneAndDelete({ _id: id, userId: user._id });
    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Habit deleted successfully", id });
  } catch (error) {
    console.error("DELETE /api/habits/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete habit" }, { status: 500 });
  }
}
