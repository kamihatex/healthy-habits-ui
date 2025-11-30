import React, { useState, useEffect } from "react";
import {
  habitsService,
  type CreateHabitData,
  type Habit,
} from "../services/habitApi";
import { useAppSelector } from "../store";

const HabitsDashboard: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const { user } = useAppSelector((state) => state.userInfo);
  // Form state
  const [formData, setFormData] = useState<CreateHabitData>({
    name: "",
    description: "",
    frequency: "daily",
    targetCount: 1,
  });

  // Load habits on component mount
  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await habitsService.getAll();
      setHabits(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load habits");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (habit?: Habit) => {
    if (habit) {
      setEditingHabit(habit);
      setFormData({
        name: habit.name,
        description: habit.description,
        frequency: habit.frequency,
        targetCount: habit.targetCount,
      });
    } else {
      setEditingHabit(null);
      setFormData({
        name: "",
        description: "",
        frequency: "daily",
        targetCount: 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHabit(null);
    setFormData({
      name: "",
      description: "",
      frequency: "daily",
      targetCount: 1,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingHabit) {
        await habitsService.update(editingHabit.id, formData);
      } else {
        await habitsService.create(formData);
      }
      await loadHabits();
      handleCloseModal();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save habit");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) {
      return;
    }

    try {
      await habitsService.delete(id);
      await loadHabits();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete habit");
    }
  };

  const getFrequencyBadgeColor = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "bg-blue-100 text-blue-800";
      case "weekly":
        return "bg-green-100 text-green-800";
      case "monthly":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading habits...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Habits</h2>
          <p className="text-gray-600 mt-1">
            Track and manage your healthy habits
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          + New Habit
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Habits Grid */}
      {habits.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">
            No habits yet. Create your first one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {habit.name}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getFrequencyBadgeColor(
                    habit.frequency
                  )}`}
                >
                  {habit.frequency}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{habit.description}</p>

              <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                <span className="font-medium">Target:</span>
                <span>
                  {habit.targetCount}x per{" "}
                  {habit.frequency === "daily"
                    ? "day"
                    : habit.frequency === "weekly"
                    ? "week"
                    : "month"}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(habit)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(habit.id)}
                  className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-[rgb(0_0_0/0.5)] flex items-center justify-center p-4 z-50"
          style={
            {
              //  backgroundColor: "rgba(0, 0, 0, 0.5)",
            }
          }
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {editingHabit ? "Edit Habit" : "Create New Habit"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Habit Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., Read for 30 minutes"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="What is this habit about?"
                />
              </div>

              <div>
                <label
                  htmlFor="frequency"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Frequency *
                </label>
                <select
                  id="frequency"
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      frequency: e.target.value as
                        | "daily"
                        | "weekly"
                        | "monthly",
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="targetCount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Target Count *
                </label>
                <input
                  id="targetCount"
                  type="number"
                  min="1"
                  value={formData.targetCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetCount: parseInt(e.target.value),
                    })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  {editingHabit ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitsDashboard;
