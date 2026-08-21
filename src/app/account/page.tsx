"use client";

import { useState } from "react";
import Link from "next/link";
import { WatchDial } from "@/components/three/WatchDial";
import { iconWatch } from "@/lib/products";
import { CheckIcon } from "@/components/ui/icons";

type Mode = "login" | "signup" | "forgot";

export default function AccountPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const title = mode === "login" ? "Welcome back" : mode === "signup" ? "Join the Maison" : "Reset your access";
  const sub =
    mode === "login"
      ? "Sign in to your private client account."
      : mode === "signup"
      ? "Create an account for private previews and priority access."
      : "Enter your email and we will send a reset link.";

  return (
    <div className="grid min-h-screen grid-cols-1 pt-20 lg:grid-cols-2">
      {/* visual panel */}
      <aside className="relative hidden overflow-hidden border-r border-line bg-bg-2 lg:block">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(50% 50% at 50% 45%, var(--hero-glow), transparent 70%)" }}
        />
        <div className="relative flex h-full flex-col justify-between p-14">
          <p className="font-display text-3xl tracking-[0.3em] pl-[0.3em]">MERIDIAN</p>
          <div className="mx-auto w-[62%] max-w-sm">
            <WatchDial mat={iconWatch.variants[0].three} dialType={iconWatch.dialType} className="h-full w-full drop-shadow-2xl" />
          </div>
          <div>
            <p className="font-display text-4xl leading-tight">
              Precision is <span className="gold-text italic">personal.</span>
            </p>
            <p className="mt-4 max-w-sm text-sm text-muted">
              Members enjoy private previews, priority allocation and a dedicated advisor.
            </p>
          </div>
        </div>
      </aside>

      {/* form panel */}
      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {/* tabs */}
          <div className="mb-10 flex gap-2 rounded-full border border-line p-1 text-sm">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setSent(false);
                }}
                className={`relative flex-1 rounded-full py-2.5 transition-colors duration-500 ${
                  mode === m ? "text-accent-ink" : "text-muted hover:text-text"
                }`}
              >
                {mode === m && (
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{ background: "linear-gradient(120deg,var(--accent),var(--accent-2))" }}
                  />
                )}
                <span className="relative">{m === "login" ? "Sign In" : "Create Account"}</span>
              </button>
            ))}
          </div>

          <h1 className="font-display text-4xl font-light">{title}</h1>
          <p className="mt-2 text-sm text-muted">{sub}</p>

          {sent ? (
            <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-line bg-bg-2 p-10 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full border border-accent text-accent">
                <CheckIcon className="h-7 w-7" />
              </div>
              <p className="font-display text-2xl">
                {mode === "forgot" ? "Check your inbox" : mode === "signup" ? "Account created" : "Signed in"}
              </p>
              <p className="text-sm text-muted">Demo only — no real account or email is involved.</p>
              <button
                onClick={() => {
                  setSent(false);
                  setMode("login");
                }}
                className="btn btn-ghost mt-2"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
              {mode === "signup" && <Field label="Full name" name="name" type="text" />}
              <Field label="Email" name="email" type="email" />
              {mode !== "forgot" && <Field label="Password" name="password" type="password" />}
              {mode === "signup" && <Field label="Confirm password" name="confirm" type="password" />}

              {mode === "login" && (
                <button type="button" onClick={() => setMode("forgot")} className="self-end text-xs text-muted hover:text-accent">
                  Forgot password?
                </button>
              )}

              <button type="submit" className="btn btn-gold mt-2 w-full">
                {mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
              </button>

              {mode === "forgot" && (
                <button type="button" onClick={() => setMode("login")} className="text-center text-xs text-muted hover:text-accent">
                  Return to sign in
                </button>
              )}
            </form>
          )}

          <p className="mt-10 text-center text-xs text-faint">
            Demo authentication UI · <Link href="/" className="text-accent hover:underline">Return home</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

function Field({ label, name, type }: { label: string; name: string; type: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="eyebrow text-[0.58rem]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        className="border-b border-line-strong bg-transparent py-2.5 text-text outline-none transition-colors focus:border-accent"
      />
    </div>
  );
}
