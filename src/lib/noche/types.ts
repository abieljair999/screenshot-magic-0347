export type Modo = "padres" | "turnos" | "gym";

export type Objetivo =
  | "dormirme-rapido"
  | "despertarme-menos"
  | "horario-estable"
  | "recuperarme";

export type Sabotaje =
  | "cafeina"
  | "pantalla"
  | "estres"
  | "ruido"
  | "bebe"
  | "entrenamiento"
  | "nada";

export interface Perfil {
  modo: Modo;
  horaDespertar: string; // "06:30"
  horaCama: string | null; // null = "no tengo hora"
  cafeina: "nunca" | "antes-12" | "12-16" | "16-20" | "despues-20";
  pantallas: "nunca" | "a-veces" | "casi-siempre" | "me-duermo-con-el";
  despertares: "casi-no" | "una" | "varias" | "me-cuesta-volver";
  contexto: string[]; // respuestas extra según modo
  objetivo: Objetivo;
  inicio: string; // fecha ISO (YYYY-MM-DD) de la noche 1
}

export interface CheckinManana {
  horas: "<4" | "4-5" | "5-6" | "6-7" | "7+";
  costoDormirse: "no" | "poco" | "mucho";
  despertares: "no" | "una" | "varias";
  energia: "baja" | "normal" | "bien";
  sabotaje: Sabotaje | null;
}

export interface CheckinNoche {
  horaCama: string; // ISO timestamp
  cafeinaTarde: boolean;
  diaPesado: "si" | "no" | "no-aplica";
}

export interface Noche {
  fecha: string; // YYYY-MM-DD (fecha de la mañana siguiente / día del plan)
  numeroPlan: number;
  regla: string;
  manana?: CheckinManana;
  noche?: CheckinNoche;
  protocolos?: string[];
  insight?: string;
  recuperacion?: "baja" | "media" | "alta";
}

export interface EstadoApp {
  perfil: Perfil | null;
  noches: Record<string, Noche>;
  ajustes: {
    recordatorios: boolean;
    sonidosSuaves: boolean;
  };
  cafeinaAdelantada: boolean;
}
