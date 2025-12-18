import { type FileState, useSmartUpload } from "@hooks/useSmartUpload";
import { useSignal } from "@preact/signals";
import { useContext, useRef } from "preact/hooks";
import type {
    FieldValues,
    Path,
    PathValue,
    UseFormReturn,
} from "react-hook-form";
import { FormControlContext } from "../../Form";
import type { FormFileProps } from "../types";

export function useFormFile<T extends object>({
    multiple = false,
    name,
}: Pick<FormFileProps<T>, "multiple" | "name">) {
    // 1. Contexto del Formulario
    const form =
        useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);

    // 2. Estado Local UI
    const isDrag = useSignal<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Estado para Modals
    const editingImage = useSignal<File | null>(null);
    const showFileInfo = useSignal<File | null>(null);

    // 3. HOOK "SMART UPLOAD" (Integración Principal)
    const { uploadFiles, fileList, isUploading, removeFileState, clearFiles } =
        useSmartUpload();

    // ID único para el input
    const nameCustom = `${name as string}-${Math.random()
        .toString(36)
        .substring(7)}`;

    // --- MANEJADORES DE EVENTOS ---

    // A. Entrada de Archivos (Input o Drop)
    const handleFilesAdded = (incomingFiles: File[]) => {
        if (incomingFiles.length === 0) return;

        // Si no es múltiple, limpiamos la lista visual anterior
        if (!multiple) {
            clearFiles();
        }

        // Preparamos los archivos (si no es multiple, solo el primero)
        const filesToProcess = multiple ? incomingFiles : [incomingFiles[0]];

        // 1. DISPARAMOS LA SUBIDA (Hook)
        uploadFiles(filesToProcess, (uploadedKeys) => {
            // 2. CALLBACK DE ÉXITO: Actualizamos el Formulario con los KEYS de S3
            // Esto ocurre solo cuando la subida termina exitosamente.

            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            const currentFormValues = form.getValues(name) as any;
            let newValue: string | string[];

            if (multiple) {
                // Si es array, concatenamos
                const prev = Array.isArray(currentFormValues)
                    ? currentFormValues
                    : [];
                // Filtramos nulls por si acaso
                newValue = [...prev, ...uploadedKeys].filter(Boolean);
            } else {
                // Si es simple, reemplazamos
                newValue = uploadedKeys[0];
            }

            // Actualizamos React Hook Form
            form.setValue(
                name as unknown as Path<T>,
                newValue as PathValue<T, Path<T>>,
                { shouldValidate: true, shouldDirty: true }
            );
        });
    };

    const onDrop = (e: DragEvent) => {
        e.preventDefault();
        isDrag.value = false;
        if (e.dataTransfer?.files) {
            handleFilesAdded(Array.from(e.dataTransfer.files));
        }
    };

    const onFileSelect = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.files) {
            handleFilesAdded(Array.from(target.files));
        }
        // Reset del input para permitir subir lo mismo si se borró
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // B. Eliminación de Archivos (Modificado para usar removeFileState del hook)
    const handleRemove = (fileState: FileState) => {
        // 1. Quitar de la lista visual y manejar abort/delete S3 (Hook)
        removeFileState(fileState.id);

        // 2. Quitar del valor del formulario (Solo si ya tenía Key generado)
        if (fileState.key) {
            const currentVal: string | string[] = form.getValues(name);

            if (Array.isArray(currentVal)) {
                // Filtrar del array
                const newVal = currentVal.filter(
                    (k: string) => k !== fileState.key
                );
                form.setValue(
                    name as unknown as Path<T>,
                    (newVal.length > 0 ? newVal : []) as PathValue<T, Path<T>>,
                    {
                        shouldValidate: true,
                        shouldDirty: true,
                    }
                );
            } else {
                // Null si es único
                form.setValue(
                    name as unknown as Path<T>,
                    null as PathValue<T, Path<T>>,
                    {
                        shouldValidate: true,
                        shouldDirty: true,
                    }
                );
            }
        }
    };

    return {
        form,
        isDrag,
        fileInputRef,
        editingImage,
        showFileInfo,
        uploadFiles,
        fileList,
        isUploading,
        removeFileState,
        clearFiles,
        nameCustom,
        handleFilesAdded,
        onDrop,
        onFileSelect,
        handleRemove,
    };
}
