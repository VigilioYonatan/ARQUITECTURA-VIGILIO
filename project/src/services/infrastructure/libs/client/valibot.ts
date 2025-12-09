import { getOutput, getPipeIssues } from "@vigilio/valibot";
import { typeTextExtensions } from "./helpers";

/**
 * file validation
 * @param {Object} props
 *  @property {boolean} required -  true will be optional, false will be required
 *  @property {number} min - min files that upload to serve
 *  @property {number} max - max files that upload to serve
 *  @property {string[]} types - types extension - @default ["image/jpg","image/png","image/webp","image/gif","image/jpeg"]
 *  @property {number} maxSize - max sizes files that upload to serve
 *  @property {number} minSize - min sizes files that upload to serve
 */
function validFileValibot(props: {
    required: boolean;
    min: number;
    max?: number;
    types?: string[];
    maxSize?: number;
    minSize?: number;
}) {
    return (files: File[]) => {
        const {
            required,
            max = null,
            maxSize,
            min,
            minSize = 0.0001,
            types = [
                "image/jpg",
                "image/png",
                "image/webp",
                "image/gif",
                "image/jpeg",
            ],
        } = props;
        if (required && !files.length) {
            return getPipeIssues("custom", "Este campo es obligatorio", files);
        }
        if (max) {
            if (files.length > max) {
                return getPipeIssues(
                    "custom",
                    `Este campo solo permite maximo ${max} archivos`,
                    files
                );
            }
        }
        if (min) {
            if (files.length < min) {
                return getPipeIssues(
                    "custom",
                    `Este campo solo permite minimo ${min} archivos`,
                    files
                );
            }
        }

        for (const file of files) {
            if (types?.length && !types.includes(file.type)) {
                return getPipeIssues(
                    "custom",
                    typeTextExtensions(types),
                    files
                );
            }
            const mb = 1000000;
            const size = file.size;
            if (maxSize && size > maxSize * mb) {
                return getPipeIssues(
                    "custom",
                    `Este archivo es demasiado pesado ${file.name.slice(
                        0,
                        12
                    )}. Máximo ${maxSize} MB`,
                    files
                );
            }

            if (minSize && size < minSize * mb) {
                return getPipeIssues(
                    "custom",
                    `Este archivo es demasiado ligero ${file.name.slice(
                        0,
                        12
                    )}. Mínimo ${minSize} MB`,
                    files
                );
            }
        }

        return getOutput(files);
    };
}
export default validFileValibot;
