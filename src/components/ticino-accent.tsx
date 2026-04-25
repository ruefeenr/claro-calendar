import { clsx } from "clsx";

export type TicinoAccentVariant =
  | "ibex"
  | "raven"
  | "salami"
  | "palm"
  | "chestnut"
  | "mountain"
  | "home";

type TicinoAccentProps = {
  className?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant: TicinoAccentVariant;
};

const accents: Record<TicinoAccentVariant, { icon: string; label: string }> = {
  chestnut: { icon: "🌰", label: "Kastanie" },
  home: { icon: "🏡", label: "Casa Claro" },
  ibex: { icon: "🦌", label: "Steinbock" },
  mountain: { icon: "⛰️", label: "Tessiner Berge" },
  palm: { icon: "🌴", label: "Palme" },
  raven: { icon: "🐦‍⬛", label: "Rabe" },
  salami: { icon: "🥓", label: "Salametti" },
};

const sizeClasses = {
  sm: "h-8 w-8 text-base",
  md: "h-10 w-10 text-xl",
  lg: "h-14 w-14 text-3xl",
};

export function TicinoAccent({
  className,
  label,
  size = "md",
  variant,
}: TicinoAccentProps) {
  const accent = accents[variant];

  return (
    <span
      aria-label={label ?? accent.label}
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-amber-900/10 bg-white/60 shadow-sm",
        sizeClasses[size],
        className,
      )}
      role="img"
      title={label ?? accent.label}
    >
      {accent.icon}
    </span>
  );
}
