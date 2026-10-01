import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHabitCompletion extends Document {
  _id: mongoose.Types.ObjectId;
  habitId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HabitCompletionSchema = new Schema<IHabitCompletion>(
  {
    habitId: { type: Schema.Types.ObjectId, ref: "Habit", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: String, required: true, index: true }, // Format YYYY-MM-DD
    completed: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate completion records for the same habit and date per user
HabitCompletionSchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });

// Index for efficient monthly date range filtering
HabitCompletionSchema.index({ userId: 1, date: 1 });

export const HabitCompletionModel: Model<IHabitCompletion> =
  mongoose.models.HabitCompletion ||
  mongoose.model<IHabitCompletion>("HabitCompletion", HabitCompletionSchema);
