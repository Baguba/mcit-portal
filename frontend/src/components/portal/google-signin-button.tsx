"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useApp, type SessionUser } from "@/lib/store";

/// Google Identity Services — renders the official "Continue with Google" button.
/// The callback receives the ID token (JWT credential) and forwards it to the
/// backend, which verifies it and creates/refreshes the session.

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            prompt_parent_id?: string;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: string;
              theme?: string;
              size?: string;
              text?: string;
              shape?: string;
              logo_alignment?: string;
              width?: number;
              locale?: string;
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const GOOGLE_GSI_SRC = "https://accounts.google.com/gsi/client";

function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GOOGLE_GSI_SRC}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Google script")));
      return;
    }
    const script = document.createElement("script");
    script.src = GOOGLE_GSI_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google script"));
    document.head.appendChild(script);
  });
}

export function GoogleSignInButton({ onSuccess }: { onSuccess: (user: SessionUser) => void }) {
  const lang = useApp((s) => s.lang);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const buttonRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const callbackRef = useRef(onSuccess);

  useEffect(() => {
    callbackRef.current = onSuccess;
  }, [onSuccess]);

  const handleCredential = useCallback(async (response: { credential: string }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      const contentType = res.headers.get("content-type");
      const data = contentType && contentType.includes("application/json")
        ? await res.json()
        : null;

      if (!res.ok) {
        throw new Error(data?.error || "Google sign-in failed");
      }

      callbackRef.current(data.user as SessionUser);
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Google sign-in failed";
      toast.error(msg);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!clientId) return;

    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        if (cancelled || !buttonRef.current || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredential,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
          logo_alignment: "center",
          width: 320,
          locale: lang === "am" ? "am" : lang === "om" ? "om" : "en",
        });
      })
      .catch((err) => {
        console.error("Google Identity Services failed to load:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [clientId, lang, handleCredential]);

  if (!clientId) {
    return null;
  }

  return (
    <div className="relative flex justify-center">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-background/60">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden />
        </div>
      )}
      <div ref={buttonRef} className="w-full flex justify-center" />
    </div>
  );
}
