export type Concept = {
  id: string;
  title: string;
  source: string;
  status: "pending" | "accepted" | "rejected";
  campaign: string;
  imgSeed: string;
  img?: string;
};

export type AgentRun = {
  id: string;
  label: string;
  time: string;
  seen: boolean;
  concepts: Concept[];
};

export const agentRuns: AgentRun[] = [
  {
    id: "manual-image-pipeline-1",
    label: "Manual Image Pipeline",
    time: "Mar 20, 2026 · 15:11",
    seen: false,
    concepts: [
      { id: "c1", title: "What if your soap was your deodorant?", source: "Manual Upload", status: "accepted", campaign: "Spring Fresh", imgSeed: "soap-deodorant", img: "/concepts/concept-1.avif" },
      { id: "c2", title: "The art of 3-in-1 freshness.", source: "Manual Upload", status: "pending", campaign: "Spring Fresh", imgSeed: "art-freshness", img: "/concepts/concept-2.avif" },
      { id: "c3", title: "Stop odor at the source, gently.", source: "Manual Upload", status: "pending", campaign: "Spring Fresh", imgSeed: "stop-odor", img: "/concepts/concept-3.avif" },
    ],
  },
  {
    id: "manual-image-pipeline-2",
    label: "Manual Image Pipeline",
    time: "Mar 20, 2026 · 14:59",
    seen: false,
    concepts: [
      { id: "c20", title: "Deodorize, cleanse, and hydrate in one step.", source: "Manual Upload", status: "pending", campaign: "Morning Routine", imgSeed: "deodorize-cleanse", img: "/concepts/concept-4.avif" },
      { id: "c21", title: "Minimalist 3-in-1 routine.", source: "Manual Upload", status: "accepted", campaign: "Morning Routine", imgSeed: "minimalist-routine", img: "/concepts/concept-5.avif" },
      { id: "c22", title: "Stop masking odor. Eliminate bacteria.", source: "Manual Upload", status: "pending", campaign: "Morning Routine", imgSeed: "stop-masking", img: "/concepts/concept-6.avif" },
    ],
  },
  {
    id: "ai-image-studio-1",
    label: "AI Image Studio",
    time: "Mar 20, 2026 · 13:30",
    seen: false,
    concepts: [
      { id: "c30", title: "Hoe blijf je fris fris tijdens een concert?", source: "AI Studio", status: "accepted", campaign: "Festival Campaign", imgSeed: "concert-fresh" },
      { id: "c31", title: "Van moshpit tot afterparty", source: "AI Studio", status: "pending", campaign: "Festival Campaign", imgSeed: "moshpit-party" },
      { id: "c32", title: "Meer schuim is niet meer zorg.", source: "AI Studio", status: "pending", campaign: "Festival Campaign", imgSeed: "meer-schuim" },
      { id: "c33", title: "Wie zegt dat je schuim nodig hebt?", source: "AI Studio", status: "pending", campaign: "Festival Campaign", imgSeed: "wie-zegt" },
      { id: "c34", title: "Breek de mythe. Voed je hoofdhuid.", source: "AI Studio", status: "rejected", campaign: "Festival Campaign", imgSeed: "breek-mythe" },
      { id: "c35", title: "Frisse oksels, bewezen resultaten", source: "AI Studio", status: "pending", campaign: "Festival Campaign", imgSeed: "frisse-oksels" },
      { id: "c36", title: "Reinigt diep zonder uit te drogen", source: "AI Studio", status: "pending", campaign: "Festival Campaign", imgSeed: "reinigt-diep" },
      { id: "c37", title: "100% actieve, voedende formule", source: "AI Studio", status: "accepted", campaign: "Festival Campaign", imgSeed: "actieve-formule" },
      { id: "c38", title: "Pakt haarverlies aan bij de wortel", source: "AI Studio", status: "pending", campaign: "Festival Campaign", imgSeed: "haarverlies" },
    ],
  },
  {
    id: "ai-image-studio-2",
    label: "AI Image Studio",
    time: "Mar 20, 2026 · 13:30",
    seen: false,
    concepts: [
      { id: "c40", title: "Het succesverhaal: Zweet, geen geur", source: "AI Studio", status: "pending", campaign: "Success Stories", imgSeed: "succesverhaal" },
      { id: "c41", title: "Stop met vechten tegen je huid.", source: "AI Studio", status: "accepted", campaign: "Success Stories", imgSeed: "stop-vechten" },
      { id: "c42", title: "Waarom genoegen nemen met een onvolledige oplossing?", source: "AI Studio", status: "pending", campaign: "Success Stories", imgSeed: "waarom-genoegen" },
      { id: "c43", title: "Zweetzorg [zweet-zorg]", source: "AI Studio", status: "rejected", campaign: "Success Stories", imgSeed: "zweetzorg" },
      { id: "c44", title: "Oy Deo Wash werkt met je huid.", source: "AI Studio", status: "pending", campaign: "Success Stories", imgSeed: "deo-wash" },
      { id: "c45", title: "Na 8 dagen geurvrij", source: "AI Studio", status: "accepted", campaign: "Success Stories", imgSeed: "acht-dagen" },
      { id: "c46", title: "Start jouw succesverhaal", source: "AI Studio", status: "pending", campaign: "Success Stories", imgSeed: "start-verhaal" },
      { id: "c47", title: "Was je zorgen weg", source: "AI Studio", status: "pending", campaign: "Success Stories", imgSeed: "zorgen-weg" },
      { id: "c48", title: "96% natuurlijk", source: "AI Studio", status: "pending", campaign: "Success Stories", imgSeed: "natuurlijk" },
    ],
  },
  {
    id: "ai-image-studio-3",
    label: "AI Image Studio",
    time: "Mar 19, 2026 · 10:15",
    seen: true,
    concepts: [
      { id: "c50", title: "Fresh all day, naturally.", source: "AI Studio", status: "pending", campaign: "International", imgSeed: "fresh-all-day" },
      { id: "c51", title: "Your skin deserves better.", source: "AI Studio", status: "accepted", campaign: "International", imgSeed: "skin-deserves" },
      { id: "c52", title: "Clean confidence, zero compromise.", source: "AI Studio", status: "pending", campaign: "International", imgSeed: "clean-confidence" },
      { id: "c53", title: "The science of fresh.", source: "AI Studio", status: "rejected", campaign: "International", imgSeed: "science-fresh" },
    ],
  },
];

export const agentRunsById: Record<string, AgentRun> = Object.fromEntries(
  agentRuns.map((r) => [r.id, r])
);

export const statusDot = { pending: "bg-amber-400", accepted: "bg-emerald-400", rejected: "bg-red-400" };
export const statusBadge = { pending: "bg-amber-50 text-amber-700 border-amber-200", accepted: "bg-emerald-50 text-emerald-700 border-emerald-200", rejected: "bg-red-50 text-red-700 border-red-200" };
