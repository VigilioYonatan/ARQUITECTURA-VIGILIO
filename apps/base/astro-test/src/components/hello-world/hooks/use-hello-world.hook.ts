import { zodResolver } from "@hookform/resolvers/zod";
import {
    type IconStoreDto,
    iconStoreDto,
} from "@modules/empresa/dtos/icon.dto";
import { useForm } from "react-hook-form";

export function useHelloWorld() {
    const iconStoreForm = useForm<IconStoreDto>({
        resolver: zodResolver(iconStoreDto),
    });

    function onIconStore(body: IconStoreDto) {
        console.log(body);
    }

    return {
        iconStoreForm,
        onIconStore,
    };
}
