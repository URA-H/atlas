"use client";

import { useMemo, useState } from "react";
import {
  FLAVOR_WHEEL,
  donutSegmentPath,
  polarToCartesian,
  type Category,
} from "@/lib/flavor-wheel";

type SelectedKey = string;

const TAU = Math.PI * 2;
const HALF_PI = Math.PI / 2;

const VIEW = 620;
const CX = VIEW / 2;
const CY = VIEW / 2;
const R_INNER = 96;
const R_MID = 188;
const R_OUTER = 282;

const CATEGORY_COLORS: Record<string, string> = {
  Floral: "oklch(0.84 0.08 12)",
  Fruity: "oklch(0.74 0.16 28)",
  "Sour / Fermented": "oklch(0.85 0.14 95)",
  "Green / Vegetative": "oklch(0.78 0.11 140)",
  Other: "oklch(0.84 0.015 80)",
  Roasted: "oklch(0.48 0.08 48)",
  Spices: "oklch(0.6 0.13 22)",
  "Nutty / Cocoa": "oklch(0.66 0.08 62)",
  Sweet: "oklch(0.83 0.13 78)",
};

const DARK_CATEGORIES = new Set(["Roasted", "Spices"]);

export function FlavorWheel({
  initialSelected,
  onChange,
}: {
  initialSelected?: SelectedKey[];
  onChange?: (selected: SelectedKey[]) => void;
}) {
  const [selected, setSelected] = useState<Set<SelectedKey>>(
    () => new Set(initialSelected ?? []),
  );
  const [expandedSub, setExpandedSub] = useState<string | null>(null);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  function toggle(key: SelectedKey) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      onChange?.(Array.from(next));
      return next;
    });
  }

  function handleSubClick(catName: string, subName: string) {
    const key = `${catName}>${subName}`;
    toggle(key);
    setExpandedSub(expandedSub === key ? null : key);
  }

  const selectedList = Array.from(selected);

  return (
    <div className="flex flex-col gap-6">
      {/* Top summary bar — shared between desktop and mobile */}
      <SelectionSummary count={selected.size} />

      {/* Desktop: SVG wheel (md+) */}
      <div className="hidden md:flex md:flex-col md:items-center md:gap-6">
        <WheelDesktop
          selected={selected}
          expandedSub={expandedSub}
          onCategoryClick={(name) => toggle(name)}
          onSubClick={handleSubClick}
        />
        <ExpandedTertiaryPanel
          expandedSub={expandedSub}
          selected={selected}
          onToggle={toggle}
        />
      </div>

      {/* Mobile: accordion list (<md) */}
      <div className="md:hidden">
        <CategoryList
          selected={selected}
          expandedCat={expandedCat}
          onCategoryToggle={(name) =>
            setExpandedCat(expandedCat === name ? null : name)
          }
          onToggle={toggle}
        />
      </div>

      {/* Selected breadcrumbs — shared */}
      {selectedList.length > 0 && (
        <div>
          <p className="font-hand mb-2 text-sm text-ink-muted">選んだ風味</p>
          <ul className="flex flex-col gap-1.5 text-sm text-ink-soft">
            {selectedList.map((k) => (
              <li key={k} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary opacity-70" />
                <span>{k.replaceAll(">", " › ")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─────────────────── Selection summary ───────────────────

function SelectionSummary({ count }: { count: number }) {
  return (
    <div className="flex items-baseline justify-between border-b border-border pb-3">
      <span
        className="font-hand text-base text-ink-muted"
        style={{ transform: "rotate(-1deg)", display: "inline-block" }}
      >
        flavor
      </span>
      <div className="flex items-baseline gap-2">
        <span
          className="text-2xl font-medium text-primary"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {count}
        </span>
        <span className="text-xs text-ink-muted">selected</span>
      </div>
    </div>
  );
}

// ─────────────────── Mobile: category accordion list ───────────────────

function CategoryList({
  selected,
  expandedCat,
  onCategoryToggle,
  onToggle,
}: {
  selected: Set<SelectedKey>;
  expandedCat: string | null;
  onCategoryToggle: (name: string) => void;
  onToggle: (key: SelectedKey) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {FLAVOR_WHEEL.map((cat) => {
        const isOpen = expandedCat === cat.name;
        const selectedInCat = countSelectedIn(selected, cat.name);
        return (
          <article
            key={cat.name}
            className="overflow-hidden rounded-2xl border border-border bg-paper"
          >
            <button
              type="button"
              onClick={() => onCategoryToggle(cat.name)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/40"
              aria-expanded={isOpen}
            >
              <span
                className="size-3.5 shrink-0 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[cat.name] }}
                aria-hidden
              />
              <div className="flex-1">
                <div className="text-base font-medium text-ink">{cat.jp}</div>
                <div className="text-[11px] tracking-wider uppercase text-ink-muted">
                  {cat.name}
                </div>
              </div>
              {selectedInCat > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {selectedInCat}
                </span>
              )}
              <ChevronIcon
                className={
                  "size-4 text-ink-muted transition-transform " +
                  (isOpen ? "rotate-180" : "")
                }
              />
            </button>
            {isOpen && <CategoryDetails cat={cat} selected={selected} onToggle={onToggle} />}
          </article>
        );
      })}
    </div>
  );
}

function CategoryDetails({
  cat,
  selected,
  onToggle,
}: {
  cat: Category;
  selected: Set<SelectedKey>;
  onToggle: (key: SelectedKey) => void;
}) {
  return (
    <div className="border-t border-border bg-background/40 px-4 py-4">
      <div className="flex flex-col gap-3">
        {cat.subcategories.map((sub) => {
          const subKey = `${cat.name}>${sub.name}`;
          const isSelected = selected.has(subKey);
          const hasMultipleTertiary = sub.tertiary.length > 1;
          return (
            <div key={sub.name}>
              <button
                type="button"
                onClick={() => onToggle(subKey)}
                aria-pressed={isSelected}
                className={
                  "flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-colors " +
                  (isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-paper text-ink-soft hover:bg-muted")
                }
              >
                <span className="text-sm font-medium">{sub.jp ?? sub.name}</span>
                {hasMultipleTertiary && (
                  <span className="text-[11px] opacity-70">
                    {sub.tertiary.length} 詳細
                  </span>
                )}
              </button>
              {isSelected && hasMultipleTertiary && (
                <div className="mt-2 flex flex-wrap gap-1.5 pl-3">
                  {sub.tertiary.map((t) => {
                    const tKey = `${subKey}>${t}`;
                    const isTSelected = selected.has(tKey);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => onToggle(tKey)}
                        aria-pressed={isTSelected}
                        className={
                          "rounded-full border px-2.5 py-1 text-[12px] transition-colors " +
                          (isTSelected
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-border bg-background text-ink-soft hover:border-primary")
                        }
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function countSelectedIn(selected: Set<SelectedKey>, catName: string): number {
  let n = 0;
  for (const key of selected) {
    if (key === catName || key.startsWith(`${catName}>`)) n++;
  }
  return n;
}

function ChevronIcon({ className }: { className?: string }) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// ─────────────────── Desktop: SVG wheel ───────────────────

function WheelDesktop({
  selected,
  expandedSub,
  onCategoryClick,
  onSubClick,
}: {
  selected: Set<SelectedKey>;
  expandedSub: string | null;
  onCategoryClick: (name: string) => void;
  onSubClick: (catName: string, subName: string) => void;
}) {
  const segments = useMemo(() => buildSegments(), []);

  return (
    <svg
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      className="w-full max-w-[620px] select-none"
      role="figure"
      aria-label="SCA フレーバーホイール"
    >
      <defs>
        {[...segments.inner, ...segments.outer].map((seg) => (
          <path
            key={`label-arc-${seg.key}`}
            id={`label-arc-${cssId(seg.key)}`}
            d={seg.labelArc}
            fill="none"
          />
        ))}
      </defs>

      {/* Outer ring: subcategories */}
      {segments.outer.map((seg) => {
        const isSelected = selected.has(seg.key);
        const isExpanded = expandedSub === seg.key;
        const labelColor = isSelected
          ? "var(--color-primary-foreground)"
          : DARK_CATEGORIES.has(seg.cat)
            ? "var(--color-paper)"
            : "var(--color-ink)";
        return (
          <g key={seg.key}>
            <path
              d={seg.path}
              fill={isSelected ? "var(--color-primary)" : seg.color}
              fillOpacity={isSelected ? 1 : 0.7}
              stroke={isSelected ? "var(--color-primary)" : "var(--color-background)"}
              strokeWidth={isSelected ? 2.5 : 1.2}
              onClick={() => onSubClick(seg.cat, seg.sub)}
              className="cursor-pointer"
              style={{
                transition: "fill-opacity 200ms ease, stroke-width 200ms ease",
              }}
            >
              <title>{`${seg.cat} › ${seg.sub}`}</title>
            </path>
            {seg.minorWidthAngle > 0.16 && (
              <text
                fontFamily="var(--font-sans)"
                fontSize={11}
                fontWeight={isExpanded ? 700 : 500}
                fill={labelColor}
                pointerEvents="none"
              >
                <textPath
                  href={`#label-arc-${cssId(seg.key)}`}
                  startOffset="50%"
                  textAnchor="middle"
                >
                  {seg.subJp ?? seg.sub}
                </textPath>
              </text>
            )}
          </g>
        );
      })}

      {/* Inner ring: broad categories */}
      {segments.inner.map((seg) => {
        const isSelected = selected.has(seg.key);
        const labelColor = isSelected
          ? "var(--color-primary-foreground)"
          : DARK_CATEGORIES.has(seg.cat)
            ? "var(--color-paper)"
            : "var(--color-ink)";
        return (
          <g key={seg.key}>
            <path
              d={seg.path}
              fill={isSelected ? "var(--color-primary)" : seg.color}
              fillOpacity={isSelected ? 1 : 0.9}
              stroke={isSelected ? "var(--color-primary)" : "var(--color-background)"}
              strokeWidth={isSelected ? 2.5 : 1.4}
              onClick={() => onCategoryClick(seg.cat)}
              className="cursor-pointer"
              style={{ transition: "fill-opacity 200ms ease, stroke-width 200ms ease" }}
            >
              <title>{seg.cat}</title>
            </path>
            <text
              fontFamily="var(--font-sans)"
              fontSize={15}
              fontWeight={600}
              fill={labelColor}
              pointerEvents="none"
              letterSpacing="0.02em"
            >
              <textPath
                href={`#label-arc-${cssId(seg.key)}`}
                startOffset="50%"
                textAnchor="middle"
              >
                {seg.catJp}
              </textPath>
            </text>
          </g>
        );
      })}

      {/* Center hub */}
      <circle
        cx={CX}
        cy={CY}
        r={R_INNER - 6}
        fill="var(--color-paper)"
        stroke="var(--color-border)"
        strokeWidth={1}
      />
      <text
        x={CX}
        y={CY - 8}
        textAnchor="middle"
        fill="var(--color-ink-muted)"
        fontSize={12}
        fontFamily="var(--font-hand)"
      >
        flavor
      </text>
      <text
        x={CX}
        y={CY + 18}
        textAnchor="middle"
        fill="var(--color-primary)"
        fontSize={28}
        fontWeight={500}
        fontFamily="var(--font-heading)"
      >
        {selected.size}
      </text>
      <text
        x={CX}
        y={CY + 38}
        textAnchor="middle"
        fill="var(--color-ink-muted)"
        fontSize={10}
      >
        selected
      </text>
    </svg>
  );
}

function ExpandedTertiaryPanel({
  expandedSub,
  selected,
  onToggle,
}: {
  expandedSub: string | null;
  selected: Set<SelectedKey>;
  onToggle: (key: SelectedKey) => void;
}) {
  if (!expandedSub) return null;
  const [catName, subName] = expandedSub.split(">");
  const expanded = FLAVOR_WHEEL.find((c) => c.name === catName)?.subcategories.find(
    (s) => s.name === subName,
  );
  if (!expanded) return null;

  return (
    <div className="w-full max-w-[620px] rounded-2xl border border-border bg-paper p-5">
      <div className="mb-3">
        <span
          className="font-hand text-base text-ink-muted"
          style={{ transform: "rotate(-1deg)", display: "inline-block" }}
        >
          {expandedSub.replaceAll(">", " › ")}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {expanded.tertiary.map((t) => {
          const tKey = `${expandedSub}>${t}`;
          const isSelected = selected.has(tKey);
          return (
            <button
              key={t}
              type="button"
              onClick={() => onToggle(tKey)}
              className={
                "rounded-full border px-3 py-1.5 text-xs transition-colors " +
                (isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-ink-soft hover:border-primary hover:text-primary")
              }
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────── Geometry helpers ───────────────────

type InnerSegment = {
  key: SelectedKey;
  cat: string;
  catJp: string;
  path: string;
  labelArc: string;
  color: string;
  midAngle: number;
};

type OuterSegment = {
  key: SelectedKey;
  cat: string;
  sub: string;
  subJp?: string;
  path: string;
  labelArc: string;
  color: string;
  midAngle: number;
  minorWidthAngle: number;
};

function buildSegments(): { inner: InnerSegment[]; outer: OuterSegment[] } {
  const inner: InnerSegment[] = [];
  const outer: OuterSegment[] = [];

  const numCats = FLAVOR_WHEEL.length;
  const catArc = TAU / numCats;

  FLAVOR_WHEEL.forEach((cat, ci) => {
    const start = ci * catArc;
    const end = start + catArc;
    const mid = (start + end) / 2;
    const color = CATEGORY_COLORS[cat.name] ?? cat.color;

    inner.push({
      key: cat.name,
      cat: cat.name,
      catJp: cat.jp,
      path: donutSegmentPath(CX, CY, R_INNER, R_MID, start, end),
      labelArc: labelArcPath(CX, CY, (R_INNER + R_MID) / 2, start, end),
      color,
      midAngle: mid,
    });

    const subs = cat.subcategories;
    const subArc = catArc / subs.length;
    subs.forEach((sub, si) => {
      const sStart = start + si * subArc;
      const sEnd = sStart + subArc;
      const sMid = (sStart + sEnd) / 2;
      outer.push({
        key: `${cat.name}>${sub.name}`,
        cat: cat.name,
        sub: sub.name,
        subJp: sub.jp,
        path: donutSegmentPath(CX, CY, R_MID, R_OUTER, sStart, sEnd),
        labelArc: labelArcPath(CX, CY, (R_MID + R_OUTER) / 2, sStart, sEnd),
        color,
        midAngle: sMid,
        minorWidthAngle: subArc,
      });
    });
  });

  return { inner, outer };
}

function labelArcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const mid = (startAngle + endAngle) / 2;
  const normMid = ((mid % TAU) + TAU) % TAU;
  const topHalf = normMid < HALF_PI || normMid > Math.PI + HALF_PI;

  const drawStart = topHalf ? startAngle : endAngle;
  const drawEnd = topHalf ? endAngle : startAngle;
  const sweep = topHalf ? 1 : 0;
  const arcDelta = Math.abs(endAngle - startAngle);
  const largeArc = arcDelta > Math.PI ? 1 : 0;

  const p1 = polarToCartesian(cx, cy, r, drawStart);
  const p2 = polarToCartesian(cx, cy, r, drawEnd);

  return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} ${sweep} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
}

function cssId(key: string): string {
  return key.replace(/[^a-zA-Z0-9]/g, "_");
}
