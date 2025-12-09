// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Card from "./Card.astro";

describe("Card Component", () => {
    it("renders with correct props", async () => {
        const container = await AstroContainer.create();
        const result = await container.renderToString(Card, {
            props: {
                title: "Test Title",
                body: "Test Body Content",
                href: "/test-link",
            },
        });

        expect(result).toContain("Test Title");
        expect(result).toContain("Test Body Content");
        expect(result).toContain('href="/test-link"');
    });
});
