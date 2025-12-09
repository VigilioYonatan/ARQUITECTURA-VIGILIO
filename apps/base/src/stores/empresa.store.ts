import { useSignal } from "@preact/signals";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

interface CampusContext {
    empresa: { id: 1 };
}
export const campusContext = createContext({} as {} & CampusContext);

export function CampusProvider() {
    const initialValue = useSignal<CampusContext>({ empresa: { id: 1 } });
    return { value: initialValue.value };
}
export const useCampusContext = () => useContext(campusContext);
