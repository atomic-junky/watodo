import { TASK_STATUS } from "../constants/taskConstants";

export interface Task {
    id: string;
    index: number;
    day: Date;
    title: string;
    status: TaskStatus;
}

export interface TasksState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
}

export type TaskStatus = typeof TASK_STATUS[number];

export interface TaskAction {
    getTasks: (day: Date) => Promise<void>;
    addTask: (task: CreateTask) => Promise<Task | null>;
    updateTask: (taskId: string, task: Partial<UpdateTask>) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
}

export interface ModalTasksProps {
    visible: boolean;
    tasks?: Task[];
    onClose: () => void;
    onSuccess?: () => void;
    onCreate?: () => void;
    onEdit?: (task: Task) => void;
}

export interface CreateTask {
    title: string;
    index: number;
}

export interface UpdateTask {
    id: string;
    title: string;
    status: TaskStatus;
}

export interface EditTasks {
    tasks: Task[];
}

export interface ListTasks {
    onViewTasks: (day: Date) => void;
}

export interface ListTasksItemProps {
    task: Task;
    onView: (task: Task) => void;
}