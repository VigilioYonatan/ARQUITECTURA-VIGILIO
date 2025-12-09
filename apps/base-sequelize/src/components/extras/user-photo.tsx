import { NO_PROFILE_BIGIMG, NO_PROFILE_SMALLIMG } from "@infrastructure/consts";
import { printFileWithDimension } from "@infrastructure/libs";
import type { UserSchemaFromServer } from "@modules/user/schemas/user.schema";

interface UserPhotoProps {
    user: Pick<UserSchemaFromServer, "id" | "photo" | "user_name">;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}
function UserPhoto({ user, className = "", size = "md" }: UserPhotoProps) {
    return (
        <div
            class="bg-white rounded-full"
            style={{
                width:
                    size === "sm" ? "45px" : size === "md" ? "80px" : "100px",
            }}
        >
            <img
                width={size === "sm" ? 45 : size === "md" ? 80 : 100}
                className={`  object-cover ${className} ${
                    size === "sm"
                        ? "min-w-[45px] min-h-[45px]"
                        : size === "md"
                        ? "min-w-[80px] min-h-[80px]"
                        : size === "lg"
                        ? "min-w-[100px] min-h-[100px]"
                        : size === "xl"
                        ? "min-w-[120px] min-h-[120px]"
                        : "min-w-[100px] min-h-[100px]"
                }`}
                height={size === "sm" ? 45 : size === "md" ? 80 : 100}
                src={
                    user?.photo
                        ? printFileWithDimension(user.photo, 100)[0]
                        : size === "sm"
                        ? NO_PROFILE_SMALLIMG
                        : size === "md"
                        ? NO_PROFILE_SMALLIMG
                        : NO_PROFILE_BIGIMG
                }
                alt=""
            />
        </div>
    );
}

export default UserPhoto;
