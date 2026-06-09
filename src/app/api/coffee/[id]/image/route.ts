import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildCoffeeImagePrompt } from "@/lib/coffee-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HF_URL =
  "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell";

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  const { id } = await params;

  const coffee = await prisma.coffee.findUnique({
    where: { id },
    select: {
      isPublic: true,
      name: true,
      origin: true,
      region: true,
      roastLevel: true,
      brewMethod: true,
      flavors: true,
    },
  });

  if (!coffee) {
    return new NextResponse("not found", { status: 404 });
  }
  if (!coffee.isPublic) {
    return new NextResponse("forbidden", { status: 403 });
  }

  const token = process.env.HUGGINGFACE_TOKEN;
  if (!token) {
    return new NextResponse("server not configured", { status: 500 });
  }

  const prompt = buildCoffeeImagePrompt(coffee);

  const hfRes = await fetch(HF_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: prompt }),
  });

  if (!hfRes.ok) {
    const detail = await hfRes.text().catch(() => "");
    return new NextResponse(`upstream error ${hfRes.status}: ${detail.slice(0, 200)}`, {
      status: 502,
    });
  }

  const body = await hfRes.arrayBuffer();
  const contentType = hfRes.headers.get("content-type") ?? "image/jpeg";

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      // Cache aggressively at the edge; the prompt is stable per coffee.
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=2592000",
    },
  });
}
