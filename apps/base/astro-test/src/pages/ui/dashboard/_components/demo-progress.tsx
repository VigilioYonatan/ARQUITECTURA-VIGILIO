import { Progress } from "@components/extras/progress";

export default function DemoProgress() {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">Progress</h3>
            <div className="grid gap-6 max-w-md">
                <Progress value={33} variant="default" />
                <Progress value={66} variant="primary" />
                <Progress value={80} variant="success" />
                <Progress value={45} variant="warning" size="sm" />
                <Progress value={90} variant="danger" size="lg" />
            </div>
        </div>
    );
}
