import Loader from "@components/extras/loader";

export default function DemoLoader() {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">Loaders</h3>
            <div className="flex flex-wrap items-center gap-8">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm">Spinner (Default)</span>
                    <Loader />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm">Dots</span>
                    <Loader variant="dots" className="text-primary" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm">Pulse</span>
                    <Loader variant="pulse" size="lg" className="bg-primary" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm">Colored</span>
                    <Loader color="#ef4444" />
                </div>
            </div>
        </div>
    );
}
