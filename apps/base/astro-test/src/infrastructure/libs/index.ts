// helpers para cliente y servidor (Server)

import { z } from "@infrastructure/config/zod-i18n.config";
import dayjs from "dayjs";
import "dayjs/locale/es";
import type { EmpresaSchemaFromServer } from "@modules/empresa/schemas/empresa.schema";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { TIMEZONE_DEFAULT } from "../consts";

dayjs.extend(relativeTime);
dayjs.locale("es");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

/**
 * Genera un retraso en la ejecución de una función
 * @param seg El número de segundos para el retraso
 * @returns Una promesa que se resuelve después del retraso
 */
export async function delay(seg = 10) {
    return new Promise((res) => setTimeout(() => res(true), seg * 1000));
}

/**
 * Genera un número aleatorio entre dos valores
 * @param start El valor mínimo
 * @param end El valor máximo
 * @returns Un número aleatorio entre start y end
 */
export function randomNumber(start: number, end: number) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}

/**
 * Elimina el contenido HTML de una cadena
 * @param value La cadena que contiene HTML
 * @returns La cadena sin HTML
 */
export function removeTextHTML(value: string) {
    return value.replace(/(<([^>]+)>)/gi, "");
}

/**
 * Genera una firma HMAC para una solicitud
 * @param method El método HTTP (GET, POST, etc.)
 * @param path La ruta de la solicitud
 * @returns Un objeto con la firma y el timestamp
 */
export async function generateSignature(method: string, path: string) {
    const timestamp = Date.now();
    const dataToSign = `${timestamp}:${method}:${path}`;
    return {
        signature: (await generateHMAC(dataToSign, "SECRET_KEY")).toString(),
        timestamp: timestamp.toString(),
    };
}

/**
 * Genera una firma HMAC para una solicitud
 * @param method El método HTTP (GET, POST, etc.)
 * @param path La ruta de la solicitud
 * @returns Un objeto con la firma y el timestamp
 */
async function generateHMAC(message: string, secretKey: string) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey);
    const messageData = encoder.encode(message);
    const key = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, messageData);
    const hex = Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    return hex;
}

/**
 * Genera un ID único
 * @returns Un string que representa un ID único
 */
export function generateId() {
    return Math.random().toString(32) + Date.now().toString(32);
}

/**
 * Normaliza un texto para hacerlo compatible con nombres de archivo:
 * - Elimina tildes y caracteres diacríticos
 * - Reemplaza espacios con guiones
 * - Elimina caracteres especiales no permitidos
 * - Convierte a minúsculas (opcional)
 *
 * @param texto El texto a normalizar
 * @param convertirMinusculas Si se convierte todo a minúsculas (true por defecto)
 * @returns El texto normalizado
 */
export function slugify(texto: string, convertirMinusculas = true): string {
    // Paso 1: Eliminar tildes y diacríticos
    let normalizado = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // Paso 2: Reemplazar espacios y guiones bajos con un solo guion
    normalizado = normalizado.replace(/[\s_]+/g, "-");
    // Paso 3: Eliminar caracteres especiales no permitidos (excepto guiones y puntos)
    normalizado = normalizado.replace(/[^a-zA-Z0-9\-.]/g, "");
    // Paso 4: Eliminar múltiples guiones consecutivos
    normalizado = normalizado.replace(/-+/g, "-");
    // Paso 5: Eliminar guiones al inicio y final
    normalizado = normalizado.replace(/^-+|-+$/g, "");

    // Opcional: Convertir a minúsculas
    if (convertirMinusculas) {
        normalizado = normalizado.toLowerCase();
    }
    return normalizado;
}

/**
 * Valida un número de DNI
 * @param dni El número de DNI a validar
 */
export const DNI_REGEX = /^[0-9]{8}$/;

/**
 * Valida un número de RUC
 * @param ruc El número de RUC a validar
 */
export const RUC_REGEX = /^(10|20)[0-9]{9}$/;

/**
 * Valida un número de carnet extranjero
 * @param carnet El número de carnet extranjero a validar
 */
export const CARNET_EXTRANJERO1_REGEX = /^[PEpe][0-9]{8}$/i;

/**
 * Valida un número de carnet extranjero
 * @param carnet El número de carnet extranjero a validar
 */
export const CARNET_EXTRANJERO2_REGEX = /^[A-Za-z]{1,2}[0-9]{6,9}$/;

/**
 * Valida una contraseña
 * @param password La contraseña a validar
 */
export const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Valida un color en formato hexadecimal, RGB o HSL
 * @param color El color a validar
 */
export const COLOR_REGEX =
    /^(#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|(rgb|hsl)a?\(\s*((\d{1,3}%?\s*,\s*){2}\d{1,3}%?|\d{1,3}%?\s+\d{1,3}%?\s+\d{1,3}%?)(\s*,\s*[01]?\.?\d+)?\s*\))$/;

/**
 * Valida un SVG
 * @param svg El SVG a validar
 */
export const SVG_REGEX = /<\s*svg\b/i;

/**
 * Valida un número positivo
 * @param number El número a validar
 */
export const POSIVES_NUMERIC_REGEX = /^\d+$/;

/**
 * Valida un objeto con timestamps
 * @param timestamps El objeto con timestamps a validar
 */
export const timestampsObject = z.object({
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});

/**
 * Convierte un número a romano
 * @param num El número a convertir
 */
export function numeroARomano(num: number): string {
    if (typeof num !== "number" || num < 1 || num > 3999) {
        throw new Error("El número debe estar entre 1 y 3999");
    }

    const valores: [number, string][] = [
        [1000, "M"],
        [900, "CM"],
        [500, "D"],
        [400, "CD"],
        [100, "C"],
        [90, "XC"],
        [50, "L"],
        [40, "XL"],
        [10, "X"],
        [9, "IX"],
        [5, "V"],
        [4, "IV"],
        [1, "I"],
    ];

    let romano = "";
    let resto = num;

    for (const [valor, simbolo] of valores) {
        while (resto >= valor) {
            romano += simbolo;
            resto -= valor;
        }
    }

    return romano;
}

/**
 * Genera un ID aleatorio
 */
export function randomId() {
    return Math.random().toString(32) + Date.now().toString(32);
}

/**
 * Obtiene la hora de una fecha
 * @param date La fecha
 */
export function getHour(
    date: Date | string,
    empresa: EmpresaSchemaFromServer | null = null
): string {
    return dayjs(date)
        .tz(empresa?.timezone || TIMEZONE_DEFAULT!)
        .format("HH:mm");
}

/**
 * Converts bytes to human-readable file size string
 *
 * @param bytes - The file size in bytes
 * @param decimals - Number of decimal places to show (default: 2)
 * @returns Formatted file size string with appropriate unit
 */
export function formatFileSize(bytes: number, decimals = 2): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    // Handle Bytes case differently (no decimals)
    if (i === 0) return `${bytes} ${sizes[i]}`;

    return `${Number.parseFloat((bytes / k ** i).toFixed(decimals))} ${
        sizes[i]
    }`;
}

/**
 * Formatea una fecha con timezone
 * @param date La fecha
 * @param format El formato de la fecha
 */
export function formatDateTz(
    date: Date,
    // format = "D [de] MMMM [de] YYYY, hh:mm A",
    format = "DD/MM/YYYY, HH:mm A",
    empresa: EmpresaSchemaFromServer | null = null
) {
    return dayjs(date)
        .tz(empresa?.timezone || TIMEZONE_DEFAULT!)
        .format(format);
}

export function formatDateUTC(
    date: Date | string,
    format = "DD/MM/YYYY, HH:mm A"
) {
    return dayjs(date).utc().format(format);
}

export function formatDateTzUTC(
    date: Date | string,
    empresa: EmpresaSchemaFromServer | null = null
) {
    return dayjs(date).tz(empresa?.timezone || TIMEZONE_DEFAULT!);
}

// 21-10-1998
export function formatInput(date: Date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function now() {
    return dayjs().tz();
}
type FilterPredicate<T> = (item: T, index: number, array: T[]) => boolean;

//  reduce + mapa es más rápido que filter anidado porque evita recorridos múltiples (O(n) vs O(n²)) y permite accesos instantáneos (O(1)) a los datos agrupados., filter usar para pequeños arrays
export function filterWithReduce<T>(
    array: T[],
    predicate: FilterPredicate<T>
): T[] {
    return array.reduce<T[]>((acc, current, index, original) => {
        predicate(current, index, original) && acc.push(current);
        return acc;
    }, []);
}
export function groupBy<T, K extends string | number>(
    array: T[],
    keyFn: (item: T) => K
): Record<K, T[]> {
    return array.reduce((acc, item) => {
        const key = keyFn(item);
        // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
        (acc[key] = acc[key] || []).push(item);
        return acc;
    }, {} as Record<K, T[]>);
}

// formatoTemporizadorFlexible , pasas minutos y te da el formato que quieras
export function formatoTemporizadorFlexible(
    minutos: number,
    segundos = 0,
    formato = "HH:MM:SS"
) {
    // Convertimos todo a segundos y redondeamos para evitar decimales
    const totalSegundos = Math.floor(minutos * 60 + segundos);

    const horas = Math.floor(totalSegundos / 3600);
    const mins = Math.floor((totalSegundos % 3600) / 60);
    const secs = totalSegundos % 60; // ya es entero

    const valores = {
        HH: horas.toString().padStart(2, "0"),
        H: horas.toString(),
        MM: mins.toString().padStart(2, "0"),
        M: mins.toString(),
        SS: secs.toString().padStart(2, "0"),
        S: secs.toString(),
        hh: (horas % 12 || 12).toString().padStart(2, "0"),
        h: (horas % 12 || 12).toString(),
    };

    return formato.replace(
        /HH|H|MM|M|SS|S|hh|h/g,
        (match: string) => valores[match as keyof typeof valores]
    );
}
export function showTime(
    date: Date | string,
    empresa: EmpresaSchemaFromServer | null = null
) {
    return dayjs()
        .tz(empresa?.timezone || TIMEZONE_DEFAULT!)
        .to(date);
}
// dimension solo es valido para imagenes
export function printFileWithDimension(
    files: any | null,
    dimension: number | null = null,
    custom_file_no_found: string | null = null
) {
    if (!files) {
        return [custom_file_no_found || "noimagefound"];
    }
    const filterImages = dimension
        ? files.filter(
              (img) =>
                  img.url?.startsWith("https://") || img.dimension === dimension
          )
        : files;

    return filterImages.map((file) =>
        file.url!.startsWith("https://") ? file.url : `/tu-empresa/${file.url}`
    );
}
export function capitalize(str: string) {
    if (typeof str !== "string" || str.length === 0) {
        return str; // Devuelve el valor original si no es string o está vacío
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
export default dayjs;
