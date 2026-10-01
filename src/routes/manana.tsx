import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Boton, Etiqueta, Opcion, Pantalla, Tarjeta, Titulo } from "@/components/noche/ui";
import { generarInsight, hoyKey, recuperacion } from "@/lib/noche/plan";
import { useNoche } from "@/lib/noche/store";
import type { CheckinManana, Sabotaje } from "@/lib/noche/types";

export const Route = createFileRoute("/manana")({
  head: () => ({
    meta: [
      { title: "Check-in de la mañana — Noche Quieta" },
      {
        name: "description",
        content: "Cuenta en 30 segundos cómo fue tu noche y recibe el ajuste de hoy.",
      },
      { property: "og:title", content: "Check-in de la mañana — Noche Quieta" },
      {
        property: "og:description",
        content: "Cinco preguntas cortas y un insight claro sobre tu noche.",
      },
    ],
  }),
  component: CheckinMananaPage,
});

const SABOTAJES: { id: Sabotaje; label: string }[] = [
  { id: "cafeina", label: "Cafeína" },
  { id: "pantalla", label: "Pantalla" },
  { id: "estres", label: "Estrés" },
  { id: "ruido", label: "Ruido" },
  { id: "bebe", label: "Bebé" },
  { id: "entrenamiento", label: "Entrenamiento tarde" },
  { id: "nada", label: "Nada" },
];

function CheckinMananaPage() {
  const navigate = useNavigate();
  const { guardarNoche, numero, itemHoy } = useNoche();
  const [r, setR] = useState<Partial<CheckinManana>>({});
  const [insight, setInsight] = useState<string | null>(null);

  const completo = r.horas && r.costoDormirse && r.despertares && r.energia;

  const guardar = () => {
    if (!completo) return;
    const datos = { ...r, sabotaje: r.sabotaje ?? null } as CheckinManana;
    const texto = generarInsight(datos, numero);
    guardarNoche(hoyKey(), {
      manana: datos,
      insight: texto,
      recuperacion: recuperacion(datos),
    });
    setInsight(texto);
  };

  if (insight) {
    return (
      <Pantalla conTabs={false}>
        <Etiqueta>Listo</Etiqueta>
        <Titulo>Tu insight de hoy</Titulo>
        <Tarjeta className="mt-6 border-primary/40">
          <p className="text-lg leading-relaxed">{insight}</p>
        </Tarjeta>
        {itemHoy ? (
          <Tarjeta className="mt-4">
            <Etiqueta>Ajuste de hoy</Etiqueta>
            <p className="mt-2 leading-relaxed">
              Corte de cafeína a las {itemHoy.corteCafeina}. Bajar luces a las{" "}
              {itemHoy.bajarLuces}.
            </p>
          </Tarjeta>
        ) : null}
        <Boton className="mt-6" onClick={() => navigate({ to: "/" })}>
          Volver a Hoy
        </Boton>
      </Pantalla>
    );
  }

  return (
    <Pantalla conTabs={false}>
      <Etiqueta>Check-in de la mañana</Etiqueta>
      <Titulo>¿Cómo dormiste?</Titulo>

      <Grupo titulo="¿Cuánto sentiste que dormiste?">
        {(["<4", "4-5", "5-6", "6-7", "7+"] as const).map((v) => (
          <Opcion
            key={v}
            label={`${v} horas`}
            activa={r.horas === v}
            onClick={() => setR((p) => ({ ...p, horas: v }))}
          />
        ))}
      </Grupo>

      <Grupo titulo="¿Te costó dormirte?">
        {([
          ["no", "No"],
          ["poco", "Un poco"],
          ["mucho", "Mucho"],
        ] as const).map(([id, label]) => (
          <Opcion
            key={id}
            label={label}
            activa={r.costoDormirse === id}
            onClick={() => setR((p) => ({ ...p, costoDormirse: id }))}
          />
        ))}
      </Grupo>

      <Grupo titulo="¿Te despertaste en la noche?">
        {([
          ["no", "No"],
          ["una", "1 vez"],
          ["varias", "Varias"],
        ] as const).map(([id, label]) => (
          <Opcion
            key={id}
            label={label}
            activa={r.despertares === id}
            onClick={() => setR((p) => ({ ...p, despertares: id }))}
          />
        ))}
      </Grupo>

      <Grupo titulo="Energía al despertar">
        {([
          ["baja", "Baja"],
          ["normal", "Normal"],
          ["bien", "Bien"],
        ] as const).map(([id, label]) => (
          <Opcion
            key={id}
            label={label}
            activa={r.energia === id}
            onClick={() => setR((p) => ({ ...p, energia: id }))}
          />
        ))}
      </Grupo>

      <Grupo titulo="¿Qué lo arruinó? (opcional)">
        <div className="flex flex-wrap gap-2">
          {SABOTAJES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setR((p) => ({ ...p, sabotaje: s.id }))}
              className={`rounded-full border px-4 py-2 text-sm ${
                r.sabotaje === s.id
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Grupo>

      <div className="mt-8 space-y-3">
        <Boton onClick={guardar} disabled={!completo}>
          Guardar
        </Boton>
        <Boton variante="fantasma" onClick={() => navigate({ to: "/" })}>
          Ahora no
        </Boton>
      </div>
    </Pantalla>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <p className="mb-3 text-base font-medium">{titulo}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
