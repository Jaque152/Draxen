'use server';
import { plans } from '@/data/plans'; // Importamos el diccionario estático

export interface CustomPlanFormData {
  nombre: string;
  apellidos: string;
  correo_electronico: string; 
  id_cotizacion: string; 
  monto: number;
}

export async function processCustomPlan(formData: CustomPlanFormData) {
  try {
    // 1. Buscamos el plan base en nuestro diccionario local
    const customPlanConfig = plans.find(p => p.id === 'custom-plan');

    if (!customPlanConfig) {
      throw new Error("No se encontró la configuración del Plan Personalizado en el sistema.");
    }

    // 2. Retornamos la data para que el frontend lo agregue al LocalStorage
    return { 
      success: true, 
      planId: customPlanConfig.id, 
      quoteId: formData.id_cotizacion, 
      customPrice: formData.monto 
    };

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error inesperado del servidor.";
    return { success: false, message: errorMessage };
  }
}