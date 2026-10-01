import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Boton, Etiqueta, Opcion, Pantalla, Tarjeta, Titulo } from "@/components/noche/ui";
import { hoyKey } from "@/lib/noche/plan";
import { useNoche } from "@/lib/noche/store";

export const Route = createFileRoute("/noche")({
  head: () => ({
    meta: [
      { title: "Modo noche — Noche Quieta" },
      {
        name: "description",
        content: "Check-in de 20 segundos antes de acostarte y pantalla oscura con tu regla.",
      },
      { property: "og:title", content: "Modo noche — Noche Quieta" },
      {
        property: "og:description",
        content: "Marca que te vas a la cama y entra en modo noche con una sola regla.",
      },
    ],
  }),
  component: ModoNoche,
});

function ModoNoche() {
  const navigate = useNavigate();
  const { guardarNoche, itemHoy, numero } = useNoche();
  const [cafeinaTarde, setCafeina] = useState<boolean | null>(null);
  const [diaPesado, setDiaPesado] = useState<"si" | "no" | "no-aplica" | null>(null);
  const [enModoNoche, setModoNoche] = useState(false);

  const iniciar = () => {
    guardarNoche(hoyKey(), {
      noche: {
        horaCama: new Date().toISOString(),
        cafeinaTarde: cafeinaTarde ?? false,
        diaPesado: diaPesado ?? "no-aplica",
      },
    });
    setModoNoche(true);
  };

  if (enModoNoche) {
    return (
      <Pantalla conTabs={false} oscura>
        <div className="flex min-h-[80vh] flex-col justify-center text-center">
          <p className="text-xs uppercase tracking-[0.2em] opacity-60">Noche {numero}</p>
          <p className="mt-6 text-2xl font-medium leading-snug opacity-90">
            {itemHoy?.regla}
          </p>
          <p className="mt-6 text-sm opacity-50">
            Despierta a las {itemHoy?.despertar}. No negocies con la cama.
          </p>
          <div className="mt-12 space-y-3">
            <Link to="/despierto">
              <button className="w-full rounded-2xl border border-night-foreground/20 px-5 py-4 text-base opacity-70">
                Sigo despierto a los 20 min
              </button>
            </Link>
            <button
              onClick={() => navigate({ to: "/" })}
              className="w-full rounded-2xl px-5 py-4 text-base opacity-40"
            >
              Ya me dormí
            </button>
          </div>
        </div>
      </Pantalla>
    );
  }

  return (
    <Pantalla conTabs={false}>
      <Etiqueta>Check-in de noche</Etiqueta>
      <Titulo>Me meto a la cama ahora</Titulo>

      <Tarjeta className="mt-6 border-primary/40">
        <Etiqueta>Regla de esta noche</Etiqueta>
        <p className="mt-2 text-xl font-semibold leading-snug">{itemHoy?.regla}</p>
      </Tarjeta>

      <div className="mt-8">
        <p className="mb-3 font-medium">¿Cafeína tarde hoy?</p>
        <div className="space-y-2">
          <Opcion label="Sí" activa={cafeinaTarde === true} onClick={() => setCafeina(true)} />
          <Opcion label="No" activa={cafeinaTarde === false} onClick={() => setCafeina(false)} />
        </div>
      </div>

      <div className="mt-8">
        <p className="mb-3 font-medium">¿Entrenaste tarde, turno pesado o bebé difícil?</p>
        <div className="space-y-2">
          {([
            ["si", "Sí"],
            ["no", "No"],
            ["no-aplica", "No aplica"],
          ] as const).map(([id, label]) => (
            <Opcion
              key={id}
              label={label}
              activa={diaPesado === id}
              onClick={() => setDiaPesado(id)}
            />
          ))}
        </div>
      </div>

      <Boton className="mt-8" onClick={iniciar}>
        Iniciar modo noche
      </Boton>
    </Pantalla>
  );
}
