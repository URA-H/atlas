import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { CoffeeForm } from "@/components/forms/coffee-form";
import { updateCoffee, deleteCoffee } from "@/app/coffee/[id]/edit/actions";
import { ConfirmDeleteButton } from "./confirm-delete-button";

export const metadata = {
  title: "編集 — atlas",
};

type Params = Promise<{ id: string }>;

export default async function EditCoffeePage({ params }: { params: Params }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const coffee = await prisma.coffee.findUnique({ where: { id } });
  if (!coffee) notFound();
  if (coffee.userId !== session.user.id) notFound();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-[820px] px-7 pt-12 pb-24">
        <div className="mb-6 flex items-center justify-between">
          <p
            className="font-hand inline-block text-[22px] text-ink-muted"
            style={{ transform: "rotate(-1.5deg)" }}
          >
            edit a page
          </p>
          <Link
            href={`/coffee/${id}`}
            className="text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline"
          >
            ← 戻る
          </Link>
        </div>
        <h1
          className="m-0 mb-4 text-[clamp(32px,4vw,44px)] leading-tight tracking-tight"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}
        >
          {coffee.name} を<em className="text-primary" style={{ fontStyle: "italic" }}>書き直す</em>。
        </h1>
        <p className="mb-12 text-[15px] leading-[1.85] text-ink-soft">
          記録は何度でも書き換えられます。風味の解像度は、時間とともに細かくなる。
        </p>

        <CoffeeForm
          initial={{
            id: coffee.id,
            name: coffee.name,
            roaster: coffee.roaster,
            origin: coffee.origin,
            region: coffee.region,
            roastLevel: coffee.roastLevel,
            brewMethod: coffee.brewMethod,
            brewTemp: coffee.brewTemp,
            brewRatio: coffee.brewRatio,
            doseG: coffee.doseG,
            waterMl: coffee.waterMl,
            notes: coffee.notes,
            scoreAcidity: coffee.scoreAcidity,
            scoreSweetness: coffee.scoreSweetness,
            scoreBitterness: coffee.scoreBitterness,
            scoreBody: coffee.scoreBody,
            scoreAftertaste: coffee.scoreAftertaste,
            flavors: coffee.flavors,
          }}
          action={updateCoffee}
          submitLabel="保存する"
        />

        {/* Destructive zone */}
        <section className="mt-16 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <h2
            className="mb-2 text-[18px] text-destructive"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            このカルテを削除する
          </h2>
          <p className="mb-4 text-sm text-ink-soft">
            削除すると元に戻せません。地図帳から消え、共有 URL も無効になります。
          </p>
          <form action={deleteCoffee}>
            <input type="hidden" name="id" value={coffee.id} />
            <ConfirmDeleteButton coffeeName={coffee.name} />
          </form>
        </section>
      </main>
    </div>
  );
}
