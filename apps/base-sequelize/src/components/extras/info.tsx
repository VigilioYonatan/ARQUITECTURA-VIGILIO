import { formatFileSize } from "@infrastructure/libs";
import { sizeIcon } from "@infrastructure/libs/client/helpers";
import type { FilesSchema } from "@modules/uploads/modules/upload.schema";
import { DownloadIconSolid } from "@vigilio/react-icons";
import type { JSX } from "preact/jsx-runtime";
import { Badge } from "./badge";

interface InfoCardProps {
    ico: JSX.Element;
    title: string;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    value: any | null;
    title_null_value: string;
    className?: string;
}
export function InfoCard({
    ico,
    title,
    value,
    title_null_value,
    className,
}: InfoCardProps) {
    return (
        <div className="w-full flex gap-2 flex-col">
            <div className="flex items-center gap-2 text-sm fill-primary text-primary [&>svg]:w-4 [&>svg]:h-4">
                {ico}
                <span>{title}</span>
            </div>
            <div className={`${className || ""} font-medium`}>
                {value || title_null_value}
            </div>
        </div>
    );
}

interface InfoFileProps {
    file: FilesSchema;
}
export function InfoFile({ file }: InfoFileProps) {
    return (
        <Badge
            as="a"
            key={file.key}
            href={`/cear_latinoamericano/${file.key}`}
            target="_blank"
            className="flex gap-2 fill-gray-500 hover:fill-primary hover:text-primary hover:border-primary hover:cursor-pointer !text-nowrap"
        >
            <p className="font-medium ">
                <span className="text-wrap  line-clamp-1">{file.name} </span>
                <span className="text-xs text-gray-400">
                    ({formatFileSize(file.size)})
                </span>
            </p>
            <DownloadIconSolid
                width={sizeIcon.small.width}
                height={sizeIcon.small.height}
            />
        </Badge>
    );
}
