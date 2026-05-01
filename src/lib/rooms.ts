export const roomOptions = [
  { id: "office", label: "Zimmer Büro", capacity: 2 },
  { id: "parents", label: "Zimmer Mami & Papi", capacity: 2 },
  { id: "garden", label: "Zimmer Gartenblick", capacity: 2 },
  { id: "living", label: "Zimmer Stube", capacity: 2 },
] as const;

export type RoomId = (typeof roomOptions)[number]["id"];

const roomIds = new Set<string>(roomOptions.map((room) => room.id));

export function isRoomId(value: string): value is RoomId {
  return roomIds.has(value);
}

export function getValidRoomIds(values: string[]) {
  return Array.from(new Set(values.filter(isRoomId)));
}

export function getRoomsCapacity(roomIdsToCheck: RoomId[]) {
  return roomOptions
    .filter((room) => roomIdsToCheck.includes(room.id))
    .reduce((total, room) => total + room.capacity, 0);
}

export function formatRoomNames(roomIdsToFormat: RoomId[]) {
  return roomOptions
    .filter((room) => roomIdsToFormat.includes(room.id))
    .map((room) => room.label)
    .join(", ");
}

export function getCapacityWarning(guestCount: number, roomIdsToCheck: RoomId[]) {
  const capacity = getRoomsCapacity(roomIdsToCheck);

  if (!roomIdsToCheck.length || guestCount <= capacity) {
    return null;
  }

  return `Die ausgewählten Zimmer haben Platz für ${capacity} Personen. Du buchst für ${guestCount} Personen.`;
}
