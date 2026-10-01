import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Etiqueta, Pantalla, Sub, Tarjeta, Titulo } from "@/components/noche/ui";
import { ETIQUETA_SABOTAJE, hoyKey } from "@/lib/noche/plan";
import { useNoche } from "@/lib/noche/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/diario")({
  head: () => ({
    meta: [
      { title: "Tu diario de noches — Noche Quieta" },
      {
        name: "description",
        content: "Siete días de noches registradas en lenguaje humano, sin fingir datos de wearable.",
      },
      { property: "og:title", content: "Tu diario de noches — Noche Quieta" },
      {
        property: "og:description",
        content: "Mira qué noches te costaron más y qué las saboteó.",
      },
    ],
  }),
  component: Diario,
});

const DIAS = ["L", "M", "X", "J", "V", "S", "D"];

function Diario() {
  const { noches } = useNoche();
  const [sel, setSel] = useState<string>(hoyKey());

  const semana = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = hoyKey(d);
    return { key, etiqueta: DIAS[(d.getDay() + 6) % 7] ?? "", noche: noches[key] };
  });

  const detalle = noches[sel];
  const nivel = { baja: 1, media: 2, alta: 3 } as const;

  return (
    <Pantalla>
      <Etiqueta>Diario</Etiqueta>
      <Titulo>Tus últimas 7 noches</Titulo>
      <Sub>Cómo de recuperado te sentiste, en tus palabras.</Sub>

      <div className="mt-6 flex items-end justify-between gap-2">
        {semana.map((d) => {
          const alto = d.noche?.recuperacion ? nivel[d.noche.recuperacion] : 0;
          return (
            <button
              key={d.key}
              onClick={() => setSel(d.key)}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div className="flex h-24 w-full items-end">
                <div
                  className={cn(
                    "w-full rounded-t-lg transition-all",
                    alto === 0 && "h-2 bg-secondary",
                    alto === 1 && "h-8 bg-destructive/70",
                    alto === 2 && "h-14 bg-warning/70",
                    alto === 3 && "h-24 bg-primary",
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-xs",
                  sel === d.key ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                {d.etiqueta}
              </span>
            </button>
          );
        })}
      </div>

      <Tarjeta className="mt-6">
        <Etiqueta>{sel}</Etiqueta>
        {detalle?.manana ? (
          <div className="mt-3 space-y-2 text-sm">
            <Fila t="Horas percibidas" v={`${detalle.manana.horas} h`} />
            <Fila
              t="Costó dormirse"
              v={{ no: "No", poco: "Un poco", mucho: "Mucho" }[detalle.manana.costoDormirse]}
            />
            <Fila
              t="Despertares"
              v={{ no: "Ninguno", una: "1 vez", varias: "Varias" }[detalle.manana.despertares]}
            />
            <Fila
              t="Sabotaje"
              v={
                detalle.manana.sabotaje
                  ? (ETIQUETA_SABOTAJE[detalle.manana.sabotaje] ?? "—")
                  : "—"
              }
            />
            {detalle.insight ? (
              <p className="mt-4 leading-relaxed text-foreground">{detalle.insight}</p>
            ) : null}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Sin registro de esa noche. No pasa nada: se recupera mañana.
          </p>
        )}
      </Tarjeta>

      <p className="mt-4 text-xs text-muted-foreground">
        Estos datos son tu percepción, no una medición clínica.
      </p>
    </Pantalla>
  );
}

function Fila({ t, v }: { t: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{t}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
