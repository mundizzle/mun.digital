import Image from "next/image";
import { hero, heroRoles } from "@/content/portfolio";
import { TenPrint } from "./TenPrint";
import { TypedRotator } from "./TypedRotator";

export function HeroCard() {
  return (
    <section
      aria-labelledby="hero-title"
      className="hero-card-veil relative mb-12 grid min-h-[380px] overflow-hidden border border-border-strong bg-card px-6 py-8 md:grid-cols-[1fr_auto] md:items-center md:px-9 md:py-10"
    >
      <TenPrint />
      <div className="relative z-[1] max-w-[720px]">
        <div className="mb-5 min-h-6 text-[11px] tracking-[0.2em] text-primary uppercase">
          <TypedRotator items={heroRoles} />
        </div>
        <h1
          id="hero-title"
          className="m-0 text-[clamp(3rem,2.35rem+3vw,5.7rem)] leading-[0.9] font-semibold tracking-normal text-foreground"
        >
          {hero.title}
        </h1>
        <p className="mt-6 max-w-[620px] font-sans text-[1.02rem] leading-[1.7] text-muted-foreground md:text-[1.12rem]">
          {hero.tagline}
        </p>
      </div>
      <div className="relative z-[1] mt-8 justify-self-start md:mt-0 md:justify-self-end">
        <Image
          src="/images/mundi.png"
          alt=""
          width={210}
          height={210}
          priority
          className="aspect-square w-[170px] object-cover grayscale mix-blend-multiply md:w-[200px]"
        />
      </div>
    </section>
  );
}
