/// <reference types="astro/client" />

declare namespace App {
    interface Locals {
        user: {
            name: string;
            role: "admin" | "user";
        } | null;
    }
}
