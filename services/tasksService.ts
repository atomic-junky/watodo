import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { ServiceResponse } from "../types/commonTypes";
import { CreateTask, Task, UpdateTask } from "../types/taskTypes";

const TASKS_COLLECTION = 'tasks';


export async function getTasksForDay(day: Date): Promise<ServiceResponse<Task[]>> {
    try {
        const startOfDay = new Date(day);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const tasksQuery = query(
            collection(db, TASKS_COLLECTION),
            where('day', '>=', Timestamp.fromDate(startOfDay)),
            where('day', '<', Timestamp.fromDate(endOfDay)),
        );
        const query_snapshot = await getDocs(tasksQuery);
        const tasks: Task[] = [];

        query_snapshot.forEach((doc) => {
            const data = doc.data();

            const task: Task = {
                id: doc.id,
                index: data.index,
                day: data.day.toDate(),
                title: data.title,
                status: data.status
            }

            tasks.push(task);
        })

        tasks.sort((a, b) => a.index - b.index);

        return {success: true, data: tasks};

    } catch (error) {
        return {success: false, error: (error as Error).message};
    }
}


export async function addTask(taskData: CreateTask): Promise<ServiceResponse<Task>> {
    try {
        taskData.day.setHours(0, 0, 0, 0);
        const docRef = await addDoc(collection(db, TASKS_COLLECTION), taskData);

        const task: Task = {
            id: docRef.id,
            ...taskData,
            status: "todo"
        }

        return {success: true, data: task};
    } catch (error) {
        return {success: false, error: (error as Error).message};
    }
}

export async function updateTask(taskId: string, taskData: UpdateTask): Promise<ServiceResponse<Task>> {
    try {
        const updateData = {
            ...taskData
        }

        delete (updateData as any).id;

        const docRef = doc(db, TASKS_COLLECTION, taskId);
        await updateDoc(docRef, updateData);

        const updatedDoc = await getDoc(docRef);
        
        if (!updatedDoc.exists()) {
            return {success: false, error: "Task not found."};
        }

        const data = updatedDoc.data();
        const updatedTaskDoc: Task = {
            id: updatedDoc.id,
            index: data.index,
            day: data.day.toDate(),
            title: data.title,
            status: data.status
        };

        return {success: true, data: updatedTaskDoc};
    } catch (error) {
        return {success: false, error: (error as Error).message};
    }
}


export async function deleteTask(taskId: string): Promise<ServiceResponse<null>> {
    try {
        const docRef = doc(db, TASKS_COLLECTION, taskId);
        await deleteDoc(docRef);

        return {success: true};

    } catch (error) {
        return {success: false, error: (error as Error).message};
    }
}