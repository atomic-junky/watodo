import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { ServiceResponse } from "../types/commonTypes";
import { CreateHabit, Habit, UpdateHabit } from "../types/habitTypes";

const NOTES_COLLECTION = 'habits';

// Firestore rejects explicit `undefined` field values (e.g. an unset optional `color`).
function omitUndefined<T extends object>(data: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined)
    ) as Partial<T>;
}

export async function getHabits(): Promise<ServiceResponse<Habit[] | []>> {
    try {
        const habitsQuery = query(
            collection(db, NOTES_COLLECTION)
        );

        const query_snapshot = await getDocs(habitsQuery);
        const habits: Habit[] = [];
        query_snapshot.forEach((doc) => {
            const data = doc.data();

            const habit: Habit = {
                id: doc.id,
                title: data.title,
                description: data.description,
                frequency: data.frequency,
                color: data.color,
                category: data.category,
                doneHistory: data.doneHistory,
            }
            habits.push(habit);
        });

        return {success: true, data: habits};

    } catch (error) {
        return {success: false, error: (error as Error).message};
    }
}

export async function getHabit(habitId: string): Promise<ServiceResponse<Habit | null>> {
    try {
        const habitRef = doc(db, NOTES_COLLECTION, habitId);        
        const habitDoc = await getDoc(habitRef);
        if (!habitDoc.exists()) {
            return {success: false, error: "Habit not found."};
        }

        const data = habitDoc.data();
        
        const habit: Habit = {
            id: habitDoc.id,
            title: data.title,
            description: data.description,
            frequency: data.frequency,
            color: data.color,
            category: data.category,
            doneHistory: data.doneHistory,
        }

        return {success: true, data: habit};
    } catch (error) {
        return {success: false, error: (error as Error).message};
    }
}


export async function addHabit(habitsData: CreateHabit): Promise<ServiceResponse<Habit | null>> {
    try {
        const docRef = await addDoc(collection(db, NOTES_COLLECTION), omitUndefined(habitsData));
        const habits: Habit = {
            id: docRef.id,
            ...habitsData,
            doneHistory: [],
        }

        return {success: true, data: habits};
    } catch (error) {
        return {success: false, error: (error as Error).message};
    }
}

export async function updateHabit(habitsId: string, habitsData: UpdateHabit): Promise<ServiceResponse<Habit | null>> {
    try {
        const updateData = {
            ...habitsData
        }

        delete (updateData as any).id;

        const docRef = doc(db, NOTES_COLLECTION, habitsId);
        await updateDoc(docRef, omitUndefined(updateData));

        const updatedDoc = await getDoc(docRef);
        
        if (!updatedDoc.exists()) {
            return {success: false, error: "Habit not found."};
        }

        const data = updatedDoc.data();
        const updatedHabitDoc: Habit = {
            id: updatedDoc.id,
            title: data.title,
            description: data.description,
            frequency: data.frequency,
            color: data.color,
            category: data.category,
            doneHistory: data.doneHistory,
        };

        return {success: true, data: updatedHabitDoc};
    } catch (error) {
        return {success: false, error: (error as Error).message};
    }
}


export async function deleteHabit(habitId: string): Promise<ServiceResponse<null>> {
    try {
        const docRef = doc(db, NOTES_COLLECTION, habitId);
        await deleteDoc(docRef);

        return {success: true};

    } catch (error) {
        return {success: false, error: (error as Error).message};
    }
}