import { render, fireEvent, screen, waitFor } from "@testing-library/preact";
import { describe, expect, test } from "vitest";
import Counter from "./counter";

// https://preactjs.com/guide/v10/preact-testing-library/

describe("Counter", () => {
    test("should display initial count", () => {
        const { container } = render(<Counter initialValue={5} />);
        expect(container.textContent).toMatch("Current value: 5");
    });

    test('should increment after "Increment" button is clicked', async () => {
        render(<Counter initialValue={5} />);

        fireEvent.click(screen.getByText("Increment"));
        await screen.findByText("Current value: 6");
        await waitFor(() => {
            // .toBeInTheDocument() is an assertion that comes from jest-dom.
            // Otherwise you could use .toBeDefined().
            expect(screen.getByText("Current value: 6")).toBeInTheDocument();
        });
    });
});
