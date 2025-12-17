import { printFileWithDimension } from "@infrastructure/libs";
import type { UserSchemaFromServer } from "@modules/users/schemas/user.schema";

interface ByUserProps {
	user: Pick<
		UserSchemaFromServer,
		"id" | "photo" | "user_name" | "father_lastname"
	>;
}
function ByUser({ user }: ByUserProps) {
	return (
		<div className="flex flex-col justify-center items-center text-xs gap-2 relative group ">
			<img
				width={80}
				height={80}
				class="rounded-full w-[50px] h-[50px] object-cover"
				src={printFileWithDimension(user.photo, 100)[0]}
				alt="user"
				loading="lazy"
			/>
			<p class="font-semibold !text-center w-[120px] rounded-md -top-7 right-2 !line-clamp-2 group-hover:!block !hidden absolute bg-white p-2">
				{user.user_name} {user.father_lastname}
			</p>
		</div>
	);
}

export default ByUser;
