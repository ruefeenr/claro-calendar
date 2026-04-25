import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";

export default async function HomePage() {
  if (!isSupabaseConfigured()) {
    redirect("/calendar");
  }

  const user = await getCurrentUser();
  redirect(user ? "/calendar" : "/login");
}
