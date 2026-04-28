"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { processCustomPlan, CustomPlanFormData } from "@/actions/custom-plan";
import { Loader2, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function CustomPricingPage() {
  const { addToCart } = useCart();
  const router = useRouter();
  const locale = useLocale();
  const isEs = locale === 'es';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [formData, setFormData] = useState<CustomPlanFormData>({
    nombre: "",
    apellidos: "",
    correo_electronico: "",
    id_cotizacion: "", 
    monto: 0, 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.monto <= 0) {
      setErrorMsg(isEs ? "El monto calculado debe ser mayor a cero." : "The calculated amount must be greater than zero.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const res = await processCustomPlan(formData);

    if (res.success && res.planId && res.customPrice && res.quoteId) {
      
      sessionStorage.setItem("nc_temp_contact", JSON.stringify({
        firstName: formData.nombre,
        lastName: formData.apellidos,
        email: formData.correo_electronico
      }));

      const added = await addToCart(
        res.planId,          
        1,                   
        res.customPrice,     
        res.quoteId          
      );

      if (added) {
        router.push(`/${locale}/checkout`);
      } else {
        setErrorMsg(isEs ? "Error al sincronizar con el carrito de compras." : "Error syncing with the shopping cart.");
        setIsSubmitting(false);
      }

    } else {
      setErrorMsg(res.message || (isEs ? "Error al procesar el plan personalizado." : "Error processing the custom plan."));
      setIsSubmitting(false);
    }
  };

  const inputClass = "h-14 bg-input border border-border focus-visible:ring-1 focus-visible:ring-ring rounded-lg px-5 text-foreground placeholder:text-muted-foreground transition-all w-full";

  return (
    <main className="min-h-screen bg-background bg-grain pt-32 pb-24 text-foreground relative">
      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            {isEs ? 'Crea tu Estrategia' : 'Create Your Strategy'}
          </h1>
          <p className="text-muted-foreground">
            {isEs 
              ? 'Ingresa tu folio de cotización y completa tus datos para proceder al pago.' 
              : 'Enter your quote reference and complete your details to proceed to payment.'}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg mb-8">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-card p-8 md:p-12 border border-border rounded-2xl shadow-lg space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <Input 
              placeholder={isEs ? "Nombre *" : "First Name *"} 
              required 
              value={formData.nombre} 
              onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
              className={inputClass} 
            />
            <Input 
              placeholder={isEs ? "Apellidos *" : "Last Name *"} 
              required 
              value={formData.apellidos} 
              onChange={(e) => setFormData({...formData, apellidos: e.target.value})} 
              className={inputClass} 
            />
          </div>
          
          <Input 
            placeholder={isEs ? "Correo Electrónico *" : "Email Address *"} 
            type="email" 
            required 
            value={formData.correo_electronico} 
            onChange={(e) => setFormData({...formData, correo_electronico: e.target.value})} 
            className={inputClass} 
          />

          <Input 
            placeholder={isEs ? "Folio de Cotización (Ej. COT-1234) *" : "Quote Reference (e.g. COT-1234) *"} 
            required 
            value={formData.id_cotizacion} 
            onChange={(e) => setFormData({...formData, id_cotizacion: e.target.value.toUpperCase()})} 
            className={inputClass + " font-mono tracking-wider"} 
          />

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              {isEs ? 'Presupuesto Acordado (MXN) *' : 'Agreed Budget (MXN) *'}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
              <Input 
                type="number" 
                min="1000"
                step="0.01"
                required 
                value={formData.monto || ""} 
                onChange={(e) => setFormData({...formData, monto: Number(e.target.value)})} 
                className={`${inputClass} pl-8`} 
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-gradient-to-r from-[var(--copper)] to-[var(--amber)] hover:opacity-90 text-[var(--navy)] font-bold h-14 rounded-lg text-lg mt-6"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin w-5 h-5 mx-auto" />
            ) : (
              <span className="flex items-center gap-2">
                <Calculator className="w-5 h-5"/> {isEs ? 'Añadir al Carrito' : 'Add to Cart'}
              </span>
            )}
          </Button>
        </form>

      </div>
    </main>
  );
}