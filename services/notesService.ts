import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { ServiceResponse } from "../types/commonTypes";
import { CreateNotes, Notes, UpdateNotes } from "../types/notesTypes";

const NOTES_COLLECTION = 'notes';


export async function getNotes(day: Date): Promise<ServiceResponse<Notes | null>> {
    try {
        const startOfDay = new Date(day);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const notesQuery = query(
            collection(db, NOTES_COLLECTION),
            where('day', '>=', Timestamp.fromDate(startOfDay)),
            where('day', '<', Timestamp.fromDate(endOfDay)),
        );
        const query_snapshot = await getDocs(notesQuery);
        const doc = query_snapshot.docs[0];
        if (!doc) {
            return {success: true, data: null};
        }

        const data = doc.data();
        const notes: Notes = {
            id: doc.id,
            day: data.day.toDate(),
            text: data.text,
        }

        return {success: true, data: notes};

    } catch (error) {
        return {success: false, error: (error as Error).message};
    }
}


export async function addNotes(notesData: CreateNotes): Promise<ServiceResponse<Notes | null>> {
    try {
        notesData.day.setHours(0, 0, 0, 0);
        const docRef = await addDoc(collection(db, NOTES_COLLECTION), notesData);
        const notes: Notes = {
            id: docRef.id,
            ...notesData
        }

        return {success: true, data: notes};
    } catch (error) {
        return {success: false, error: (error as Error).message};
    }
}

export async function updateNotes(notesId: string, notesData: UpdateNotes): Promise<ServiceResponse<Notes | null>> {
    try {
        const updateData = {
            ...notesData
        }

        delete (updateData as any).id;

        const docRef = doc(db, NOTES_COLLECTION, notesId);
        await updateDoc(docRef, updateData);

        const updatedDoc = await getDoc(docRef);
        
        if (!updatedDoc.exists()) {
            return {success: false, error: "Notes not found."};
        }

        const data = updatedDoc.data();
        const updatedNotesDoc: Notes = {
            id: updatedDoc.id,
            day: data.day.toDate(),
            text: data.text,
        };

        return {success: true, data: updatedNotesDoc};
    } catch (error) {
        return {success: false, error: (error as Error).message};
    }
}


export async function deleteNotes(day: Date): Promise<ServiceResponse<null>> {
    try {
        const startOfDay = new Date(day);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const notesQuery = query(
            collection(db, NOTES_COLLECTION),
            where('day', '>=', Timestamp.fromDate(startOfDay)),
            where('day', '<', Timestamp.fromDate(endOfDay)),
        );

        const query_snapshot = await getDocs(notesQuery);
        query_snapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });

        return {success: true};

    } catch (error) {
        return {success: false, error: (error as Error).message};
    }
}