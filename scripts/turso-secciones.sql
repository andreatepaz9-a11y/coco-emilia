-- Secciones editables del inicio. Ejecutar en Turso ANTES de publicar el código nuevo.
CREATE TABLE IF NOT EXISTS `inicio_blocks_colecciones` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `inicio`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `inicio_blocks_colecciones_order_idx` ON `inicio_blocks_colecciones` (`_order`);
CREATE INDEX IF NOT EXISTS `inicio_blocks_colecciones_parent_id_idx` ON `inicio_blocks_colecciones` (`_parent_id`);
CREATE INDEX IF NOT EXISTS `inicio_blocks_colecciones_path_idx` ON `inicio_blocks_colecciones` (`_path`);
CREATE TABLE IF NOT EXISTS `inicio_blocks_novedades` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `inicio`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `inicio_blocks_novedades_order_idx` ON `inicio_blocks_novedades` (`_order`);
CREATE INDEX IF NOT EXISTS `inicio_blocks_novedades_parent_id_idx` ON `inicio_blocks_novedades` (`_parent_id`);
CREATE INDEX IF NOT EXISTS `inicio_blocks_novedades_path_idx` ON `inicio_blocks_novedades` (`_path`);
CREATE TABLE IF NOT EXISTS `inicio_blocks_historia` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `inicio`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `inicio_blocks_historia_order_idx` ON `inicio_blocks_historia` (`_order`);
CREATE INDEX IF NOT EXISTS `inicio_blocks_historia_parent_id_idx` ON `inicio_blocks_historia` (`_parent_id`);
CREATE INDEX IF NOT EXISTS `inicio_blocks_historia_path_idx` ON `inicio_blocks_historia` (`_path`);
CREATE TABLE IF NOT EXISTS `inicio_blocks_instagram` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `inicio`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `inicio_blocks_instagram_order_idx` ON `inicio_blocks_instagram` (`_order`);
CREATE INDEX IF NOT EXISTS `inicio_blocks_instagram_parent_id_idx` ON `inicio_blocks_instagram` (`_parent_id`);
CREATE INDEX IF NOT EXISTS `inicio_blocks_instagram_path_idx` ON `inicio_blocks_instagram` (`_path`);
CREATE TABLE IF NOT EXISTS `inicio_blocks_seccion_texto` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`etiqueta` text DEFAULT 'Nueva temporada',
	`titulo` text DEFAULT 'Piezas para',
	`titulo_cursiva` text DEFAULT 'estrenar',
	`texto` text DEFAULT 'Cuéntale a tus clientas qué hay de nuevo, una promoción o una colección especial.',
	`imagen_id` integer,
	`posicion_foto` text DEFAULT 'derecha',
	`fondo` text DEFAULT 'rosa',
	`boton_texto` text DEFAULT 'Ver más',
	`boton_enlace` text DEFAULT '#novedades',
	`color_boton` text DEFAULT 'verde',
	`block_name` text,
	FOREIGN KEY (`imagen_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `inicio`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `inicio_blocks_seccion_texto_order_idx` ON `inicio_blocks_seccion_texto` (`_order`);
CREATE INDEX IF NOT EXISTS `inicio_blocks_seccion_texto_parent_id_idx` ON `inicio_blocks_seccion_texto` (`_parent_id`);
CREATE INDEX IF NOT EXISTS `inicio_blocks_seccion_texto_path_idx` ON `inicio_blocks_seccion_texto` (`_path`);
CREATE INDEX IF NOT EXISTS `inicio_blocks_seccion_texto_imagen_idx` ON `inicio_blocks_seccion_texto` (`imagen_id`);

-- Opción "Mostrar en el menú" de las páginas
ALTER TABLE pages ADD COLUMN mostrar_en_menu integer DEFAULT false;
ALTER TABLE pages ADD COLUMN etiqueta_menu text;
ALTER TABLE _pages_v ADD COLUMN version_mostrar_en_menu integer DEFAULT false;
ALTER TABLE _pages_v ADD COLUMN version_etiqueta_menu text;
