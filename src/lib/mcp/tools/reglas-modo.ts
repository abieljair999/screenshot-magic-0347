import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { MODOS, REGLAS } from "../../noche/content";

export default defineTool({
  name: "reglas_modo",
  title: "Reglas por modo",
  description: "Devuelve la descripción y las reglas nocturnas de un modo de Noche Quieta.",
  inputSchema: { modo: z.enum(["padres", "turnos", "gym"]).describe("Modo a consultar.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ modo }) => {
    const info = MODOS.find((m) => m.id === modo);
    const data = { modo, titulo: info?.titulo ?? modo, sub: info?.sub ?? "", reglas: [...REGLAS[modo]] };
    return { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: data };
  },
});
