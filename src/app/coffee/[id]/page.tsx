import { notFound } from "next/navigation";
import Link from "next/link";
import type { RoastLevel } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";

const ROAST_LABEL: Record<RoastLevel, string> = {
  LIGHT: "Light",
  MEDIUM_LIGHT: "Medium-Light",
  MEDIUM: "Medium",
  MEDIUM_DARK: "Medium-Dark",
  DARK: "Dark",
};
const ROAST_COLOR: Record<RoastLevel, string> = {
  LIGHT: "oklch(0.65 0.08 60)",
  MEDIUM_LIGHT: "oklch(0.55 0.09 55)",
  MEDIUM: "oklch(0.5 0.09 50)",
  MEDIUM_DARK: "oklch(0.4 0.08 45)",
  DARK: "oklch(0.28 0.05 40)",
};

const SCORE_LABEL: Record<string, string> = {
  scoreAcidity: "酸味",
  scoreSweetness: "甘み",
  scoreBitterness: "苦み",
  scoreBody: "ボディ",
  scoreAftertaste: "余韻",
};

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const coffee = await prisma.coffee.findUnique({
    where: { id },
    select: { name: true, region: true, origin: true, roaster: true },
  });
  if (!coffee) return { title: "atlas" };

  const subtitle = [coffee.origin, coffee.region].filter(Boolean).join(" · ");
  return {
    title: `${coffee.name}${subtitle ? ` · ${subtitle}` : ""} — atlas`,
    description: `${coffee.roaster ?? ""} の ${coffee.name} のテイスティングノート`,
  };
}

export default async function CoffeeDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const session = await auth();

  const coffee = await prisma.coffee.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  if (!coffee) notFound();
  if (!coffee.isPublic && coffee.userId !== session?.user?.id) notFound();

  const isOwner = session?.user?.id === coffee.userId;
  const drank = coffee.drankAt ?? coffee.createdAt;
  const scoreEntries = Object.entries(SCORE_LABEL).map(([k, label]) => ({
    label,
    value: (coffee as unknown as Record<string, number | null>)[k] ?? null,
  }));
  const hasAnyScore = scoreEntries.some((s) => s.value !== null);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-[820px] px-7 pt-10 pb-24">
        {/* Meta line */}
        <div className="mb-8 flex items-center justify-between text-sm text-ink-muted">
          <span
            className="font-hand text-[18px]"
            style={{ transform: "rotate(-1deg)", display: "inline-block" }}
          >
            atlas of @{coffee.user.name ?? "anon"}
          </span>
          {isOwner && (
            <Link
              href="/my"
              className="text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline"
            >
              ← 地図帳に戻る
            </Link>
          )}
        </div>

        {/* Title */}
        <h1
          className="m-0 mb-2 text-[clamp(36px,5vw,56px)] leading-tight tracking-tight"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}
        >
          {coffee.name}
        </h1>
        <div className="mb-1 text-[15px] text-ink-soft">
          {[coffee.origin, coffee.region].filter(Boolean).join(" · ")}
        </div>
        {coffee.roaster && (
          <div className="mb-6 text-[12px] uppercase tracking-wider text-ink-muted">
            {coffee.roaster}
          </div>
        )}

        {/* Brew + Roast badges */}
        <div className="mb-10 flex flex-wrap items-center gap-3 text-sm text-ink-soft">
          {coffee.roastLevel && (
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1">
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: ROAST_COLOR[coffee.roastLevel] }}
                aria-hidden
              />
              {ROAST_LABEL[coffee.roastLevel]} Roast
            </span>
          )}
          {coffee.brewMethod && (
            <span className="rounded-full border border-border px-3 py-1">
              {coffee.brewMethod}
            </span>
          )}
          {coffee.brewTemp && (
            <span className="rounded-full border border-border px-3 py-1">
              {coffee.brewTemp}℃
            </span>
          )}
          {coffee.brewRatio && (
            <span className="rounded-full border border-border px-3 py-1">
              {coffee.brewRatio}
            </span>
          )}
          {coffee.doseG && (
            <span className="rounded-full border border-border px-3 py-1">
              {coffee.doseG}g
            </span>
          )}
          {coffee.waterMl && (
            <span className="rounded-full border border-border px-3 py-1">
              {coffee.waterMl}ml
            </span>
          )}
          <span className="ml-auto text-ink-muted">
            {drank.toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </span>
        </div>

        {/* Notes */}
        {coffee.notes && (
          <blockquote className="mb-12 border-l-2 border-primary/40 pl-6">
            <p
              className="font-hand whitespace-pre-wrap text-[22px] leading-[1.7] text-ink"
              style={{ transform: "rotate(-0.2deg)", display: "block" }}
            >
              {coffee.notes}
            </p>
          </blockquote>
        )}

        {/* Flavors */}
        {coffee.flavors.length > 0 && (
          <section className="mb-12">
            <h2
              className="mb-4 text-[20px] tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              選んだ風味
            </h2>
            <ul className="flex flex-col gap-2 text-[15px] text-ink-soft">
              {coffee.flavors.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary opacity-70" />
                  <span>{f.replaceAll(">", " › ")}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Scores */}
        {hasAnyScore && (
          <section className="mb-12">
            <h2
              className="mb-4 text-[20px] tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              味の印象
            </h2>
            <div className="flex flex-col gap-3">
              {scoreEntries.map((s) => (
                <div key={s.label} className="grid grid-cols-[80px_1fr_28px] items-center gap-4">
                  <span className="text-sm text-ink-soft">{s.label}</span>
                  <div className="flex h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${((s.value ?? 0) / 10) * 100}%` }}
                    />
                  </div>
                  <span
                    className="text-right text-sm tabular-nums"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {s.value ?? "—"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer signature */}
        <div className="mt-16 border-t border-border pt-6">
          <p className="font-hand text-[18px] text-ink-muted">
            atlas of @{coffee.user.name ?? "anon"} · {coffee.createdAt.getFullYear()}
          </p>
        </div>
      </main>
    </div>
  );
}
