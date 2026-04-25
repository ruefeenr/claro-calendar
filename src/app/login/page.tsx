import Link from "next/link";

import { loginAction } from "@/app/actions";
import { StatusMessage } from "@/components/status-message";
import { isSupabaseConfigured } from "@/lib/env";

type LoginPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-6 py-16">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] bg-stone-900 p-8 text-white shadow-xl">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-stone-300">
            Claro Calendar
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight">
            Privater Familienkalender für Aufenthalte in Claro.
          </h1>
          <p className="mt-4 max-w-xl text-base text-stone-300">
            Jede Person hat ihr eigenes Profil. Aufenthalte können mit mehreren
            Familienmitgliedern geplant werden, damit ihr schnell seht, wer wann im
            Ferienhaus ist.
          </p>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">MVP-Fokus</h2>
            <ul className="mt-4 space-y-3 text-sm text-stone-300">
              <li>Geschützter Zugang nur für eingeladene Familienmitglieder</li>
              <li>Monatsansicht mit klarer Belegung pro Tag</li>
              <li>Einträge mit mehreren Personen und kurzer Notiz</li>
              <li>Profilfarbe pro Person für bessere Lesbarkeit</li>
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-stone-900">Anmeldung</h2>
          <p className="mt-2 text-sm text-stone-600">
            Melde dich mit deinem Familienkonto an.
          </p>

          <div className="mt-6">
            <StatusMessage message={params.message} />
          </div>

          {configured ? (
            <form action={loginAction} className="mt-6 space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-stone-700">E-Mail</span>
                <input
                  className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900"
                  name="email"
                  placeholder="familie@example.com"
                  required
                  type="email"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-stone-700">Passwort</span>
                <input
                  className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900"
                  name="password"
                  required
                  type="password"
                />
              </label>

              <button
                className="w-full rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
                type="submit"
              >
                Einloggen
              </button>
            </form>
          ) : (
            <div className="mt-6 space-y-4 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
              <p className="font-semibold">Supabase noch nicht verbunden.</p>
              <p>
                Die App zeigt bis zur Konfiguration Demo-Daten an. Hinterlege zuerst
                die Werte aus <code>.env.example</code> in einer lokalen{" "}
                <code>.env.local</code>.
              </p>
              <p>
                Danach kannst du über Supabase fünf Familienkonten anlegen und
                dich hier normal anmelden.
              </p>
              <Link
                className="inline-flex rounded-full bg-stone-900 px-4 py-2 font-medium text-white"
                href="/calendar"
              >
                Demo-Kalender ansehen
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
