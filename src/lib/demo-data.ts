import type { Profile, Stay } from "@/lib/types";

export const demoProfiles: Profile[] = [
  {
    id: "reto",
    full_name: "Reto",
    display_color: "#2563eb",
    avatar_emoji: "🐻",
    email: null,
  },
  {
    id: "miriam",
    full_name: "Miriam",
    display_color: "#db2777",
    avatar_emoji: "🦊",
    email: null,
  },
  {
    id: "morena",
    full_name: "Morena",
    display_color: "#ea580c",
    avatar_emoji: "🦉",
    email: null,
  },
  {
    id: "alessandra",
    full_name: "Alessandra",
    display_color: "#7c3aed",
    avatar_emoji: "🐱",
    email: null,
  },
  {
    id: "enrique",
    full_name: "Enrique",
    display_color: "#059669",
    avatar_emoji: "🐼",
    email: null,
  },
];

export const demoStays: Stay[] = [
  {
    id: "demo-april",
    title: "Frühlingswochenende in Claro",
    start_date: "2026-04-24",
    end_date: "2026-04-26",
    note: "Anreise Freitagabend, Rückfahrt Sonntag.",
    created_by: "miriam",
    participants: demoProfiles.filter((profile) =>
      ["reto", "miriam"].includes(profile.id),
    ),
  },
  {
    id: "demo-may",
    title: "Morena in Claro",
    start_date: "2026-05-02",
    end_date: "2026-05-03",
    note: "Plant ein ruhiges Wochenende im Ferienhaus.",
    created_by: "morena",
    participants: demoProfiles.filter((profile) =>
      ["morena"].includes(profile.id),
    ),
  },
  {
    id: "demo-summer",
    title: "Familienwoche in Claro",
    start_date: "2026-07-11",
    end_date: "2026-07-18",
    note: "Sommeraufenthalt mit möglicher Anreise in Etappen.",
    created_by: "enrique",
    participants: demoProfiles,
  },
];
