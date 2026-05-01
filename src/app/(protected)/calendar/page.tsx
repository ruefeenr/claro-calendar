import { format } from "date-fns";

import { CalendarMonthView } from "@/components/calendar-month-view";
import { getCurrentUser } from "@/lib/auth";
import { CALENDAR_VISIBLE_MONTHS, parseMonthParam } from "@/lib/calendar";
import { getProfiles, getStaysForMonth } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/env";

type CalendarPageProps = {
  searchParams: Promise<{ month?: string; message?: string }>;
};

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const params = await searchParams;
  const month = parseMonthParam(params.month);
  const user = await getCurrentUser();
  const profiles = await getProfiles(user);
  const stays = await getStaysForMonth(month, user, CALENDAR_VISIBLE_MONTHS);
  const configured = isSupabaseConfigured();

  return (
    <div className="space-y-6">
      {!configured ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
          <p className="font-semibold">Demo-Modus aktiv.</p>
          <p className="mt-2">
            Sobald du Supabase verbunden hast, werden Login, Profile und echte
            Familieneinträge aktiviert.
          </p>
        </div>
      ) : null}

      <CalendarMonthView
        currentProfileId={user?.id}
        initialMessage={params.message}
        month={format(month, "yyyy-MM-dd")}
        profiles={profiles}
        stays={stays}
      />
    </div>
  );
}
