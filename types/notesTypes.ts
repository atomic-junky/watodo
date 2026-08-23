export interface Notes {
    id: string;
    day: Date;
    text: string;
}

export interface NotesState {
    notes: Notes | null;
    loading: boolean;
    error: string | null;
}

export interface NotesAction {
    getNotes: (day: Date) => Promise<void>;
    hasNotes: (date: Date) => Promise<boolean>;
    addNotes: (notes: CreateNotes) => Promise<Notes | null>;
    updateNotes: (noteId: string, notes: Partial<UpdateNotes>) => Promise<void>;
    deleteNotes: (day: Date) => Promise<void>;
}

export interface ModalNotesProps {
    visible: boolean;
    notes?: Notes;
    day: Date;
    onClose: () => void;
    onSuccess?: () => void;
    onCreate?: () => void;
    onEdit?: (notes: Notes) => void;
}

export interface CreateNotes {
    text: string;
    day: Date;
}

export interface UpdateNotes {
    id: string;
    text: string;
}

export interface EditNotes {
    notes: Notes[];
}

export interface GetNotes {
    onViewNotes: (day: Date) => void;
}

export interface GetNotesItemProps {
    note: Notes;
    onView: (note: Notes) => void;
}