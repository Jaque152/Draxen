"use client";

import { useLocale } from 'next-intl';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { CheckCircle, Loader2, CreditCard, ShieldCheck } from "lucide-react";
import { processCheckout } from "@/actions/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CheckoutContent() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const locale = useLocale();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [contactInfo, setContactInfo] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [billingInfo, setBillingInfo] = useState({ pais: "México", direccion: "", localidad: "", estado: "", codigo_postal: "" });
  const [cardInfo, setCardInfo] = useState({ number: "", name: "", expiry: "", cvv: "" });

  useEffect(() => {
    const savedData = sessionStorage.getItem("nc_temp_contact");
    if (savedData) {
      const { firstName, lastName, email } = JSON.parse(savedData);
      setContactInfo(prev => ({ ...prev, firstName, lastName, email }));
      sessionStorage.removeItem("nc_temp_contact"); 
    }
  }, []);

  const formatPrice = (price: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg("");
    const payload = {
      locale,
      contactInfo,
      billingInfo,
      cardInfo,
      items, 
      total  
  };
  const res = await processCheckout(payload);

  if (res.success) {
    setShowSuccess(true);
    clearCart();
  } else {
    setErrorMsg(res.message);
    setIsProcessing(false);
  }
};
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) val = `${val.slice(0, 2)}/${val.slice(2)}`;
    setCardInfo({ ...cardInfo, expiry: val });
  };

  const inputClass = "h-14 bg-input border border-border focus-visible:ring-1 focus-visible:ring-ring rounded-lg px-5 text-foreground placeholder:text-muted-foreground transition-all";

  if (showSuccess) {
    return (
      <main className="min-h-screen bg-background bg-grain pt-40 pb-24 flex items-center justify-center px-4 relative">
        <div className="max-w-lg w-full text-center bg-card rounded-2xl p-12 border border-border shadow-2xl relative z-10">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4 text-foreground">¡Pago Exitoso!</h1>
          <p className="text-muted-foreground mb-8">Tu estrategia está confirmada. Revisa tu correo electrónico.</p>
          <Button asChild className="w-full bg-primary hover:opacity-90 text-primary-foreground font-bold h-14 rounded-lg transition-all">
            <Link href={`/${locale}/`}>Volver al Inicio</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background bg-grain pt-32 pb-24 text-foreground relative">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-gradient">Finalizar compra</h1>

        {errorMsg && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg mb-8">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-8">
            
            {/* Facturación y Contacto */}
            <div className="bg-card p-8 border border-border rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold mb-6 text-foreground">Detalles de facturación</h2>
              <div className="grid sm:grid-cols-2 gap-5 mb-6">
                <Input placeholder="Nombre *" required value={contactInfo.firstName} onChange={(e)=>setContactInfo({...contactInfo, firstName:e.target.value})} className={inputClass} />
                <Input placeholder="Apellidos *" required value={contactInfo.lastName} onChange={(e)=>setContactInfo({...contactInfo, lastName:e.target.value})} className={inputClass} />
                <Input placeholder="Correo electrónico *" type="email" required value={contactInfo.email} onChange={(e)=>setContactInfo({...contactInfo, email:e.target.value})} className={inputClass} />
                <Input placeholder="Teléfono *" type="tel" required value={contactInfo.phone} onChange={(e)=>setContactInfo({...contactInfo, phone:e.target.value})} className={inputClass} />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Input placeholder="País / Región *" required value={billingInfo.pais} disabled className={inputClass} />
                <Input placeholder="Dirección de la calle *" required value={billingInfo.direccion} onChange={(e)=>setBillingInfo({...billingInfo, direccion:e.target.value})} className={inputClass} />
                <Input placeholder="Localidad / Ciudad *" required value={billingInfo.localidad} onChange={(e)=>setBillingInfo({...billingInfo, localidad:e.target.value})} className={inputClass} />
                <Input placeholder="Región / Estado *" required value={billingInfo.estado} onChange={(e)=>setBillingInfo({...billingInfo, estado:e.target.value})} className={inputClass} />
                <Input placeholder="Código postal *" required value={billingInfo.codigo_postal} onChange={(e)=>setBillingInfo({...billingInfo, codigo_postal:e.target.value})} className={inputClass} />
              </div>
            </div>

            {/* Tarjeta Crédito/Débito */}
            <div className="bg-card p-8 border border-border rounded-2xl shadow-lg relative overflow-hidden">
              
              {/* Decoración de fondo */}
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                <CreditCard className="w-40 h-40" />
              </div>

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <h2 className="text-xl font-bold flex items-center gap-3 text-foreground">
                    <CreditCard className="text-primary w-5 h-5" /> 
                    {locale === 'es' ? 'Método de Pago' : 'Payment Method'}
                  </h2>
                  
                  {/* Logo de Etomin dinámico */}
                  <div className="flex flex-col items-end">
                    <div className="h-6 opacity-80">
                      <img 
                        src="/etomin_logo.svg" 
                        alt="Powered by Etomin" 
                        className="h-full w-auto object-contain brightness-0 invert" // Filtro para que se vea blanco en fondo oscuro
                      />
                    </div>
                  </div>
                </div>
                  
                <div className="grid gap-5 max-w-md">
                  <Input 
                    placeholder="Número de tarjeta *" 
                    required 
                    maxLength={19} 
                    value={cardInfo.number} 
                    onChange={(e)=>setCardInfo({...cardInfo, number: e.target.value.replace(/\D/g, '')})} 
                    className={inputClass + " font-mono text-lg tracking-widest"} 
                  />
                  
                  <Input 
                    placeholder="Nombre en la tarjeta *" 
                    required 
                    value={cardInfo.name} 
                    onChange={(e)=>setCardInfo({...cardInfo, name: e.target.value.toUpperCase()})} 
                    className={inputClass} 
                  />

                  <div className="grid grid-cols-2 gap-5">
                    <Input 
                      placeholder="MM/AA *" 
                      required 
                      maxLength={5} 
                      value={cardInfo.expiry} 
                      onChange={handleExpiryChange} 
                      className={inputClass + " text-center"} 
                    />
                    <Input 
                      placeholder="CVV *" 
                      type="password" 
                      required 
                      maxLength={4} 
                      value={cardInfo.cvv} 
                      onChange={(e)=>setCardInfo({...cardInfo, cvv: e.target.value.replace(/\D/g, '')})} 
                      className={inputClass + " text-center tracking-widest"} 
                    />
                  </div>

                  {/* Logos de Pago Seguro y Marcas de Tarjetas */}
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="h-10 flex items-center">
                      <img 
                        src="/etomin_secbadge.svg" 
                        alt="Secure Payment Gateways" 
                        className="h-full w-auto object-contain opacity-90 grayscale hover:grayscale-0 transition-all duration-500" 
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tighter mt-3 flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3 text-secondary" />
                      {locale === 'es' 
                        ? 'Tus datos están protegidos y encriptados de extremo a extremo.' 
                        : 'Your data is protected and encrypted end-to-end.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
            
          {/* Resumen */}
          <div className="lg:col-span-4 bg-card p-8 border border-border rounded-2xl shadow-lg sticky top-32">
            <h2 className="text-xl font-bold mb-6 border-b border-border pb-4 text-foreground">Tu pedido</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm items-center font-sans">
                  <span className="text-muted-foreground">
                    {item.plans_nc?.title || 'Plan Personalizado'} <span className="text-foreground font-medium">x{item.quantity}</span>
                  </span>
                  <span className="font-bold text-foreground">
                    {formatPrice((item.custom_price || item.plans_nc?.price || 0) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-6 mb-8 font-sans">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formatPrice(total / 1.16)}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted-foreground">Impuesto (16%)</span>
                <span className="text-foreground">{formatPrice(total - (total / 1.16))}</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold text-gradient mt-6">
                <span>Total estimado</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            
            <Button type="submit" disabled={isProcessing} className="w-full bg-primary hover:opacity-90 text-primary-foreground font-bold h-14 rounded-lg text-lg transition-all">
              {isProcessing ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : `REALIZAR EL PAGO`}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}