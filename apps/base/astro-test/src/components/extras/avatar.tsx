import { printFileWithDimension } from "@infrastructure/libs";
import { cn } from "@infrastructure/libs/client/helpers";
import type { FilesSchema } from "@modules/uploads/schemas/upload.schema";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarStatus = "online" | "offline" | "away" | "busy";

interface AvatarProps {
    user: {
        photo: FilesSchema[] | null;
        full_name: string;
        mother_lastname: string;
        father_lastname: string;
    };
    size?: AvatarSize;
    status?: AvatarStatus;
    className?: string;
}

function Avatar({ user, size = "md", status, className }: AvatarProps) {
    const sizes: Record<AvatarSize, string> = {
        xs: "w-6 h-6 text-xs",
        sm: "w-8 h-8 text-sm",
        md: "w-10 h-10 text-base",
        lg: "w-14 h-14 text-lg",
        xl: "w-20 h-20 text-xl",
    };

    const statusColors: Record<AvatarStatus, string> = {
        online: "bg-emerald-500 dark:bg-green-500",
        offline: "bg-gray-400 dark:bg-gray-500",
        away: "bg-amber-500 dark:bg-yellow-500",
        busy: "bg-red-500",
    };

    const statusSizes: Record<AvatarSize, string> = {
        xs: "w-2 h-2",
        sm: "w-2.5 h-2.5",
        md: "w-3 h-3",
        lg: "w-4 h-4",
        xl: "w-5 h-5",
    };

    return (
        <div class={cn("relative inline-block", className)}>
            <div
                class={cn(
                    "rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden",
                    sizes[size]
                )}
            >
                {user?.photo ? (
                    <img
                        src={printFileWithDimension(user.photo, 100)[0]}
                        alt={user.full_name || ""}
                        class="w-full h-full object-cover"
                    />
                ) : (
                    <span class="font-medium text-muted-foreground">
                        {`${user?.full_name[0]}${user?.father_lastname[0]}` ||
                            "?"}
                    </span>
                )}
            </div>

            {status && (
                <div
                    class={cn(
                        "absolute bottom-0 right-0 rounded-full border-2 border-background",
                        statusColors[status],
                        statusSizes[size]
                    )}
                />
            )}
        </div>
    );
}

export default Avatar;
