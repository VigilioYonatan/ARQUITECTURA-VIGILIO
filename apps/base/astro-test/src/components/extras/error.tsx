import { sizeIcon } from "@infrastructure/libs/client/helpers";
import { CircleXIconSolid } from "@vigilio/react-icons";
import Card from "./card";

interface ErrorComponentProps {
    message: string;
}
function ErrorComponent({ message }: ErrorComponentProps) {
    return (
        <Card className="p-4">
            <div className="flex items-center gap-2">
                <CircleXIconSolid
                    {...sizeIcon.medium}
                    className="fill-red-500"
                />
                {message}
            </div>
        </Card>
    );
}

export default ErrorComponent;
