import type { RoomId } from "@/lib/rooms";

export type Profile = {
  id: string;
  full_name: string;
  display_color: string;
  avatar_emoji: string;
  email: string | null;
};

export type Stay = {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  guest_count: number;
  note: string | null;
  room_ids: RoomId[];
  created_by: string;
  participants: Profile[];
};
