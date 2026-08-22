import { TASK_COLORS } from "../constants/taskConstants";

export interface Habit {
  id: string;
  title: string;
  description: string;
  color?: HabitColor;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}   

export type HabitColor = typeof TASK_COLORS[number];