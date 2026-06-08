import { FlavorWheel } from "@/components/flavor-wheel/flavor-wheel";

export const metadata = {
  title: "フレーバーホイール — atlas",
};

export default function FlavorWheelPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border py-6">
        <div className="mx-auto max-w-[1080px] px-7">
          <a href="/" className="text-sm text-ink-muted hover:text-ink">
            ← atlas
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[1080px] px-7 py-14">
        <p
          className="font-hand mb-3 inline-block text-[22px] text-ink-muted"
          style={{ transform: "rotate(-1.5deg)" }}
        >
          tasting wheel preview
        </p>
        <h1 className="m-0 mb-3 text-[clamp(32px,4vw,48px)] leading-tight tracking-tight">
          風味の地図
        </h1>
        <p className="mb-10 max-w-[40em] text-ink-soft">
          SCA フレーバーホイール。中心は 9 つの大カテゴリ、外側は中分類。タップで選択。中分類を選ぶと、その中の詳細な風味が下にひらきます。
        </p>

        <div className="rounded-3xl border border-border bg-paper p-8 md:p-12">
          <FlavorWheel />
        </div>
      </main>
    </div>
  );
}
