const infoSections = [
  {
    title: "Heizung",
    description:
      "Hier kannst du festhalten, wie die Heizung eingestellt wird, welche Modi sinnvoll sind und worauf bei der Abreise geachtet werden soll.",
    items: [
      "Anleitung zum Einschalten ergänzen.",
      "Empfohlene Temperatur ergänzen.",
      "Abreise-Einstellung ergänzen.",
    ],
  },
  {
    title: "Schlüssel",
    description:
      "Hier ist Platz für Informationen zum Schlüssel, Schlüsseldepot oder zur Übergabe.",
    items: [
      "Ort des Schlüssels ergänzen.",
      "Code oder Vorgehen ergänzen.",
      "Hinweis zur Rückgabe ergänzen.",
    ],
  },
  {
    title: "Telefonnummern",
    description:
      "Wichtige Kontakte für Notfälle, Nachbarn, Verwaltung oder Handwerker.",
    items: [
      "Notfallkontakt ergänzen.",
      "Kontakt vor Ort ergänzen.",
      "Weitere wichtige Nummern ergänzen.",
    ],
  },
  {
    title: "Sonstiges",
    description:
      "Weitere praktische Hinweise für den Aufenthalt in Casa Claro.",
    items: [
      "WLAN-Informationen ergänzen.",
      "Abfall/Entsorgung ergänzen.",
      "Checkliste für Abreise ergänzen.",
    ],
  },
];

export default function InfoPage() {
  return (
    <section className="space-y-6">
      <div className="ticino-soft-card rounded-3xl border p-5 sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c3f24]">
          Hausinfos
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
          Infos zu Casa Claro
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-stone-600">
          Sammle hier die wichtigsten Hinweise für alle, die im Haus sind.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {infoSections.map((section) => (
          <article
            className="ticino-card rounded-3xl border p-5 shadow-sm"
            key={section.title}
          >
            <h3 className="text-xl font-semibold text-stone-900">{section.title}</h3>
            <p className="mt-2 text-sm text-stone-600">{section.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-stone-700">
              {section.items.map((item) => (
                <li className="rounded-2xl bg-stone-50 px-4 py-2" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
