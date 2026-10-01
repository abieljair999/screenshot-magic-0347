import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { generarPlan } from "../../noche/plan";

const hora = z.string().regex(/^\d{2}:\d{2}$/);

export default defineTool({
  name: "generar_plan",
  title: "Generar plan de 14 noches",
  description: "Calcula el plan de 14 noches de Noche Quieta (regla, luces, cama, despertar y corte de cafeína) para un modo y horario.",
  inputSchema: {
    modo: z.enum(["padres", "turnos", "gym"]).describe("Modo del plan."),
    horaDespertar: hora.describe("Hora de despertar HH:MM, p. ej. 06:30."),
    horaCama: hora.optional().describe("Hora habitual de dormir HH:MM (opcional)."),
    cafeinaAdelantada: z.boolean().optional().describe("Adelantar 1 h el corte de cafeína."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ modo, horaDespertar, horaCama, cafeinaAdelantada }) => {
    if (Number(horaDespertar.slice(0, 2)) > 23) throw new ToolError("Hora de despertar inválida.");
    const plan = generarPlan(
      {
        modo,
        horaDespertar,
        horaCama: horaCama ?? null,
        cafeina: "nunca",
        pantallas: "nunca",
        despertares: "casi-no",
        contexto: [],
        objetivo: "dormir-mejor" as never,
        inicio: "2026-01-01",
      },
      cafeinaAdelantada ?? false,
    ).map((n) => ({ ...n }));
    return {
      content: [{ type: "text", text: JSON.stringify(plan) }],
      structuredContent: { plan },
    };
  },
});
