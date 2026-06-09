import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { CoffeeForm } from "@/components/forms/coffee-form";
import { createCoffee } from "@/app/new/actions";

export const metadata = {
  title: "新しい一杯 — atlas",
};

export default async function NewCoffeePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-[820px] px-7 pt-12 pb-24">
        <p
          className="font-hand mb-3 inline-block text-[22px] text-ink-muted"
          style={{ transform: "rotate(-1.5deg)" }}
        >
          a new cup
        </p>
        <h1
          className="m-0 mb-4 text-[clamp(32px,4vw,44px)] leading-tight tracking-tight"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}
        >
          新しい一杯を<em className="text-primary" style={{ fontStyle: "italic" }}>綴じる</em>。
        </h1>
        <p className="mb-12 text-[15px] leading-[1.85] text-ink-soft">
          今日のカップから、地図帳の頁が一つ加わります。
        </p>

        <CoffeeForm action={createCoffee} submitLabel="綴じる" />
      </main>
    </div>
  );
}
