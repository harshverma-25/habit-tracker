"use client";

import React, { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Habit } from "@/types/habit";

interface EditHabitModalProps {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: { id: string; name: string; description: string; icon: string; color: string }) => void;
}

const COLOR_OPTIONS = [
  "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "bg-rose-500/20 text-rose-400 border-rose-500/30",
];

const EMOJI_OPTIONS = ["📖", "💻", "🏃", "🧘", "💧", "🎨", "🎵", "✍️", "🏋️", "🥗"];

export function EditHabitDialog({ habit, isOpen, onClose, onSave }: EditHabitModalProps) {
  const [name, setName] = useState(habit.name);
  const [description, setDescription] = useState(habit.description || "");
  const [icon, setIcon] = useState(habit.icon || "📖");
  const [selectedColor, setSelectedColor] = useState(habit.color || COLOR_OPTIONS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: habit.id,
      name,
      description,
      icon,
      color: selectedColor,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Edit Habit</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Habit Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Read 20 pages"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Description
            </label>
            <input
              type="text"
              placeholder="e.g. Before going to bed"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Icon
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border text-lg transition-transform active:scale-95 ${
                    icon === emoji
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-neutral-800 bg-neutral-950 hover:bg-neutral-800"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Color Tag
            </label>
            <div className="flex gap-2.5 pt-1">
              {COLOR_OPTIONS.map((cClass) => (
                <button
                  key={cClass}
                  type="button"
                  onClick={() => setSelectedColor(cClass)}
                  className={`h-7 w-7 rounded-full border-2 transition-all ${cClass.split(" ")[0]} ${
                    selectedColor === cClass ? "border-white scale-110" : "border-transparent opacity-70"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-neutral-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg hover:bg-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
