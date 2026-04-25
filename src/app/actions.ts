"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { defaultAvatar } from "@/lib/avatar-options";
import { requireUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

type CreateStayActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

async function saveStay(formData: FormData): Promise<CreateStayActionState> {
  const user = await requireUser();
  const title = getString(formData, "title");
  const startDate = getString(formData, "start_date");
  const endDate = getString(formData, "end_date");
  const note = getString(formData, "note");
  const participantIds = formData
    .getAll("participant_ids")
    .map((value) => String(value))
    .filter(Boolean);

  if (!title || !startDate || !endDate || participantIds.length === 0) {
    return {
      status: "error",
      message: "Bitte Titel, Zeitraum und mindestens eine Person angeben.",
    };
  }

  if (endDate < startDate) {
    return {
      status: "error",
      message: "Das Enddatum muss nach dem Startdatum liegen.",
    };
  }

  const supabase = await createClient();
  const { data: stay, error } = await supabase
    .from("stays")
    .insert({
      title,
      start_date: startDate,
      end_date: endDate,
      note: note || null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !stay) {
    return {
      status: "error",
      message: "Der Aufenthalt konnte nicht gespeichert werden.",
    };
  }

  const { error: participantError } = await supabase
    .from("stay_participants")
    .insert(
      participantIds.map((profileId) => ({
        stay_id: stay.id,
        profile_id: profileId,
      })),
    );

  if (participantError) {
    await supabase.from("stays").delete().eq("id", stay.id);
    return {
      status: "error",
      message: "Teilnehmende konnten nicht gespeichert werden.",
    };
  }

  revalidatePath("/calendar");

  return {
    status: "success",
    message: "Aufenthalt gespeichert.",
  };
}

async function updateStay(formData: FormData): Promise<CreateStayActionState> {
  await requireUser();

  const stayId = getString(formData, "stay_id");
  const title = getString(formData, "title");
  const startDate = getString(formData, "start_date");
  const endDate = getString(formData, "end_date");
  const note = getString(formData, "note");
  const participantIds = formData
    .getAll("participant_ids")
    .map((value) => String(value))
    .filter(Boolean);

  if (!stayId || !title || !startDate || !endDate || participantIds.length === 0) {
    return {
      status: "error",
      message: "Bitte Titel, Zeitraum und mindestens eine Person angeben.",
    };
  }

  if (endDate < startDate) {
    return {
      status: "error",
      message: "Das Enddatum muss nach dem Startdatum liegen.",
    };
  }

  const supabase = await createClient();
  const { error: stayError } = await supabase
    .from("stays")
    .update({
      title,
      start_date: startDate,
      end_date: endDate,
      note: note || null,
    })
    .eq("id", stayId)
    .select("id")
    .single();

  if (stayError) {
    return {
      status: "error",
      message: "Der Aufenthalt konnte nicht aktualisiert werden.",
    };
  }

  const { error: deleteParticipantsError } = await supabase
    .from("stay_participants")
    .delete()
    .eq("stay_id", stayId);

  if (deleteParticipantsError) {
    return {
      status: "error",
      message: "Teilnehmende konnten nicht aktualisiert werden.",
    };
  }

  const { error: insertParticipantsError } = await supabase
    .from("stay_participants")
    .insert(
      participantIds.map((profileId) => ({
        stay_id: stayId,
        profile_id: profileId,
      })),
    );

  if (insertParticipantsError) {
    return {
      status: "error",
      message: "Teilnehmende konnten nicht gespeichert werden.",
    };
  }

  revalidatePath("/calendar");

  return {
    status: "success",
    message: "Aufenthalt aktualisiert.",
  };
}

async function deleteStay(formData: FormData): Promise<CreateStayActionState> {
  await requireUser();

  const stayId = getString(formData, "stay_id");

  if (!stayId) {
    return {
      status: "error",
      message: "Der Aufenthalt konnte nicht gefunden werden.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("stays")
    .delete()
    .eq("id", stayId)
    .select("id")
    .single();

  if (error) {
    return {
      status: "error",
      message: "Der Aufenthalt konnte nicht gelöscht werden.",
    };
  }

  revalidatePath("/calendar");

  return {
    status: "success",
    message: "Aufenthalt gelöscht.",
  };
}

async function saveProfile(formData: FormData): Promise<CreateStayActionState> {
  const user = await requireUser();
  const fullName = getString(formData, "full_name");
  const displayColor = getString(formData, "display_color");
  const avatarEmoji = getString(formData, "avatar_emoji") || defaultAvatar;

  if (!fullName || !displayColor || !avatarEmoji) {
    return {
      status: "error",
      message: "Bitte Name, Farbe und Emoji auswählen.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? null,
      full_name: fullName,
      display_color: displayColor,
      avatar_emoji: avatarEmoji,
    },
    { onConflict: "id" },
  );

  if (error) {
    return {
      status: "error",
      message: "Profil konnte nicht aktualisiert werden.",
    };
  }

  revalidatePath("/calendar");
  revalidatePath("/settings/profile");

  return {
    status: "success",
    message: "Profil aktualisiert.",
  };
}

export async function loginAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/login?message=Supabase ist noch nicht konfiguriert.");
  }

  const email = getString(formData, "email");
  const password = getString(formData, "password");

  if (!email || !password) {
    redirect("/login?message=Bitte E-Mail und Passwort angeben.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  redirect("/calendar");
}

export async function logoutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/login?message=Abgemeldet.");
}

export async function createStayAction(formData: FormData) {
  const result = await saveStay(formData);
  redirect(`/calendar?message=${encodeURIComponent(result.message)}`);
}

export async function createStayModalAction(
  _previousState: CreateStayActionState,
  formData: FormData,
) {
  return saveStay(formData);
}

export async function updateStayModalAction(
  _previousState: CreateStayActionState,
  formData: FormData,
) {
  return updateStay(formData);
}

export async function deleteStayModalAction(
  _previousState: CreateStayActionState,
  formData: FormData,
) {
  return deleteStay(formData);
}

export async function updateProfileAction(formData: FormData) {
  const result = await saveProfile(formData);
  redirect(`/settings/profile?message=${encodeURIComponent(result.message)}`);
}

export async function updateProfileModalAction(
  _previousState: CreateStayActionState,
  formData: FormData,
) {
  return saveProfile(formData);
}
