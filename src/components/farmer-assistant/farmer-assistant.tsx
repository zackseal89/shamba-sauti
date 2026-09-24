"use client";

import { type FormEvent, useState } from "react";
import { ArrowUp, CircleAlert, LoaderCircle, Mic, Sparkles } from "lucide-react";

import { AnswerPanel } from "@/components/farmer-assistant/answer-panel";
import { useAudioRecorder } from "@/components/farmer-assistant/use-audio-recorder";
import type { AgriculturalAnswer, Crop, Language, ProviderMode } from "@/lib/contracts";

const samples: Record<Language, string> = {
  sw: "Majani ya mahindi yangu yanageuka manjano. Nifanye nini?",
  en: "My maize leaves are turning yellow. What should I do?",
};

const copy = {
  sw: { crop: "Zao", question: "Unaona nini shambani?", placeholder: "Eleza dalili, zilipoanza, na sehemu ya mmea...", sample: "Tumia swali la mfano", submit: "Pata ushauri", thinking: "Ninachunguza...", error: "Samahani, hatukuweza kupata jibu. Jaribu tena.", micError: "Kipaza sauti hakipatikani. Endelea kwa kuandika swali lako.", recording: "Simamisha kurekodi", record: "Rekodi swali kwa sauti", transcribing: "Ninatafsiri sauti...", crops: { maize: "Mahindi", beans: "Maharagwe", tomatoes: "Nyanya" } },
  en: { crop: "Crop", question: "What do you see in the field?", placeholder: "Describe the symptoms, when they began, and the affected part...", sample: "Use sample question", submit: "Get guidance", thinking: "Checking...", error: "We could not get an answer. Please try again.", micError: "The microphone is unavailable. You can continue by typing your question.", recording: "Stop recording", record: "Record a voice question", transcribing: "Transcribing voice...", crops: { maize: "Maize", beans: "Beans", tomatoes: "Tomatoes" } },
};

export function FarmerAssistant({ initialProvider }: { initialProvider: ProviderMode }) {
  const [language, setLanguage] = useState<Language>("sw");
  const [crop, setCrop] = useState<Crop>("maize");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<AgriculturalAnswer | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [provider, setProvider] = useState(initialProvider);
  const labels = copy[language];
  const recorder = useAudioRecorder({ language, onTranscript: setQuestion, onProvider: setProvider });

  async function submitQuestion(event: FormEvent) {
    event.preventDefault();
    if (question.trim().length < 4) return;
    setStatus("loading");
    setAnswer(null);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop, language, message: question }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      setAnswer(body.answer);
      setProvider(body.provider);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  function playBrowserSpeech(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "sw" ? "sw-KE" : "en-KE";
    window.speechSynthesis.speak(utterance);
  }

  async function speakAnswer() {
    if (!answer) return;
    const text = [answer.summary, ...answer.checks, ...answer.actions, answer.caution, answer.escalation].join(". ");
    if (provider === "mock") return playBrowserSpeech(text);

    try {
      const response = await fetch("/api/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language }),
      });
      if (!response.ok) throw new Error("Speech unavailable");
      const audioUrl = URL.createObjectURL(await response.blob());
      const audio = new Audio(audioUrl);
      audio.addEventListener("ended", () => URL.revokeObjectURL(audioUrl), { once: true });
      await audio.play();
    } catch {
      playBrowserSpeech(text);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-card sm:p-7">
      <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="text-sm font-bold">Mazungumzo mapya</p>
          <p className="mt-1 text-xs text-muted">{provider === "mansa" ? "Inaendeshwa na Mansa AI" : "Mfano salama wa majaribio"}</p>
        </div>
        <div className="segmented" aria-label="Language">
          {(["sw", "en"] as Language[]).map((item) => (
            <button key={item} type="button" aria-pressed={language === item} onClick={() => setLanguage(item)}>{item === "sw" ? "Kiswahili" : "English"}</button>
          ))}
        </div>
      </div>

      <form className="mt-6" onSubmit={submitQuestion}>
        <fieldset>
          <legend className="label">{labels.crop}</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["maize", "beans", "tomatoes"] as Crop[]).map((item) => (
              <button key={item} type="button" className="choice-button" aria-pressed={crop === item} onClick={() => setCrop(item)}>{labels.crops[item]}</button>
            ))}
          </div>
        </fieldset>

        <label className="label mt-6 block" htmlFor="farmer-question">{labels.question}</label>
        <div className="question-box mt-2">
          <textarea id="farmer-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={labels.placeholder} rows={5} maxLength={8000} />
          <div className="flex items-center justify-between border-t border-line px-3 py-2">
            <button className="text-button" type="button" onClick={() => setQuestion(samples[language])}><Sparkles aria-hidden="true" size={15} />{labels.sample}</button>
            <button
              className={`icon-button ${recorder.status === "recording" ? "recording" : ""}`}
              type="button"
              onClick={recorder.toggleRecording}
              disabled={recorder.status === "transcribing"}
              aria-label={recorder.status === "recording" ? labels.recording : labels.record}
              title={recorder.status === "recording" ? labels.recording : labels.record}
            >
              {recorder.status === "transcribing" ? <LoaderCircle className="animate-spin" aria-hidden="true" size={19} /> : <Mic aria-hidden="true" size={19} />}
            </button>
          </div>
        </div>

        {recorder.status === "recording" && <p role="status" className="mt-3 text-sm font-semibold text-danger">● {labels.recording}</p>}
        {recorder.status === "transcribing" && <p role="status" className="mt-3 text-sm font-medium text-muted">{labels.transcribing}</p>}
        {recorder.status === "error" && <p role="alert" className="mt-3 flex items-center gap-2 text-sm font-medium text-danger"><CircleAlert aria-hidden="true" size={17} />{labels.micError}</p>}
        {status === "error" && <p role="alert" className="mt-3 flex items-center gap-2 text-sm font-medium text-danger"><CircleAlert aria-hidden="true" size={17} />{labels.error}</p>}

        <button className="primary-button mt-4" type="submit" disabled={status === "loading" || question.trim().length < 4}>
          {status === "loading" ? <><LoaderCircle className="animate-spin" aria-hidden="true" size={18} />{labels.thinking}</> : <>{labels.submit}<ArrowUp aria-hidden="true" size={18} /></>}
        </button>
      </form>

      <div aria-live="polite">
        {answer && <AnswerPanel answer={answer} language={language} onSpeak={speakAnswer} />}
      </div>
    </div>
  );
}
