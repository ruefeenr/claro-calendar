import { endOfMonth, format, startOfMonth } from "date-fns";
import type { User } from "@supabase/supabase-js";

import { defaultAvatar } from "@/lib/avatar-options";
import { demoProfiles, demoStays } from "@/lib/demo-data";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Stay } from "@/lib/types";

async function ensureProfile(user: User) {
  const supabase = await createClient();
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id, email")
    .eq("id", user.id)
    .maybeSingle();

  if (!existingProfile) {
    const fullName =
      user.user_metadata.full_name ??
      user.user_metadata.name ??
      user.email?.split("@")[0] ??
      "Familienmitglied";

    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email ?? null,
      full_name: fullName,
      avatar_emoji: defaultAvatar,
    });
    return;
  }

  if (existingProfile.email !== (user.email ?? null)) {
    await supabase
      .from("profiles")
      .update({ email: user.email ?? null })
      .eq("id", user.id);
  }
}

export async function getProfiles(user: User | null) {
  if (!isSupabaseConfigured() || !user) {
    return demoProfiles;
  }

  await ensureProfile(user);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, display_color, avatar_emoji, email")
    .order("full_name", { ascending: true });

  if (error || !data) {
    return demoProfiles;
  }

  return data satisfies Profile[];
}

export async function getStaysForMonth(month: Date, user: User | null) {
  if (!isSupabaseConfigured() || !user) {
    return demoStays;
  }

  const supabase = await createClient();
  const monthStart = format(startOfMonth(month), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(month), "yyyy-MM-dd");

  const profiles = await getProfiles(user);

  const { data: stays, error: staysError } = await supabase
    .from("stays")
    .select("id, title, start_date, end_date, note, created_by")
    .lte("start_date", monthEnd)
    .gte("end_date", monthStart)
    .order("start_date", { ascending: true });

  if (staysError || !stays) {
    return demoStays;
  }

  const stayIds = stays.map((stay) => stay.id);
  const { data: participantRows, error: participantError } = stayIds.length
    ? await supabase
        .from("stay_participants")
        .select("stay_id, profile_id")
        .in("stay_id", stayIds)
    : { data: [], error: null };

  if (participantError || !participantRows) {
    return stays.map((stay) => ({
      ...stay,
      participants: [],
    })) satisfies Stay[];
  }

  const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));

  return stays.map((stay) => ({
    ...stay,
    participants: participantRows
      .filter((row) => row.stay_id === stay.id)
      .map((row) => profilesById.get(row.profile_id))
      .filter((profile): profile is Profile => Boolean(profile)),
  })) satisfies Stay[];
}

export async function getCurrentProfile(user: User | null) {
  const profiles = await getProfiles(user);
  return profiles.find((profile) => profile.id === user?.id) ?? profiles[0] ?? null;
}
