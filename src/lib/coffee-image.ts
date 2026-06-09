// Compose a Hugging Face FLUX.1-schnell prompt for an atlas-style watercolor
// illustration of a coffee karte. The actual API call lives in
// /api/coffee/[id]/image and the result is cached at the Vercel edge.

const ROAST_WORD: Record<string, string> = {
  LIGHT: "light",
  MEDIUM_LIGHT: "medium-light",
  MEDIUM: "medium",
  MEDIUM_DARK: "medium-dark",
  DARK: "dark",
};

const FLAVOR_HINTS: Record<string, string> = {
  Floral: "delicate floral notes",
  Fruity: "ripe fruit overtones",
  "Sour / Fermented": "bright acidity",
  "Green / Vegetative": "fresh herbal undertones",
  Roasted: "deep roasted warmth",
  Spices: "warm spice hints",
  "Nutty / Cocoa": "cocoa and nut warmth",
  Sweet: "honeyed sweetness",
  Other: "earthy undertones",
};

export type CoffeeSeed = {
  name: string;
  origin?: string | null;
  region?: string | null;
  roastLevel?: string | null;
  brewMethod?: string | null;
  flavors: string[];
};

export function buildCoffeeImagePrompt(c: CoffeeSeed): string {
  const parts: string[] = [];

  parts.push("vintage watercolor illustration");
  parts.push("hand-painted travel journal style");
  parts.push("loose brushwork, soft pencil outlines");

  const place = [c.origin, c.region].filter(Boolean).join(" ");
  if (place) {
    parts.push(`a still life of ${place} specialty coffee`);
  } else {
    parts.push("a still life of specialty coffee");
  }

  if (c.roastLevel && ROAST_WORD[c.roastLevel]) {
    parts.push(`${ROAST_WORD[c.roastLevel]} roast beans nearby`);
  }

  if (c.brewMethod === "Espresso") {
    parts.push("in a small porcelain demitasse on a saucer");
  } else if (
    c.brewMethod === "V60" ||
    c.brewMethod === "Aeropress" ||
    c.brewMethod === "Kalita" ||
    c.brewMethod === "Chemex"
  ) {
    parts.push("in a ceramic pour-over cup with a wooden table");
  } else if (c.brewMethod === "French Press") {
    parts.push("in a glass mug beside a French press");
  } else {
    parts.push("in a hand-thrown ceramic mug");
  }

  const categories = new Set(c.flavors.map((f) => f.split(">")[0]));
  const hints: string[] = [];
  for (const cat of categories) {
    const h = FLAVOR_HINTS[cat];
    if (h) hints.push(h);
  }
  if (hints.length > 0) {
    parts.push(`evoking ${hints.slice(0, 2).join(" and ")}`);
  }

  parts.push("soft morning light");
  parts.push("muted earthy tones");
  parts.push("cream, kraft paper, and deep brown palette");
  parts.push("atmospheric, contemplative, slow-living mood");
  parts.push("vintage atlas page background");
  parts.push("no text, no labels, no captions");

  return parts.join(", ");
}

/** Stable proxy URL for the AI-generated illustration. */
export function coffeeImageUrl(id: string): string {
  return `/api/coffee/${id}/image`;
}
