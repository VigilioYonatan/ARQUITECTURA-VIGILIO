import Button from "@components/extras/button";
import Dropdown from "@components/extras/dropdown";

export default function DemoDropdown() {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">Dropdown</h3>
            <div className="flex gap-4">
                <Dropdown
                    triggerChildren={(params) => (
                        <Button onClick={params.onOpen}>Open Menu</Button>
                    )}
                >
                    <div className="p-2 flex flex-col gap-1 min-w-[200px]">
                        <button
                            type="button"
                            className="text-left px-3 py-2 hover:bg-accent rounded-md text-sm transition-colors"
                        >
                            Profile
                        </button>
                        <button
                            type="button"
                            className="text-left px-3 py-2 hover:bg-accent rounded-md text-sm transition-colors"
                        >
                            Billing
                        </button>
                        <button
                            type="button"
                            className="text-left px-3 py-2 hover:bg-accent rounded-md text-sm transition-colors"
                        >
                            Settings
                        </button>
                        <div className="h-px bg-border my-1" />
                        <button
                            type="button"
                            className="text-left px-3 py-2 hover:bg-red-500/10 text-red-600 rounded-md text-sm transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </Dropdown>

                <Dropdown
                    isHover
                    triggerChildren={() => (
                        <Button variant="secondary">Hover Me</Button>
                    )}
                >
                    <div className="p-4">
                        <p className="text-sm">Hover content displayed!</p>
                    </div>
                </Dropdown>
            </div>
        </div>
    );
}
