import { REGLAS, INSIGHTS_BUENOS, INSIGHTS_MALOS } from "./content";
import type { CheckinManana, Noche, Perfil } from "./types";

export function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function toHHMM(min: number): string {
  const v = ((min % 1440) + 1440) % 1440;
  const h = Math.floor(v / 60);
  const m = v % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function hoyKey(d = new Date()): string {
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export function diasDesde(inicio: string): number {
  const a = new Date(`${inicio}T00:00:00`);
  const b = new Date(`${hoyKey()}T00:00:00`);
  return Math.floor((b.getTime() - a.getTime()) / 86400000);
}

export function numeroNoche(perfil: Perfil): number {
  return Math.max(1, diasDesde(perfil.inicio) + 1);
}

export interface ItemPlan {
  numero: number;
  regla: string;
  bajarLuces: string;
  camaObjetivo: string;
  despertar: string;
  corteCafeina: string;
}

/** Motor del plan: una palanca por noche, horarios relativos al bloque de sueño. */
export function generarPlan(perfil: Perfil, cafeinaAdelantada = false): ItemPlan[] {
  const despertar = toMin(perfil.horaDespertar);
  const sueñoObjetivo = perfil.modo === "padres" ? 7 * 60 : 7.5 * 60;
  const camaBase = perfil.horaCama ? toMin(perfil.horaCama) : despertar - sueñoObjetivo;
  const reglas = REGLAS[perfil.modo];

  return Array.from({ length: 14 }, (_, i) => {
    // El avance es gradual: hasta 45 min de adelanto de la cama en 14 noches.
    const adelanto = Math.min(45, Math.floor((i / 13) * 45 / 5) * 5);
    const cama = camaBase - adelanto;
    const corte = cama - (8 * 60 + (cafeinaAdelantada ? 60 : 0));
    return {
      numero: i + 1,
      regla: reglas[i % reglas.length] ?? "",
      bajarLuces: toHHMM(cama - (perfil.modo === "padres" ? 30 : 45)),
      camaObjetivo: toHHMM(cama),
      despertar: toHHMM(cama + sueñoObjetivo),
      corteCafeina: toHHMM(corte),
    };
  });
}

export function recuperacion(c: CheckinManana): "baja" | "media" | "alta" {
  let p = 0;
  if (c.horas === "6-7" || c.horas === "7+") p += 2;
  else if (c.horas === "5-6") p += 1;
  if (c.costoDormirse === "no") p += 1;
  if (c.despertares === "no") p += 1;
  if (c.energia === "bien") p += 2;
  else if (c.energia === "normal") p += 1;
  if (p >= 5) return "alta";
  if (p >= 3) return "media";
  return "baja";
}

export function generarInsight(c: CheckinManana, numero: number): string {
  const nivel = recuperacion(c);
  if (c.sabotaje === "cafeina") return INSIGHTS_MALOS[1]!;
  if (c.sabotaje === "pantalla") return INSIGHTS_MALOS[0]!;
  if (c.sabotaje === "estres") return INSIGHTS_MALOS[3]!;
  if (c.sabotaje === "ruido" || c.sabotaje === "bebe") return INSIGHTS_MALOS[4]!;
  if (nivel === "baja") return INSIGHTS_MALOS[2]!;
  if (nivel === "alta") return INSIGHTS_BUENOS[numero % INSIGHTS_BUENOS.length]!;
  return INSIGHTS_BUENOS[(numero + 2) % INSIGHTS_BUENOS.length]!;
}

export function estadoNoche(n: Noche | undefined): "hecha" | "parcial" | "fallida" | "futura" {
  if (!n) return "futura";
  if (n.manana && n.noche) return "hecha";
  if (n.manana || n.noche) return "parcial";
  return "fallida";
}

export const ETIQUETA_SABOTAJE: Record<string, string> = {
  cafeina: "Cafeína",
  pantalla: "Pantalla",
  estres: "Estrés",
  ruido: "Ruido",
  bebe: "Bebé",
  entrenamiento: "Entrenamiento tarde",
  nada: "Nada",
};
