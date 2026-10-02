import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHabit extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  icon: string;
  color: string;
  frequency: "daily";
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HabitSchema = new Schema<IHabit>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    icon: { type: String, default: "📖" },
    color: { type: String, default: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    frequency: { type: String, enum: ["daily"], default: "daily" },
    isArchived: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user habit lookups and sorted queries
HabitSchema.index({ userId: 1, isArchived: 1, createdAt: 1 });

export const HabitModel: Model<IHabit> =
  mongoose.models.Habit || mongoose.model<IHabit>("Habit", HabitSchema);
