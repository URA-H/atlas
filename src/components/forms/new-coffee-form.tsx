"use client";

import { useState } from "react";
import { FlavorWheel } from "@/components/flavor-wheel/flavor-wheel";
import { createCoffee } from "@/app/new/actions";

const ROAST_OPTIONS = [
  { value: "LIGHT", label: "Light", color: "oklch(0.65 0.08 60)" },
  { value: "MEDIUM_LIGHT", label: "Medium-Light", color: "oklch(0.55 0.09 55)" },
  { value: "MEDIUM", label: "Medium", color: "oklch(0.5 0.09 50)" },
  { value: "MEDIUM_DARK", label: "Medium-Dark", color: "oklch(0.4 0.08 45)" },
  { value: "DARK", label: "Dark", color: "oklch(0.28 0.05 40)" },
];

const BREW_OPTIONS = ["V60", "Aeropress", "Espresso", "French Press", "Kalita", "Chemex", "Other"];

const SCORE_FIELDS = [
  { key: "scoreAcidity", label: "酸味", hint: "acidity" },
  { key: "scoreSweetness", label: "甘み", hint: "sweetness" },
  { key: "scoreBitterness", label: "苦み", hint: "bitterness" },
  { key: "scoreBody", label: "ボディ", hint: "body" },
  { key: "scoreAftertaste", label: "余韻", hint: "aftertaste" },
] as const;

export function NewCoffeeForm() {
  const [flavors, setFlavors] = useState<string[]>([]);
  const [roastLevel, setRoastLevel] = useState<string>("");
  const [brewMethod, setBrewMethod] = useState<string>("");
  const [scores, setScores] = useState<Record<string, number>>({
    scoreAcidity: 5,
    scoreSweetness: 5,
    scoreBitterness: 5,
    scoreBody: 5,
    scoreAftertaste: 5,
  });

  return (
    <form action={createCoffee} className="flex flex-col gap-14">
      <input type="hidden" name="flavors" value={JSON.stringify(flavors)} />
      <input type="hidden" name="roastLevel" value={roastLevel} />
      <input type="hidden" name="brewMethod" value={brewMethod} />

      {/* ── 基本情報 ── */}
      <Section title="基本情報" subtitle="the cup">
        <Field label="コーヒー名" required>
          <input
            name="name"
            required
            placeholder="例: Yirgacheffe"
            className={inputCls}
          />
        </Field>
        <Field label="ロースター / カフェ">
          <input
            name="roaster"
            placeholder="例: FUGLEN COFFEE ROASTERS"
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="産地（国）">
            <input
              name="origin"
              placeholder="例: Ethiopia"
              className={inputCls}
            />
          </Field>
          <Field label="詳細産地">
            <input
              name="region"
              placeholder="例: Yirgacheffe"
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="焙煎度">
          <div className="flex flex-wrap gap-2">
            {ROAST_OPTIONS.map((r) => {
              const selected = roastLevel === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRoastLevel(selected ? "" : r.value)}
                  aria-pressed={selected}
                  className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-paper text-ink-soft hover:border-primary"
                  }`}
                >
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: r.color }}
                    aria-hidden
                  />
                  {r.label}
                </button>
              );
            })}
          </div>
        </Field>
      </Section>

      {/* ── 抽出 ── */}
      <Section title="抽出" subtitle="brewing">
        <Field label="抽出方法">
          <div className="flex flex-wrap gap-2">
            {BREW_OPTIONS.map((b) => {
              const selected = brewMethod === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBrewMethod(selected ? "" : b)}
                  aria-pressed={selected}
                  className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-paper text-ink-soft hover:border-primary"
                  }`}
                >
                  {b}
                </button>
              );
            })}
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          <Field label="温度 ℃">
            <input name="brewTemp" type="number" step="1" min="0" max="100" placeholder="92" className={inputCls} />
          </Field>
          <Field label="豆量 g">
            <input name="doseG" type="number" step="0.1" min="0" placeholder="15" className={inputCls} />
          </Field>
          <Field label="湯量 ml">
            <input name="waterMl" type="number" step="1" min="0" placeholder="240" className={inputCls} />
          </Field>
          <Field label="比率">
            <input name="brewRatio" placeholder="1:16" className={inputCls} />
          </Field>
        </div>
      </Section>

      {/* ── テイスティング ── */}
      <Section title="テイスティング" subtitle="tasting">
        <p
          className="font-hand mb-2 text-[18px] text-ink-muted"
          style={{ transform: "rotate(-1deg)", display: "inline-block" }}
        >
          風味の地図
        </p>
        <div className="mb-10 rounded-2xl border border-border bg-paper p-5 sm:p-7">
          <FlavorWheel
            initialSelected={flavors}
            onChange={setFlavors}
          />
        </div>

        <p
          className="font-hand mb-3 text-[18px] text-ink-muted"
          style={{ transform: "rotate(-0.5deg)", display: "inline-block" }}
        >
          味の印象
        </p>
        <div className="flex flex-col gap-4">
          {SCORE_FIELDS.map((s) => (
            <ScoreSlider
              key={s.key}
              name={s.key}
              label={s.label}
              hint={s.hint}
              value={scores[s.key]}
              onChange={(v) => setScores({ ...scores, [s.key]: v })}
            />
          ))}
        </div>
      </Section>

      {/* ── メモ ── */}
      <Section title="メモ" subtitle="notes">
        <Field label="自由メモ（紀行文風に）">
          <textarea
            name="notes"
            rows={6}
            placeholder="朝のヒンヤリした風と、カップから昇る花の香り。今日のエチオピアは、果実というより、花だった。"
            className={`${inputCls} min-h-[150px] resize-y leading-relaxed`}
            style={{ fontFamily: "var(--font-sans)" }}
          />
        </Field>
      </Section>

      {/* ── Submit ── */}
      <div className="flex items-center justify-end gap-3 border-t border-border pt-8">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-[15px] font-medium text-primary-foreground transition-all hover:-translate-y-px hover:bg-ink"
        >
          綴じる
          <ArrowRight className="size-4" />
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-paper px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-6 flex items-baseline gap-3 border-b border-border pb-2">
        <h2
          className="text-[24px] tracking-tight"
          style={{ fontFamily: "var(--font-heading)", fontVariationSettings: '"opsz" 36, "SOFT" 40' }}
        >
          {title}
        </h2>
        <span className="font-hand text-sm text-ink-muted">{subtitle}</span>
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-soft">
        {label}
        {required && <span className="ml-1 text-cherry">*</span>}
      </span>
      {children}
    </label>
  );
}

function ScoreSlider({
  name,
  label,
  hint,
  value,
  onChange,
}: {
  name: string;
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="grid grid-cols-[80px_1fr_28px] items-center gap-4">
      <div>
        <div className="text-sm font-medium text-ink">{label}</div>
        <div className="font-hand text-xs text-ink-muted">{hint}</div>
      </div>
      <input
        type="range"
        name={name}
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="atlas-range w-full accent-primary"
      />
      <span
        className="text-right text-sm tabular-nums text-ink"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {value}
      </span>
    </div>
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
