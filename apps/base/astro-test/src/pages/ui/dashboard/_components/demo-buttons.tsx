import Button from "@components/extras/button";
import { CopyIconSolid } from "@vigilio/react-icons";

export function DemoButtons() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">Variants</h3>
                <div className="flex flex-wrap gap-2">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="gradient">Gradient</Button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">Sizes</h3>
                <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">States</h3>
                <div className="flex flex-wrap gap-2">
                    <Button disabled>Disabled</Button>
                    <Button loading>Loading</Button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">With Icons</h3>
                <div className="flex flex-wrap gap-2">
                    <Button>
                        <CopyIconSolid className="mr-2" />
                        Copy
                    </Button>
                    <Button variant="outline">
                        Delete
                        <CopyIconSolid className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default DemoButtons;
