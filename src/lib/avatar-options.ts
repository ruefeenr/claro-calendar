export const avatarOptions = [
  { value: "🐼", label: "Panda" },
  { value: "🦊", label: "Fuchs" },
  { value: "🐦", label: "Rabe" },
  { value: "🐻", label: "Bär" },
  { value: "🦉", label: "Eule" },
  { value: "🐺", label: "Wolf" },
  { value: "🦝", label: "Waschbär" },
  { value: "🦌", label: "Hirsch" },
] as const;

export const defaultAvatar = avatarOptions[0].value;
