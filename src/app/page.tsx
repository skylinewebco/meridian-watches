import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { FeaturedIcon } from "@/components/sections/FeaturedIcon";
import { Collection } from "@/components/sections/Collection";
import { Heritage } from "@/components/sections/Heritage";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedIcon />
      <Collection />
      <Heritage />
      <Contact />
    </>
  );
}
