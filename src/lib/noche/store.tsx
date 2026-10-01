import { useCallback, useEffect, useState } from "react";
import type { EstadoApp, Noche, Perfil } from "./types";
import { generarPlan, hoyKey, numeroNoche } from "./plan";

const KEY = "noche-quieta-v1";

const inicial: EstadoApp = {
  perfil: null,
  noches: {},
  ajustes: { recordatorios: true, sonidosSuaves: true },
  cafeinaAdelantada: false,
};

function leer(): EstadoApp {
  if (typeof window === "undefined") return inicial;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...inicial, ...(JSON.parse(raw) as EstadoApp) } : inicial;
  } catch {
    return inicial;
  }
}

const listeners = new Set<(e: EstadoApp) => void>();
let memoria: EstadoApp | null = null;

function escribir(next: EstadoApp) {
  memoria = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* almacenamiento no disponible */
  }
  listeners.forEach((l) => l(next));
}

export function useNoche() {
  const [estado, setEstado] = useState<EstadoApp>(inicial);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    memoria = memoria ?? leer();
    setEstado(memoria);
    setListo(true);
    const l = (e: EstadoApp) => setEstado(e);
    listeners.add(l);
    return () => void listeners.delete(l);
  }, []);

  const actualizar = useCallback((fn: (e: EstadoApp) => EstadoApp) => {
    const base = memoria ?? leer();
    escribir(fn(base));
  }, []);

  const guardarPerfil = useCallback(
    (perfil: Perfil) => actualizar((e) => ({ ...e, perfil })),
    [actualizar],
  );

  const guardarNoche = useCallback(
    (fecha: string, parche: Partial<Noche>) =>
      actualizar((e) => {
        const previa = e.noches[fecha];
        const numero = previa?.numeroPlan ?? (e.perfil ? numeroNoche(e.perfil) : 1);
        const regla =
          previa?.regla ??
          (e.perfil ? generarPlan(e.perfil, e.cafeinaAdelantada)[(numero - 1) % 14].regla : "");
        return {
          ...e,
          noches: {
            ...e.noches,
            [fecha]: { fecha, numeroPlan: numero, regla, ...previa, ...parche },
          },
        };
      }),
    [actualizar],
  );

  const reiniciar = useCallback(() => escribir(inicial), []);

  const plan = estado.perfil ? generarPlan(estado.perfil, estado.cafeinaAdelantada) : [];
  const numero = estado.perfil ? numeroNoche(estado.perfil) : 1;
  const itemHoy = plan.length ? plan[(numero - 1) % 14] : null;
  const nocheHoy = estado.noches[hoyKey()];

  return {
    ...estado,
    listo,
    plan,
    numero,
    itemHoy,
    nocheHoy,
    actualizar,
    guardarPerfil,
    guardarNoche,
    reiniciar,
  };
}
