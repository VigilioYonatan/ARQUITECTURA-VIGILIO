import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import Newsletter from "./Newsletter";

// 🎭 Mock de astro:actions
// Esto es crucial: No queremos llamar al backend real en un test unitario
vi.mock("astro:actions", () => ({
    actions: {
        newsletter: {
            subscribe: vi.fn(),
        },
    },
}));

import { actions } from "astro:actions";

describe("Newsletter Component", () => {
    it("renders the form correctly", () => {
        render(<Newsletter />);
        expect(screen.getByText(/Newsletter/i)).toBeInTheDocument();
        expect(screen.getByText("Suscribirse")).toBeInTheDocument();
    });

    it("handles submission correctly", async () => {
        // 1. Configurar el Mock para que devuelva éxito
        actions.newsletter.subscribe.mockResolvedValue({
            data: { message: "¡Éxito simulado!" },
            error: null,
        });

        render(<Newsletter />);

        // 2. Rellenar el formulario
        const nameInput = screen.getByLabelText("Nombre"); // Asegúrate que tu label tenga el texto correcto
        const emailInput = screen.getByLabelText("Email");

        // Nota: En Preact/React testing library a veces es mejor usar userEvent,
        // pero fireEvent es más simple para empezar.
        fireEvent.input(nameInput, { target: { value: "Test User" } });
        fireEvent.input(emailInput, { target: { value: "test@example.com" } });

        // 3. Enviar
        const button = screen.getByText("Suscribirse");
        fireEvent.click(button);

        // 4. Verificar que cambió a "Enviando..."
        expect(screen.getByText("Enviando...")).toBeInTheDocument();

        // 5. Esperar a que termine
        await waitFor(() => {
            expect(screen.getByText("¡Éxito simulado!")).toBeInTheDocument();
        });

        // 6. Verificar que se llamó a la acción con los datos correctos
        expect(actions.newsletter.subscribe).toHaveBeenCalled();
    });
});
