import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { coffeeImageUrl } from "@/lib/coffee-image";

export const metadata = {
  title: "あなたの地図帳 — atlas",
};

export default async function MyLibraryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const coffees = await prisma.coffee.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      roaster: true,
      origin: true,
      region: true,
      roastLevel: true,
      drankAt: true,
      createdAt: true,
    },
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-[1080px] px-7 pt-12 pb-24">
        <p
          className="font-hand mb-3 inline-block text-[22px] text-ink-muted"
          style={{ transform: "rotate(-1.5deg)" }}
        >
          your atlas
        </p>
        <h1
          className="m-0 mb-2 text-[clamp(32px,4vw,48px)] leading-tight tracking-tight"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}
        >
          あなたの<em className="text-primary" style={{ fontStyle: "italic" }}>地図帳</em>。
        </h1>
        <p className="mb-10 text-[15px] leading-[1.85] text-ink-soft">
          綴じた一杯が {coffees.length} つ。
        </p>

        {coffees.length === 0 ? (
          <EmptyState />
        ) : (
          <CoffeeGrid coffees={coffees} />
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-border bg-paper px-8 py-16 text-center">
      <CompassEmpty className="mx-auto mb-6 size-20 text-primary opacity-50" />
      <h2 className="mb-3 text-[22px]">まだ一杯も綴じられていません。</h2>
      <p
        className="font-hand mb-8 text-[20px] text-ink-muted"
        style={{ transform: "rotate(-0.5deg)", display: "inline-block" }}
      >
        最初の一杯から、旅は始まります。
      </p>
      <div>
        <Link
          href="/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[15px] font-medium text-primary-foreground transition-all hover:-translate-y-px hover:bg-ink"
        >
          最初の一杯を綴じる
        </Link>
      </div>
    </div>
  );
}

type CoffeeCard = {
  id: string;
  name: string;
  roaster: string | null;
  origin: string | null;
  region: string | null;
  roastLevel: string | null;
  drankAt: Date | null;
  createdAt: Date;
};

function CoffeeGrid({ coffees }: { coffees: CoffeeCard[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {coffees.map((c, i) => (
        <Link
          key={c.id}
          href={`/coffee/${c.id}`}
          className="group overflow-hidden rounded-2xl border border-border bg-paper transition-colors hover:border-primary/60"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coffeeImageUrl(c.id)}
            alt=""
            width={1024}
            height={1024}
            loading="lazy"
            decoding="async"
            className="block w-full bg-muted"
            style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
          />
          <div className="p-5">
            <div
              className="font-hand mb-1 text-[16px] text-ink-muted"
              style={{ transform: "rotate(-1deg)", display: "inline-block" }}
            >
              no. {String(coffees.length - i).padStart(3, "0")}
            </div>
            <h3 className="mb-2 text-[18px] group-hover:text-primary">{c.name}</h3>
            {c.region && (
              <p className="mb-1 text-[13px] text-ink-soft">
                {[c.origin, c.region].filter(Boolean).join(" · ")}
              </p>
            )}
            {c.roaster && (
              <p className="text-[12px] uppercase tracking-wider text-ink-muted">
                {c.roaster}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

function CompassEmpty({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="34" strokeDasharray="2 3" />
      <circle cx="40" cy="40" r="24" />
      <path d="M40 12 L43 40 L40 68 L37 40 Z" fill="currentColor" opacity={0.4} stroke="none" />
      <path d="M12 40 L40 37 L68 40 L40 43 Z" fill="currentColor" opacity={0.3} stroke="none" />
    </svg>
  );
}
