import { TASK_COLORS, TASK_FREQUENCY } from "../constants/taskConstants";

export interface Habit {
  id: string;
  title: string;
  description: string;
  frequency: HabitFrequency;
  color?: HabitColor;
  category: string;
  doneHistory: Date[];
}

export interface HabitsState {
  habits: Habit[];
  loading: boolean;
  error: string | null;
}

export type HabitFrequency = typeof TASK_FREQUENCY[number];
export type HabitColor = typeof TASK_COLORS[number];

export interface HabitAction {
  getHabits: () => Promise<void>;
  addHabit: (habit: CreateHabit) => Promise<Habit | null>;
  updateHabit: (habitId: string, habit: Partial<UpdateHabit>) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
}

export interface ModalHabitProps {
  visible: boolean;
  habit?: Habit;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface CreateHabit {
  title: string;
  description: string;
  frequency: HabitFrequency;
  color?: HabitColor;
  category: string;
}

export interface UpdateHabit {
  id: string;
  title: string;
  description: string;
  frequency: HabitFrequency;
  color?: HabitColor;
  category: string;
  doneHistory: Date[];
}

export interface EditHabits {
  habits: Habit[];
}

export interface ListHabits {
  onViewHabits: () => void;
}

export interface ListHabitsItemProps {
  habit: Habit;
  onView: (habit: Habit) => void;
}