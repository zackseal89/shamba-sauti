import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Globe,
  Languages,
  LoaderCircle,
  Search,
  Square,
  Stethoscope,
  Volume2,
} from "lucide-react";

import type { AgriculturalAnswer, Language } from "@/lib/contracts";

type AnswerPanelProps = {
  answer: AgriculturalAnswer;
  language: Language;
  onSpeak: () => void;
  audioState?: "idle" | "loading" | "playing";
  onTranslate?: () => void;
  isTranslating?: boolean;
  showingTranslated?: boolean;
};

export function AnswerPanel({
  answer,
  language,
  onSpeak,
  audioState = "idle",
  onTranslate,
  isTranslating = false,
  showingTranslated = false,
}: AnswerPanelProps) {
  const isSwahili = language === "sw";

  const labels = isSwahili
    ? {
        eyebrow: "Ushauri wa Shamba Sauti",
        causes: "Sababu zinazowezekana",
        checks: "Vitu vya kuangalia shambani",
        actions: "Hatua za kuchukua haraka",
        listen: audioState === "playing" ? "Simamisha sauti" : "Sikiliza ushauri kwa sauti",
        loadingAudio: "Inatayarisha sauti...",
        note: "Tahadhari Muhimu",
        escalateTitle: "Wakati wa Kuita Afisa wa Kilimo",
        sources: "Vyanzo vilivyothibitishwa mtandaoni",
        translateBtn: showingTranslated
          ? "Onyesha kwa Kiswahili"
          : "Tafsiri kwa Kiingereza (English)",
        translating: "Inatafsiri...",
      }
    : {
        eyebrow: "Shamba Sauti Guidance",
        causes: "Possible causes",
        checks: "What to inspect in the field",
        actions: "Immediate steps to take",
        listen: audioState === "playing" ? "Stop audio" : "Listen to answer",
        loadingAudio: "Preparing audio...",
        note: "Important Caution",
        escalateTitle: "Professional Escalation",
        sources: "Verified Online Sources",
        translateBtn: showingTranslated
          ? "Show original English"
          : "Tafsiri kwa Kiswahili (Swahili)",
        translating: "Translating...",
      };

  return (
    <section aria-labelledby="answer-title" className="mt-7 border-t border-line pt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow">{labels.eyebrow}</span>
            {showingTranslated && (
              <span className="rounded-md bg-leaf-soft px-2 py-0.5 text-[11px] font-semibold text-leaf-dark">
                {isSwahili ? "Imetafsiriwa kwa Kiswahili" : "Translated to English"}
              </span>
            )}
          </div>
          <h2 id="answer-title" className="mt-2 font-display text-2xl font-bold leading-snug sm:text-3xl">
            {answer.summary}
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start pt-1">
          {onTranslate && (
            <button
              type="button"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-leaf hover:bg-leaf-soft hover:text-leaf-dark disabled:opacity-50"
              onClick={onTranslate}
              disabled={isTranslating}
              aria-label={labels.translateBtn}
              title={labels.translateBtn}
            >
              {isTranslating ? (
                <>
                  <LoaderCircle className="animate-spin text-leaf" size={15} />
                  <span>{labels.translating}</span>
                </>
              ) : (
                <>
                  <Languages size={15} className="text-leaf" />
                  <span>{labels.translateBtn}</span>
                </>
              )}
            </button>
          )}

          <button
            className={`icon-button ${audioState === "playing" ? "border-leaf bg-leaf text-white ring-4 ring-leaf/20" : ""}`}
            type="button"
            onClick={onSpeak}
            disabled={audioState === "loading"}
            aria-label={labels.listen}
            title={labels.listen}
          >
            {audioState === "loading" ? (
              <LoaderCircle className="animate-spin text-leaf" size={19} />
            ) : audioState === "playing" ? (
              <Square size={16} fill="currentColor" />
            ) : (
              <Volume2 aria-hidden="true" size={20} />
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6">
        <AnswerList icon={<Stethoscope size={18} className="text-leaf" />} title={labels.causes} items={answer.likelyCauses} />
        <AnswerList icon={<Search size={18} className="text-leaf" />} title={labels.checks} items={answer.checks} />
        <AnswerList icon={<CheckCircle2 size={18} className="text-leaf" />} title={labels.actions} items={answer.actions} numbered />
      </div>

      <div className="mt-6 rounded-xl border-l-4 border-ochre bg-ochre-soft p-4">
        <p className="flex items-center gap-2 text-sm font-bold text-ink">
          <AlertTriangle aria-hidden="true" size={18} className="text-ochre shrink-0" />
          {labels.note}
        </p>
        <p className="mt-1.5 text-sm leading-6 text-muted">{answer.caution}</p>
      </div>

      <div className="mt-4 rounded-xl border border-leaf/20 bg-leaf-soft/50 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-leaf-dark">
          {labels.escalateTitle}
        </p>
        <p className="mt-1 text-sm font-medium leading-6 text-leaf-dark">
          {answer.escalation}
        </p>
      </div>

      {answer.sources && answer.sources.length > 0 && (
        <div className="mt-6 rounded-xl border border-line bg-canvas/60 p-4">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
            <Globe size={14} className="text-leaf" />
            {labels.sources}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {answer.sources.map((url, i) => {
              let domain = url;
              try {
                domain = new URL(url).hostname.replace(/^www\./, "");
              } catch {
                domain = url;
              }
              return (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1 text-xs font-medium text-leaf hover:border-leaf hover:bg-leaf-soft"
                >
                  <span className="truncate max-w-[200px]">{domain}</span>
                  <ExternalLink size={12} className="opacity-70 shrink-0" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

function AnswerList({
  icon,
  title,
  items,
  numbered = false,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  numbered?: boolean;
}) {
  const List = numbered ? "ol" : "ul";
  return (
    <div className="rounded-xl border border-line bg-canvas/30 p-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
        {icon}
        {title}
      </h3>
      <List className={`mt-3 space-y-2 pl-6 text-sm leading-6 text-muted ${numbered ? "list-decimal" : "list-disc"}`}>
        {items.map((item) => (
          <li key={item} className="pl-1">
            {item}
          </li>
        ))}
      </List>
    </div>
  );
}
