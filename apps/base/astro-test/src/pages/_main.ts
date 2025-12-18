if (typeof window !== "undefined") {
    // 1. Cargar CSS de forma dinámica
    import("@assets/css/global.css");
    import("@vigilio/sweet/sweet.min.css");
    import("aos/dist/aos.css");

    // 2. Cargar librerías JS de forma dinámica
    Promise.all([import("@vigilio/sweet"), import("aos")]).then(
        ([{ default: Sweet }, { default: Aos }]) => {
            // Inicializar AOS
            Aos.init();

            // Configurar Sweet Modal
            Sweet.modalConfig({
                confirmButtonText: "Aceptar",
                hiddeBackground: false,
                isCloseInBackground: false,
                showCancelButton: true,
                showConfirmButton: true,
                showCloseButton: true,
                text: "",
            });
        }
    );
}
