import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="py-7">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between px-7">
        <Link href="/" className="flex items-center gap-2.5 text-ink no-underline">
          <CompassMark className="size-6 text-primary" />
          <span
            className="text-[22px] font-medium tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            atlas
          </span>
        </Link>
        <nav className="flex items-center gap-5">
          {session?.user ? (
            <>
              <Link
                href="/my"
                className="hidden text-sm font-medium text-ink-soft hover:text-ink sm:inline"
              >
                あなたの地図帳
              </Link>
              <Link
                href="/new"
                className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-px hover:bg-ink"
              >
                新しい一杯
              </Link>
              <Link
                href="/my"
                className="flex size-8 items-center justify-center overflow-hidden rounded-full border border-border bg-paper transition-colors hover:border-primary"
                aria-label={session.user.name ?? "your library"}
              >
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt=""
                    width={32}
                    height={32}
                    className="block size-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-xs font-medium text-ink-muted">
                    {(session.user.name ?? "?").slice(0, 1).toUpperCase()}
                  </span>
                )}
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="text-sm font-medium text-ink-muted hover:text-ink"
                >
                  ログアウト
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-ink-soft hover:text-ink"
            >
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function CompassMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="12.5" />
      <path d="M16 4 L18 16 L16 28 L14 16 Z" fill="currentColor" stroke="none" />
      <path d="M4 16 L16 14 L28 16 L16 18 Z" />
    </svg>
  );
}
