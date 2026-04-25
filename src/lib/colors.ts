export function withCalendarAlpha(color: string) {
  return color.startsWith("#") && color.length === 7 ? `${color}99` : color;
}
