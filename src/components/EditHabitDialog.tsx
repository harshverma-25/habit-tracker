"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Edit2, X } from "lucide-react";
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

  const shouldReduceMotion = useReducedMotion();

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Box */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-habit-title"
            className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:p-6 shadow-2xl custom-scrollbar"
          >
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Edit2 className="h-4.5 w-4.5" />
                </div>
                <h3 id="edit-habit-title" className="text-lg font-bold text-white">
                  Edit Habit
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="edit-habit-name-input" className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Habit Name *
                </label>
                <input
                  id="edit-habit-name-input"
                  type="text"
                  required
                  placeholder="e.g. Read 20 pages"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="edit-habit-desc-input" className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <input
                  id="edit-habit-desc-input"
                  type="text"
                  placeholder="e.g. Before going to bed"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Icon
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <motion.button
                      key={emoji}
                      type="button"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
                      onClick={() => setIcon(emoji)}
                      aria-label={`Select icon ${emoji}`}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border text-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        icon === emoji
                          ? "border-blue-500 bg-blue-500/20 shadow-md shadow-blue-500/20"
                          : "border-neutral-800 bg-neutral-950 hover:bg-neutral-800 text-neutral-300"
                      }`}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Color Tag
                </label>
                <div className="flex gap-3 pt-1">
                  {COLOR_OPTIONS.map((cClass, idx) => (
                    <motion.button
                      key={cClass}
                      type="button"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.15 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                      onClick={() => setSelectedColor(cClass)}
                      aria-label={`Select color option ${idx + 1}`}
                      className={`h-8 w-8 rounded-full border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${cClass.split(" ")[0]} ${
                        selectedColor === cClass
                          ? "border-white scale-110 shadow-lg shadow-white/20"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-neutral-800/80 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  Save Changes
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
