export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Plan {
  id: number;
  title: string;
  slug: string;
  category_id: number;
  price: number;
  description: string | null;
  features: string[] | Json;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  categories_nc?: Category; 
}

export interface CartItem {
  id: number;
  session_id: string;
  plan_id: number;
  quantity: number;
  custom_price: number | null; 
  quote_id: string | null;     
  created_at: string;
  plans_nc?: Plan; 
}

export interface Checkout {
  id: string;
  session_id: string;
  nombre: string;
  apellidos: string;
  pais_region: string;
  direccion_calle: string;
  localidad_ciudad: string;
  region_estado: string;
  codigo_postal: string;
  telefono: string | null;
  correo_electronico: string;
  indicaciones_pedido: string | null;
  subtotal: number;
  impuesto: number;
  total_estimado: number;
  payment_status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
}

export interface CheckoutItem {
  id: number;
  checkout_id: string;
  plan_id: number;
  quantity: number;
  unit_price: number;
  custom_price: number | null;
  quote_id: string | null;
}

export interface Contact {
  id: number;
  nombre_completo: string;
  empresa_negocio: string;
  telefono: string;
  correo_electronico: string;
  asunto: string;
  mensaje: string;
  created_at: string;
}

export interface CustomPlanPayment {
  id: string;
  nombre: string;
  apellidos: string;
  correo_electronico: string;
  id_cotizacion: string;
  monto_a_pagar: number;
  payment_status: string;
  created_at: string;
}