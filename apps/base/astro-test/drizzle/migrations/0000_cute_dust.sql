CREATE TABLE "address" (
	"id" serial PRIMARY KEY NOT NULL,
	"ubigeo" varchar(10),
	"urbanizacion" varchar(300),
	"direccion" varchar(300),
	"cod_local" varchar(20),
	"city_id" integer,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "company" (
	"id" serial PRIMARY KEY NOT NULL,
	"ruc" varchar(200) NOT NULL,
	"razon_social" varchar(200) NOT NULL,
	"nombre_comercial" varchar(200) NOT NULL,
	"sol_user" varchar(100) NOT NULL,
	"sol_pass" varchar(100) NOT NULL,
	"client_id" varchar(200),
	"client_secret" varchar(200),
	"certificado_password" varchar(200),
	"mode" varchar(20) NOT NULL,
	"logo_facturacion" json,
	"certificado_digital" json,
	"empresa_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "empresa" (
	"id" serial PRIMARY KEY NOT NULL,
	"name_empresa" varchar(255) NOT NULL,
	"dial_code" varchar(20) NOT NULL,
	"model_ai_groq" varchar(100) NOT NULL,
	"telefono" varchar(20) NOT NULL,
	"token_ai" varchar(255) NOT NULL,
	"color_primary" varchar(100) NOT NULL,
	"timezone" varchar(100) NOT NULL,
	"enabled_automatic_payment" boolean DEFAULT false NOT NULL,
	"enabled_send_sunat" boolean DEFAULT false NOT NULL,
	"enabled_send_pdf" boolean DEFAULT false NOT NULL,
	"logo_facturacion" jsonb NOT NULL,
	"certificado_digital" jsonb NOT NULL,
	"address_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "file" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"file" jsonb NOT NULL,
	"history" jsonb NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "file_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "icons" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"slug" text NOT NULL,
	"photo" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "icons_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "city" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"region_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "country" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(255) NOT NULL,
	"dial_code" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "country_code_unique" UNIQUE("code"),
	CONSTRAINT "country_dial_code_unique" UNIQUE("dial_code"),
	CONSTRAINT "country_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "region" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"country_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(20) NOT NULL,
	"user_name" varchar(100),
	"email" varchar(255) NOT NULL,
	"documento_code" varchar(100) NOT NULL,
	"documento" varchar(100) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"father_lastname" varchar(100) NOT NULL,
	"mother_lastname" varchar(100) NOT NULL,
	"gender" varchar DEFAULT 'masculino' NOT NULL,
	"password" varchar(100),
	"profesion" varchar(100),
	"presentation" text,
	"photo" jsonb,
	"wallpaper" jsonb,
	"role" varchar NOT NULL,
	"telefono" varchar(30) NOT NULL,
	"is_register_automatic" boolean DEFAULT false NOT NULL,
	"status" varchar(30) NOT NULL,
	"estudiante_status" varchar(30) NOT NULL,
	"intentos_session" integer DEFAULT 0 NOT NULL,
	"intentos_session_date" timestamp with time zone,
	"ultima_conexion" timestamp with time zone,
	"enabled_notifications_webpush" boolean DEFAULT false NOT NULL,
	"address" varchar(500) NOT NULL,
	"subscription" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "address" ADD CONSTRAINT "address_city_id_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."city"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "address" ADD CONSTRAINT "address_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company" ADD CONSTRAINT "company_empresa_id_empresa_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresa"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "empresa" ADD CONSTRAINT "empresa_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "empresa" ADD CONSTRAINT "empresa_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file" ADD CONSTRAINT "file_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "city" ADD CONSTRAINT "city_region_id_region_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."region"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "region" ADD CONSTRAINT "region_country_id_country_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."country"("id") ON DELETE no action ON UPDATE no action;