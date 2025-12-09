import { useSignal } from "@preact/signals";
import {
	CircleArrowLeftIconSolid,
	CircleArrowRightIconSolid,
	CropIconSolid,
	DownloadIconSolid,
	PaletteIconSolid,
	RepeatIconSolid,
	RotateIconSolid,
	XIconSolid,
} from "@vigilio/react-icons";
import { useEffect, useRef } from "preact/hooks";
import Button from "./button";
import Card from "./card";
import Slider from "./slider";
import Tabs from "./tabs";

interface ImageEditorProps {
	file: File;
	onSave: (editedFile: File) => void;
	onClose: () => void;
}

interface ImageFilters {
	brightness: number;
	contrast: number;
	saturation: number;
	hue: number;
	blur: number;
	sepia: number;
	grayscale: number;
}

interface CropData {
	x: number;
	y: number;
	width: number;
	height: number;
}

function ImageEditor({ file, onSave, onClose }: ImageEditorProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const originalImage = useSignal<HTMLImageElement | null>(null);
	const filters = useSignal<ImageFilters>({
		brightness: 100,
		contrast: 100,
		saturation: 100,
		hue: 0,
		blur: 0,
		sepia: 0,
		grayscale: 0,
	});
	const rotation = useSignal(0);
	const flipHorizontal = useSignal(false);
	const cropMode = useSignal(false);
	const cropData = useSignal<CropData | null>(null);
	const isDragging = useSignal(false);
	const startPos = useSignal({ x: 0, y: 0 });
	const history = useSignal<ImageFilters[]>([]);
	const historyIndex = useSignal(-1);
	const activeTab = useSignal("filters");
	const dimensions = useSignal({ width: 0, height: 0 });
	const maintainAspectRatio = useSignal(true);
	const aspectRatio = useSignal(1);

	useEffect(() => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => {
			originalImage.value = img;
			dimensions.value = { width: img.width, height: img.height };
			aspectRatio.value = img.width / img.height;
			drawImage(img);
		};
		img.src = URL.createObjectURL(file);
	}, [file]);

	useEffect(() => {
		if (originalImage.value) {
			drawImage(originalImage.value);
		}
	}, [
		filters.value,
		rotation.value,
		flipHorizontal.value,
		cropData.value,
		dimensions.value,
	]);

	const drawImage = (img: HTMLImageElement) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Set canvas dimensions
		if (cropData.value) {
			canvas.width = cropData.value.width;
			canvas.height = cropData.value.height;
		} else {
			canvas.width = dimensions.value.width;
			canvas.height = dimensions.value.height;
		}

		ctx.save();

		// Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Apply transformations
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.rotate((rotation.value * Math.PI) / 180);
		if (flipHorizontal.value) ctx.scale(-1, 1);
		ctx.translate(-canvas.width / 2, -canvas.height / 2);

		// Apply filters
		const filterString = `
            brightness(${filters.value.brightness}%)
            contrast(${filters.value.contrast}%)
            saturate(${filters.value.saturation}%)
            hue-rotate(${filters.value.hue}deg)
            blur(${filters.value.blur}px)
            sepia(${filters.value.sepia}%)
            grayscale(${filters.value.grayscale}%)
        `;
		ctx.filter = filterString;

		// Draw image with crop or resize
		if (cropData.value) {
			ctx.drawImage(
				img,
				cropData.value.x,
				cropData.value.y,
				cropData.value.width,
				cropData.value.height,
				0,
				0,
				cropData.value.width,
				cropData.value.height,
			);
		} else {
			ctx.drawImage(
				img,
				0,
				0,
				img.width,
				img.height,
				0,
				0,
				dimensions.value.width,
				dimensions.value.height,
			);
		}

		ctx.restore();

		// Draw crop rectangle if in crop mode
		if (cropMode.value && !cropData.value) {
			ctx.strokeStyle = "#3b82f6";
			ctx.lineWidth = 2;
			ctx.setLineDash([5, 5]);
			ctx.strokeRect(0, 0, canvas.width, canvas.height);
		}
	};

	const handleMouseDown = (e: MouseEvent) => {
		if (!cropMode.value || !canvasRef.current) return;

		const rect = canvasRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		startPos.value = { x, y };
		isDragging.value = true;
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!cropMode.value || !isDragging.value || !canvasRef.current) return;

		const rect = canvasRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const width = x - startPos.value.x;
		const height = y - startPos.value.y;

		// Update crop preview
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		drawImage(originalImage.value!);

		ctx.strokeStyle = "#3b82f6";
		ctx.lineWidth = 2;
		ctx.setLineDash([5, 5]);
		ctx.strokeRect(startPos.value.x, startPos.value.y, width, height);
	};

	const handleMouseUp = (e: MouseEvent) => {
		if (!cropMode.value || !isDragging.value || !canvasRef.current) return;

		isDragging.value = false;

		const rect = canvasRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const width = x - startPos.value.x;
		const height = y - startPos.value.y;

		// Ensure positive dimensions
		const absWidth = Math.abs(width);
		const absHeight = Math.abs(height);
		const absX = width < 0 ? startPos.value.x + width : startPos.value.x;
		const absY = height < 0 ? startPos.value.y + height : startPos.value.y;

		// Set crop data
		cropData.value = {
			x: absX,
			y: absY,
			width: absWidth,
			height: absHeight,
		};

		// Update dimensions after crop
		dimensions.value = { width: absWidth, height: absHeight };
		cropMode.value = false;
	};

	const cancelCrop = () => {
		cropData.value = null;
		cropMode.value = false;
		if (originalImage.value) {
			dimensions.value = {
				width: originalImage.value.width,
				height: originalImage.value.height,
			};
		}
	};

	const updateFilter = (key: keyof ImageFilters, value: number) => {
		const newFilters = { ...filters.value, [key]: value };
		filters.value = newFilters;

		// Add to history
		const newHistory = history.value.slice(0, historyIndex.value + 1);
		newHistory.push(newFilters);
		history.value = newHistory;
		historyIndex.value = newHistory.length - 1;
	};

	const undo = () => {
		if (historyIndex.value > 0) {
			historyIndex.value--;
			filters.value = history.value[historyIndex.value];
		}
	};

	const redo = () => {
		if (historyIndex.value < history.value.length - 1) {
			historyIndex.value++;
			filters.value = history.value[historyIndex.value];
		}
	};

	const resetFilters = () => {
		filters.value = {
			brightness: 100,
			contrast: 100,
			saturation: 100,
			hue: 0,
			blur: 0,
			sepia: 0,
			grayscale: 0,
		};
		rotation.value = 0;
		flipHorizontal.value = false;
		cropData.value = null;
		if (originalImage.value) {
			dimensions.value = {
				width: originalImage.value.width,
				height: originalImage.value.height,
			};
		}
	};

	const removeBackground = async () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const data = imageData.data;

		// Simple background removal based on edge detection
		for (let i = 0; i < data.length; i += 4) {
			const r = data[i];
			const g = data[i + 1];
			const b = data[i + 2];

			// Simple white background removal
			if (r > 240 && g > 240 && b > 240) {
				data[i + 3] = 0; // Make transparent
			}
		}

		ctx.putImageData(imageData, 0, 0);
	};

	const saveImage = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		canvas.toBlob((blob) => {
			if (blob) {
				const editedFile = new File([blob], file.name, {
					type: file.type,
				});
				onSave(editedFile);
			}
		}, file.type);
	};

	const handleResize = (width: number, height: number) => {
		dimensions.value = { width, height };
	};

	const toggleMaintainAspectRatio = () => {
		maintainAspectRatio.value = !maintainAspectRatio.value;
	};

	return (
		<Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
			<Card.content className="p-0">
				<div className="flex flex-col lg:flex-row h-[60vh]">
					{/* Canvas Area */}
					<div className="flex-1 flex items-center justify-center bg-gray-100 p-4">
						<canvas
							ref={canvasRef}
							className="max-w-full max-h-full border border-gray-300 shadow-lg"
							style={{ maxWidth: "100%", maxHeight: "100%" }}
							onMouseDown={handleMouseDown}
							onMouseMove={handleMouseMove}
							onMouseUp={handleMouseUp}
							onMouseLeave={handleMouseUp}
						/>
					</div>

					{/* Controls */}
					<div className="w-80 bg-white overflow-y-auto flex flex-col gap-2">
						{" "}
						<div className="flex items-center gap-2 justify-end">
							<Button
								size="sm"
								onClick={undo}
								disabled={historyIndex.value <= 0}
								variant="primary"
								type="button"
							>
								<CircleArrowLeftIconSolid className="w-4 h-4" />
							</Button>
							<Button
								size="sm"
								onClick={redo}
								disabled={historyIndex.value >= history.value.length - 1}
								variant="primary"
								type="button"
							>
								<CircleArrowRightIconSolid className="w-4 h-4 " />
							</Button>
						</div>
						<Tabs
							onTabChange={(tabId) => {
								activeTab.value = tabId;
							}}
							tabs={[
								{
									id: "filters",
									label: "Filtros",
									content: (
										<div className="p-4 space-y-4">
											<div>
												<label htmlFor="brightness">
													Brillo: {filters.value.brightness}%
												</label>
												<Slider
													value={[filters.value.brightness]}
													onValueChange={([value]) =>
														updateFilter("brightness", value)
													}
													min={0}
													max={200}
													step={1}
													className="mt-2"
												/>
											</div>
											<div>
												<label htmlFor="contrast">
													Contraste: {filters.value.contrast}%
												</label>
												<Slider
													value={[filters.value.contrast]}
													onValueChange={([value]) =>
														updateFilter("contrast", value)
													}
													min={0}
													max={200}
													step={1}
													className="mt-2"
												/>
											</div>
											<div>
												<label htmlFor="saturation">
													Saturación: {filters.value.saturation}%
												</label>
												<Slider
													value={[filters.value.saturation]}
													onValueChange={([value]) =>
														updateFilter("saturation", value)
													}
													min={0}
													max={200}
													step={1}
													className="mt-2"
												/>
											</div>
											<div>
												<label htmlFor="hue">Matiz: {filters.value.hue}°</label>
												<Slider
													value={[filters.value.hue]}
													onValueChange={([value]) =>
														updateFilter("hue", value)
													}
													min={-180}
													max={180}
													step={1}
													className="mt-2"
												/>
											</div>
											<div>
												<label htmlFor="blur">
													Desenfoque: {filters.value.blur}px
												</label>
												<Slider
													value={[filters.value.blur]}
													onValueChange={([value]) =>
														updateFilter("blur", value)
													}
													min={0}
													max={10}
													step={0.1}
													className="mt-2"
												/>
											</div>
											<div>
												<label htmlFor="sepia">
													Sepia: {filters.value.sepia}%
												</label>
												<Slider
													value={[filters.value.sepia]}
													onValueChange={([value]) =>
														updateFilter("sepia", value)
													}
													min={0}
													max={100}
													step={1}
													className="mt-2"
												/>
											</div>
											<div>
												<label htmlFor="grayscale">
													Escala de grises: {filters.value.grayscale}%
												</label>
												<Slider
													value={[filters.value.grayscale]}
													onValueChange={([value]) =>
														updateFilter("grayscale", value)
													}
													min={0}
													max={100}
													step={1}
													className="mt-2"
												/>
											</div>
										</div>
									),
								},
								{
									id: "transform",
									label: "Transformar",
									content: (
										<div className="p-4 space-y-4">
											<Button
												variant="outline"
												className="w-full bg-transparent"
												onClick={() => {
													rotation.value += 90;
												}}
												type="button"
											>
												<RotateIconSolid className="w-4 h-4 mr-2" />
												Rotar 90°
											</Button>
											<Button
												variant="outline"
												className="w-full bg-transparent"
												onClick={() => {
													flipHorizontal.value = !flipHorizontal.value;
												}}
												type="button"
											>
												<RepeatIconSolid className="w-4 h-4 mr-2" />
												Voltear Horizontal
											</Button>
											<Button
												variant="outline"
												className="w-full bg-transparent"
												onClick={() => {
													cropMode.value = !cropMode.value;
													if (!cropMode.value) {
														cancelCrop();
													}
												}}
												type="button"
											>
												<CropIconSolid className="w-4 h-4 mr-2" />
												{cropMode.value ? "Cancelar Recorte" : "Recortar"}
											</Button>
											{cropData.value && (
												<Button
													variant="outline"
													className="w-full bg-transparent text-red-500"
													onClick={cancelCrop}
													type="button"
												>
													<XIconSolid className="w-4 h-4 mr-2" />
													Eliminar Recorte
												</Button>
											)}
										</div>
									),
								},
								{
									id: "advanced",
									label: "Avanzado",
									content: (
										<div className="p-4 space-y-4">
											<div>
												<label
													htmlFor="maintainAspectRatio"
													className="block mb-2"
												>
													Redimensionar
												</label>
												<div className="flex items-center mb-2">
													<input
														type="checkbox"
														checked={maintainAspectRatio.value}
														onChange={toggleMaintainAspectRatio}
														className="mr-2"
													/>
													<span>Mantener relación de aspecto</span>
												</div>
												<div className="grid grid-cols-2 gap-4">
													<div>
														<label htmlFor="width" className="block mb-2">
															Ancho (px)
														</label>
														<input
															type="number"
															value={dimensions.value.width}
															onChange={(e) => {
																const newWidth = Number.parseInt(
																	e.currentTarget.value,
																);
																if (!Number.isNaN(newWidth)) {
																	const newHeight = maintainAspectRatio.value
																		? Math.round(newWidth / aspectRatio.value)
																		: dimensions.value.height;
																	handleResize(newWidth, newHeight);
																}
															}}
															className="w-full p-2 border rounded"
														/>
													</div>
													<div>
														<label htmlFor="height" className="block mb-2">
															Alto (px)
														</label>
														<input
															type="number"
															value={dimensions.value.height}
															onChange={(e) => {
																const newHeight = Number.parseInt(
																	e.currentTarget.value,
																);
																if (!Number.isNaN(newHeight)) {
																	const newWidth = maintainAspectRatio.value
																		? Math.round(newHeight * aspectRatio.value)
																		: dimensions.value.width;
																	handleResize(newWidth, newHeight);
																}
															}}
															className="w-full p-2 border rounded"
														/>
													</div>
												</div>
											</div>
											<Button
												variant="outline"
												className="w-full bg-transparent"
												onClick={removeBackground}
												type="button"
											>
												<PaletteIconSolid className="w-4 h-4 mr-2" />
												Eliminar Fondo
											</Button>
											<Button
												variant="outline"
												className="w-full bg-transparent"
												onClick={resetFilters}
												type="button"
											>
												Restablecer Todo
											</Button>
										</div>
									),
								},
							]}
							activeTab={activeTab.value}
							className="w-full"
						/>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex justify-end gap-2 p-4">
					<Button type="button" variant="outline" onClick={onClose}>
						Cancelar
					</Button>
					<Button type="button" onClick={saveImage}>
						<DownloadIconSolid className="w-4 h-4 mr-2" />
						Guardar Cambios
					</Button>
				</div>
			</Card.content>
		</Card>
	);
}

export default ImageEditor;
