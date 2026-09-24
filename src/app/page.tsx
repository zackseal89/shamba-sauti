import { Leaf, Radio, ShieldCheck } from "lucide-react";

import { FarmerAssistant } from "@/components/farmer-assistant/farmer-assistant";
import { selectProviderMode } from "@/lib/providers/provider";

export default function Home() {
  const provider = selectProviderMode({
    provider: process.env.MANSA_PROVIDER,
    apiKey: process.env.MANSA_API_KEY,
  });

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-leaf text-white">
              <Leaf aria-hidden="true" size={21} strokeWidth={2.2} />
            </span>
            <div>
              <p className="font-display text-xl font-bold leading-none">Shamba Sauti</p>
              <p className="mt-1 text-xs font-medium text-muted">Sauti yako. Shamba lenye afya.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-semibold text-muted">
            <Radio aria-hidden="true" className={provider === "mansa" ? "text-leaf" : "text-ochre"} size={14} />
            {provider === "mansa" ? "Mansa live" : "Demo mode"}
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-14">
        <div className="self-start lg:sticky lg:top-8">
          <p className="eyebrow">Msaidizi wa mkulima</p>
          <h1 className="mt-4 max-w-xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            Uliza kuhusu shamba lako.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-muted sm:text-lg">
            Eleza unachoona kwa sauti au maandishi. Utapata hatua rahisi za kukagua zao lako kwa Kiswahili au English.
          </p>

          <div className="mt-8 grid gap-3 border-t border-line pt-6 text-sm text-muted sm:grid-cols-2 lg:grid-cols-1">
            <div className="flex items-start gap-3">
              <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-leaf" size={20} />
              <p><strong className="text-ink">Ushauri salama.</strong> Hatutoi kipimo cha kemikali bila uchunguzi wa eneo lako.</p>
            </div>
            <div className="flex items-start gap-3">
              <Radio aria-hidden="true" className="mt-0.5 shrink-0 text-leaf" size={20} />
              <p><strong className="text-ink">Rahisi kusikiliza.</strong> Majibu yanaweza kusomwa kwa sauti.</p>
            </div>
          </div>
        </div>

        <FarmerAssistant initialProvider={provider} />
      </section>
    </main>
  );
}
