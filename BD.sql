-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================================
-- 1. LIMPIEZA PREVIA
-- =====================================================================================
DROP TABLE IF EXISTS public.checkout_items_nc CASCADE;
DROP TABLE IF EXISTS public.checkouts_nc CASCADE;
DROP TABLE IF EXISTS public.cart_items_nc CASCADE;
DROP TABLE IF EXISTS public.custom_plan_payments_nc CASCADE;
DROP TABLE IF EXISTS public.contacts_nc CASCADE;
DROP TABLE IF EXISTS public.plans_nc CASCADE;
DROP TABLE IF EXISTS public.categories_nc CASCADE;

-- =====================================================================================
-- 2. CREACIÓN DE TABLAS
-- =====================================================================================

CREATE TABLE public.categories_nc (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE
);

CREATE TABLE public.plans_nc (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  category_id INTEGER REFERENCES public.categories_nc(id),
  price NUMERIC NOT NULL,
  description TEXT,
  features JSONB,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.cart_items_nc (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR NOT NULL,
  plan_id INTEGER REFERENCES public.plans_nc(id),
  quantity INTEGER DEFAULT 1,
  custom_price NUMERIC,  
  quote_id VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.checkouts_nc (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR NOT NULL,
  nombre VARCHAR NOT NULL,
  apellidos VARCHAR NOT NULL,
  pais_region VARCHAR NOT NULL,
  direccion_calle VARCHAR NOT NULL,
  localidad_ciudad VARCHAR NOT NULL,
  region_estado VARCHAR NOT NULL,
  codigo_postal VARCHAR NOT NULL,
  telefono VARCHAR,
  correo_electronico VARCHAR NOT NULL,
  indicaciones_pedido TEXT,
  subtotal NUMERIC NOT NULL,
  impuesto NUMERIC NOT NULL,
  total_estimado NUMERIC NOT NULL,
  payment_status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.checkout_items_nc (
  id SERIAL PRIMARY KEY,
  checkout_id UUID REFERENCES public.checkouts_nc(id),
  plan_id INTEGER REFERENCES public.plans_nc(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL
  custom_price NUMERIC,  
  quote_id VARCHAR
);

CREATE TABLE public.contacts_nc (
  id SERIAL PRIMARY KEY,
  nombre_completo VARCHAR NOT NULL,
  empresa_negocio VARCHAR NOT NULL,
  telefono VARCHAR NOT NULL,
  correo_electronico VARCHAR NOT NULL,
  asunto VARCHAR NOT NULL,
  mensaje TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.custom_plan_payments_nc (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR NOT NULL,
  apellidos VARCHAR NOT NULL,
  correo_electronico VARCHAR NOT NULL,
  id_cotizacion VARCHAR NOT NULL,
  monto_a_pagar NUMERIC NOT NULL,
  payment_status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexar por session_id para consultas más rápidas
CREATE INDEX idx_cart_session ON public.cart_items_nc(session_id);
-- =====================================================================================
-- 3. POLÍTICAS DE SEGURIDAD RLS
-- =====================================================================================
ALTER TABLE public.categories_nc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans_nc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items_nc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkouts_nc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkout_items_nc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts_nc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_plan_payments_nc ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública categorías NC" ON public.categories_nc FOR SELECT USING (true);
CREATE POLICY "Lectura pública planes NC" ON public.plans_nc FOR SELECT USING (true);
CREATE POLICY "Sesión privada carrito" ON public.cart_items_nc FOR ALL USING (session_id = current_setting('app.current_session_id', true))WITH CHECK (session_id = current_setting('app.current_session_id', true));
CREATE POLICY "Insertar items checkout NC" ON public.checkout_items_nc FOR INSERT WITH CHECK (true);
CREATE POLICY "Insertar checkouts anónimos NC" ON public.checkouts_nc FOR INSERT WITH CHECK (true);
CREATE POLICY "Insertar items checkout NC" ON public.checkout_items_nc FOR INSERT WITH CHECK (true);
CREATE POLICY "Insertar contactos anónimos NC" ON public.contacts_nc FOR INSERT WITH CHECK (true);
CREATE POLICY "Insertar pagos personalizados NC" ON public.custom_plan_payments_nc FOR INSERT WITH CHECK (true);

-- =====================================================================================
-- 4. INSERTAR DATOS (CATEGORÍAS Y PLANES)
-- =====================================================================================
INSERT INTO public.categories_nc (name, slug) VALUES 
('Planes de marketing', 'planes-de-marketing');

INSERT INTO public.plans_nc (title, slug, category_id, price, description, features) VALUES

('Plan Ultra Premium', 'plan-ultra-premium', 1, 25000.00, 'Plan estratégico y orientado a resultados para maximizar tu inversión en marketing.', 
'["Investigación de mercado Ultra Premium: Análisis detallado de competencia, segmentos, comportamientos, datos y estudios de caso.", "Creación de una estrategia de marketing de élite: Estrategia avanzada y personalizada de marketing digital y tradicional.", "Creación de materiales de marketing avanzados: Desarrollo de identidad de marca (logotipo y materiales gráficos).", "Creación de materiales de marketing más avanzados: Producción de 3 videos de alta gama de hasta 25 segundos.", "Gestión de anuncios publicitarios: Optimización avanzada de anuncios en varias plataformas con segmentación precisa.", "Consultoría estratégica de alto nivel: Estrategias de crecimiento, análisis de datos continuos y sesiones de optimización personalizadas.", "Planificación y ejecución de eventos grandes: Apoyo integral en la organización de grandes eventos o lanzamientos de productos."]'::jsonb),

('Plan Elite', 'plan-elite', 1, 20900.00, 'Solución completa con herramientas avanzadas y análisis estratégico.', 
'["Investigación de mercado premium: Análisis profundo de mercado, tendencias y comportamiento del consumidor.", "Creación de una estrategia de marketing premium: Estrategia multicanal integrada y seguimiento exhaustivo.", "Creación de materiales de marketing avanzados: 2 videos publicitarios de alta calidad de hasta 20 segundos cada uno.", "Gestión de anuncios publicitarios: Optimización y monitoreo en 2 plataformas (Google Ads, Facebook, Instagram o LinkedIn).", "Consultoría continua: Reunión de seguimiento y análisis de KPIs."]'::jsonb),

('Plan Intensivo Pro', 'plan-intensivo-pro', 1, 16300.00, 'Consolida tu marca con campañas efectivas y personalizadas.', 
'["Investigación de mercado intensiva: Análisis en profundidad con estudio de competencia detallado y encuestas directas hasta 25 personas.", "Creación de una estrategia de marketing avanzada: Estrategia integrada con canales de marketing.", "Creación de materiales de marketing avanzados: Diseño de 1 folleto, 1 logo y 2 tarjetas de presentación.", "Creación de materiales de marketing más avanzados: Video de hasta 20 segundos.", "Gestión de anuncios publicitarios: Gestión y optimización de dos anuncios en Google Ads con informes detallados.", "Consultoría media: Asesoramiento personalizado."]'::jsonb),

('Plan Premium', 'plan-premium', 1, 12000.00, 'Estrategia de marketing optimizada para el éxito.', 
'["Investigación de mercado avanzada: Informe detallado con segmentación, análisis de tendencias y percepción de marca.", "Creación de una estrategia de marketing avanzada: Estrategia optimizada para escalabilidad y expansión.", "Creación de materiales de marketing más avanzados: Video corto promocional.", "Gestión de anuncios publicitarios: Administración de campañas de anuncios en Facebook o Google (presupuesto adicional)."]'::jsonb),

('Plan Avanzado', 'plan-avanzado', 1, 8700.00, 'Impulsa tu negocio para maximizar tu alcance y fortalecer tu presencia en el mercado.', 
'["Investigación de mercado intermedia: Investigación y análisis de datos cualitativos y cuantitativos.", "Creación de una estrategia de marketing intermedia: Estrategia con objetivos medibles y ajustados a largo plazo.", "Creación de materiales de marketing básicos: 2 folletos y 2 tarjetas de presentación."]'::jsonb),

('Plan Intensivo', 'plan-intensivo', 1, 7140.00, 'Expande tus horizontes con esta estrategia de marketing.', 
'["Investigación de mercado intermedia: Análisis de tendencias del mercado y segmentación avanzada.", "Creación de una estrategia de marketing simple: Estrategia optimizada.", "Creación de materiales de marketing básicos: 1 folleto y 1 tarjeta de presentación."]'::jsonb),

('Plan Intermedio', 'plan-intermedio', 1, 5500.00, 'Da el siguiente paso en tu estrategia de marketing.', 
'["Investigación de mercado básica: Análisis más detallado con una encuesta aplicada a 10 personas.", "Creación de una estrategia de marketing simple: Estrategia básica más enfocada en las fortalezas del cliente.", "Creación de materiales de marketing básicos: 1 folleto con diseño personalizado."]'::jsonb),

('Plan Básico', 'plan-basico', 1, 3500.00, 'Tu primer gran paso a una estrategia de marketing exitosa.', 
'["Investigación de mercado básica: Análisis sencillo de mercado, competencia y perfil del cliente ideal.", "Creación de una estrategia de marketing simple: Estrategia básica adaptada a las necesidades generales del cliente."]'::jsonb);

-- =====================================================================================
-- 5. INSERTAR EL "PLAN PERSONALIZADO" BASE
-- =====================================================================================
-- Insertamos un plan genérico con precio 0. 
-- El precio real se tomará de la columna custom_price de cart_items_nc.
INSERT INTO public.plans_nc (title, slug, category_id, price, description, features) 
VALUES (
  'Plan Personalizado', 
  'plan-personalizado', 
  1, 
  0.00, 
  'Estrategia de marketing altamente personalizada y adaptada a tus necesidades únicas.', 
  '[]'::jsonb
);
-- =====================================================================================
-- 6. FUNCIÓN NECESARIA PARA NEXT.JS MIDDLEWARE
-- =====================================================================================
CREATE OR REPLACE FUNCTION set_session_id(s_id text) RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_session_id', s_id, false);
END;
$$ LANGUAGE plpgsql;