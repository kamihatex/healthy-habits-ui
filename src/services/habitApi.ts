import api from "./api";

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: "daily" | "weekly" | "monthly";
  targetCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHabitData {
  name: string;
  description: string;
  frequency: "daily" | "weekly" | "monthly";
  targetCount: number;
}

export interface UpdateHabitData {
  name?: string;
  description?: string;
  frequency?: "daily" | "weekly" | "monthly";
  targetCount?: number;
  isActive?: boolean;
}

export const habitsService = {
  getAll: async (): Promise<Habit[]> => {
    try {
      const response = await api.get(`/habits`);
      console.log("Habits response:", response.data);
      return response.data.habits || response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Get habits error:", error.response?.data);
      throw error;
    }
  },

  getById: async (id: string): Promise<Habit> => {
    const response = await api.get(`/habits/${id}`);
    return response.data.habit || response.data;
  },

  create: async (data: CreateHabitData): Promise<Habit> => {
    const response = await api.post("/habits", data);
    return response.data.habit;
  },

  update: async (id: string, data: UpdateHabitData): Promise<Habit> => {
    const response = await api.put(`/habits/${id}`, data);
    return response.data.habit;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/habits/${id}`);
  },
};
