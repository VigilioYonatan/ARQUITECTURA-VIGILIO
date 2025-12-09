import "vite/modulepreload-polyfill"; //https://vitejs.dev/guide/backend-integration
import "../assets/index.css";
import { render } from "@/infrastructure/libs/client/preact";
import { lazy } from "preact/compat";
import enviroments from "~/config/client/environments.config";
import "@vigilio/sweet/sweet.min.css";
import "aos/dist/aos.css";
import Aos from "aos";
import Sweet from "@vigilio/sweet";

// Init AOS to animate the page
Aos.init();

// sweet modal global
Sweet.modalConfig({
    confirmButtonText: "Aceptar",
    hiddeBackground: false,
    isCloseInBackground: false,
    showCancelButton: true,
    showConfirmButton: true,
    showCloseButton: true,
});

// web
// importar todas las páginas lazyloading y ignorar los que no
for (const [path, importFn] of Object.entries(
    import.meta.glob(
        [
            "./**/*.tsx",
            "!./**/interno/**/*.tsx",
            "!./**/campus/**/*.tsx",
            "!./components/**/*.tsx",
        ],
        {
            eager: false,
        }
    )
)) {
    render(
        path.slice(1),
        lazy(() =>
            enviroments.VITE_ENV === "production"
                ? importFn().then((module) => ({
                      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                      default: (module as any).default,
                  }))
                : import(/* @vite-ignore */ path)
        )
    );
}
