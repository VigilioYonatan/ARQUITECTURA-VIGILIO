export type UploadRole = "default" | "avatar" | "document";

export interface UploadRule {
    maxSize: number;
    mimeTypes: string[];
    resize?: { width?: number; height?: number; fit?: any };
    maxFiles?: number;
}

export const UPLOAD_RULES = {
    default: {
        maxSize: 5 * 1024 * 1024, // 5MB
        mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
    },
    avatar: {
        maxSize: 2 * 1024 * 1024, // 2MB
        mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    },
    document: {
        maxSize: 10 * 1024 * 1024, // 10MB
        mimeTypes: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
    },
};
