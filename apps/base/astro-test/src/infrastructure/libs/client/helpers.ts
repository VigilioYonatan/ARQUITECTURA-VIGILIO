import useMediaQuery from "@hooks/useMediaQuery";
import type { FilesSchema } from "@modules/uploads/schemas/upload.schema";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import type { Path, UseFormReturn } from "react-hook-form";

//copy image and paste
export async function onPageImage<T extends object>(
    form: UseFormReturn<T>,
    key: keyof T
) {
    const text = await navigator.clipboard.readText();
    if (!text.startsWith("http")) {
        sweetAlert({
            icon: "info",
            title: "Buscar y copiar <i class='far fa-copy'></i> imagen en  <i class='fas fa-cogs'></i>",
        });
        return;
    }
    try {
        const response = await fetch(`/proxy-image?url=${text}`);
        const blob = await response.blob(); // Convertir a blob
        const file = new File([blob], text, { type: "image/webp" });
        form.setValue(
            key as unknown as Path<T>,
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            [...(form.watch(key as unknown as Path<T>) ?? []), file] as any
        );
    } catch (error) {
        alert("Error imagen");
    }
}

export function formatSoles(total: number) {
    return `S/ ${total}`;
}

// remove query in web url
export function removeValueQuery(key: "open") {
    const url = new URL(window.location.href);
    url.searchParams.delete(key);
    window.history.replaceState({}, document.title, url.toString());
}

// remove query in web url
export function setValueQuery(key: string, value: string) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState({}, document.title, url);
}
// remove query in web url
export function getQuery(key: string) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(key);
}

// media query download
export function downloadPDF() {
    return useMediaQuery("(max-width: 600px)");
}

// ejemplo: yon****@gmail.com
export function ocultarEmail(email: string) {
    if (!email.includes("@")) {
        return email;
    }
    const [nombre, dominio] = email.split("@");
    const caracteresVisibles = 2;
    const parteOculta = "*".repeat(
        Math.max(0, nombre.length - caracteresVisibles)
    );

    return `${nombre.substring(
        0,
        caracteresVisibles
    )}${parteOculta}@${dominio}`;
}

/****  METHOD to get files to edit  - TYPE="image/webp"*****/
// export async function getFilesEdit(
//     files: FilesSchema[],
//     dimension: number | null
// ) {
//     try {
//         const filterImages = dimension
//             ? files.filter((pro) => {
//                   return (
//                       pro.file!.startsWith("https://") ||
//                       pro.dimension === dimension ||
//                       pro.file!.endsWith("mp4")
//                   );
//               })
//             : files;

//         function fetchWithTimeout(url: string, timeout: number) {
//             return Promise.race([
//                 fetch(url),
//                 new Promise<never>((_, reject) =>
//                     setTimeout(
//                         () => reject(new Error("Request timed out")),
//                         timeout
//                     )
//                 ),
//             ]);
//         }
//         const response = await Promise.all(
//             filterImages.map(async (file) => {
//                 try {
//                     const url =
//                         file.file?.startsWith("https://") ||
//                         file.file?.startsWith("http://")
//                             ? `/proxy?url=${file.file!}`
//                             : `/cear_latinoamericano/${file.file}`;

//                     return await fetchWithTimeout(url, 10000);
//                 } catch (error) {
//                     return null;
//                 }
//             })
//         );
//         const result = await Promise.all(
//             response.filter((val) => val).map(async (req) => await req!.blob())
//         );

//         const images = result.map(
//             (res, i) =>
//                 new File([res], filterImages[i].file!, {
//                     type: result[i]?.type,
//                 })
//         );
//         return images as unknown as File[];
//     } catch (error) {
//         return [];
//     }
// }

/****  METHOD to consume api files  *****/
export interface ResultApiImages {
    success: boolean;
    files: FilesSchema[];
}
export interface ResultApiImagesError<T extends object> {
    success: false;
    message: string;
    body: keyof T;
}
export async function uploadApi(
    url: string,
    body: { file: File[] | null; name?: string }
) {
    const formData = new FormData();

    if (body.name) {
        formData.append("name", body.name);
    }
    if (body.file) {
        for (const file of body.file) {
            formData.append("file", file);
        }
    }
    const responseImage = await fetch(url, {
        method: "POST",
        body: formData,
    });
    const resultImage: ResultApiImages = await responseImage.json();
    if (!resultImage.success) throw resultImage;
    return resultImage;
}

export function normalizarText(texto: string) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}
export function formatTelephoneNumber(telephone: string) {
    return telephone.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
}

export function normalizeString(str: string) {
    return str
        .normalize("NFD") // Descompone los caracteres acentuados en su forma base + acento
        .replace(/[\u0300-\u036f]/g, "") // Elimina los diacríticos (tildes)
        .toLowerCase()
        .trim();
}

export function handlerError<T extends object>(
    form: UseFormReturn<T>,
    error: { success: boolean; body: keyof T; message: string },
    message: string
) {
    if (error?.body) {
        form.setError(error.body as unknown as Path<T>, {
            message: error.message,
        });
        form.resetField(error.body as unknown as Path<T>, {
            keepError: true,
        });

        return;
    }
    sweetModal({
        icon: "danger",
        title: message,
        text: `${error.message}`,
    });
}

export const sizeIcon: Record<
    "small" | "medium" | "large" | "xlarge" | "xxlarge" | "xxxlarge",
    {
        width: number;
        height: number;
        minWidth: number;
        maxWidth: number;
        minHeight: number;
        maxHeight: number;
    }
> = {
    small: {
        width: 16,
        height: 16,
        minWidth: 16,
        maxWidth: 16,
        minHeight: 16,
        maxHeight: 16,
    },
    medium: {
        width: 20,
        height: 20,
        minWidth: 20,
        maxWidth: 20,
        minHeight: 20,
        maxHeight: 20,
    },
    large: {
        width: 24,
        height: 24,
        minWidth: 24,
        maxWidth: 24,
        minHeight: 24,
        maxHeight: 24,
    },
    xlarge: {
        width: 32,
        height: 32,
        minWidth: 32,
        maxWidth: 32,
        minHeight: 32,
        maxHeight: 32,
    },
    xxlarge: {
        width: 40,
        height: 40,
        minWidth: 40,
        maxWidth: 40,
        minHeight: 40,
        maxHeight: 40,
    },
    xxxlarge: {
        width: 48,
        height: 48,
        minWidth: 48,
        maxWidth: 48,
        minHeight: 48,
        maxHeight: 48,
    },
};
export interface FilterResult<T extends object> {
    search?: {
        value: string | null;
        debounce: string | null;
    };
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    filters: Partial<Record<keyof T, any>>;
    typeView?: "table" | "list";
}
export const animationFadeInTailwind =
    "animate-[fadeIn_0.5s_ease-in-out_forwards]";

// export function typeTextExtensions(extensions: string[]) {
//     const mimeList = extensions
//         .map((mime) => EXTENSIONS_MIME.find(([m]) => m === mime)?.[1]) // busca extensión exacta
//         .filter(
//             (ext): ext is string => typeof ext === "string" && ext.length > 0
//         ); // filtra undefined

//     if (mimeList.length === 0) return "Formato no permitido";

//     let mimeText = "";
//     if (mimeList.length === 1) mimeText = mimeList[0];
//     else if (mimeList.length === 2) mimeText = mimeList.join(" y ");
//     else mimeText = `${mimeList.slice(0, -1).join(", ")} y ${mimeList.at(-1)}`;

//     return `Solo se puede subir archivos de tipo ${mimeText}`;
// }

export function cn(...classes: (string | undefined | null | boolean)[]) {
    return classes.filter(Boolean).join(" ");
}
