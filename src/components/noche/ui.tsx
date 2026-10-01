import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Pantalla({
  children,
  conTabs = true,
  oscura = false,
}: {
  children: ReactNode;
  conTabs?: boolean;
  oscura?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-h-screen w-full",
        oscura ? "bg-night text-night-foreground" : "screen-night text-foreground",
      )}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-md px-5 pt-10",
          conTabs ? "pb-32" : "pb-12",
        )}
      >
        {children}
      </div>
      {conTabs ? <TabBar /> : null}
    </div>
  );
}

const TABS = [
  { to: "/", label: "Hoy" },
  { to: "/plan", label: "Plan" },
  { to: "/diario", label: "Diario" },
  { to: "/ajustes", label: "Ajustes" },
] as const;

function TabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-md items-stretch justify-between px-2 pb-6 pt-2">
        {TABS.map((t) => {
          const activo = pathname === t.to;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "flex-1 rounded-xl py-3 text-center text-sm font-medium transition-colors",
                activo
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Titulo({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-3xl font-semibold leading-tight tracking-tight">{children}</h1>
  );
}

export function Sub({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-base leading-relaxed text-muted-foreground">{children}</p>;
}

export function Tarjeta({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("card-soft p-5", className)}>{children}</div>;
}

export function Boton({
  children,
  onClick,
  variante = "primario",
  type = "button",
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  variante?: "primario" | "secundario" | "fantasma";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full rounded-2xl px-5 py-4 text-base font-semibold transition-colors disabled:opacity-40",
        variante === "primario" && "bg-primary text-primary-foreground hover:bg-primary/90",
        variante === "secundario" &&
          "bg-secondary text-secondary-foreground hover:bg-accent",
        variante === "fantasma" && "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Opcion({
  label,
  sub,
  activa,
  onClick,
}: {
  label: string;
  sub?: string;
  activa?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border px-5 py-4 text-left transition-colors",
        activa
          ? "border-primary bg-accent text-accent-foreground"
          : "border-border bg-card text-foreground hover:border-input",
      )}
    >
      <span className="block text-base font-medium">{label}</span>
      {sub ? <span className="mt-1 block text-sm text-muted-foreground">{sub}</span> : null}
    </button>
  );
}

export function Etiqueta({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </span>
  );
}
