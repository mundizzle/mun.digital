import Image from "next/image";
import { hero, heroRoles } from "@/content/portfolio";
import { TenPrint } from "./TenPrint";
import { TypedRotator } from "./TypedRotator";

export function HeroCard() {
  return (
    <>
      <h1 id="hero-title" className="sr-only">
        {hero.title}
      </h1>
      <div className="mb-3 min-h-6 text-[11px] tracking-[0.2em] text-primary uppercase">
        <span aria-hidden="true" className="mr-2 text-subtle-foreground">
          ▸
        </span>
        <span>
          <TypedRotator items={heroRoles} />
        </span>
      </div>
      <section
        aria-labelledby="hero-title"
        className="hero-card-veil relative mb-12 min-h-[190px] overflow-hidden border border-border/60 bg-card shadow-sm md:min-h-[210px]"
      >
        <TenPrint />
        <Image
          src="/images/mundi.png"
          alt=""
          width={210}
          height={210}
          priority
          className="absolute -top-px -right-px -bottom-px z-[1] h-[calc(100%+2px)] w-[150px] object-cover grayscale mix-blend-multiply sm:w-[180px] md:w-[210px]"
        />
      </section>
    </>
  );
}
