"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { processCustomPlan } from "@/actions/custom-plan";
import { Loader2 } from "lucide-react";

export default function CustomPlanPage() {
  const router = useRouter();
  const locale = useLocale();
  const { refreshCart } = useCart();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Estado estricto para los 5 campos de la BD
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    correo_electronico: "",
    id_cotizacion: "",
    monto_a_pagar: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg("");

    const montoNumber = parseFloat(formData.monto_a_pagar);
    if (isNaN(montoNumber) || montoNumber <= 0) {
      setErrorMsg("Por favor ingresa un monto válido.");
      setIsProcessing(false);
      return;
    }

    // 1. Procesamos la Server Action
    const res = await processCustomPlan({
      ...formData,
      monto_a_pagar: montoNumber
    });

    if (res.success) {
      // 2. Guardamos en SessionStorage para pre-llenar el Checkout
      sessionStorage.setItem("nc_temp_contact", JSON.stringify({
        firstName: formData.nombre,
        lastName: formData.apellidos,
        email: formData.correo_electronico
      }));
      
      // 3. Actualizamos carrito y redirigimos
      await refreshCart();
      router.push(`/${locale}/checkout`);
    } else {
      setErrorMsg(res.error || "Ocurrió un error.");
      setIsProcessing(false);
    }
  };

  const inputClass = "h-14 bg-input border border-border focus-visible:ring-1 focus-visible:ring-ring rounded-lg px-5 text-foreground placeholder:text-muted-foreground transition-all";

  return (
    <main className="min-h-screen bg-background bg-grain pt-32 pb-24 text-foreground relative flex items-center">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Columna Izquierda: Información */}
          <div className="space-y-8">
            <div>
              <span className="text-primary text-sm font-bold uppercase tracking-[0.3em] font-sans mb-4 block">
                Planes
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight text-gradient">
                Plan personalizado
              </h1>
            </div>
            
            <p className="text-lg text-muted-foreground font-sans leading-relaxed">
              Este plan es adecuado para empresas que buscan una estrategia de marketing altamente personalizada y adaptada a sus necesidades únicas.
            </p>
            <p className="text-lg text-muted-foreground font-sans leading-relaxed">
              Se adapta a las necesidades específicas de una empresa y puede incluir cualquier combinación de investigación de mercado, estrategia de marketing y actividades de marketing en línea y fuera de línea.
            </p>
          </div>

          {/* Columna Derecha: Formulario Estricto BD */}
          <div className="bg-card p-8 md:p-10 border border-border rounded-[2rem] shadow-2xl relative">
            {/* Efecto de luz */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              
              {errorMsg && (
                <div className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg text-sm font-sans">
                  {errorMsg}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground font-sans ml-1">Nombre <span className="text-destructive">*</span></label>
                  <Input required value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground font-sans ml-1">Apellidos <span className="text-destructive">*</span></label>
                  <Input required value={formData.apellidos} onChange={(e) => setFormData({...formData, apellidos: e.target.value})} className={inputClass} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground font-sans ml-1">Correo electrónico <span className="text-destructive">*</span></label>
                <Input type="email" required value={formData.correo_electronico} onChange={(e) => setFormData({...formData, correo_electronico: e.target.value})} className={inputClass} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground font-sans ml-1">ID de Cotización <span className="text-destructive">*</span></label>
                <Input required placeholder="Ej: NC-2026-001" value={formData.id_cotizacion} onChange={(e) => setFormData({...formData, id_cotizacion: e.target.value})} className={inputClass} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground font-sans ml-1">Monto a Pagar (MXN) <span className="text-destructive">*</span></label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                  <Input type="number" step="0.01" min="1" required value={formData.monto_a_pagar} onChange={(e) => setFormData({...formData, monto_a_pagar: e.target.value})} className={`${inputClass} pl-9`} />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isProcessing}
                className="w-full bg-primary hover:opacity-90 text-primary-foreground font-bold h-14 rounded-xl text-lg mt-4 transition-all"
              >
                {isProcessing ? <Loader2 className="animate-spin w-6 h-6" /> : "Pagar"}
              </Button>

            </form>
          </div>

        </div>
      </div>
    </main>
  );
}