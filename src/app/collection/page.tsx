import type { Metadata } from "next";
import { Collection } from "@/components/sections/Collection";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "The Collection — MERIDIAN",
  description: "Nine iconic timepieces. Explore the full Meridian collection — a demo portfolio concept.",
};

export default function CollectionPage() {
  return (
    <div className="pt-32">
      <header className="section-pad pb-4">
        <Reveal>
          <p className="eyebrow mb-5">The Complete Collection</p>
        </Reveal>
        <Reveal y={30}>
          <h1 className="font-display text-[clamp(2.8rem,8vw,6.5rem)] font-light leading-[0.95]">
            Every <span className="gold-text italic">timepiece.</span>
          </h1>
        </Reveal>
        <Reveal y={20}>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted">
            Nine references, each defined by a distinct purpose — from the depths of the ocean to the corridors of
            power. Choose the one that keeps your time.
          </p>
        </Reveal>
      </header>
      <Collection heading={false} cta={false} />
    </div>
  );
}
