-- Cambios de base de datos para Turso (producción). Ejecutar ANTES de publicar el código nuevo.
-- Ejecuta línea por línea. Si alguna ALTER dice "duplicate column name", esa columna ya existe: sigue con la siguiente.

-- Portada de la Home (Páginas → Home → Hero)
ALTER TABLE pages ADD COLUMN hero_etiqueta text DEFAULT 'Coco Emilia';
ALTER TABLE pages ADD COLUMN hero_titulo text DEFAULT 'Tu estilo,';
ALTER TABLE pages ADD COLUMN hero_titulo_cursiva text DEFAULT 'con mucho cariño';
ALTER TABLE pages ADD COLUMN hero_texto text DEFAULT 'Moda, ropa deportiva, joyería, bolsos, zapatos, pijamas y todo para tu cabello. Piezas que te hacen sentir tú.';
ALTER TABLE pages ADD COLUMN hero_color_boton text DEFAULT 'verde';
ALTER TABLE _pages_v ADD COLUMN version_hero_etiqueta text DEFAULT 'Coco Emilia';
ALTER TABLE _pages_v ADD COLUMN version_hero_titulo text DEFAULT 'Tu estilo,';
ALTER TABLE _pages_v ADD COLUMN version_hero_titulo_cursiva text DEFAULT 'con mucho cariño';
ALTER TABLE _pages_v ADD COLUMN version_hero_texto text DEFAULT 'Moda, ropa deportiva, joyería, bolsos, zapatos, pijamas y todo para tu cabello. Piezas que te hacen sentir tú.';
ALTER TABLE _pages_v ADD COLUMN version_hero_color_boton text DEFAULT 'verde';

-- Sección de Instagram (Globales → Instagram)
ALTER TABLE instagram ADD COLUMN etiqueta text DEFAULT 'Instagram';
ALTER TABLE instagram ADD COLUMN titulo text DEFAULT 'Síguenos en';
ALTER TABLE instagram ADD COLUMN titulo_cursiva text DEFAULT 'Instagram';
ALTER TABLE instagram ADD COLUMN texto text DEFAULT 'Novedades, looks y lo que pasa detrás de cámaras en';
ALTER TABLE instagram ADD COLUMN boton_texto text DEFAULT 'Seguir en Instagram';
ALTER TABLE instagram ADD COLUMN boton_enlace text DEFAULT '';
ALTER TABLE instagram ADD COLUMN color_boton text DEFAULT 'verde';

-- Global nuevo "Inicio" (orden de secciones, textos y novedades)
CREATE TABLE IF NOT EXISTS inicio (
	id integer PRIMARY KEY NOT NULL,
	colecciones_etiqueta text DEFAULT 'Explora',
	colecciones_titulo text DEFAULT 'Nuestras',
	colecciones_titulo_cursiva text DEFAULT 'colecciones',
	novedades_mostrar integer DEFAULT true,
	novedades_etiqueta text DEFAULT 'Lo último',
	novedades_titulo text DEFAULT '',
	novedades_titulo_cursiva text DEFAULT 'Novedades',
	novedades_cantidad numeric DEFAULT 3,
	historia_mostrar integer DEFAULT true,
	historia_etiqueta text DEFAULT 'Nuestra historia',
	historia_titulo text DEFAULT 'Así nació',
	historia_titulo_cursiva text DEFAULT 'Coco Emilia',
	historia_texto text DEFAULT 'Coco Emilia nació del amor por la moda y por esos pequeños detalles que nos hacen sentir bonitas. Quisimos reunir en un solo lugar piezas elegidas con cariño: ropa, joyería, bolsos, zapatos, pijamas y accesorios para el cabello.',
	historia_boton_texto text DEFAULT 'Escríbenos',
	historia_boton_enlace text DEFAULT '',
	updated_at text,
	created_at text,
	novedades_modo text DEFAULT 'ultimos',
	historia_color_boton text DEFAULT 'borde'
);
CREATE TABLE IF NOT EXISTS inicio_orden (
	_order integer NOT NULL,
	_parent_id integer NOT NULL,
	id text PRIMARY KEY NOT NULL,
	seccion text NOT NULL,
	FOREIGN KEY (_parent_id) REFERENCES inicio(id) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS inicio_orden_order_idx ON inicio_orden (_order);
CREATE INDEX IF NOT EXISTS inicio_orden_parent_id_idx ON inicio_orden (_parent_id);
CREATE TABLE IF NOT EXISTS inicio_rels (
	id integer PRIMARY KEY NOT NULL,
	"order" integer,
	parent_id integer NOT NULL,
	path text NOT NULL,
	products_id integer,
	FOREIGN KEY (parent_id) REFERENCES inicio(id) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (products_id) REFERENCES products(id) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS inicio_rels_order_idx ON inicio_rels ("order");
CREATE INDEX IF NOT EXISTS inicio_rels_parent_idx ON inicio_rels (parent_id);
CREATE INDEX IF NOT EXISTS inicio_rels_path_idx ON inicio_rels (path);
CREATE INDEX IF NOT EXISTS inicio_rels_products_id_idx ON inicio_rels (products_id);
