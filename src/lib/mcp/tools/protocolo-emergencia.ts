import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PASOS_SIGO_DESPIERTO, PASOS_TRES_AM } from "../../noche/content";

export default defineTool({
  name: "protocolo_emergencia",
  title: "Protocolo de emergencia",
  description: "Devuelve los pasos de los protocolos nocturnos: 'sigo-despierto' o 'tres-am'.",
  inputSchema: { tipo: z.enum(["sigo-despierto", "tres-am"]).describe("Protocolo a consultar.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ tipo }) => {
    const pasos = [...(tipo === "tres-am" ? PASOS_TRES_AM : PASOS_SIGO_DESPIERTO)];
    return {
      content: [{ type: "text", text: pasos.map((p, i) => `${i + 1}. ${p}`).join("\n") }],
      structuredContent: { tipo, pasos },
    };
  },
});
