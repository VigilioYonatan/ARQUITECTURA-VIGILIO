import { writeFile } from "node:fs/promises";

// Configuración
const API_KEY = "wJsRt7wbBnC3FW3gx9rLmeAacwe90lFl";
const COUNTRY = "PE";
const START_YEAR = 2025;
const END_YEAR = 2050;
const OUTPUT_FILE = "peru_holidays_2025-2050.json";

// Función para obtener feriados de un año específico
async function fetchHolidays(year: number): Promise<HolidaysResponse> {
	const url = `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${COUNTRY}&year=${year}`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status} for year ${year}`);
	}

	return (await response.json()) as HolidaysResponse;
}

// Función principal
export async function fetchAndSaveHolidays() {
	const allHolidays: Record<number, { name: string; date: string }[]> = {};
	const years = Array.from(
		{ length: END_YEAR - START_YEAR + 1 },
		(_, i) => START_YEAR + i,
	);

	// Limitar solicitudes concurrentes
	const CONCURRENT_LIMIT = 5;

	for (let i = 0; i < years.length; i += CONCURRENT_LIMIT) {
		const batch = years.slice(i, i + CONCURRENT_LIMIT);
		const promises = batch.map((year) =>
			fetchHolidays(year)
				.then((data) => {
					allHolidays[year] = data.response.holidays.map((holy) => ({
						name: holy.name,
						date: holy.date.iso,
					}));
				})
				.catch((error) => {
					console.error(`❌ Error en año ${year}:`, error.message);
					allHolidays[year] = [];
				}),
		);

		await Promise.all(promises);

		// Pequeña pausa entre lotes
		if (i + CONCURRENT_LIMIT < years.length) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}

	// Guardar a archivo
	try {
		await writeFile(OUTPUT_FILE, JSON.stringify(allHolidays, null, 2));
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		console.log(`\n🎉 Datos guardados en ${OUTPUT_FILE}`);
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		console.log(
			`📂 Total de años procesados: ${Object.keys(allHolidays).length}`,
		);
	} catch (error) {
		console.error("Error al guardar el archivo:", error);
	}
}

// Ejecutar
interface Holiday {
	name: string;
	description: string;
	country: {
		id: string;
		name: string;
	};
	date: {
		iso: string;
		datetime: {
			year: number;
			month: number;
			day: number;
			hour?: number;
			minute?: number;
			second?: number;
		};
		timezone?: {
			offset: string;
			zoneabb: string;
			zoneoffset: number;
			zonedst: number;
			zonetotaloffset: number;
		};
	};
	type: string[];
	primary_type: string;
	canonical_url: string;
	urlid: string;
	locations: string;
	states: string;
}

interface HolidaysResponse {
	meta: {
		code: number;
	};
	response: {
		holidays: Holiday[];
	};
}
