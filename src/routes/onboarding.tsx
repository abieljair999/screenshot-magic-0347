import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Boton, Etiqueta, Opcion, Pantalla, Sub, Tarjeta, Titulo } from "@/components/noche/ui";
import { MODOS } from "@/lib/noche/content";
import { generarPlan, hoyKey, toHHMM, toMin } from "@/lib/noche/plan";
import { useNoche } from "@/lib/noche/store";
import type { Modo, Objetivo, Perfil } from "@/lib/noche/types";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Empieza tus 14 noches — Noche Quieta" },
      {
        name: "description",
        content:
          "Responde 8 preguntas cortas y arma un plan de sueño de 14 noches que cabe en tu vida real.",
      },
      { property: "og:title", content: "Empieza tus 14 noches — Noche Quieta" },
      {
        property: "og:description",
        content: "90 segundos de preguntas y tienes tu plan de sueño de 14 noches.",
      },
    ],
  }),
  component: Onboarding,
});

const CAFEINA = [
  { id: "nunca", label: "Nunca tomo" },
  { id: "antes-12", label: "Antes de las 12" },
  { id: "12-16", label: "Entre 12 y 16" },
  { id: "16-20", label: "Entre 16 y 20" },
  { id: "despues-20", label: "Después de las 20" },
] as const;

const PANTALLAS = [
  { id: "nunca", label: "Nunca" },
  { id: "a-veces", label: "A veces" },
  { id: "casi-siempre", label: "Casi siempre" },
  { id: "me-duermo-con-el", label: "Me duermo con el celular" },
] as const;

const DESPERTARES = [
  { id: "casi-no", label: "Casi no me despierto" },
  { id: "una", label: "1 vez" },
  { id: "varias", label: "Varias veces" },
  { id: "me-cuesta-volver", label: "Me cuesta volver a dormir" },
] as const;

const OBJETIVOS: { id: Objetivo; label: string }[] = [
  { id: "dormirme-rapido", label: "Dormirme más rápido" },
  { id: "despertarme-menos", label: "Despertarme menos" },
  { id: "horario-estable", label: "Tener un horario más estable" },
  { id: "recuperarme", label: "Recuperarme aunque duerma poco" },
];

const CONTEXTO: Record<Modo, string[]> = {
  padres: ["Hay bebé menor de 2 años", "Comparto cuarto", "Ninguna de las dos"],
  turnos: ["Turno fijo de noche", "Turno rotativo", "Madrugada"],
  gym: ["Entreno después de las 19:00", "Me cuesta apagar la cabeza", "Las dos cosas"],
};

function Onboarding() {
  const navigate = useNavigate();
  const { guardarPerfil } = useNoche();
  const [paso, setPaso] = useState(0);
  const [modo, setModo] = useState<Modo | null>(null);
  const [despertar, setDespertar] = useState("06:30");
  const [cama, setCama] = useState<string | null>("23:30");
  const [cafeina, setCafeina] = useState<Perfil["cafeina"] | null>(null);
  const [pantallas, setPantallas] = useState<Perfil["pantallas"] | null>(null);
  const [despertares, setDespertares] = useState<Perfil["despertares"] | null>(null);
  const [contexto, setContexto] = useState<string | null>(null);
  const [objetivo, setObjetivo] = useState<Objetivo | null>(null);

  const siguiente = () => setPaso((p) => p + 1);

  const perfil: Perfil | null =
    modo && cafeina && pantallas && despertares && objetivo
      ? {
          modo,
          horaDespertar: despertar,
          horaCama: cama,
          cafeina,
          pantallas,
          despertares,
          contexto: contexto ? [contexto] : [],
          objetivo,
          inicio: hoyKey(),
        }
      : null;

  const terminar = () => {
    if (!perfil) return;
    guardarPerfil(perfil);
    navigate({ to: "/" });
  };

  return (
    <Pantalla conTabs={false}>
      {paso > 0 && paso < 9 ? (
        <Etiqueta>Paso {paso} de 8</Etiqueta>
      ) : null}

      {paso === 0 ? (
        <div className="flex min-h-[70vh] flex-col justify-center">
          <Etiqueta>Noche Quieta</Etiqueta>
          <Titulo>Duermes mal. No es falta de disciplina.</Titulo>
          <Sub>En 14 noches armamos un plan que sí cabe en tu vida.</Sub>
          <div className="mt-8">
            <Boton onClick={siguiente}>Empezar</Boton>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Noche Quieta es una herramienta de hábitos. No es un dispositivo médico ni un
            diagnóstico.
          </p>
        </div>
      ) : null}

      {paso === 1 ? (
        <Bloque titulo="¿Cuál es tu vida ahora mismo?">
          <div className="space-y-3">
            {MODOS.map((m) => (
              <Opcion
                key={m.id}
                label={m.titulo}
                sub={m.sub}
                activa={modo === m.id}
                onClick={() => {
                  setModo(m.id);
                  siguiente();
                }}
              />
            ))}
          </div>
        </Bloque>
      ) : null}

      {paso === 2 ? (
        <Bloque titulo="¿A qué hora te despiertas normalmente?">
          <Stepper valor={despertar} onChange={setDespertar} />
          <Boton onClick={siguiente} className="mt-8">
            Continuar
          </Boton>
        </Bloque>
      ) : null}

      {paso === 3 ? (
        <Bloque titulo="¿A qué hora te acuestas?">
          <Stepper valor={cama ?? "23:30"} onChange={setCama} />
          <Boton onClick={siguiente} className="mt-8">
            Continuar
          </Boton>
          <Boton
            variante="fantasma"
            className="mt-2"
            onClick={() => {
              setCama(null);
              siguiente();
            }}
          >
            No tengo hora
          </Boton>
        </Bloque>
      ) : null}

      {paso === 4 ? (
        <Bloque titulo="¿Hasta qué hora tomas café, té o energética?">
          <Lista
            opciones={CAFEINA}
            valor={cafeina}
            onPick={(v) => {
              setCafeina(v as Perfil["cafeina"]);
              siguiente();
            }}
          />
        </Bloque>
      ) : null}

      {paso === 5 ? (
        <Bloque titulo="¿Usas pantallas en la cama?">
          <Lista
            opciones={PANTALLAS}
            valor={pantallas}
            onPick={(v) => {
              setPantallas(v as Perfil["pantallas"]);
              siguiente();
            }}
          />
        </Bloque>
      ) : null}

      {paso === 6 ? (
        <Bloque titulo="¿Te despiertas en la noche?">
          <Lista
            opciones={DESPERTARES}
            valor={despertares}
            onPick={(v) => {
              setDespertares(v as Perfil["despertares"]);
              siguiente();
            }}
          />
        </Bloque>
      ) : null}

      {paso === 7 && modo ? (
        <Bloque titulo="Una cosa más sobre tu situación">
          <div className="space-y-3">
            {CONTEXTO[modo].map((c) => (
              <Opcion
                key={c}
                label={c}
                activa={contexto === c}
                onClick={() => {
                  setContexto(c);
                  siguiente();
                }}
              />
            ))}
          </div>
        </Bloque>
      ) : null}

      {paso === 8 ? (
        <Bloque titulo="¿Qué quieres lograr en 14 días?">
          <div className="space-y-3">
            {OBJETIVOS.map((o) => (
              <Opcion
                key={o.id}
                label={o.label}
                activa={objetivo === o.id}
                onClick={() => {
                  setObjetivo(o.id);
                  siguiente();
                }}
              />
            ))}
          </div>
        </Bloque>
      ) : null}

      {paso === 9 && perfil ? (
        <Revelacion perfil={perfil} onConfirmar={terminar} />
      ) : null}
    </Pantalla>
  );
}

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <Titulo>{titulo}</Titulo>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Lista({
  opciones,
  valor,
  onPick,
}: {
  opciones: readonly { id: string; label: string }[];
  valor: string | null;
  onPick: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      {opciones.map((o) => (
        <Opcion key={o.id} label={o.label} activa={valor === o.id} onClick={() => onPick(o.id)} />
      ))}
    </div>
  );
}

function Stepper({ valor, onChange }: { valor: string; onChange: (v: string) => void }) {
  const mover = (delta: number) => onChange(toHHMM(toMin(valor) + delta));
  return (
    <div className="flex items-center justify-between rounded-2xl bg-card px-6 py-6">
      <button
        type="button"
        onClick={() => mover(-15)}
        className="h-12 w-12 rounded-full bg-secondary text-2xl"
        aria-label="Quitar 15 minutos"
      >
        −
      </button>
      <span className="text-4xl font-semibold tabular-nums">{valor}</span>
      <button
        type="button"
        onClick={() => mover(15)}
        className="h-12 w-12 rounded-full bg-secondary text-2xl"
        aria-label="Sumar 15 minutos"
      >
        +
      </button>
    </div>
  );
}

function Revelacion({ perfil, onConfirmar }: { perfil: Perfil; onConfirmar: () => void }) {
  const item = generarPlan(perfil)[0];
  return (
    <div className="mt-4">
      <Etiqueta>Tu plan está listo</Etiqueta>
      <Titulo>14 noches, una regla cada vez</Titulo>
      <Tarjeta className="mt-6 space-y-3">
        <Fila titulo="Hora ancla de despertar" valor={item.despertar} />
        <Fila titulo="Corte de cafeína" valor={item.corteCafeina} />
        <Fila titulo="Bajar luces" valor={item.bajarLuces} />
        <Fila titulo="Cama objetivo" valor={item.camaObjetivo} />
      </Tarjeta>
      <Tarjeta className="mt-4 border-primary/40">
        <Etiqueta>Regla de la noche 1</Etiqueta>
        <p className="mt-2 text-xl font-semibold leading-snug">{item.regla}</p>
      </Tarjeta>
      <Boton className="mt-6" onClick={onConfirmar}>
        Activar recordatorios y empezar
      </Boton>
      <p className="mt-4 text-xs text-muted-foreground">
        7 noches completas gratis. Después decides si sigues.
      </p>
    </div>
  );
}

function Fila({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{titulo}</span>
      <span className="text-lg font-semibold tabular-nums">{valor}</span>
    </div>
  );
}
