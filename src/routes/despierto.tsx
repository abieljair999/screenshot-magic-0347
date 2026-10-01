import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pantalla } from "@/components/noche/ui";
import { PASOS_SIGO_DESPIERTO } from "@/lib/noche/content";

export const Route = createFileRoute("/despierto")({
  head: () => ({
    meta: [
      { title: "No puedo dormir — Protocolo | Noche Quieta" },
      {
        name: "description",
        content: "Seis pasos, uno a uno, para cuando llevas 20 minutos despierto en la cama.",
      },
      { property: "og:title", content: "No puedo dormir — Protocolo | Noche Quieta" },
      {
        property: "og:description",
        content: "Protocolo corto y a oscuras para volver a dormirte sin pelear con la cama.",
      },
    ],
  }),
  component: () => <Protocolo pasos={PASOS_SIGO_DESPIERTO} titulo="Sigo despierto" />,
});

export function Protocolo({ pasos, titulo }: { pasos: string[]; titulo: string }) {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [segundos, setSegundos] = useState<number | null>(null);

  useEffect(() => {
    if (segundos === null) return;
    if (segundos <= 0) return;
    const t = setTimeout(() => setSegundos((s) => (s ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [segundos]);

  const ultimo = i === pasos.length - 1;

  return (
    <Pantalla conTabs={false} oscura>
      <div className="flex min-h-[80vh] flex-col justify-center text-center">
        <p className="text-xs uppercase tracking-[0.2em] opacity-50">
          {titulo} · paso {i + 1} de {pasos.length}
        </p>
        <p className="mt-8 text-2xl font-medium leading-snug opacity-90">{pasos[i]}</p>

        {segundos !== null ? (
          <p className="mt-8 text-5xl font-semibold tabular-nums opacity-80">
            {Math.floor(segundos / 60)}:{String(segundos % 60).padStart(2, "0")}
          </p>
        ) : null}

        <div className="mt-12 space-y-3">
          {i === 3 && segundos === null ? (
            <button
              onClick={() => setSegundos(300)}
              className="w-full rounded-2xl border border-night-foreground/20 px-5 py-4 opacity-80"
            >
              Respirar 5 minutos
            </button>
          ) : null}
          {!ultimo ? (
            <button
              onClick={() => {
                setSegundos(null);
                setI((v) => v + 1);
              }}
              className="w-full rounded-2xl border border-night-foreground/25 px-5 py-4 text-base opacity-85"
            >
              Siguiente paso
            </button>
          ) : (
            <button
              onClick={() => navigate({ to: "/" })}
              className="w-full rounded-2xl border border-night-foreground/25 px-5 py-4 text-base opacity-85"
            >
              Volver a la cama
            </button>
          )}
          <button
            onClick={() => navigate({ to: "/" })}
            className="w-full px-5 py-3 text-sm opacity-40"
          >
            Salir
          </button>
        </div>
      </div>
    </Pantalla>
  );
}
