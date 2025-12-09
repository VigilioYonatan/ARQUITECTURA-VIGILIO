import type { Request, Response } from "express";
import { BASE_URL,  } from "~/config/server/const";
import enviroments from "~/config/server/environments.config";

interface HeaderProps {
    title: string;
    description?: string;
}
export async function Header({
    title,
    description = "Centro de Arbitraje e Investigaciones Jurídicas. Especialistas en arbitraje con contrataciones públicas, arbitrajes de emergencias y Junta de Resolución de disputas.",
}: HeaderProps) {
    const logo = `${BASE_URL()}/images/favicon.webp`;

    const seo = {
        title,
        description,
        keywords:
            "arbitraje, arbitraje en contrataciones públicas, arbitraje con el estado, arbitraje de emergencia, normativa contratación pública Perú, disputas contractuales, resolución de controversias, junta de resolución de disputas, dispute boards",
    };

    return `
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${seo.title}</title>
        <meta name="description" content="${seo.description}">
        <meta name="keywords" content="${seo.keywords}">
        <meta itemprop="name" content="cearlatinoamericano">
        <meta itemprop="description" content="${seo.description}">
        <meta itemprop="image" content="${logo}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="${BASE_URL()}">
        <meta name="twitter:title" content="${seo.title}">
        <meta name="twitter:description" content="${seo.description}">
        <meta name="twitter:creator" content="cearlatinoamericano">
        <meta name="twitter:image" content="${logo}">
        <meta property="og:title" content="${seo.title}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="${logo}">
        <meta property="og:image" content="${logo}">
        <meta property="og:width" content="800">
        <meta property="og:height" content="800">
        <meta property="og:description" content="${seo.description}">
        <meta property="og:site_name" content="cearlatinoamericano">
        <meta name="fb:app_id" content="100064161184422">
        <link rel="apple-touch-icon" href="${logo}">
        <link rel="manifest" href="${enviroments().VITE_URL}/manifest.json">
        <link rel="icon" href="/images/settings/favicon.ico" type="image/x-icon">
        `;
}
export function tailwind(color_primary: string) {
    return `
     <!-- los primarios son --primary y --primary-foreground -->
        <!-- accent y accent-foreground -->
        <style type="text/css">
            @layer base {
                 :root {
                    --background: #ffffff;
                    --foreground: #0a0a0a;
                    --card: #ffffff;
                    --hover: #066484;
                    --card-foreground: #0a0a0a;
                    --popover: #ffffff;
                    --popover-foreground: #0a0a0a;
                    --primary: ${color_primary};
                    --primary-foreground: #ffffff;
                    --secondary: #f5f5f5;
                    --secondary-foreground: #0b95ba;
                    --muted: #f5f5f5;
                    --muted-foreground: #737373;
                    --accent: #f5f5f5;
                    --accent-foreground: #0b95ba;
                    --destructive: #dc2626;
                    --destructive-foreground: #fafafa;
                    --border: #e5e5e5;
                    --input: #e5e5e5;
                    --ring: #171717;
                    --radius: 0.5rem;
                }
                .dark {
                    --background: #0a0a0a;
                    --hover: #066484;
                    --foreground: #fafafa;
                    --card: #0a0a0a;
                    --card-foreground: #fafafa;
                    --popover: #0a0a0a;
                    --popover-foreground: #fafafa;
                    --primary: ${color_primary};
                    --primary-foreground: #ffffff;
                    --secondary: #262626;
                    --secondary-foreground: #0b95ba;
                    --muted: #262626;
                    --muted-foreground: #a3a3a3;
                    --accent: #262626;
                    --accent-foreground: #0b95ba;
                    --destructive: #7f1d1d;
                    --destructive-foreground: #fafafa;
                    --border: #262626;
                    --input: #262626;
                    --ring: #d4d4d4;
                }

                * {
                    border-color: var(--border);
                }

                body {
                    color: var(--foreground);
                    font-feature-settings: "rlig" 1, "calt" 1;
                }
            }
        </style>
    `;
}
export function styleEditorPreview() {
    return `
    <style>
    .mce-content-body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;width:100%;}.mce-content-body p{display:block!important;margin:1em 0!important;text-align:justify;}.mce-content-body h2{display:block!important;font-size:1.5em!important;margin:0.43em 0!important;font-weight:bold!important;text-align:justify;}.mce-content-body h3{display:block!important;font-size:1.17em!important;margin:0.43em 0!important;font-weight:bold!important;text-align:justify;}.mce-content-body h4{display:block!important;font-size:1em!important;margin:0.43em 0!important;font-weight:bold!important;text-align:justify;}.mce-content-body h5{display:block!important;font-size:0.83em!important;margin:0.43em 0!important;font-weight:bold!important;text-align:justify;}.mce-content-body h6{display:block!important;font-size:0.67em!important;margin:0.43em 0!important;font-weight:bold!important;text-align:justify;}.mce-content-body ul{display:block!important;list-style-type:disc!important;margin:1em 0!important;padding-left:40px!important;}.mce-content-body ol{display:block!important;list-style-type:decimal!important;margin:1em 0!important;padding-left:40px!important;}.mce-content-body li{display:list-item!important;}.mce-content-body a{color:(internal value)!important;text-decoration:underline!important;cursor:pointer!important;text-align:justify;}.mce-content-body strong{font-weight:bold!important;}.mce-content-body em{font-style:italic!important;}.mce-content-body u{text-decoration:underline!important;}.mce-content-body s{text-decoration:line-through!important;}.mce-content-body small{font-size:smaller!important;}.mce-content-body blockquote{display:block!important;margin:1em 40px!important;}.mce-content-body pre{display:block!important;font-family:monospace!important;white-space:pre!important;margin:1em 0!important;}.mce-content-body span{display:inline!important;text-align:justify;}.mce-content-body br{display:inline!important;}.mce-content-body table{display:table!important;border-spacing:2px!important;}.mce-content-body tr{display:table-row!important;}.mce-content-body td{display:table-cell!important;padding:1px!important;}.mce-content-body th{display:table-cell!important;font-weight:bold!important;padding:1px!important;}.mce-content-body img{display:inline-block!important;}.mce-content-body hr{display:block!important;margin:0.5em auto!important;border-style:inset!important;border-width:1px!important;}.mce-content-body table{border-collapse:collapse;}.mce-content-body table:not([cellpadding]) th,.mce-content-body table:not([cellpadding]) td{padding:0.4rem;}.mce-content-body table[border]:not([border="0"]):not([style*="border-width"]) th,.mce-content-body table[border]:not([border="0"]):not([style*="border-width"]) td{border-width:1px;}.mce-content-body table[border]:not([border="0"]):not([style*="border-style"]) th,.mce-content-body table[border]:not([border="0"]):not([style*="border-style"]) td{border-style:solid;}.mce-content-body table[border]:not([border="0"]):not([style*="border-color"]) th,.mce-content-body table[border]:not([border="0"]):not([style*="border-color"]) td{border-color:#ccc;}.mce-content-body figure{display:table;margin:1rem auto;}.mce-content-body figure figcaption{color:#999;display:block;margin-top:0.25rem;}.mce-content-body hr{border-color:#ccc;border-style:solid;border-width:1px 0 0 0;}.mce-content-body code{background-color:#e8e8e8;border-radius:3px;padding:0.1rem 0.2rem;}.mce-content-body:not([dir=rtl]) blockquote{border-left:2px solid #ccc;margin-left:1.5rem;padding-left:1rem;}.mce-content-body[dir=rtl] blockquote{border-right:2px solid #ccc;margin-right:1.5rem;padding-right:1rem;}
    </style>
    `;
}
export function escapeQuotes(str: string): string {
    return str.replace(/"/g, '\\"');
}

/**
 *  html json strifidy
 */
export function escapeForHtmlAttribute(json: string) {
    return json
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

/**
 *  parser props
 */
export function propsToString(props: Record<string, unknown>): string {
    return Object.entries(props)
        .map(([key, value]) => {
            if (typeof value === "string") {
                return `${key}="${escapeQuotes(value)}"`; // ecape
            }
            return `:${key}="${escapeForHtmlAttribute(JSON.stringify(value))}"`;
        })
        .join(" ");
}

export function render(props: {
    lang?: string;
    head?: string;
    scripts?: string;
    props?: Record<string, unknown>;
}) {
    return async (req: Request, res: Response) => {
        function formatPath(routePath: string) {
            let formatted = routePath.startsWith("/")
                ? routePath.slice(1)
                : routePath;

            formatted = !Number.isNaN(Number(formatted[0]))
                ? `page-${formatted.replace("*", "")}`
                : formatted.startsWith(":")
                ? `page-${formatted.slice(1).replace("*", "")}`
                : formatted.replace("*", "");

            if (formatted === "") return "index";
            const segments = formatted.split("/");
            const processedSegments = segments.map((segment) => {
                if (segment.startsWith(":")) {
                    return `[${segment.slice(1)}]`;
                }
                return segment;
            });
            formatted = processedSegments.join("-");
            if (!formatted.endsWith("]")) {
                formatted += "-index";
            }
            return formatted;
        }
        let pathJs = formatPath(req.route.path.toLowerCase());
        // let files: FileSchemaToClient[] | null = cacheGetJson("files");

        // if (!files) {
        //     files = await FileEntity.findAll({
        //         raw: true,
        //         attributes: ["id", "name", "file"],
        //     });
        //     cache.set("files", JSON.stringify(files), cacheTimes.days30);
        // }

        pathJs = pathJs === "admin*-index" ? "app-index" : pathJs;
        pathJs = pathJs === "admin*-index" ? "app-index" : pathJs;

        // const icons = cacheGetJson<IconSchemaFromServer[]>("icons");
        // BEST PERFORMANCE, GET THIS IN ALL PAGES
        props.props = {
            ...(props.props || {}),
        };

        // pathJs = `pages-${pathJs}`;
        return res.send(`
            <!DOCTYPE html>
            <html lang="${props.lang || "es"}">
                        <head>
                            ${props.head || ""}
                            ${tailwind("red")}
                            ${styleEditorPreview()}
                            ${res.locals.vite}
                        </head>
                        <body class="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 ">
                            <${pathJs}></${pathJs}>
                           <script>window.props = ${JSON.stringify(
                               props.props || {}
                           )}; </script>
                        </body>
                    </html>`);
    };
}
