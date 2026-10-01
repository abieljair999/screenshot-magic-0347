import { createFileRoute } from "@tanstack/react-router";
import { PASOS_TRES_AM } from "@/lib/noche/content";
import { Protocolo } from "./despierto";

export const Route = createFileRoute("/madrugada")({
  head: () => ({
    meta: [
      { title: "Me desperté a las 3 — Protocolo | Noche Quieta" },
      {
        name: "description",
        content:
          "Qué hacer cuando te despiertas de madrugada: no mires la hora, no empieces el día.",
      },
      { property: "og:title", content: "Me desperté a las 3 — Protocolo | Noche Quieta" },
      {
        property: "og:description",
        content: "Protocolo de madrugada en seis pasos, con la pantalla casi negra.",
      },
    ],
  }),
  component: () => <Protocolo pasos={PASOS_TRES_AM} titulo="Desperté de madrugada" />,
});
