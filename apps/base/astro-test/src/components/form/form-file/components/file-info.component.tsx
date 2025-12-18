import { Badge } from "@components/extras/badge";
import Card from "@components/extras/card";
import Hr from "@components/extras/hr";
import {
    CalendarIconSolid,
    CircleInfoIconSolid,
    HardDriveIconSolid,
} from "@vigilio/react-icons";
import { useEffect, useState } from "preact/hooks";
import { formatDate, formatFileSize, getFileTypeInfo } from "../libs";
import type { FileInfoProps, ImageMetadata } from "../types";

export function FileInfo({ file }: FileInfoProps) {
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

    const fileTypeInfo = getFileTypeInfo(file.type);

    return (
        <Card className="w-full">
            <Card.content className="space-y-6">
                {/* File Preview */}
                <div className="flex items-center gap-4">
                    <div className="min-w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        {file.type.startsWith("image/") ? (
                            <img
                                src={
                                    URL.createObjectURL(file) ||
                                    "/placeholder.svg"
                                }
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
                        <p className="font-medium">
                            {formatFileSize(file.size)}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CalendarIconSolid className="w-4 h-4 fill-primary" />
                            <span>Modificado</span>
                        </div>
                        <p className="font-medium">
                            {formatDate(file.lastModified)}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CircleInfoIconSolid className="min-w-4 h-4 fill-primary" />
                            <span>Tipo MIME</span>
                        </div>
                        <p className="font-medium">
                            {file.type || "Desconocido"}
                        </p>
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
                            <h4 className="font-medium mb-3">
                                Información de Imagen
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <span className="text-sm text-gray-600">
                                        Dimensiones
                                    </span>
                                    <p className="font-medium">
                                        {imageMetadata.width} ×{" "}
                                        {imageMetadata.height} px
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-sm text-gray-600">
                                        Relación de aspecto
                                    </span>
                                    <p className="font-medium">
                                        {imageMetadata.aspectRatio}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-sm text-gray-600">
                                        Profundidad de color
                                    </span>
                                    <p className="font-medium">
                                        {imageMetadata.colorDepth}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-sm text-gray-600">
                                        Megapíxeles
                                    </span>
                                    <p className="font-medium">
                                        {(
                                            (imageMetadata.width *
                                                imageMetadata.height!) /
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
                            <span className="font-mono">
                                {file.size.toLocaleString()}
                            </span>
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
