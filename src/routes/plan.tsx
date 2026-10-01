import { createFileRoute } from "@tanstack/react-router";
import { Etiqueta, Pantalla, Sub, Tarjeta, Titulo } from "@/components/noche/ui";
import { estadoNoche, hoyKey } from "@/lib/noche/plan";
import { useNoche } from "@/lib/noche/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Tu plan de 14 noches — Noche Quieta" },
      {
        name: "description",
        content: "El mapa completo: una regla, una hora de bajar luces y una cama objetivo por noche.",
      },
      { property: "og:title", content: "Tu plan de 14 noches — Noche Quieta" },
      {
        property: "og:description",
        content: "Catorce noches, una palanca cada vez. Sin rediseñar el plan todos los días.",
      },
    ],
  }),
  component: PlanPage,
});

function PlanPage() {
  const { plan, numero, noches, perfil, listo } = useNoche();

  if (!listo || !perfil) {
    return (
      <Pantalla>
        <Titulo>Plan</Titulo>
        <Sub>Termina el onboarding para ver tus 14 noches.</Sub>
      </Pantalla>
    );
  }

  const registro = Object.values(noches);

  return (
    <Pantalla>
      <Etiqueta>Plan de 14 noches</Etiqueta>
      <Titulo>El mapa, sin trampas</Titulo>
      <Sub>Puedes leerlo entero, pero solo se vive una noche a la vez.</Sub>

      <div className="mt-6 space-y-3">
        {plan.map((item) => {
          const n = registro.find((x) => x.numeroPlan === item.numero);
          const estado = item.numero > numero ? "futura" : estadoNoche(n);
          const actual = item.numero === numero;
          return (
            <Tarjeta
              key={item.numero}
              className={cn(
                actual && "border-primary/60",
                item.numero > numero && "opacity-50",
              )}
            >
              <div className="flex items-center justify-between">
                <Etiqueta>Noche {item.numero}</Etiqueta>
                <span
                  className={cn(
                    "text-xs font-medium",
                    estado === "hecha" && "text-success",
                    estado === "parcial" && "text-warning",
                    estado === "fallida" && "text-destructive",
                    estado === "futura" && "text-muted-foreground",
                  )}
                >
                  {{
                    hecha: "Hecha",
                    parcial: "Parcial",
                    fallida: "Sin registro",
                    futura: "Futura",
                  }[estado]}
                </span>
              </div>
              <p className="mt-2 text-base font-medium leading-snug">{item.regla}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Luces {item.bajarLuces} · Cama {item.camaObjetivo} · Despertar {item.despertar}
              </p>
            </Tarjeta>
          );
        })}
      </div>

      {numero > 7 ? (
        <Tarjeta className="mt-6 border-primary/40">
          <Etiqueta>La semana 2 es donde se nota</Etiqueta>
          <p className="mt-2 leading-relaxed">
            Ahí ajustamos el plan con tus noches reales. Hoy es {hoyKey()}.
          </p>
        </Tarjeta>
      ) : null}
    </Pantalla>
  );
}
