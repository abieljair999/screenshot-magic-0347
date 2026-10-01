import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Boton, Etiqueta, Opcion, Pantalla, Sub, Tarjeta, Titulo } from "@/components/noche/ui";
import { MODOS } from "@/lib/noche/content";
import { toHHMM, toMin } from "@/lib/noche/plan";
import { useNoche } from "@/lib/noche/store";

export const Route = createFileRoute("/ajustes")({
  head: () => ({
    meta: [
      { title: "Ajustes — Noche Quieta" },
      {
        name: "description",
        content: "Cambia tu modo, tu hora ancla y tus recordatorios. Exporta o borra tus datos.",
      },
      { property: "og:title", content: "Ajustes — Noche Quieta" },
      {
        property: "og:description",
        content: "Modo, hora ancla, recordatorios y tus datos, bajo tu control.",
      },
    ],
  }),
  component: Ajustes,
});

function Ajustes() {
  const { perfil, ajustes, actualizar, reiniciar, noches, listo } = useNoche();
  const navigate = useNavigate();

  if (!listo || !perfil) {
    return (
      <Pantalla>
        <Titulo>Ajustes</Titulo>
        <Sub>Termina el onboarding primero.</Sub>
      </Pantalla>
    );
  }

  const moverAncla = (delta: number) =>
    actualizar((e) => ({
      ...e,
      perfil: e.perfil
        ? { ...e.perfil, horaDespertar: toHHMM(toMin(e.perfil.horaDespertar) + delta) }
        : e.perfil,
    }));

  const exportar = () => {
    const blob = new Blob([JSON.stringify({ perfil, noches }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "noche-quieta.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Pantalla>
      <Etiqueta>Ajustes</Etiqueta>
      <Titulo>Tu configuración</Titulo>

      <div className="mt-6">
        <p className="mb-3 font-medium">Modo</p>
        <div className="space-y-2">
          {MODOS.map((m) => (
            <Opcion
              key={m.id}
              label={m.titulo}
              activa={perfil.modo === m.id}
              onClick={() =>
                actualizar((e) => ({
                  ...e,
                  perfil: e.perfil ? { ...e.perfil, modo: m.id } : e.perfil,
                }))
              }
            />
          ))}
        </div>
      </div>

      <Tarjeta className="mt-6">
        <Etiqueta>Hora ancla de despertar</Etiqueta>
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => moverAncla(-15)}
            className="h-11 w-11 rounded-full bg-secondary text-xl"
            aria-label="Quitar 15 minutos"
          >
            −
          </button>
          <span className="text-3xl font-semibold tabular-nums">{perfil.horaDespertar}</span>
          <button
            onClick={() => moverAncla(15)}
            className="h-11 w-11 rounded-full bg-secondary text-xl"
            aria-label="Sumar 15 minutos"
          >
            +
          </button>
        </div>
      </Tarjeta>

      <Tarjeta className="mt-4 space-y-4">
        <Interruptor
          titulo="Recordatorios"
          sub="Máximo 3 al día, anclados a tu bloque de sueño."
          valor={ajustes.recordatorios}
          onToggle={() =>
            actualizar((e) => ({
              ...e,
              ajustes: { ...e.ajustes, recordatorios: !e.ajustes.recordatorios },
            }))
          }
        />
        <Interruptor
          titulo="Tonos suaves"
          sub="Háptico suave y silencio por defecto."
          valor={ajustes.sonidosSuaves}
          onToggle={() =>
            actualizar((e) => ({
              ...e,
              ajustes: { ...e.ajustes, sonidosSuaves: !e.ajustes.sonidosSuaves },
            }))
          }
        />
      </Tarjeta>

      <div className="mt-6 space-y-3">
        <Link to="/suscripcion">
          <Boton variante="secundario">Suscripción</Boton>
        </Link>
        <Boton variante="secundario" onClick={exportar}>
          Exportar mis datos
        </Boton>
        <Boton
          variante="fantasma"
          onClick={() => {
            reiniciar();
            navigate({ to: "/onboarding" });
          }}
        >
          Borrar datos y empezar de nuevo
        </Boton>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        Noche Quieta es una herramienta de hábitos. No es un dispositivo médico ni un
        diagnóstico. Si sospechas apnea, insomnio crónico o depresión, habla con un
        profesional.
      </p>
    </Pantalla>
  );
}

function Interruptor({
  titulo,
  sub,
  valor,
  onToggle,
}: {
  titulo: string;
  sub: string;
  valor: boolean;
  onToggle: () => void;
}) {
  return (
    <button onClick={onToggle} className="flex w-full items-start justify-between gap-4 text-left">
      <span>
        <span className="block font-medium">{titulo}</span>
        <span className="mt-1 block text-sm text-muted-foreground">{sub}</span>
      </span>
      <span
        className={`mt-1 h-7 w-12 shrink-0 rounded-full p-1 transition-colors ${
          valor ? "bg-primary" : "bg-secondary"
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-background transition-transform ${
            valor ? "translate-x-5" : ""
          }`}
        />
      </span>
    </button>
  );
}
