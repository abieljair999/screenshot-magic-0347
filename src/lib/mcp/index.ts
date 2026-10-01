import { defineMcp } from "@lovable.dev/mcp-js";
import generarPlan from "./tools/generar-plan";
import reglasModo from "./tools/reglas-modo";
import protocolo from "./tools/protocolo-emergencia";

export default defineMcp({
  name: "pixel-perfect-screenshot",
  title: "Pixel Perfect Screenshot",
  version: "0.1.0",
  instructions:
    "Herramientas de Noche Quieta, un plan de sueño de 14 noches. Usa `generar_plan` para calcular horarios, `reglas_modo` para las reglas de cada modo y `protocolo_emergencia` para los pasos cuando alguien no puede dormir.",
  tools: [generarPlan, reglasModo, protocolo],
});
