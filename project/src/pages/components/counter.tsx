import { useSignal } from "@preact/signals";

interface CounterProps {
    initialValue: number;
}
function Counter({ initialValue }: CounterProps) {
    const count = useSignal<number>(initialValue);

    function onIncrement() {
        count.value = count.value + 1;
    }

    return (
        <div>
            Current value: {count.value}
            <button onClick={onIncrement}>Increment</button>
        </div>
    );
}

export default Counter;
