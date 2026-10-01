import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Boton, Etiqueta, Pantalla, Tarjeta, Titulo } from "@/components/noche/ui";
import { useNoche } from "@/lib/noche/store";
import { hoyKey } from "@/lib/noche/plan";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Noche Quieta — Duerme mejor en 14 noches" },
      {
        name: "description",
        content:
          "Plan de 14 noches para padres, turnos o mente acelerada. Una regla por noche y un check-in de 20 segundos.",
      },
      { property: "og:title", content: "Noche Quieta — Duerme mejor en 14 noches" },
      {
        property: "og:description",
        content:
          "Una vida imperfecta. Una noche. Una regla. Un check-in corto. Sin wearables, sin culpa.",
      },
    ],
  }),
  component: Hoy,
});

function Hoy() {
  const { listo, perfil, plan, numero, itemHoy, nocheHoy } = useNoche();
  const navigate = useNavigate();

  useEffect(() => {
    if (listo && !perfil) navigate({ to: "/onboarding" });
  }, [listo, perfil, navigate]);

  if (!listo || !perfil || !itemHoy) {
    return (
      <Pantalla conTabs={false}>
        <p className="text-muted-foreground">Cargando tu noche…</p>
      </Pantalla>
    );
  }

  const hora = new Date().getHours();
  const esManana = hora >= 4 && hora < 16;
  const nochesRegistradas = Object.values(useNocheSemana()).length;

  const cerrada = Boolean(nocheHoy?.manana);
  const ciclo = numero > 14;

  return (
    <Pantalla>
      <Etiqueta>
        {ciclo ? `Mantenimiento · día ${numero - 14}` : `Noche ${numero} de 14`}
      </Etiqueta>
      <Titulo>{esManana ? "Buenos días" : "Buenas noches"}</Titulo>

      <Tarjeta className="mt-6">
        <Etiqueta>
          {perfil.modo === "turnos" ? "Tu bloque de sueño" : "Tu próxima ancla"}
        </Etiqueta>
        <p className="mt-2 text-2xl font-semibold">
          {perfil.modo === "turnos"
            ? `Bloque ${itemHoy.camaObjetivo}–${itemHoy.despertar}`
            : `Despertar ${itemHoy.despertar}`}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Dato titulo="Corte de cafeína" valor={itemHoy.corteCafeina} />
          <Dato titulo="Bajar luces" valor={itemHoy.bajarLuces} />
          <Dato titulo="Cama objetivo" valor={itemHoy.camaObjetivo} />
          <Dato
            titulo="Estado"
            valor={cerrada ? "Noche cerrada" : nocheHoy?.noche ? "En curso" : "Pendiente"}
          />
        </div>
      </Tarjeta>

      <Tarjeta className="mt-4 border-primary/40">
        <Etiqueta>La regla de hoy</Etiqueta>
        <p className="mt-2 text-xl font-semibold leading-snug">{itemHoy.regla}</p>
      </Tarjeta>

      {nocheHoy?.insight ? (
        <Tarjeta className="mt-4">
          <Etiqueta>Insight de anoche</Etiqueta>
          <p className="mt-2 leading-relaxed">{nocheHoy.insight}</p>
        </Tarjeta>
      ) : null}

      <div className="mt-6 space-y-3">
        {esManana && !nocheHoy?.manana ? (
          <Link to="/manana">
            <Boton>¿Cómo dormiste?</Boton>
          </Link>
        ) : null}
        {!esManana ? (
          <Link to="/noche">
            <Boton>Me voy a dormir</Boton>
          </Link>
        ) : null}
        {esManana && nocheHoy?.manana ? (
          <Link to="/plan">
            <Boton variante="secundario">Ver el plan de hoy</Boton>
          </Link>
        ) : null}
        <Link to="/despierto">
          <Boton variante="secundario">No puedo dormir ahora</Boton>
        </Link>
        <Link to="/madrugada">
          <Boton variante="fantasma">Me desperté a las 3</Boton>
        </Link>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {nochesRegistradas} {nochesRegistradas === 1 ? "noche registrada" : "noches registradas"}{" "}
        esta semana
      </p>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Plan de {plan.length} noches. Noche Quieta es una herramienta de hábitos, no un
        diagnóstico.
      </p>
    </Pantalla>
  );
}

function useNocheSemana() {
  const { noches } = useNoche();
  const limite = new Date();
  limite.setDate(limite.getDate() - 6);
  const desde = hoyKey(limite);
  return Object.fromEntries(
    Object.entries(noches).filter(([k, n]) => k >= desde && (n.manana || n.noche)),
  );
}

function Dato({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="rounded-xl bg-secondary px-3 py-2">
      <p className="text-xs text-muted-foreground">{titulo}</p>
      <p className="mt-0.5 font-medium">{valor}</p>
    </div>
  );
}
