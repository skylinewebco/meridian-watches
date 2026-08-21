"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { CheckIcon } from "@/components/ui/icons";

const BOUTIQUES = [
  { city: "Geneva", detail: "Rue du Rhône 42" },
  { city: "New York", detail: "Fifth Avenue 720" },
  { city: "Tokyo", detail: "Ginza 4-Chōme" },
  { city: "Dubai", detail: "Dubai Mall, Fashion Ave" },
];

export function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="relative border-t border-line bg-bg-2 py-24 md:py-32">
      <div className="section-pad grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="eyebrow mb-5">Private Client Services</p>
          </Reveal>
          <Reveal y={30}>
            <h2 className="font-display text-[clamp(2.4rem,5vw,4.2rem)] font-light leading-[1.02]">
              Begin a <span className="gold-text italic">conversation.</span>
            </h2>
          </Reveal>
          <Reveal y={24}>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted">
              Request a private viewing, enquire about availability, or speak with a client advisor. Our
              specialists respond within one business day.
            </p>
          </Reveal>

          <Reveal stagger={0.1} y={20} className="mt-12 grid grid-cols-2 gap-8">
            {BOUTIQUES.map((b) => (
              <div key={b.city}>
                <p className="font-display text-2xl text-text">{b.city}</p>
                <p className="mt-1 text-xs text-muted">{b.detail}</p>
              </div>
            ))}
          </Reveal>
        </div>

        {/* form */}
        <Reveal y={30} className="rounded-3xl border border-line bg-bg p-8 md:p-10">
          {sent ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-5 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full border border-accent text-accent">
                <CheckIcon className="h-8 w-8" />
              </div>
              <p className="font-display text-3xl">Thank you.</p>
              <p className="max-w-xs text-sm text-muted">
                Your enquiry has been received. A client advisor will be in touch shortly. (Demo — nothing was sent.)
              </p>
              <button onClick={() => setSent(false)} className="btn btn-ghost mt-2">
                Send another
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="flex flex-col gap-6"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="First name" name="first" />
                <Field label="Last name" name="last" />
              </div>
              <Field label="Email" name="email" type="email" />
              <div className="flex flex-col gap-2">
                <label className="eyebrow text-[0.6rem]">Message</label>
                <textarea
                  rows={4}
                  required
                  className="resize-none border-b border-line-strong bg-transparent py-2 text-text outline-none focus:border-accent"
                  placeholder="I would like to arrange a private viewing…"
                />
              </div>
              <MagneticButton type="submit" className="btn btn-gold self-start">
                Send Enquiry
              </MagneticButton>
              <p className="text-[0.7rem] text-faint">Demo form — no message is actually transmitted.</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="eyebrow text-[0.6rem]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        className="border-b border-line-strong bg-transparent py-2 text-text outline-none focus:border-accent"
      />
    </div>
  );
}
