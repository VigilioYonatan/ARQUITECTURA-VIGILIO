import Toggle from "@components/extras/toggle";
import { useSignal } from "@preact/signals";

export default function DemoToggle() {
    const toggleState = useSignal(false);
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">Toggle / Switch</h3>
            <div className="flex items-center gap-8 flex-wrap">
                <div className="flex flex-col gap-2 items-center">
                    <span className="text-sm text-muted-foreground">
                        Default
                    </span>
                    <Toggle
                        checked={toggleState.value}
                        onChange={(val) => {
                            toggleState.value = val;
                        }}
                    />
                </div>

                <div className="flex flex-col gap-2 items-center">
                    <span className="text-sm text-muted-foreground">Small</span>
                    <Toggle
                        checked={toggleState.value}
                        onChange={(val) => {
                            toggleState.value = val;
                        }}
                        size="sm"
                    />
                </div>

                <div className="flex flex-col gap-2 items-center">
                    <span className="text-sm text-muted-foreground">Large</span>
                    <Toggle
                        checked={toggleState.value}
                        onChange={(val) => {
                            toggleState.value = val;
                        }}
                        size="lg"
                    />
                </div>

                <div className="flex flex-col gap-2 items-center">
                    <span className="text-sm text-muted-foreground">
                        Disabled
                    </span>
                    <Toggle checked={true} onChange={() => {}} disabled />
                </div>
            </div>
        </div>
    );
}
