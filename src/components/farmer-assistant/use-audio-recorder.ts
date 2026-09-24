"use client";

import { useRef, useState } from "react";

import type { Language, ProviderMode } from "@/lib/contracts";

type RecorderStatus = "idle" | "recording" | "transcribing" | "error";

export function useAudioRecorder({
  language,
  onTranscript,
  onProvider,
}: {
  language: Language;
  onTranscript: (value: string) => void;
  onProvider: (value: ProviderMode) => void;
}) {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const startedAtRef = useRef(0);

  async function toggleRecording() {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks: Blob[] = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      startedAtRef.current = Date.now();

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setStatus("transcribing");
        try {
          const audio = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
          const form = new FormData();
          form.set("audio", audio, "question.webm");
          form.set("language", language);
          form.set("durationSeconds", String(Math.max(1, (Date.now() - startedAtRef.current) / 1000)));
          const response = await fetch("/api/transcribe", { method: "POST", body: form });
          const body = await response.json();
          if (!response.ok) throw new Error(body.error);
          onTranscript(body.transcript);
          onProvider(body.provider);
          setStatus("idle");
        } catch {
          setStatus("error");
        }
      };

      recorder.start();
      setStatus("recording");
    } catch {
      setStatus("error");
    }
  }

  return { status, toggleRecording };
}
