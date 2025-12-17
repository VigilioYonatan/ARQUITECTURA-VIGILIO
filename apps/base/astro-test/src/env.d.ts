/// <reference types="astro/client" />
import type { Global } from "@infrastructure/types/request";

declare global {
	namespace App {
		interface Locals {
			empresa: Global["empresa"];
			props: Record<string, unknown>;
		}
	}
}
