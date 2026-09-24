import { AlertTriangle, CheckCircle2, Search, Stethoscope, Volume2 } from "lucide-react";

import type { AgriculturalAnswer, Language } from "@/lib/contracts";

type AnswerPanelProps = {
  answer: AgriculturalAnswer;
  language: Language;
  onSpeak: () => void;
};

export function AnswerPanel({ answer, language, onSpeak }: AnswerPanelProps) {
  const labels = language === "sw"
    ? { causes: "Kinachoweza kusababisha", checks: "Kagua kwanza", actions: "Hatua za kuchukua", listen: "Sikiliza jibu", note: "Muhimu" }
    : { causes: "Possible causes", checks: "Check first", actions: "Next steps", listen: "Listen to answer", note: "Important" };

  return (
    <section aria-labelledby="answer-title" className="mt-6 border-t border-line pt-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Jibu la Shamba Sauti</p>
          <h2 id="answer-title" className="mt-2 font-display text-2xl font-bold">{answer.summary}</h2>
        </div>
        <button className="icon-button" type="button" onClick={onSpeak} aria-label={labels.listen} title={labels.listen}>
          <Volume2 aria-hidden="true" size={20} />
        </button>
      </div>

      <div className="mt-6 grid gap-5">
        <AnswerList icon={<Stethoscope size={18} />} title={labels.causes} items={answer.likelyCauses} />
        <AnswerList icon={<Search size={18} />} title={labels.checks} items={answer.checks} />
        <AnswerList icon={<CheckCircle2 size={18} />} title={labels.actions} items={answer.actions} numbered />
      </div>

      <div className="mt-6 border-l-4 border-ochre bg-ochre-soft px-4 py-3">
        <p className="flex items-center gap-2 text-sm font-bold text-ink"><AlertTriangle aria-hidden="true" size={17} />{labels.note}</p>
        <p className="mt-1 text-sm leading-6 text-muted">{answer.caution}</p>
      </div>
      <p className="mt-4 text-sm font-medium leading-6 text-leaf-dark">{answer.escalation}</p>
    </section>
  );
}

function AnswerList({ icon, title, items, numbered = false }: { icon: React.ReactNode; title: string; items: string[]; numbered?: boolean }) {
  const List = numbered ? "ol" : "ul";
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-bold text-ink">{icon}{title}</h3>
      <List className={`mt-2 space-y-2 pl-7 text-sm leading-6 text-muted ${numbered ? "list-decimal" : "list-disc"}`}>
        {items.map((item) => <li key={item}>{item}</li>)}
      </List>
    </div>
  );
}
