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
  note: string | null;
  created_by: string;
  participants: Profile[];
};
