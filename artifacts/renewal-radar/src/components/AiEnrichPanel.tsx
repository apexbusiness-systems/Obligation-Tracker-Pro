import { useState } from "react";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";

export interface AiEnrichResult {
  title: string;
  category: string;
  notes: string;
  suggestedDaysBefore: number;
  ownerName: string;
  ownerEmail: string;
}

interface AiEnrichPanelProps {
  onEnriched: (fields: AiEnrichResult) => void;
  apiBaseUrl?: string;
}

export function AiEnrichPanel({ onEnriched, apiBaseUrl = "" }: AiEnrichPanelProps) {
  const [open, setOpen] = useState(true);
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enriched, setEnriched] = useState(false);

  const handleEnrich = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    setError(null);
    setEnriched(false);

    try {
      const res = await fetch(`${apiBaseUrl}/api/ai/enrich-obligation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rawText }),
      });

      if (res.status === 503) {
        const body = await res.json().catch(() => ({}));
        if ((body as { code?: string }).code === "ai_disabled") {
          setError("AI enrichment is not enabled on this instance.");
          return;
        }
      }

      if (!res.ok) {
        setError("AI enrichment failed. Please fill fields manually.");
        return;
      }

      const data = (await res.json()) as AiEnrichResult;
      setEnriched(true);
      onEnriched(data);
    } catch {
      setError("AI enrichment failed. Please fill fields manually.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#0A0E18",
        border: "1px solid rgba(245,166,35,.35)",
        borderRadius: 14,
        boxShadow: "0 0 20px rgba(245,166,35,.1), 0 2px 12px rgba(0,0,0,.4)",
        overflow: "hidden",
      }}
    >
      {/* Header / toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full px-5 py-3.5 text-left transition-colors"
        style={{
          background: "rgba(245,166,35,.06)",
          borderBottom: open ? "1px solid rgba(245,166,35,.2)" : "none",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-base leading-none"
            style={{ color: "#F5A623", textShadow: "0 0 8px rgba(245,166,35,.5)" }}
          >
            ✨
          </span>
          <span className="text-sm font-semibold" style={{ color: "#F5A623" }}>
            AI Obligation Enrichment
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
            style={{
              background: "rgba(245,166,35,.18)",
              border: "1px solid rgba(245,166,35,.3)",
              color: "#F5A623",
            }}
          >
            Groq
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4" style={{ color: "#4A5568" }} />
        ) : (
          <ChevronDown className="w-4 h-4" style={{ color: "#4A5568" }} />
        )}
      </button>

      {/* Body */}
      {open && (
        <div className="px-5 py-4 space-y-3">
          <p className="text-xs" style={{ color: "#4A5568" }}>
            Describe your obligation in plain language and let AI extract the title, category, owner, and notes automatically.
          </p>

          <textarea
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              if (enriched) setEnriched(false);
              if (error) setError(null);
            }}
            rows={4}
            placeholder="Paste or type a description of your obligation — contract clause, permit requirement, renewal notice, etc."
            disabled={loading}
            className="w-full rounded-xl text-sm resize-none transition-colors"
            style={{
              background: "#0F1524",
              border: "1px solid rgba(255,255,255,.1)",
              color: "#F0F4F8",
              padding: "10px 14px",
              outline: "none",
              caretColor: "#F5A623",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(245,166,35,.5)";
              e.currentTarget.style.boxShadow = "0 0 0 2px rgba(245,166,35,.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,.1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />

          {/* Error message */}
          {error && (
            <div
              className="text-xs px-3 py-2 rounded-lg"
              style={{
                background: "rgba(255,64,64,.1)",
                border: "1px solid rgba(255,64,64,.25)",
                color: "#FF6060",
              }}
            >
              {error}
            </div>
          )}

          {/* Success message */}
          {enriched && !error && (
            <div
              className="text-xs px-3 py-2 rounded-lg"
              style={{
                background: "rgba(0,230,118,.08)",
                border: "1px solid rgba(0,230,118,.2)",
                color: "#00E676",
              }}
            >
              Fields populated from AI — review and adjust as needed.
            </div>
          )}

          {/* Action row */}
          <div className="flex items-center justify-between">
            <span className="text-[11px]" style={{ color: "#4A5568" }}>
              Powered by Groq · fields are editable after enrichment
            </span>
            <button
              type="button"
              onClick={handleEnrich}
              disabled={loading || !rawText.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: loading || !rawText.trim() ? "rgba(245,166,35,.3)" : "#F5A623",
                color: "#0F0800",
                border: "1px solid transparent",
                boxShadow: loading || !rawText.trim() ? "none" : "0 0 14px rgba(245,166,35,.25)",
              }}
              onMouseEnter={(e) => {
                if (!loading && rawText.trim()) {
                  e.currentTarget.style.filter = "brightness(1.1)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "";
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Enriching…
                </>
              ) : (
                <>
                  <span>✨</span>
                  Enrich with AI
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
