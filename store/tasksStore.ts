import { create } from "zustand";
import { addTask, deleteTask, getTasksForDay, updateTask } from "../services/tasksService";
import { CreateTask, TaskAction, TasksState, UpdateTask } from "../types/taskTypes";

export const useTasksStore = create<TaskAction & TasksState>((set, get) => ({
    tasks: [],
    loading: false,
    error: null,

    getTasks: async (day: Date) => {
        set({ loading: true, error: null });
        try {
            const response = await getTasksForDay(day);
            if (response.success && response.data) {
                set({ tasks: response.data, loading: false });
            } else {
                set({ loading: false, error: response.error || "Failed to fetch tasks" });
            }
        } catch (error) {
            set({ loading: false, error: (error as Error).message });
        }
    },
    addTask: async (task: CreateTask) => {
        set({ loading: true, error: null });
        try {
            const response = await addTask(task);
            if (response.success && response.data) {
                set((state) => ({
                    tasks: [response.data!, ...state.tasks],
                    loading: false,
                }));
                return response.data;
            } else {
                set({ loading: false, error: response.error || "Failed to add a newtask" });
                return null;
            }
        } catch (error) {
            set({ loading: false, error: (error as Error).message });
            return null;
        }
    },
    updateTask: async (taskId: string, task: Partial<UpdateTask>) => {
        set({ loading: true, error: null });
        try {
            const response = await updateTask(taskId, task as UpdateTask);
            if (response.success && response.data) {
                set((state) => ({
                    tasks: state.tasks.map((task) => (task.id === taskId ? response.data! : task)),
                    loading: false,
                }));
            } else {
                set({ loading: false, error: response.error || "Failed to update the task" });
            }
        } catch (error) {
            set({ loading: false, error: (error as Error).message });
        }
    },
    deleteTask: async (taskId: string) => {
        set({ loading: true, error: null });
        try {
            const response = await deleteTask(taskId);
            if (response.success) {
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== taskId),
                    loading: false,
                }));
            } else {
                set({ loading: false, error: response.error || "Failed to delete the task" });
            }
        } catch (error) {
            set({ loading: false, error: (error as Error).message });
        }
    },
}))

export const useTasks = () => useTasksStore((state) => state.tasks);