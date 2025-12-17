import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock window.locals for tests
if (typeof window !== "undefined") {
    Object.defineProperty(window, "locals", {
        writable: true,
        value: {
            empresa: {
                timezone: "America/Lima",
            },
        },
    });

    // Mock matchMedia
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(), // deprecated
            removeListener: vi.fn(), // deprecated
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
}

// Mock ResizeObserver
if (typeof global.ResizeObserver === "undefined") {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    }));
}
