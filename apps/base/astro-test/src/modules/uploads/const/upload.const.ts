/**
 * MIMETYPES
 */
type MimeKey =
	| "image"
	| "vector"
	| "document"
	| "spreadsheet"
	| "presentation"
	| "video"
	| "audio"
	| "archive"
	| "json_data"
	| "default";
export const MIMETYPES: Record<MimeKey, string[] | string> = {
	image: [
		"image/jpg",
		"image/jpeg",
		"image/png",
		"image/webp",
		"image/gif",
		"image/avif",
		"image/svg+xml",
	],
	vector: ["image/svg+xml"],
	document: [
		"application/pdf",
		"application/msword",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"text/plain",
		"application/rtf",
	],
	spreadsheet: [
		"text/csv",
		"application/vnd.ms-excel",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	],
	presentation: [
		"application/pdf",
		"application/vnd.ms-powerpoint",
		"application/vnd.openxmlformats-officedocument.presentationml.presentation",
	],
	video: ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"],
	audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/webm"],
	archive: [
		"application/zip",
		"application/x-rar-compressed",
		"application/x-7z-compressed",
		"application/gzip",
	],
	json_data: ["application/json"],
	default: "*",
};

/**
 * Sizes
 * xs: 1024 * 1024 / 2 //0.5MB /n,
 * sm: 1024 * 1024 //1MB /n,
 * md: 5 * 1024 * 1024 //5MB /n,
 * lg: 10 * 1024 * 1024 //10MB /n,
 * xl: 50 * 1024 * 1024 //50MB /n,
 * xxl: 100 * 1024 * 1024 //100MB /n,
 * xxxl: 2000 * 1024 * 1024 //2000MB /n,
 */
type SizeKey = "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";
export const SIZE: Record<SizeKey, number> = {
	xs: (1024 * 1024) / 2,
	sm: 1024 * 1024,
	md: 5 * 1024 * 1024,
	lg: 10 * 1024 * 1024,
	xl: 50 * 1024 * 1024,
	xxl: 100 * 1024 * 1024,
	xxxl: 2000 * 1024 * 1024,
};

/**
 * Upload Rules
 */
export type UploadRuleType =
	| "default"
	| "avatar"
	| "banner"
	| "gallery"
	| "vector"
	| "document"
	| "spreadsheet"
	| "presentation"
	| "videoShort"
	| "videoLong"
	| "audio"
	| "archive"
	| "json_data";
export type UploadRule = {
	max_size: number;
	mime_types: string[] | string;
};
export const UPLOAD_RULES: Record<UploadRuleType, UploadRule> = {
	// --- GENÉRICOS ---
	default: {
		max_size: SIZE.xl, //20MB
		mime_types: MIMETYPES.default,
	},

	// --- IMÁGENES ---
	avatar: {
		max_size: SIZE.lg,
		mime_types: MIMETYPES.image,
	},
	banner: {
		max_size: SIZE.lg,
		mime_types: MIMETYPES.image,
	},
	gallery: {
		max_size: SIZE.lg,
		mime_types: MIMETYPES.image,
	},
	// ¡Cuidado con SVG! Puede contener scripts (XSS). Solo úsalo si sanitizas el archivo.
	vector: {
		max_size: SIZE.sm,
		mime_types: MIMETYPES.vector,
	},

	// --- DOCUMENTOS / OFICINA ---
	document: {
		max_size: SIZE.lg,
		mime_types: MIMETYPES.document,
	},
	spreadsheet: {
		max_size: SIZE.lg,
		mime_types: MIMETYPES.spreadsheet,
	},
	presentation: {
		max_size: SIZE.xl,
		mime_types: MIMETYPES.presentation,
	},

	// --- MULTIMEDIA ---
	videoShort: {
		max_size: SIZE.xl,
		mime_types: MIMETYPES.video,
	},
	videoLong: {
		max_size: SIZE.xxxl,
		mime_types: MIMETYPES.video,
	},
	audio: {
		max_size: SIZE.xl,
		mime_types: MIMETYPES.audio,
	},

	// --- ARCHIVOS COMPRIMIDOS / OTROS ---
	archive: {
		max_size: SIZE.xxl,
		mime_types: MIMETYPES.archive,
	},
	json_data: {
		max_size: SIZE.md,
		mime_types: MIMETYPES.json_data,
	},
};

export const DIMENSION_IMAGE: Record<SizeKey, number> = {
	xs: 100,
	sm: 320,
	md: 768,
	lg: 1024,
	xl: 1280,
	xxl: 1920,
	xxxl: 2560,
};

export type EntityFile = "user";
export type EntityFileProperty = "photo" | "wallpaper";

export type UploadConfig = UploadRule & {
	dimensions?: number[];
	folder?: string;
	max_files: number;
};
export const UPLOAD_CONFIG: Record<
	EntityFile,
	Record<EntityFileProperty, UploadConfig>
> = {
	user: {
		photo: {
			...UPLOAD_RULES.avatar,
			dimensions: [DIMENSION_IMAGE.xs, DIMENSION_IMAGE.md],
			folder: "users",
			max_files: 1,
		},
		wallpaper: {
			...UPLOAD_RULES.banner,
			dimensions: [DIMENSION_IMAGE.xs, DIMENSION_IMAGE.md],
			folder: "users",
			max_files: 1,
		},
	},
};
