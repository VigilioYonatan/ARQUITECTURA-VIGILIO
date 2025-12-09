import { describe, expect, it } from "vitest";
import { newsletterService } from "./newsletterService";

describe("Newsletter Service", () => {
    it("subscribes a valid user", async () => {
        const result = await newsletterService.subscribe("test@example.com", "Test User");

        expect(result).toHaveProperty("id");
        expect(result.status).toBe("subscribed");
    });

    it("throws error for blocked email", async () => {
        await expect(newsletterService.subscribe("error@example.com", "Bad User")).rejects.toThrow(
            "Error de negocio: Email bloqueado",
        );
    });
});
