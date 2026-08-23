import { create } from "zustand";
import { addHabit, deleteHabit, getHabit, getHabits, updateHabit } from "../services/habitsService";
import { CreateHabit, HabitAction, HabitsState, UpdateHabit } from "../types/habitTypes";

export const useHabitsStore = create<HabitAction & HabitsState>((set, get) => ({
    habits: [],
    loading: false,
    error: null,

    getHabits: async () => {
        set({ loading: true, error: null });
        try {
            const response = await getHabits();
            if (response.success) {
                set({ habits: response.data, loading: false });
            } else {
                set({ loading: false, error: response.error || "Failed to fetch habit" });
            }
        } catch (error) {
            set({ loading: false, error: (error as Error).message });
        }
    },
    getHabit: async (habitId: string) => {
        set({ loading: true, error: null });
        try {
            const response = await getHabit(habitId);
            if (response.success && response.data) {
                set((state) => ({
                    habits: [response.data!, ...state.habits],
                    loading: false
                }));
                return response.data;
            }
            else {
                set({ loading: false, error: response.error || "Failed to fetch habit" });
                return null;
            }
        } catch (error) {
            set({ loading: false, error: (error as Error).message });
        }
    },
    addHabit: async (notes: CreateHabit) => {
        set({ loading: true, error: null });
        try {
            const response = await addHabit(notes);
            if (response.success && response.data) {
                set((state) => ({
                    habits: [response.data!, ...state.habits],
                    loading: false
                }));
                return response.data;
            } else {
                set({ loading: false, error: response.error || "Failed to add a new habit" });
                return null;
            }
        } catch (error) {
            set({ loading: false, error: (error as Error).message });
            return null;
        }
    },
    updateHabit: async (notesId: string, notes: Partial<UpdateHabit>) => {
        set({ loading: true, error: null });
        try {
            const response = await updateHabit(notesId, notes as UpdateHabit);
            if (response.success && response.data) {
                set((state) => ({
                    habits: [response.data!, ...state.habits],
                    loading: false
                }));
            } else {
                set({ loading: false, error: response.error || "Failed to update the habit" });
            }
        } catch (error) {
            set({ loading: false, error: (error as Error).message });
        }
    },
    deleteHabit: async (habitId: string) => {
        set({ loading: true, error: null });
        try {
            const response = await deleteHabit(habitId);
            if (response.success) {
                set((state) => ({
                    notes: response.data,
                    loading: false,
                }));
            } else {
                set({ loading: false, error: response.error || "Failed to delete the habit" });
            }
        } catch (error) {
            set({ loading: false, error: (error as Error).message });
        }
    },
}))

export const useHabits = () => useHabitsStore((state) => state.habits);