import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";

export const metadata = {
  title: "ログイン — atlas",
};

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="min-h-screen">
      <header className="py-7">
        <div className="mx-auto flex max-w-[1080px] items-center px-7">
          <a href="/" className="flex items-center gap-2.5 text-ink no-underline">
            <CompassMark className="size-6 text-primary" />
            <span
              className="text-[22px] font-medium tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              atlas
            </span>
          </a>
        </div>
      </header>

      <main className="mx-auto flex max-w-[440px] flex-col items-center px-7 pt-12 pb-24 text-center">
        <p
          className="font-hand mb-3 text-[22px] text-ink-muted"
          style={{ transform: "rotate(-1.5deg)" }}
        >
          a journey begins
        </p>
        <h1
          className="m-0 mb-4 text-[clamp(32px,5vw,48px)] leading-tight tracking-tight"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}
        >
          旅の<em className="text-primary" style={{ fontStyle: "italic" }}>始まり</em>。
        </h1>
        <p className="mb-10 text-[15px] leading-[1.85] text-ink-soft">
          記録する一杯ごとに、地図帳の頁が綴じられていきます。<br />
          まずは Google で席にどうぞ。
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
          className="w-full"
        >
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-primary px-6 py-3.5 text-[15px] font-medium text-primary-foreground transition-all hover:-translate-y-px hover:bg-ink"
          >
            <GoogleIcon className="size-5" />
            Google で続ける
          </button>
        </form>

        <p
          className="font-hand mt-10 text-[18px] text-ink-muted"
          style={{ transform: "rotate(-0.5deg)" }}
        >
          welcome to the atlas
        </p>
      </main>
    </div>
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

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}
