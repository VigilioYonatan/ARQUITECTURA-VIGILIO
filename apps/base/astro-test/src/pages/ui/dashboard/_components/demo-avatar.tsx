import Avatar from "@components/extras/avatar";

export default function DemoAvatar() {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">Avatars</h3>
            <div className="flex flex-wrap items-end gap-4">
                <Avatar
                    user={{
                        photo: null,
                        full_name: "John",
                        father_lastname: "Doe",
                        mother_lastname: "",
                    }}
                    size="xs"
                />
                <Avatar
                    user={{
                        photo: null,
                        full_name: "Jane",
                        father_lastname: "Smith",
                        mother_lastname: "",
                    }}
                    size="sm"
                    status="online"
                />
                <Avatar
                    user={{
                        photo: null,
                        full_name: "User",
                        father_lastname: "Name",
                        mother_lastname: "",
                    }}
                    size="md"
                    status="busy"
                />
                <Avatar
                    user={{
                        photo: null,
                        full_name: "Big",
                        father_lastname: "User",
                        mother_lastname: "",
                    }}
                    size="lg"
                    status="away"
                />
                <Avatar
                    user={{
                        photo: null,
                        full_name: "Extra",
                        father_lastname: "Large",
                        mother_lastname: "",
                    }}
                    size="xl"
                    status="offline"
                />
            </div>
        </div>
    );
}
