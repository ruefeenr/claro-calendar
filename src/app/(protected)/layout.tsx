import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/auth";
import { getCurrentProfile } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/env";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const configured = isSupabaseConfigured();
  const user = await getCurrentUser();
  const currentProfile = await getCurrentProfile(user);

  return (
    <AppShell
      currentProfile={currentProfile}
      setupMode={!configured || !user}
      title="Casa Claro"
    >
      {children}
    </AppShell>
  );
}
