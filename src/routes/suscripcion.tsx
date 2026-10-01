import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Boton, Etiqueta, Opcion, Pantalla, Sub, Tarjeta, Titulo } from "@/components/noche/ui";

export const Route = createFileRoute("/suscripcion")({
  head: () => ({
    meta: [
      { title: "La semana 2 es donde se nota — Noche Quieta" },
      {
        name: "description",
        content:
          "Continúa tus 14 noches: plan completo, recalibración cada 3 días y todos los protocolos.",
      },
      { property: "og:title", content: "La semana 2 es donde se nota — Noche Quieta" },
      {
        property: "og:description",
        content: "Ahí ajustamos el plan con tus noches reales. Semanal, mensual o anual.",
      },
    ],
  }),
  component: Suscripcion,
});

const PLANES = [
  { id: "semanal", label: "Semanal · USD 3.99", sub: "Para probar la semana 2." },
  { id: "mensual", label: "Mensual · USD 9.99", sub: "El plan completo y los ciclos." },
  { id: "anual", label: "Anual · USD 49.99", sub: "Menos de 1 USD por semana." },
];

function Suscripcion() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState("mensual");

  return (
    <Pantalla conTabs={false}>
      <Etiqueta>Noche 7</Etiqueta>
      <Titulo>La semana 2 es donde se nota.</Titulo>
      <Sub>Ahí ajustamos el plan con tus noches reales.</Sub>

      <Tarjeta className="mt-6">
        <ul className="space-y-2 text-sm leading-relaxed">
          <li>Plan completo y recalibración cada 3 días</li>
          <li>Todos los protocolos de emergencia</li>
          <li>Diario e insights de patrones</li>
          <li>Recordatorios inteligentes y ciclos después del día 14</li>
        </ul>
      </Tarjeta>

      <div className="mt-6 space-y-3">
        {PLANES.map((p) => (
          <Opcion
            key={p.id}
            label={p.label}
            sub={p.sub}
            activa={plan === p.id}
            onClick={() => setPlan(p.id)}
          />
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <Boton onClick={() => navigate({ to: "/" })}>Continuar 7 noches más</Boton>
        <Boton variante="fantasma" onClick={() => navigate({ to: "/" })}>
          Seguir con lo básico
        </Boton>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Los pagos todavía no están conectados: por ahora los botones te devuelven a tu plan.
      </p>
    </Pantalla>
  );
}
