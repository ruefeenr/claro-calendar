import Link from "next/link";
import type { ReactNode } from "react";

import { logoutAction } from "@/app/actions";
import { ProfileModalTrigger } from "@/components/profile-modal-trigger";
import type { Profile } from "@/lib/types";

type AppShellProps = {
  currentProfile?: Profile | null;
  title: string;
  subtitle?: string;
  setupMode?: boolean;
  children: ReactNode;
};

export function AppShell({
  currentProfile,
  title,
  subtitle,
  setupMode = false,
  children,
}: AppShellProps) {
  return (
    <div className="ticino-shell min-h-screen text-stone-900">
      <header className="border-b border-amber-900/10 bg-[#fff7ed]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div className="min-w-0">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#7c3f24]">
              Claro Calendar
            </p>
            <div className="mt-1 flex min-w-0 items-center gap-3">
              <h1 className="truncate text-2xl font-semibold">{title}</h1>
            </div>
            {subtitle ? (
              <p className="mt-1 text-sm text-stone-600">{subtitle}</p>
            ) : null}
          </div>

          <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
            <Link
              className="rounded-full px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-amber-100/70"
              href="/calendar"
            >
              Kalender
            </Link>
            {!setupMode ? <ProfileModalTrigger profile={currentProfile ?? null} /> : null}

            {!setupMode ? (
              <form action={logoutAction}>
                <button
                  className="rounded-full bg-[#2b211c] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#7c3f24]"
                  type="submit"
                >
                  Logout
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
