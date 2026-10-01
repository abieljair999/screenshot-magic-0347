import type { Modo } from "./types";

export const MODOS: { id: Modo; titulo: string; sub: string }[] = [
  {
    id: "padres",
    titulo: "Padres / casa con niños",
    sub: "Despertares, siestas rotas, noches partidas.",
  },
  {
    id: "turnos",
    titulo: "Turnos / trabajo de noche",
    sub: "Dormir de día, luz, ruido, horarios que cambian.",
  },
  {
    id: "gym",
    titulo: "Gym y mente acelerada",
    sub: "Entrenas tarde y te acuestas cansado pero encendido.",
  },
];

export const REGLAS: Record<Modo, string[]> = {
  padres: [
    "Celular carga fuera de la cama. Alarma en otro lado.",
    "Protege un bloque de 4 horas seguidas. Ese es el objetivo de hoy.",
    "Si te toca turno de madrugada, luz mínima y nada de pantalla.",
    "Acuéstate 20 minutos antes de lo que crees que puedes.",
    "Último café o té 8 horas antes de tu bloque principal.",
    "Si el bebé despierta, no revises el reloj.",
    "Siesta de 20 minutos si el día lo permite. Ni una más.",
    "Repartan la noche: una persona cubre la primera mitad.",
    "La casa baja luces 45 minutos antes de tu cama objetivo.",
    "Nada de resolver pendientes de casa después de bajar luces.",
    "Si duermes menos, levántate igual a tu hora ancla.",
    "Deja el cuarto listo antes de la cena: oscuro, fresco, sin desorden.",
    "Hoy no persigas la noche perfecta. Persigue dormirte rápido.",
    "Revisa qué funcionó estas dos semanas y quédate con dos reglas.",
  ],
  turnos: [
    "Al llegar, 10 min de bajada: ducha tibia, cuarto oscuro, sin redes.",
    "Lentes oscuros al salir del turno. La luz le avisa al cuerpo que es de día.",
    "Antifaz y tapones listos antes de acostarte, no después.",
    "Última cafeína 6 horas antes del final de tu turno.",
    "Avisa en casa tu bloque de sueño y ponlo en la puerta.",
    "Nada de pantalla en la cama, aunque sea de día.",
    "Si el bloque se rompe, suma una siesta de 20 min antes del turno.",
    "Come ligero en la última hora del turno.",
    "Mismo ritual de bajada siempre, aunque cambie el horario.",
    "En días libres, no muevas tu bloque más de 2–3 horas.",
    "Sin alcohol para dormir: te saca del sueño profundo.",
    "Cuarto a oscuras totales: tapa cada lucecita.",
    "Protege la primera hora al despertar: luz fuerte y movimiento.",
    "Elige el protocolo de bajada que mejor te funcionó y hazlo fijo.",
  ],
  gym: [
    "La cama no es para reels. Si no pegas el sueño en 20 min, te levantas.",
    "Corte de pantallas 30 minutos antes de la cama objetivo.",
    "Si entrenas después de las 19:00, baja la intensidad del final.",
    "8 minutos de respiración 4-6 antes de acostarte.",
    "Último café antes de tu corte de cafeína, sin excepciones.",
    "Escribe en papel los pendientes de mañana antes de bajar luces.",
    "Cena al menos 90 minutos antes de la cama.",
    "Luz cálida y baja en la última hora del día.",
    "Nada de noticias ni trabajo después de bajar luces.",
    "Ducha tibia 60–90 minutos antes de acostarte.",
    "Si te despiertas, no mires la hora. Respira 4-6.",
    "Hora ancla de despertar incluso si dormiste mal.",
    "Entrena temprano hoy si puedes. Compara cómo duermes.",
    "Quédate con las dos reglas que más te ayudaron y hazlas fijas.",
  ],
};

export const INSIGHTS_BUENOS = [
  "Dormiste mejor cuando el café se cortó temprano. Repite ese corte hoy.",
  "Aunque durmieras poco, te levantaste a la hora ancla. Eso protege esta noche.",
  "Dos noches seguidas registrando. Ahí es donde el plan empieza a notarse.",
  "Te costó menos dormirte. La bajada de luces está haciendo su trabajo.",
  "Menos despertares que el promedio de tu semana. Buen bloque.",
];

export const INSIGHTS_MALOS = [
  "Las noches con celular en la cama te cuesta más dormirte. Hoy carga el teléfono fuera.",
  "La cafeína tarde aparece otra vez. Hoy adelantamos el corte una hora.",
  "No pasó nada. Una noche mala no arruina el plan. Hoy no persigas la siesta larga.",
  "El estrés apareció en el check-in. Escribe los pendientes en papel antes de bajar luces.",
  "El ruido te rompió la noche. Hoy prepara tapones o ruido blanco antes de acostarte.",
];

export const PASOS_SIGO_DESPIERTO = [
  "Levántate de la cama.",
  "Luz mínima. Ni lámpara fuerte ni techo.",
  "Nada de redes, noticias ni email.",
  "4–6 minutos de respiración 4-6: inhala 4, exhala 6.",
  "Cuando bosteces o te pesen los ojos, vuelve a la cama.",
  "Si en 20 min no pega, repite una sola vez. Luego protege el despertar de mañana, no persigas la noche.",
];

export const PASOS_TRES_AM = [
  "No revises la hora. No empieces el día a las 3.",
  "Quédate acostado y respira 4-6 durante 10 ciclos.",
  "Si a los 20 minutos sigues despierto, levántate con luz mínima.",
  "Texto aburrido o respiración. Nada de pantalla.",
  "Vuelve a la cama cuando llegue el sueño, no antes.",
  "Mañana te levantas a tu hora ancla igual. Eso arregla la próxima noche.",
];

export const MENSAJES_NOCHE_MALA = [
  "No pasó nada. Una noche mala no arruina el plan.",
  "Hoy el objetivo es mínimo: hora ancla y corte de cafeína.",
  "No persigas la siesta larga. 20 minutos máximo.",
  "Acortamos la regla de hoy. Solo una cosa.",
];

export const MENSAJES_NOCHE_BUENA = [
  "Eso es. Repite exactamente lo de anoche.",
  "Tu cuerpo ya está agarrando el ritmo.",
  "Buena noche. Mantén la hora ancla aunque sea fin de semana.",
  "Lo que hiciste anoche funciona. Hazlo rutina.",
];
