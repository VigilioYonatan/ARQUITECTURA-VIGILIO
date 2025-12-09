import { formatFileSize } from "@infrastructure/libs";
import { FileIconSolid } from "@vigilio/react-icons";
import { Badge } from "./badge";

interface FileListProps {
    title: string;
    files: File[] | null;
    width?: number;
}
function InfoFileList({ title, files, width }: FileListProps) {
    const getFileTypeColor = (file: File) => {
        if (file.type.startsWith("image/"))
            return "bg-green-100 text-green-800";
        if (file.type.startsWith("video/")) return "bg-blue-100 text-blue-800";
        return "bg-gray-100 text-gray-800";
    };
    return (
        <div className="space-y-2">
            <h3 className="font-medium">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {files?.length ? (
                    files.map((file) => (
                        <div className={`w-[${width}px]`} key={file.name}>
                            <div className="aspect-square relative mb-3 bg-gray-100 rounded-lg overflow-hidden  w-full ">
                                {file.type.startsWith("image/") ? (
                                    <img
                                        src={
                                            URL.createObjectURL(file) ||
                                            "/placeholder.svg"
                                        }
                                        alt={file.name}
                                        className="w-full h-full object-contain mx-auto"
                                    />
                                ) : file.type.startsWith("video/") ? (
                                    <video
                                        src={URL.createObjectURL(file)}
                                        className="w-full h-full object-cover"
                                        controls={false}
                                        muted
                                        autoPlay
                                        loop
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FileIconSolid className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <p
                                    className="text-sm font-medium truncate"
                                    title={file.name}
                                >
                                    {file.name}
                                </p>
                                <div className="flex items-center justify-between">
                                    <Badge className={getFileTypeColor(file)}>
                                        {file.type
                                            .split("/")[1]
                                            ?.toUpperCase() || "FILE"}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                        {formatFileSize(file.size)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <span className="text-gray-500">No hay archivos</span>
                )}
            </div>
        </div>
    );
}
export default InfoFileList;
