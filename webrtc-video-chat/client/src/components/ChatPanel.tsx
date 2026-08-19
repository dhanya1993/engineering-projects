import { useState } from "react";
import type { FormEvent } from "react";
import type { ChatMessage } from "../types";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
}

export function ChatPanel({ messages, onSend }: ChatPanelProps) {
  const [draft, setDraft] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    onSend(draft);
    setDraft("");
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-onyx-700 bg-onyx-900">
      <div className="border-b border-onyx-700 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-onyx-400">
          Chat (WebRTC data channel)
        </p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <p className="text-sm text-onyx-500">
            Messages here travel peer-to-peer over a data channel — not through the server.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.from === "me" ? "text-right" : "text-left"}>
            <span
              className={[
                "inline-block max-w-[85%] rounded-lg px-3 py-1.5 text-sm",
                m.from === "me" ? "bg-wave-500 text-white" : "bg-onyx-700 text-onyx-100"
              ].join(" ")}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-onyx-700 p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 rounded-md border border-onyx-600 bg-onyx-800 px-3 py-2 text-sm text-onyx-100 placeholder:text-onyx-500 focus:border-wave-500 focus:outline-none focus:ring-2 focus:ring-wave-500/30"
        />
        <button
          type="submit"
          className="rounded-md bg-wave-500 px-3 py-2 text-sm font-medium text-white hover:bg-wave-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}
