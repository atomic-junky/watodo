export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export type ModalMode = "create" | "edit" | "view";