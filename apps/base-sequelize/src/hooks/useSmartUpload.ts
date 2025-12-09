import { useSignal } from "@preact/signals";
import pLimit from "p-limit";

// Tipos para el estado visual
export type UploadStatus = "PENDING" | "UPLOADING" | "COMPLETED" | "ERROR";
export interface FileState {
    id: string;
    file: File;
    status: UploadStatus;
    key?: string; // El path final en S3 (ej: uploads/foto.jpg)
}

const CHUNK_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_PARALLEL_CHUNKS = 4;
const MAX_RETRIES = 3;
const CHUNK_THRESHOLD = 50 * 1024 * 1024; // 50 MB

export function useSmartUpload() {
    const isUploading = useSignal(false);
    const fileList = useSignal<FileState[]>([]);

    // --- ESTRATEGIA 1: SIMPLE ---
    const uploadSimple = async (file: File) => {
        const res = await fetch("/api/uploads/presigned-simple", {
            method: "POST",
            body: JSON.stringify({ fileName: file.name, fileType: file.type }),
            headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Error obteniendo URL");
        const { uploadUrl, key } = await res.json();

        await fetch(uploadUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
        });
        return key;
    };

    // --- ESTRATEGIA 2: MULTIPART (Chunking) ---
    const uploadMultipart = async (file: File) => {
        const totalParts = Math.ceil(file.size / CHUNK_SIZE);

        // 1. Iniciar
        const initRes = await fetch("/api/s3/multipart/create", {
            method: "POST",
            body: JSON.stringify({ filename: file.name, type: file.type }),
            headers: { "Content-Type": "application/json" },
        });
        if (!initRes.ok) throw new Error("Falló init multipart");
        const { uploadId, key } = await initRes.json();

        // 2. Subir partes
        const chunkLimit = pLimit(MAX_PARALLEL_CHUNKS);
        const partPromises: Promise<
            { PartNumber: number; ETag: string } | undefined
        >[] = [];

        for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
            const start = (partNumber - 1) * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunkBlob = file.slice(start, end);

            partPromises.push(
                chunkLimit(async () => {
                    let attempt: number = 0;
                    while (attempt < MAX_RETRIES) {
                        try {
                            const signRes = await fetch(
                                "/api/s3/multipart/sign-part",
                                {
                                    method: "POST",
                                    body: JSON.stringify({
                                        key,
                                        uploadId,
                                        partNumber,
                                    }),
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                }
                            );
                            const { url } = await signRes.json();

                            const uploadRes = await fetch(url, {
                                method: "PUT",
                                body: chunkBlob,
                            });
                            if (!uploadRes.ok) throw new Error("Error S3");

                            const eTag = uploadRes.headers.get("ETag");
                            if (!eTag) throw new Error("No ETag");

                            return {
                                PartNumber: partNumber,
                                ETag: eTag.replaceAll('"', ""),
                            };
                        } catch (e) {
                            attempt++;
                            if (attempt >= MAX_RETRIES) throw e;
                            await new Promise((r) =>
                                setTimeout(r, 1000 * attempt)
                            );
                        }
                    }
                })
            );
        }

        const partsResults = await Promise.all(partPromises);
        const sortedParts = partsResults.sort(
            (a, b) => a!.PartNumber - b!.PartNumber
        );

        // 3. Completar
        await fetch("/api/s3/multipart/complete", {
            method: "POST",
            body: JSON.stringify({ key, uploadId, parts: sortedParts }),
            headers: { "Content-Type": "application/json" },
        });

        return key;
    };

    // --- ORQUESTADOR ---
    const uploadFiles = async (
        files: File[],
        onComplete?: (keys: string[]) => void
    ) => {
        isUploading.value = true;

        // Mezclamos archivos nuevos con los existentes si es necesario
        // Aquí reiniciamos la lista para simplificar, pero podrías hacer append
        const newFileStates: FileState[] = files.map((f) => ({
            id: f.name + Date.now(),
            file: f,
            status: "PENDING",
        }));

        fileList.value = [...fileList.value, ...newFileStates];

        const limit = pLimit(3); // Máximo 3 archivos simultáneos

        const promises = newFileStates.map((fileState) => {
            return limit(async () => {
                try {
                    // Actualizar UI a UPLOADING
                    fileList.value = fileList.value.map((f) =>
                        f.id === fileState.id
                            ? { ...f, status: "UPLOADING" }
                            : f
                    );

                    let key = "";
                    if (fileState.file.size > CHUNK_THRESHOLD) {
                        key = await uploadMultipart(fileState.file);
                    } else {
                        key = await uploadSimple(fileState.file);
                    }

                    // Actualizar UI a COMPLETED
                    fileList.value = fileList.value.map((f) =>
                        f.id === fileState.id
                            ? { ...f, status: "COMPLETED", key }
                            : f
                    );
                    return key;
                } catch (_e) {
                    fileList.value = fileList.value.map((f) =>
                        f.id === fileState.id ? { ...f, status: "ERROR" } : f
                    );
                    return null;
                }
            });
        });

        const results = await Promise.all(promises);
        const successfulKeys = results.filter((k) => k !== null) as string[];

        isUploading.value = false;

        if (onComplete && successfulKeys.length > 0) {
            onComplete(successfulKeys);
        }
    };

    const removeFileState = (id: string) => {
        fileList.value = fileList.value.filter((f) => f.id !== id);
    };

    const clearFiles = () => {
        fileList.value = [];
    };

    return {
        isUploading,
        fileList,
        uploadFiles,
        removeFileState,
        clearFiles,
    };
}
