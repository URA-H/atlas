"use server";

import { redirect } from "next/navigation";
import type { RoastLevel } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const ROAST_VALUES = ["LIGHT", "MEDIUM_LIGHT", "MEDIUM", "MEDIUM_DARK", "DARK"] as const;

export async function createCoffee(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const name = ((formData.get("name") as string) ?? "").trim();
  if (!name) throw new Error("コーヒー名は必須です");

  const flavorsRaw = (formData.get("flavors") as string) ?? "[]";
  let flavors: string[] = [];
  try {
    const parsed = JSON.parse(flavorsRaw);
    if (Array.isArray(parsed)) flavors = parsed.filter((s) => typeof s === "string");
  } catch {
    flavors = [];
  }

  const toStr = (key: string): string | null => {
    const v = ((formData.get(key) as string) ?? "").trim();
    return v ? v : null;
  };
  const toInt = (key: string): number | null => {
    const v = formData.get(key);
    if (v === null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? Math.round(n) : null;
  };
  const toFloat = (key: string): number | null => {
    const v = formData.get(key);
    if (v === null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const toRoast = (): RoastLevel | null => {
    const v = (formData.get("roastLevel") as string) ?? "";
    return (ROAST_VALUES as readonly string[]).includes(v) ? (v as RoastLevel) : null;
  };

  const coffee = await prisma.coffee.create({
    data: {
      userId: session.user.id,
      name,
      roaster: toStr("roaster"),
      origin: toStr("origin"),
      region: toStr("region"),
      roastLevel: toRoast(),
      brewMethod: toStr("brewMethod"),
      brewTemp: toInt("brewTemp"),
      brewRatio: toStr("brewRatio"),
      doseG: toFloat("doseG"),
      waterMl: toInt("waterMl"),
      notes: toStr("notes"),
      scoreAcidity: toInt("scoreAcidity"),
      scoreSweetness: toInt("scoreSweetness"),
      scoreBitterness: toInt("scoreBitterness"),
      scoreBody: toInt("scoreBody"),
      scoreAftertaste: toInt("scoreAftertaste"),
      flavors,
    },
  });

  redirect(`/coffee/${coffee.id}`);
}
