import Link from "next/link";
import { RoughUnderline } from "@/components/decorations/rough-underline";
import { RoughFrame } from "@/components/decorations/rough-frame";
import { SiteHeader } from "@/components/site-header";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Hero isAuthenticated={!!session?.user} />
      <Features />
      <SiteFooter />
    </div>
  );
}

function Hero({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <section className="relative overflow-hidden pt-14 pb-24">
      <CompassRose className="pointer-events-none absolute -right-16 top-0 size-[520px] text-primary opacity-[0.07]" />

      <div className="mx-auto max-w-[1080px] px-7">
        <p
          className="font-hand mb-3 inline-block text-[22px] text-ink-muted"
          style={{ transform: "rotate(-1.5deg)" }}
        >
          a coffee journal of the world
        </p>

        <h1
          className="m-0 max-w-[18em] text-[clamp(40px,6.5vw,72px)] leading-[1.12] tracking-[-0.02em]"
          style={{
            fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 1',
          }}
        >
          コーヒーは世界を旅する。
          <br />
          <em
            className="text-primary"
            style={{
              fontStyle: "italic",
              fontVariationSettings: '"opsz" 144, "SOFT" 100',
            }}
          >
            あなたのカップで、もう一度。
          </em>
        </h1>

        <div className="mt-2 mb-7">
          <RoughUnderline width={320} />
        </div>

        <p className="m-0 mb-8 max-w-[32em] text-[17px] leading-[1.85] text-ink-soft">
          飲んだ一杯を、産地と風味と一緒に綴じていく。
          <br />
          エチオピアの朝、コロンビアの午後、グアテマラの夕暮れ — カップの向こうに、世界がひろがる。
        </p>

        <div className="flex flex-wrap items-center gap-3.5">
          <Link
            href={isAuthenticated ? "/my" : "/login"}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-[22px] py-[13px] text-[15px] font-medium text-primary-foreground transition-all hover:-translate-y-px hover:bg-ink"
          >
            地図帳を開く
            <ArrowRight className="size-4" />
          </Link>
          {isAuthenticated ? (
            <Link
              href="/new"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-[22px] py-[13px] text-[15px] font-medium text-ink transition-all hover:bg-muted"
            >
              新しい一杯を綴じる
            </Link>
          ) : (
            <button className="inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-[22px] py-[13px] text-[15px] font-medium text-ink transition-all hover:bg-muted">
              使い方を見る
            </button>
          )}
        </div>

        <p
          className="font-hand relative mt-14 inline-block text-[26px] text-ink-muted"
          style={{ transform: "rotate(-0.5deg)" }}
        >
          <span
            aria-hidden
            className="absolute top-[18px] -left-7 inline-block h-px w-[18px] bg-ink-muted opacity-40"
          />
          今日のコーヒーは、どこから来ましたか。
        </p>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="relative pt-14 pb-24">
      <WorldMap className="pointer-events-none absolute left-1/2 top-10 z-0 h-auto w-[1100px] max-w-[110vw] -translate-x-1/2 text-primary opacity-[0.05]" />

      <div className="relative z-10 mx-auto max-w-[1080px] px-7">
        <div className="mb-14 flex items-center gap-3.5 text-border">
          <CompassDot className="size-3.5 text-primary opacity-70" />
          <span className="font-hand text-[18px] text-ink-muted">三つの道しるべ</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid gap-9 md:grid-cols-3">
          <FeatureCard
            no="01"
            title="産地で旅する"
            body="エチオピア、ケニア、コロンビア、グアテマラ。一杯ごとに世界地図にピンが立ち、いつかの旅路として記録されていく。"
            icon={<PinIcon />}
            frameIndex={0}
          />
          <FeatureCard
            no="02"
            title="風味で記録する"
            body="SCA フレーバーホイールの上にタップで風味をマップ。言葉にしづらかった味の輪郭が、自分のものになっていく。"
            icon={<WheelIcon />}
            frameIndex={1}
          />
          <FeatureCard
            no="03"
            title="そっと、誰かに渡す"
            body="一杯ごとに個別の URL が生まれる。X や Threads に貼れば、地図帳の一枚をそのまま手渡せる。"
            icon={<EnvelopeIcon />}
            frameIndex={2}
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  no,
  title,
  body,
  icon,
  frameIndex,
}: {
  no: string;
  title: string;
  body: string;
  icon: React.ReactNode;
  frameIndex: number;
}) {
  return (
    <article className="relative rounded-2xl border border-border/60 bg-paper px-7 py-8">
      <RoughFrame index={frameIndex} />
      <div className="relative z-10">
        <div className="mb-4 inline-flex size-14 items-center justify-center text-primary">
          {icon}
        </div>
        <div
          className="font-hand mb-1 inline-block text-[18px] text-ink-muted"
          style={{ transform: "rotate(-2deg)" }}
        >
          no. {no}
        </div>
        <h3 className="mb-2 text-[20px]">{title}</h3>
        <p className="m-0 text-[14.5px] leading-[1.85] text-ink-soft">{body}</p>
      </div>
    </article>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-5 border-t border-border py-9">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between px-7 text-[13px] text-ink-muted">
        <span
          className="font-hand text-[18px]"
          style={{ transform: "rotate(-0.8deg)" }}
        >
          made with coffee · 2026
        </span>
        <span>atlas</span>
      </div>
    </footer>
  );
}

/* ─────────────── Hand-drawn SVG marks (inline) ─────────────── */

function CompassRose({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="88" strokeDasharray="1.4 2.8" />
      <circle cx="100" cy="100" r="64" />
      <circle cx="100" cy="100" r="34" />
      <path d="M100 12 L106 100 L100 188 L94 100 Z" fill="currentColor" opacity={0.4} stroke="none" />
      <path d="M12 100 L100 94 L188 100 L100 106 Z" fill="currentColor" opacity={0.3} stroke="none" />
      <path d="M37 37 L100 96 L163 163 L97 104 Z" opacity={0.5} />
      <path d="M37 163 L96 100 L163 37 L104 96 Z" opacity={0.5} />
      <text x="100" y="9" textAnchor="middle" fontFamily="var(--font-heading)" fontSize="9" fill="currentColor">
        N
      </text>
      <text x="100" y="198" textAnchor="middle" fontFamily="var(--font-heading)" fontSize="9" fill="currentColor">
        S
      </text>
      <text x="195" y="103" textAnchor="middle" fontFamily="var(--font-heading)" fontSize="9" fill="currentColor">
        E
      </text>
      <text x="6" y="103" textAnchor="middle" fontFamily="var(--font-heading)" fontSize="9" fill="currentColor">
        W
      </text>
    </svg>
  );
}

function WorldMap({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1000 400"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M120 90 Q150 60 200 75 Q255 60 290 95 Q310 130 290 165 Q265 200 230 215 Q190 220 165 200 Q135 175 120 140 Z" />
      <path d="M275 215 Q290 235 305 250 Q310 295 295 330 Q280 365 265 385 Q250 365 245 330 Q240 285 255 245 Z" />
      <path d="M460 90 Q485 75 520 80 Q555 85 570 105 Q565 130 540 145 Q510 150 485 140 Q465 125 460 105 Z" />
      <path d="M495 165 Q525 155 555 165 Q580 180 585 215 Q580 260 565 295 Q545 325 525 335 Q505 320 495 290 Q480 255 480 220 Q480 190 495 165 Z" />
      <path d="M590 165 Q615 155 640 165 Q665 180 670 200 Q660 225 640 235 Q615 235 600 220 Q590 195 590 175 Z" />
      <path d="M660 95 Q710 75 770 85 Q830 95 860 130 Q870 165 850 195 Q820 220 770 220 Q720 215 690 195 Q665 175 660 145 Z" />
      <path d="M770 235 Q800 230 825 245 Q830 270 815 280 Q790 280 765 270 Q755 255 770 235 Z" />
      <path d="M825 295 Q865 285 905 295 Q925 320 905 345 Q875 360 840 350 Q820 330 825 295 Z" />
      <g fill="currentColor" opacity={0.55}>
        <circle cx="525" cy="225" r="3" />
        <text x="525" y="245" textAnchor="middle" fontFamily="var(--font-hand)" fontSize="11">Ethiopia</text>
        <circle cx="270" cy="295" r="3" />
        <text x="270" y="316" textAnchor="middle" fontFamily="var(--font-hand)" fontSize="11">Colombia</text>
        <circle cx="800" cy="255" r="3" />
        <text x="800" y="276" textAnchor="middle" fontFamily="var(--font-hand)" fontSize="11">Indonesia</text>
        <circle cx="550" cy="265" r="3" />
        <text x="555" y="285" textAnchor="middle" fontFamily="var(--font-hand)" fontSize="11">Kenya</text>
      </g>
    </svg>
  );
}

function CompassDot({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3 L12 21 M3 12 L21 12" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M24 6 Q12 7 11 20 Q11 28 17 35 Q21 40 24 43 Q27 40 31 35 Q37 28 37 20 Q36 7 24 6 Z" />
      <circle cx="24" cy="20" r="4.5" fill="currentColor" opacity={0.15} />
      <circle cx="24" cy="20" r="4.5" />
    </svg>
  );
}

function WheelIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="20" />
      <circle cx="24" cy="24" r="13" />
      <circle cx="24" cy="24" r="6" />
      <path d="M24 4 L24 44 M4 24 L44 24 M10 10 L38 38 M10 38 L38 10" />
      <circle cx="34" cy="14" r="2.4" fill="currentColor" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="6" y="13" width="36" height="24" rx="2" />
      <path d="M6 14 L24 27 L42 14" />
      <rect x="30" y="6" width="11" height="11" strokeDasharray="1.5 1.5" />
      <path
        d="M33 9 Q35 12 38 9 Q38 13 35 14 Q32 13 33 9 Z"
        fill="currentColor"
        opacity={0.5}
        stroke="none"
      />
    </svg>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
