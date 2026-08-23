import { create } from "zustand";
import { addNotes, deleteNotes, getNotes, updateNotes } from "../services/notesService";
import { CreateNotes, NotesAction, NotesState, UpdateNotes } from "../types/notesTypes";

export const useNotesStore = create<NotesAction & NotesState>((set, get) => ({
    notes: null,
    loading: false,
    error: null,

    getNotes: async (day: Date) => {
        set({ loading: true, error: null });
        try {
            const response = await getNotes(day);
            if (response.success) {
                set({ notes: response.data ?? null, loading: false });
            } else {
                set({ loading: false, error: response.error || "Failed to fetch notes" });
            }
        } catch (error) {
            set({ loading: false, error: (error as Error).message });
        }
    },
    hasNotes: async (date: Date) => {
        try {
            const response = await getNotes(date);
            return !!response.success && !!response.data;
        } catch (error) {
            set({ error: (error as Error).message });
            return false;
        }
    },
    addNotes: async (notes: CreateNotes) => {
        set({ loading: true, error: null });
        try {
            const response = await addNotes(notes);
            if (response.success && response.data) {
                set({
                    notes: response.data,
                    loading: false,
                });
                return response.data;
            } else {
                set({ loading: false, error: response.error || "Failed to add a newnotes" });
                return null;
            }
        } catch (error) {
            set({ loading: false, error: (error as Error).message });
            return null;
        }
    },
    updateNotes: async (notesId: string, notes: Partial<UpdateNotes>) => {
        set({ loading: true, error: null });
        try {
            const response = await updateNotes(notesId, notes as UpdateNotes);
            if (response.success && response.data) {
                set((state) => ({
                    notes: response.data!,
                    loading: false,
                }));
            } else {
                set({ loading: false, error: response.error || "Failed to update the notes" });
            }
        } catch (error) {
            set({ loading: false, error: (error as Error).message });
        }
    },
    deleteNotes: async (day: Date) => {
        set({ loading: true, error: null });
        try {
            const response = await deleteNotes(day);
            if (response.success) {
                set((state) => ({
                    notes: response.data,
                    loading: false,
                }));
            } else {
                set({ loading: false, error: response.error || "Failed to delete the notes" });
            }
        } catch (error) {
            set({ loading: false, error: (error as Error).message });
        }
    },
}))

export const useNotes = () => useNotesStore((state) => state.notes);