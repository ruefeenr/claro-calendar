export const profilePresets = [
  { id: "panda-blue", avatar: "🐼", color: "#2563eb", label: "🐼 Blau" },
  { id: "fox-orange", avatar: "🦊", color: "#ea580c", label: "🦊 Orange" },
  { id: "raven-slate", avatar: "🐦", color: "#475569", label: "🐦 Grau" },
  { id: "bear-brown", avatar: "🐻", color: "#92400e", label: "🐻 Braun" },
  { id: "owl-violet", avatar: "🦉", color: "#7c3aed", label: "🦉 Violett" },
  { id: "wolf-teal", avatar: "🐺", color: "#0f766e", label: "🐺 Petrol" },
  { id: "raccoon-pink", avatar: "🦝", color: "#db2777", label: "🦝 Pink" },
  { id: "deer-green", avatar: "🦌", color: "#059669", label: "🦌 Grün" },
] as const;

export const defaultProfilePreset = profilePresets[0];
export const defaultColor = defaultProfilePreset.color;
export type ProfilePresetId = (typeof profilePresets)[number]["id"];

export function getProfilePresetValue(color: string, avatar: string) {
  const exactMatch = profilePresets.find(
    (preset) => preset.color === color && preset.avatar === avatar,
  );

  return exactMatch?.id ?? defaultProfilePreset.id;
}

export function getProfilePresetById(id: string) {
  return (
    profilePresets.find((preset) => preset.id === id) ?? defaultProfilePreset
  );
}
