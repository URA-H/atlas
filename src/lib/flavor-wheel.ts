// SCA Coffee Taster's Flavor Wheel taxonomy (2016 / 2017 update).
// Atlas が採用する 9 大カテゴリ × 中分類 × (詳細) の階層。
// 色は SCA 公式に倣いつつ、atlas の古紙パレットに馴染むよう彩度を抑えてある。

export type Tertiary = string;

export type Subcategory = {
  name: string;
  jp?: string;
  tertiary: Tertiary[];
};

export type Category = {
  name: string;
  jp: string;
  /** OKLCH 色 — 古紙背景に馴染むトーン */
  color: string;
  subcategories: Subcategory[];
};

export const FLAVOR_WHEEL: Category[] = [
  {
    name: "Floral",
    jp: "花",
    color: "oklch(0.78 0.10 15)",
    subcategories: [
      { name: "Black Tea", jp: "紅茶", tertiary: ["Black Tea"] },
      {
        name: "Floral",
        jp: "花",
        tertiary: ["Chamomile", "Rose", "Jasmine"],
      },
    ],
  },
  {
    name: "Fruity",
    jp: "果実",
    color: "oklch(0.74 0.13 30)",
    subcategories: [
      {
        name: "Berry",
        jp: "ベリー",
        tertiary: ["Blackberry", "Raspberry", "Blueberry", "Strawberry"],
      },
      { name: "Dried Fruit", jp: "ドライフルーツ", tertiary: ["Raisin", "Prune"] },
      {
        name: "Other Fruit",
        jp: "その他果実",
        tertiary: [
          "Coconut",
          "Cherry",
          "Pomegranate",
          "Pineapple",
          "Grape",
          "Apple",
          "Peach",
          "Pear",
        ],
      },
      {
        name: "Citrus",
        jp: "柑橘",
        tertiary: ["Grapefruit", "Orange", "Lemon", "Lime"],
      },
    ],
  },
  {
    name: "Sour / Fermented",
    jp: "酸・発酵",
    color: "oklch(0.78 0.13 80)",
    subcategories: [
      {
        name: "Sour",
        jp: "酸",
        tertiary: [
          "Sour Aromatics",
          "Acetic Acid",
          "Butyric Acid",
          "Isovaleric Acid",
          "Citric Acid",
          "Malic Acid",
        ],
      },
      {
        name: "Alcohol / Fermented",
        jp: "発酵",
        tertiary: ["Winey", "Whiskey", "Fermented", "Overripe"],
      },
    ],
  },
  {
    name: "Green / Vegetative",
    jp: "緑・植物",
    color: "oklch(0.72 0.09 130)",
    subcategories: [
      { name: "Olive Oil", jp: "オリーブオイル", tertiary: ["Olive Oil"] },
      { name: "Raw", jp: "生の", tertiary: ["Raw"] },
      {
        name: "Green / Vegetative",
        jp: "青草",
        tertiary: [
          "Under-ripe",
          "Peapod",
          "Fresh",
          "Dark Green",
          "Vegetative",
          "Hay-like",
          "Herb-like",
        ],
      },
      { name: "Beany", jp: "豆っぽい", tertiary: ["Beany"] },
    ],
  },
  {
    name: "Other",
    jp: "その他",
    color: "oklch(0.78 0.02 80)",
    subcategories: [
      {
        name: "Papery / Musty",
        jp: "紙・カビ",
        tertiary: [
          "Stale",
          "Cardboard",
          "Papery",
          "Woody",
          "Moldy / Damp",
          "Musty / Dusty",
          "Musty / Earthy",
          "Animalic",
          "Meaty Brothy",
          "Phenolic",
        ],
      },
      {
        name: "Chemical",
        jp: "ケミカル",
        tertiary: [
          "Bitter",
          "Salty",
          "Medicinal",
          "Petroleum",
          "Skunky",
          "Rubber",
        ],
      },
    ],
  },
  {
    name: "Roasted",
    jp: "焙煎",
    color: "oklch(0.5 0.07 50)",
    subcategories: [
      { name: "Pipe Tobacco", jp: "パイプタバコ", tertiary: ["Pipe Tobacco"] },
      { name: "Tobacco", jp: "タバコ", tertiary: ["Tobacco"] },
      {
        name: "Burnt",
        jp: "焦げ",
        tertiary: ["Acrid", "Ashy", "Smoky", "Brown, Roast"],
      },
      { name: "Cereal", jp: "穀物", tertiary: ["Grain", "Malt"] },
    ],
  },
  {
    name: "Spices",
    jp: "スパイス",
    color: "oklch(0.6 0.12 28)",
    subcategories: [
      { name: "Pungent", jp: "刺激", tertiary: ["Pungent"] },
      { name: "Pepper", jp: "胡椒", tertiary: ["Pepper"] },
      {
        name: "Brown Spice",
        jp: "ブラウンスパイス",
        tertiary: ["Anise", "Nutmeg", "Cinnamon", "Clove"],
      },
    ],
  },
  {
    name: "Nutty / Cocoa",
    jp: "ナッツ・カカオ",
    color: "oklch(0.6 0.07 60)",
    subcategories: [
      {
        name: "Nutty",
        jp: "ナッツ",
        tertiary: ["Peanuts", "Hazelnut", "Almond"],
      },
      {
        name: "Cocoa",
        jp: "カカオ",
        tertiary: ["Chocolate", "Dark Chocolate"],
      },
    ],
  },
  {
    name: "Sweet",
    jp: "甘味",
    color: "oklch(0.78 0.12 80)",
    subcategories: [
      {
        name: "Brown Sugar",
        jp: "ブラウンシュガー",
        tertiary: ["Molasses", "Maple Syrup", "Caramelized", "Honey"],
      },
      { name: "Vanilla", jp: "バニラ", tertiary: ["Vanilla"] },
      { name: "Vanillin", jp: "バニリン", tertiary: ["Vanillin"] },
      { name: "Overall Sweet", jp: "甘味全般", tertiary: ["Overall Sweet"] },
      {
        name: "Sweet Aromatics",
        jp: "甘い香り",
        tertiary: ["Sweet Aromatics"],
      },
    ],
  },
];

// ─────────────────── Geometry helpers ───────────────────

/** Polar coordinates → Cartesian. angle in radians, 0 starts at 12 o'clock. */
export function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angle: number,
) {
  return {
    x: cx + r * Math.cos(angle - Math.PI / 2),
    y: cy + r * Math.sin(angle - Math.PI / 2),
  };
}

/** SVG path for a donut segment between (r1, r2) from startAngle to endAngle. */
export function donutSegmentPath(
  cx: number,
  cy: number,
  r1: number,
  r2: number,
  startAngle: number,
  endAngle: number,
): string {
  const p1 = polarToCartesian(cx, cy, r2, startAngle);
  const p2 = polarToCartesian(cx, cy, r2, endAngle);
  const p3 = polarToCartesian(cx, cy, r1, endAngle);
  const p4 = polarToCartesian(cx, cy, r1, startAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return [
    `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `A ${r2} ${r2} 0 ${largeArc} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    `L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
    `A ${r1} ${r1} 0 ${largeArc} 0 ${p4.x.toFixed(2)} ${p4.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

/** Total subcategories across all categories (used to split outer ring evenly). */
export function totalSubcategories(): number {
  return FLAVOR_WHEEL.reduce((s, c) => s + c.subcategories.length, 0);
}
