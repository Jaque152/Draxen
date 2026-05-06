-- =======================================================
-- 1. CREACIÓN DE TABLAS (ECOSISTEMA CLICBLAZE "cb_")
-- =======================================================

-- Asegurarnos de tener la extensión de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS cb_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS cb_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    correo_electronico TEXT NOT NULL,
    telefono TEXT,
    direccion_calle TEXT,
    localidad_ciudad TEXT,
    region_estado TEXT,
    codigo_postal TEXT,
    pais_region TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    impuesto NUMERIC(10, 2) NOT NULL,
    total_estimado NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS cb_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES cb_orders(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES cb_plans(id),
    quantity INT NOT NULL,
    custom_price NUMERIC(10, 2), -- Aquí se guardará el precio del Custom Garage
    quote_id TEXT
);

-- =======================================================
-- 2. HABILITAR SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- =======================================================

ALTER TABLE cb_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE cb_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cb_order_items ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PARA PLANES (Cualquiera puede leer los planes activos para ver el catálogo, nadie puede alterarlos desde la web)
CREATE POLICY "Lectura publica de planes activos" 
ON cb_plans FOR SELECT 
USING (is_active = true);

-- POLÍTICAS PARA ÓRDENES E ITEMS (El cliente puede INSERTAR su orden al pagar, pero no puede leer ni borrar órdenes de otros)
CREATE POLICY "Permitir inserción de órdenes al pagar" 
ON cb_orders FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir inserción de items de orden" 
ON cb_order_items FOR INSERT 
WITH CHECK (true);

-- (Opcional si usas el Service Role Key de Supabase en tu Server Action de Checkout, el Service Role ignora el RLS automáticamente).

-- =======================================================
-- 3. INSERCIÓN DEL ARSENAL (INCLUYENDO CUSTOM GARAGE)
-- =======================================================

INSERT INTO cb_plans (title, description, price, is_active) VALUES
('Fotografía Profesional', 'Realizamos sesiones fotográficas de productos y contenido corporativo para mejorar la imagen de tu marca.', 6781.00, true),
('Gestión De E-Commerce', 'Administramos y optimizamos tu tienda en línea para mejorar la experiencia del usuario y aumentar las ventas.', 20627.00, true),
('Desarrollo Web Y Landing Pages', 'Creamos sitios web y páginas de aterrizaje optimizadas para convertir visitantes en clientes.', 22346.00, true),
('Análisis De Métricas Y Reportes', 'Realizamos seguimiento y análisis de tus campañas para optimizar resultados y tomar decisiones informadas.', 521.00, true),
('Community Management', 'Administramos tus redes sociales, creando contenido relevante y gestionando la interacción con tu comunidad.', 11494.00, true),
('Publicidad En Redes Sociales', 'Creamos y gestionamos anuncios en plataformas como Facebook, Instagram y TikTok para aumentar tu alcance y engagement.', 4023.00, true),
('Campañas SEM (Google Ads)', 'Gestionamos campañas de anuncios en Google para atraer tráfico cualificado y generar conversiones inmediatas.', 3628.00, true),
('Marketing De Influencers', 'Gestionamos campañas con influencers que amplifican tu mensaje y llegan a audiencias específicas de manera auténtica.', 17435.00, true),
('SEO (Posicionamiento En Buscadores)', 'Optimizamos tu sitio web para mejorar su visibilidad en los motores de búsqueda, atrayendo tráfico orgánico cualificado.', 8652.00, true),
('Email Marketing', 'Diseñamos y gestionamos campañas de correo electrónico que fidelizan a tus clientes y aumentan tus conversiones.', 200.00, true),
('Redacción Publicitaria (Copywriting)', 'Elaboramos textos persuasivos que comunican tu mensaje de forma clara y atractiva, generando una respuesta del público.', 3447.00, true),
('Producción Audiovisual', 'Creamos videos y spots publicitarios que capturan la atención y transmiten tu mensaje de manera impactante.', 36650.00, true),
('Producción De Materiales Impresos', 'Diseñamos y producimos flyers, carteles y empaques que comunican tu mensaje de forma efectiva y profesional.', 1570.00, true),
('Diseño De Identidad Visual', 'Creamos logotipos, paletas de colores y tipografías que representan tu marca de manera coherente y atractiva.', 25245.00, true),
('Creación De Conceptos Creativos', 'Desarrollamos ideas innovadoras que reflejan la esencia de tu marca, creando una conexión emocional con tu audiencia.', 17820.00, true),
('Planificación De Medios Integrada', 'Elaboramos planes de medios que combinan canales tradicionales y digitales, optimizando tu inversión publicitaria para alcanzar a tu público objetivo.', 8563.00, true),
('Análisis De Competencia Y Mercado', 'Realizamos estudios profundos de tu industria y competidores para identificar oportunidades y amenazas, permitiéndote posicionarte de manera efectiva.', 12420.00, true),
('Impulso Estratégico', 'Diseñamos estrategias personalizadas que alinean tus objetivos comerciales con las tendencias del mercado digital, asegurando un crecimiento sostenible.', 20140.00, true),
-- AÑADIMOS EL PLAN CUSTOM PARA QUE EXISTA EN LA BD
('Plan personalizado', 'Cotización a medida (El precio se calcula dinámicamente en el checkout)', 0.00, true);


CREATE TABLE IF NOT EXISTS cb_cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    plan_id UUID REFERENCES cb_plans(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    custom_price NUMERIC(10, 2),
    quote_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Permisos de seguridad para que el navegador pueda modificar el carrito
ALTER TABLE cb_cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acceso publico carrito" 
ON cb_cart_items FOR ALL 
USING (true) 
WITH CHECK (true);

-- 1. Crear la tabla para almacenar las cotizaciones a medida (Leads)
CREATE TABLE IF NOT EXISTS cb_custom_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    correo_electronico TEXT NOT NULL,
    id_cotizacion TEXT NOT NULL,
    monto_a_pagar NUMERIC(10, 2) NOT NULL,
    payment_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Habilitar la seguridad de nivel de fila (RLS)
ALTER TABLE cb_custom_quotes ENABLE ROW LEVEL SECURITY;

-- 3. Crear política: Permitir que el formulario web (público) inserte cotizaciones
CREATE POLICY "Permitir insercion de cotizaciones web" 
ON cb_custom_quotes FOR INSERT 
WITH CHECK (true);