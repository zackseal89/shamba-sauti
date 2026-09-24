import { Globe, Headphones, Leaf, Radio, ShieldCheck, Sparkles } from "lucide-react";

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
            <span className="grid size-10 place-items-center rounded-xl bg-leaf text-white shadow-sm">
              <Leaf aria-hidden="true" size={21} strokeWidth={2.2} />
            </span>
            <div>
              <p className="font-display text-xl font-bold leading-none">Shamba Sauti</p>
              <p className="mt-1 text-xs font-medium text-muted">Sauti yako. Shamba lenye afya.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://platform.mymansa.ai/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-leaf transition-colors mr-2"
            >
              <span>Mansa API Docs</span>
              <span className="text-[10px] text-leaf bg-leaf-soft px-1.5 py-0.5 rounded font-mono">v1</span>
            </a>
            <div className="flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-semibold text-muted">
              <Radio
                aria-hidden="true"
                className={provider === "mansa" ? "text-leaf animate-pulse" : "text-ochre"}
                size={14}
              />
              {provider === "mansa" ? "Mansa live API" : "Demo mode"}
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-14">
        <div className="self-start lg:sticky lg:top-8">
          <p className="eyebrow">Msaidizi wa kilimo cha kisasa</p>
          <h1 className="mt-4 max-w-xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            Uliza kuhusu shamba lako.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-muted sm:text-lg">
            Eleza unachoona shambani kwa sauti au maandishi. Utapata mwongozo sahihi wa kukagua mimea yako kwa Kiswahili na Kiingereza, unaotegemea teknolojia ya Mansa AI.
          </p>

          <div className="mt-8 grid gap-4 border-t border-line pt-6 text-sm text-muted sm:grid-cols-2 lg:grid-cols-1">
            <div className="flex items-start gap-3">
              <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-leaf" size={20} />
              <div>
                <strong className="block text-ink">Ushauri salama na wa kuaminika</strong>
                <p className="text-xs leading-5">Hatutoi kipimo cha kemikali bila uchunguzi. Tunapendekeza ukaguzi na maafisa wa ugani.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Headphones aria-hidden="true" className="mt-0.5 shrink-0 text-leaf" size={20} />
              <div>
                <strong className="block text-ink">Sauti asili ya Afrika Mashariki</strong>
                <p className="text-xs leading-5">Inatumia Mansa TTS kutoa majibu yanayoeleweka haraka shambani hata ukiwa na shughuli nyingi.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe aria-hidden="true" className="mt-0.5 shrink-0 text-leaf" size={20} />
              <div>
                <strong className="block text-ink">Tafsiri ya Papo Hapo</strong>
                <p className="text-xs leading-5">Badilisha ushauri kati ya Kiswahili na Kiingereza kwa mbofyo mmoja kupitia Mansa Translate.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles aria-hidden="true" className="mt-0.5 shrink-0 text-leaf" size={20} />
              <div>
                <strong className="block text-ink">Taarifa zilizothibitishwa mtandaoni</strong>
                <p className="text-xs leading-5">Mansa Web Search inakagua vyanzo rasmi kama KALRO, CABI, na Wizara ya Kilimo.</p>
              </div>
            </div>
          </div>
        </div>

        <FarmerAssistant initialProvider={provider} />
      </section>

      <footer className="border-t border-line bg-surface/50 py-6 text-center text-xs text-muted">
        <p>
          Shamba Sauti • Inaendeshwa na{" "}
          <a
            href="https://platform.mymansa.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-leaf hover:underline"
          >
            Mansa AI Platform
          </a>{" "}
          (Chat, Speech, Transcribe, Translate, Web Tools).
        </p>
      </footer>
    </main>
  );
}
