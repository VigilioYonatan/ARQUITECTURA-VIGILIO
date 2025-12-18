import Slider from "@components/extras/slider";
import { useSignal } from "@preact/signals";

export default function DemoSlider() {
    const sliderValue = useSignal([50]);
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">Slider</h3>
            <div className="max-w-md space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Basic</span>
                        <span>{sliderValue.value[0]}%</span>
                    </div>
                    <Slider
                        value={sliderValue.value}
                        onValueChange={(val) => {
                            sliderValue.value = val;
                        }}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Steps (10)</span>
                    </div>
                    <Slider value={[30]} onValueChange={() => {}} step={10} />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Disabled</span>
                    </div>
                    <Slider value={[75]} onValueChange={() => {}} disabled />
                </div>
            </div>
        </div>
    );
}
