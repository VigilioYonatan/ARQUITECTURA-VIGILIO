import { type FileState, useSmartUpload } from "@hooks/useSmartUpload";
import { cn } from "@infrastructure/libs/client/helpers";
import { useSignal } from "@preact/signals";
import {
	CalendarIconSolid,
	CircleInfoIconSolid,
	FileIconSolid,
	HardDriveIconSolid,
	ImageIconSolid,
	PencilIconSolid,
	TrashIconSolid,
	UploadIconSolid,
	VideoIconSolid,
	XIconSolid,
} from "@vigilio/react-icons";
import type { JSX } from "preact";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import type {
	FieldValues,
	Path,
	PathValue,
	RegisterOptions,
	UseFormReturn,
} from "react-hook-form";
import { Badge } from "../extras/badge";
import Button from "../extras/button";
import Card from "../extras/card";
import Hr from "../extras/hr";
import ImageEditor from "../extras/image-editor";
import Modal from "../extras/modal";
import { anidarPropiedades } from ".";
import { FormControlContext } from "./Form";

export interface FormFileProps<T extends object> {
	title: string | JSX.Element | JSX.Element[];
	name: Path<T>;
	multiple?: boolean;
	accept?: string;
	typeFile?: "image" | "file" | "video" | "image-video" | { value: string };
	typesText?: string;
	options?: RegisterOptions<T, Path<T>>;
	showButonCopy?: boolean;
	showButtonClean?: boolean;
	fileNormal?: "big" | "normal" | "small";
	height?: number;
	smallContent?: JSX.Element | JSX.Element[];
	required?: boolean;
	placeholder?: string;
}

export interface FormFileProps<T extends object> {
	title: string | JSX.Element | JSX.Element[];
	name: Path<T>;
	multiple?: boolean;
	accept?: string;
	typeFile?: "image" | "file" | "video" | "image-video" | { value: string };
	typesText?: string;
	options?: RegisterOptions<T, Path<T>>;
	showButonCopy?: boolean;
	showButtonClean?: boolean;
	fileNormal?: "big" | "normal" | "small";
	height?: number;
	smallContent?: JSX.Element | JSX.Element[];
	required?: boolean;
	placeholder?: string;
}

export function FormFile<T extends object>({
	multiple = false,
	accept = "*",
	typeFile = "file",
	typesText = "jpg, png, webp, pdf",
	name,
	title,
	options,
	showButtonClean = false,
	fileNormal = "big",
	height = 200,
	required = false,
	placeholder,
	showButonCopy,
	smallContent,
	...rest
}: FormFileProps<T>) {
	// 1. Contexto del Formulario
	const form =
		useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);

	// 2. Estado Local UI
	const [isDrag, setIsDrag] = useState<boolean>(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Estado para Modals
	const editingImage = useSignal<File | null>(null);
	const [showFileInfo, setShowFileInfo] = useState<File | null>(null);

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

			const currentFormValues = form.getValues(name) as any;
			let newValue: string | string[];

			if (multiple) {
				// Si es array, concatenamos
				const prev = Array.isArray(currentFormValues) ? currentFormValues : [];
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
				{ shouldValidate: true, shouldDirty: true },
			);
		});
	};

	const onDrop = (e: DragEvent) => {
		e.preventDefault();
		setIsDrag(false);
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
				const newVal = currentVal.filter((k: string) => k !== fileState.key);
				form.setValue(
					name as unknown as Path<T>,
					(newVal.length > 0 ? newVal : []) as PathValue<T, Path<T>>,
					{
						shouldValidate: true,
						shouldDirty: true,
					},
				);
			} else {
				// Null si es único
				form.setValue(
					name as unknown as Path<T>,
					null as PathValue<T, Path<T>>,
					{
						shouldValidate: true,
						shouldDirty: true,
					},
				);
			}
		}
	};

	// --- HELPERS VISUALES ---
	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / k ** i).toFixed(2))} ${
			["Bytes", "KB", "MB", "GB"][i]
		}`;
	};

	const getFileTypeColor = (type: string) => {
		if (type.startsWith("image/"))
			return "bg-green-100 text-green-800 border-green-200";
		if (type.startsWith("video/"))
			return "bg-blue-100 text-blue-800 border-blue-200";
		return "bg-gray-100 text-gray-800 border-gray-200";
	};

	const getIcon = (type: string) => {
		if (type.startsWith("image/"))
			return <ImageIconSolid className="w-8 h-8 text-green-500" />;
		if (type.startsWith("video/"))
			return <VideoIconSolid className="w-8 h-8 text-blue-500" />;
		return <FileIconSolid className="w-8 h-8 text-gray-400" />;
	};

	// Obtener error del form
	const error = anidarPropiedades(
		form.formState.errors,
		(name as string).split("."),
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
					onClick={() => !isUploading.value && fileInputRef.current?.click()}
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
				{error && <p className="text-sm text-destructive">{error.message}</p>}
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
						{required && <span className="text-destructive">*</span>}
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
										URL.createObjectURL(fileList.value[0].file),
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
									name as unknown as Path<T>,
									(multiple ? [] : null) as any,
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
					isDrag
						? "border-primary bg-primary/5 ring-2 ring-primary/20"
						: "border-dashed border-2 border-border hover:border-primary/50 hover:bg-accent/5",
					error ? "border-destructive bg-destructive/5" : "",
					"cursor-pointer",
				)}
				style={{ minHeight: height }}
				onClick={(e) => {
					// Evitar abrir el selector si hacemos clic en botones internos
					if ((e.target as HTMLElement).closest("button")) return;
					if (!isUploading.value) fileInputRef.current?.click();
				}}
				onDrop={onDrop as any} // Tipado de Preact/React
				onDragOver={(e) => {
					e.preventDefault();
					setIsDrag(true);
				}}
				onDragLeave={() => setIsDrag(false)}
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
								{isDrag
									? "¡Suelta aquí!"
									: placeholder || "Haz clic o arrastra archivos"}
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
									: "grid-cols-1",
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
										{fileState.file.type.startsWith("image/") ? (
											<img
												src={URL.createObjectURL(fileState.file)}
												alt="preview"
												className="w-full h-full object-cover"
											/>
										) : (
											getIcon(fileState.file.type)
										)}

										{/* Overlay de acciones rápidas (Editor/Info) */}
										<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 rounded-md">
											{fileState.file.type.startsWith("image/") && (
												<Button
													type="button"
													size="sm"
													variant="ghost"
													className="h-6 w-6 text-white hover:text-primary hover:bg-white/20"
													onClick={() => {
														editingImage.value = fileState.file;
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
												onClick={() => setShowFileInfo(fileState.file)}
											>
												<CircleInfoIconSolid className="w-3 h-3" />
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
													getFileTypeColor(fileState.file.type),
												)}
											>
												{fileState.file.type.split("/")[1]?.toUpperCase() ||
													"FILE"}
											</Badge>
											<span className="text-[10px] text-muted-foreground">
												{formatFileSize(fileState.file.size)}
											</span>
										</div>

										{/* STATUS BAR (Modificado para mostrar progreso) */}
										<div className="mt-1.5 flex items-center gap-2 h-4">
											{(fileState.status === "PENDING" ||
												fileState.status === "UPLOADING") && (
												<div className="flex-1">
													{/* Barra de Progreso */}
													<div className="w-full bg-gray-200 rounded-full h-1.5 relative overflow-hidden">
														<div
															className={cn(
																"h-1.5 rounded-full transition-all duration-300",
																fileState.status === "PENDING"
																	? "bg-gray-400"
																	: "bg-primary",
															)}
															style={{
																width: `${fileState.progress}%`,
															}}
														/>
													</div>
													{/* Porcentaje y estado de texto */}
													<div className="flex justify-between items-center mt-0.5">
														<span className="text-[10px] text-muted-foreground">
															{fileState.status === "PENDING"
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

											{fileState.status === "COMPLETED" && (
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
					<span>{error.message as string}</span>
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
								: item,
						);
						// Nota: Si quieres subir automáticamente el editado, deberías llamar a uploadFiles([editedFile])
						fileList.value = updatedList;
						editingImage.value = null;
					}}
				/>
			</Modal>

			{/* Info del Archivo */}
			<Modal
				isOpen={!!showFileInfo}
				onClose={() => setShowFileInfo(null)}
				contentClassName="max-w-md"
				content={
					<div className="font-bold text-lg mb-4">Detalles del Archivo</div>
				}
			>
				<FileInfo file={showFileInfo!} />
			</Modal>
		</div>
	);
}
interface FileInfoProps {
	file: File;
}

interface ImageMetadata {
	width?: number;
	height?: number;
	aspectRatio?: string;
	colorDepth?: string;
}

function FileInfo({ file }: FileInfoProps) {
	const [imageMetadata, setImageMetadata] = useState<ImageMetadata>({});

	useEffect(() => {
		if (file.type.startsWith("image/")) {
			const img = new Image();
			img.onload = () => {
				const aspectRatio = (img.width / img.height).toFixed(2);
				setImageMetadata({
					width: img.width,
					height: img.height,
					aspectRatio: `${aspectRatio}:1`,
					colorDepth: "24-bit",
				});
			};
			img.src = URL.createObjectURL(file);
		}
	}, [file]);

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	const formatDate = (timestamp: number) => {
		return new Date(timestamp).toLocaleString("es-ES", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getFileTypeInfo = () => {
		const type = file.type;
		if (type.startsWith("image/")) {
			return {
				category: "Imagen",
				icon: <ImageIconSolid className="w-5 h-5" />,
				color: "bg-green-100 text-green-800",
			};
		}
		if (type.startsWith("video/")) {
			return {
				category: "Video",
				icon: <ImageIconSolid className="w-5 h-5" />,
				color: "bg-blue-100 text-blue-800",
			};
		}
		return {
			category: "Archivo",
			icon: <CircleInfoIconSolid className="w-5 h-5" />,
			color: "bg-gray-100 text-gray-800",
		};
	};

	const fileTypeInfo = getFileTypeInfo();

	return (
		<Card className="w-full">
			<Card.content className="space-y-6">
				{/* File Preview */}
				<div className="flex items-center gap-4">
					<div className="min-w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
						{file.type.startsWith("image/") ? (
							<img
								src={URL.createObjectURL(file) || "/placeholder.svg"}
								alt={file.name}
								className="w-full h-full object-cover"
							/>
						) : (
							fileTypeInfo.icon
						)}
					</div>
					<div className="flex-1">
						<h3 className="font-medium text-lg ">{file.name}</h3>
						<Badge className={fileTypeInfo.color}>
							{fileTypeInfo.category}
						</Badge>
					</div>
				</div>

				{/* Basic Info */}
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<HardDriveIconSolid className="w-4 h-4 fill-primary" />
							<span>Tamaño</span>
						</div>
						<p className="font-medium">{formatFileSize(file.size)}</p>
					</div>

					<div className="space-y-2">
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<CalendarIconSolid className="w-4 h-4 fill-primary" />
							<span>Modificado</span>
						</div>
						<p className="font-medium">{formatDate(file.lastModified)}</p>
					</div>

					<div className="space-y-2">
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<CircleInfoIconSolid className="min-w-4 h-4 fill-primary" />
							<span>Tipo MIME</span>
						</div>
						<p className="font-medium">{file.type || "Desconocido"}</p>
					</div>

					<div className="space-y-2">
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<CircleInfoIconSolid className="min-w-4 h-4 fill-primary" />
							<span>Extensión</span>
						</div>
						<p className="font-medium">
							{file.name.split(".").pop()?.toUpperCase() || "N/A"}
						</p>
					</div>
				</div>

				{/* Image-specific metadata */}
				{file.type.startsWith("image/") && imageMetadata.width && (
					<>
						<Hr className="my-4" />{" "}
						<div className="">
							<h4 className="font-medium mb-3">Información de Imagen</h4>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<span className="text-sm text-gray-600">Dimensiones</span>
									<p className="font-medium">
										{imageMetadata.width} × {imageMetadata.height} px
									</p>
								</div>

								<div className="space-y-2">
									<span className="text-sm text-gray-600">
										Relación de aspecto
									</span>
									<p className="font-medium">{imageMetadata.aspectRatio}</p>
								</div>

								<div className="space-y-2">
									<span className="text-sm text-gray-600">
										Profundidad de color
									</span>
									<p className="font-medium">{imageMetadata.colorDepth}</p>
								</div>

								<div className="space-y-2">
									<span className="text-sm text-gray-600">Megapíxeles</span>
									<p className="font-medium">
										{(
											(imageMetadata.width * imageMetadata.height!) /
											1000000
										).toFixed(1)}{" "}
										MP
									</p>
								</div>
							</div>
						</div>
					</>
				)}
				<Hr className="my-4" />
				{/* File size breakdown */}
				<div className="">
					<h4 className="font-medium mb-3">Detalles de Tamaño</h4>
					<div className="space-y-2 text-sm">
						<div className="flex justify-between">
							<span>Bytes:</span>
							<span className="font-mono">{file.size.toLocaleString()}</span>
						</div>
						<div className="flex justify-between">
							<span>Kilobytes:</span>
							<span className="font-mono">
								{(file.size / 1024).toFixed(2)} KB
							</span>
						</div>
						<div className="flex justify-between">
							<span>Megabytes:</span>
							<span className="font-mono">
								{(file.size / (1024 * 1024)).toFixed(2)} MB
							</span>
						</div>
					</div>
				</div>
			</Card.content>
		</Card>
	);
}

/* <div class="flex items-center gap-4">
<div class="flex-shrink-0 rounded-md p-3 bg-primary/10 dark:bg-primary/20 fill-primary">
	<UploadIconSolid
		{...sizeIcon.small}
	/>
</div>
<div class="min-w-0">
	<p class="text-sm font-medium text-slate-900 dark:text-slate-100">
		Subir archivo
	</p>
	<p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
		PNG, JPG o PDF —
		máximo 10MB
	</p>
</div>
<div class="ml-auto">
	<span class="inline-flex fill-white items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-medium text-white shadow-sm group-hover:bg-primary/90 transition-colors">
		<PlusIconSolid
			{...sizeIcon.small}
		/>
		Seleccionar
	</span>
</div>
</div> */

export default FormFile;
