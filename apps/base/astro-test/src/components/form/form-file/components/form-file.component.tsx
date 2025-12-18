import { Badge } from "@components/extras/badge";
import Button from "@components/extras/button";
import Card from "@components/extras/card";
import ImageEditor from "@components/extras/image-editor";
import Modal from "@components/extras/modal";
import { cn } from "@infrastructure/libs/client/helpers";
import {
    ImageIconSolid,
    PencilIconSolid,
    TrashIconSolid,
    UploadIconSolid,
    XIconSolid,
} from "@vigilio/react-icons";
import { anidarPropiedades } from "../..";
import { useFormFile } from "../hooks/use-form-file.hook";
import { formatFileSize, getFileTypeColor, getIcon } from "../libs";
import type { FormFileProps } from "../types";
import { FileInfo } from "./file-info.component";

export function FormFile<T extends object>(props: FormFileProps<T>) {
    const {
        multiple = false,
        accept = "*",
        typesText = "jpg, png, webp, pdf",
        title,
        showButtonClean = false,
        fileNormal = "big",
        height = 200,
        required = false,
        placeholder,
        showButonCopy,
        smallContent,
        ...rest
    } = props;

    const {
        form,
        isDrag,
        fileInputRef,
        editingImage,
        showFileInfo,
        isUploading,
        fileList,
        clearFiles,
        handleRemove,
        handleFilesAdded,
        onDrop,
        onFileSelect,
        nameCustom,
    } = useFormFile(props);

    // Obtener error del form
    const error = anidarPropiedades(
        form.formState.errors,
        (props.name as string).split(".")
    );

    // --- RENDERIZADO: MODO PEQUEÑO (BOTÓN) ---
    if (fileNormal === "small") {
        return (
            <div className="flex items-center gap-2">
                <input
                    id={nameCustom}
                    ref={fileInputRef}
                    type="file"
                    hidden
                    multiple={multiple}
                    accept={accept}
                    onChange={onFileSelect}
                    {...rest}
                />
                <Button
                    type="button"
                    variant="outline"
                    className="relative flex items-center gap-2"
                    onClick={() =>
                        !isUploading.value && fileInputRef.current?.click()
                    }
                    disabled={isUploading.value}
                >
                    {smallContent || (
                        <>
                            {isUploading.value ? (
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                            ) : (
                                <UploadIconSolid className="w-4 h-4" />
                            )}
                            <span>Subir</span>
                        </>
                    )}
                    {fileList.value.length > 0 && (
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                            {fileList.value.length}
                        </span>
                    )}
                </Button>
                {error && (
                    <p className="text-sm text-destructive">{error.message}</p>
                )}
            </div>
        );
    }

    // --- RENDERIZADO: MODO NORMAL/GRANDE (CARD) ---
    return (
        <div className="w-full space-y-2">
            {/* 1. Header & Labels */}
            <div className="flex items-center justify-between">
                {title && (
                    <label
                        htmlFor={nameCustom}
                        className="text-sm font-semibold text-foreground flex items-center gap-1"
                    >
                        {title}
                        {required && (
                            <span className="text-destructive">*</span>
                        )}
                    </label>
                )}

                <div className="flex gap-2">
                    {showButonCopy &&
                        fileList.value.length > 0 &&
                        fileList.value[0].file && (
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        URL.createObjectURL(
                                            fileList.value[0].file
                                        )
                                    );
                                }}
                                title="Copiar URL Blob (Preview)"
                            >
                                <ImageIconSolid className="w-4 h-4" />
                            </Button>
                        )}
                    {showButtonClean && fileList.value.length > 0 && (
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => {
                                clearFiles();
                                form.setValue(
                                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                    props.name as any,
                                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                    (multiple ? [] : null) as any
                                );
                            }}
                        >
                            <XIconSolid className="w-4 h-4 mr-1" /> Limpiar
                        </Button>
                    )}
                </div>
            </div>

            {/* 2. Input Oculto */}
            <input
                id={nameCustom}
                ref={fileInputRef}
                type="file"
                hidden
                multiple={multiple}
                accept={accept}
                onChange={onFileSelect}
                {...rest}
            />

            {/* 3. Zona de Drop (Card Principal) */}
            <Card
                className={cn(
                    "relative transition-all duration-200 overflow-hidden",
                    isDrag.value
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-dashed border-2 border-border hover:border-primary/50 hover:bg-accent/5",
                    error ? "border-destructive bg-destructive/5" : "",
                    "cursor-pointer"
                )}
                style={{ minHeight: height }}
                onClick={(e) => {
                    // Evitar abrir el selector si hacemos clic en botones internos
                    if ((e.target as HTMLElement).closest("button")) return;
                    if (!isUploading.value) fileInputRef.current?.click();
                }}
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                onDrop={onDrop as any} // Tipado de Preact/React
                onDragOver={(e) => {
                    e.preventDefault();
                    isDrag.value = true;
                }}
                onDragLeave={() => {
                    isDrag.value = false;
                }}
            >
                <Card.content className="p-4 flex flex-col justify-center min-h-[inherit]">
                    {/* A. ESTADO VACÍO */}
                    {fileList.value.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-6">
                            <div className="mb-3 p-3 bg-muted rounded-full">
                                {isUploading.value ? (
                                    <span className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full block" />
                                ) : (
                                    <UploadIconSolid className="w-6 h-6 text-muted-foreground" />
                                )}
                            </div>
                            <p className="text-sm font-medium">
                                {isDrag.value
                                    ? "¡Suelta aquí!"
                                    : placeholder ||
                                      "Haz clic o arrastra archivos"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 px-4">
                                {typesText}
                            </p>
                        </div>
                    ) : (
                        /* B. LISTA DE ARCHIVOS (GRID) */
                        <div
                            className={cn(
                                "grid gap-3",
                                fileList.value.length > 1
                                    ? "grid-cols-1 md:grid-cols-2"
                                    : "grid-cols-1"
                            )}
                        >
                            {fileList.value.map((fileState) => (
                                <div
                                    key={fileState.id}
                                    className="group relative flex items-start gap-3 p-3 rounded-lg border bg-background shadow-sm hover:shadow-md transition-all"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Preview Thumbnail */}
                                    <div className="w-16 h-16 rounded-md bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center border">
                                        {fileState.file.type.startsWith(
                                            "image/"
                                        ) ? (
                                            <img
                                                src={URL.createObjectURL(
                                                    fileState.file
                                                )}
                                                alt="preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            getIcon(fileState.file.type)
                                        )}

                                        {/* Overlay de acciones rápidas (Editor/Info) */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 rounded-md">
                                            {fileState.file.type.startsWith(
                                                "image/"
                                            ) && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-6 w-6 text-white hover:text-primary hover:bg-white/20"
                                                    onClick={() => {
                                                        editingImage.value =
                                                            fileState.file;
                                                    }}
                                                >
                                                    <PencilIconSolid className="w-3 h-3" />
                                                </Button>
                                            )}
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="ghost"
                                                className="h-6 w-6 text-white hover:text-primary hover:bg-white/20"
                                                onClick={() => {
                                                    showFileInfo.value =
                                                        fileState.file;
                                                }}
                                            >
                                                <PencilIconSolid className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Info del Archivo */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center h-16">
                                        <p
                                            className="text-sm font-medium truncate pr-6"
                                            title={fileState.file.name}
                                        >
                                            {fileState.file.name}
                                        </p>

                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-[10px] px-1 h-5",
                                                    getFileTypeColor(
                                                        fileState.file.type
                                                    )
                                                )}
                                            >
                                                {fileState.file.type
                                                    .split("/")[1]
                                                    ?.toUpperCase() || "FILE"}
                                            </Badge>
                                            <span className="text-[10px] text-muted-foreground">
                                                {formatFileSize(
                                                    fileState.file.size
                                                )}
                                            </span>
                                        </div>

                                        {/* STATUS BAR (Modificado para mostrar progreso) */}
                                        <div className="mt-1.5 flex items-center gap-2 h-4">
                                            {(fileState.status === "PENDING" ||
                                                fileState.status ===
                                                    "UPLOADING") && (
                                                <div className="flex-1">
                                                    {/* Barra de Progreso */}
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5 relative overflow-hidden">
                                                        <div
                                                            className={cn(
                                                                "h-1.5 rounded-full transition-all duration-300",
                                                                fileState.status ===
                                                                    "PENDING"
                                                                    ? "bg-gray-400"
                                                                    : "bg-primary"
                                                            )}
                                                            style={{
                                                                width: `${fileState.progress}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    {/* Porcentaje y estado de texto */}
                                                    <div className="flex justify-between items-center mt-0.5">
                                                        <span className="text-[10px] text-muted-foreground">
                                                            {fileState.status ===
                                                            "PENDING"
                                                                ? "En cola..."
                                                                : "Subiendo..."}
                                                        </span>
                                                        <span className="text-[10px] font-semibold text-primary">
                                                            **
                                                            {fileState.progress}
                                                            %**
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {fileState.status ===
                                                "COMPLETED" && (
                                                <div className="flex items-center gap-1 text-green-600">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                                    <span className="text-[10px] font-bold">
                                                        Completado
                                                    </span>
                                                </div>
                                            )}
                                            {fileState.status === "ERROR" && (
                                                <span className="text-[10px] text-destructive font-bold">
                                                    Error
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Botón Borrar (La 'X' o Papelera) */}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        // Usamos TrashIconSolid aquí para representar la eliminación, que visualmente actúa como la 'X'
                                        className="h-6 w-6 absolute top-2 right-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleRemove(fileState)}
                                    >
                                        <TrashIconSolid className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </Card.content>
            </Card>

            {/* 4. Mensaje de Error */}
            {error && (
                <div className="flex items-center gap-2 mt-1 text-destructive text-sm animate-in slide-in-from-top-1 fade-in">
                    <XIconSolid className="w-4 h-4" />
                    {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                    <span>{error.message as any}</span>
                </div>
            )}

            {/* --- MODALS --- */}

            {/* Editor de Imagen */}
            <Modal
                isOpen={!!editingImage.value}
                onClose={() => {
                    editingImage.value = null;
                }}
                contentClassName="max-w-4xl w-full"
                content={
                    <div className="flex items-center gap-2 text-xl font-bold mb-4">
                        <ImageIconSolid className="w-6 h-6" /> Editor de Imagen
                    </div>
                }
            >
                <ImageEditor
                    file={editingImage.value!}
                    onClose={() => {
                        editingImage.value = null;
                    }}
                    onSave={(editedFile: File) => {
                        // Reemplazamos el archivo en la lista local y reiniciamos ID para re-render
                        const updatedList = fileList.value.map((item) =>
                            item.file === editingImage.value
                                ? {
                                      ...item,
                                      file: editedFile,
                                      id: editedFile.name + Date.now(),
                                      status: "PENDING" as const,
                                  } // PENDING para que se pueda volver a subir si se desea
                                : item
                        );
                        // Nota: Si quieres subir automáticamente el editado, deberías llamar a uploadFiles([editedFile])
                        fileList.value = updatedList;
                        editingImage.value = null;
                    }}
                />
            </Modal>

            {/* Info del Archivo */}
            <Modal
                isOpen={!!showFileInfo.value}
                onClose={() => {
                    showFileInfo.value = null;
                }}
                contentClassName="max-w-md"
                content={
                    <div className="font-bold text-lg mb-4">
                        Detalles del Archivo
                    </div>
                }
            >
                <FileInfo file={showFileInfo.value!} />
            </Modal>
        </div>
    );
}

export default FormFile;
