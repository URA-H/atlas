import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "atlas — a coffee journal";

type Params = Promise<{ id: string }>;

async function loadGoogleFont(family: string, weight: number) {
  const cssRes = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`,
    { headers: { "User-Agent": "Mozilla/5.0" } },
  );
  const css = await cssRes.text();
  const url = css.match(/src: url\((https:[^)]+)\) format/)?.[1];
  if (!url) throw new Error(`Font URL not found for ${family}`);
  const fontRes = await fetch(url);
  return fontRes.arrayBuffer();
}

const ROAST_LABEL: Record<string, string> = {
  LIGHT: "Light",
  MEDIUM_LIGHT: "Medium-Light",
  MEDIUM: "Medium",
  MEDIUM_DARK: "Medium-Dark",
  DARK: "Dark",
};
const ROAST_COLOR: Record<string, string> = {
  LIGHT: "#9B7A4A",
  MEDIUM_LIGHT: "#84613B",
  MEDIUM: "#6E4A2C",
  MEDIUM_DARK: "#523822",
  DARK: "#2F1F13",
};

export default async function Image({ params }: { params: Params }) {
  const { id } = await params;

  const coffee = await prisma.coffee.findUnique({
    where: { id },
    include: { user: { select: { name: true } } },
  });

  if (!coffee || !coffee.isPublic) notFound();

  const [fraunces, caveat, inter] = await Promise.all([
    loadGoogleFont("Fraunces", 500),
    loadGoogleFont("Caveat", 500),
    loadGoogleFont("Inter", 500),
  ]);

  const origin = [coffee.origin, coffee.region].filter(Boolean).join(" · ");
  const date = coffee.createdAt.toISOString().slice(0, 10);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FAF6EE",
          display: "flex",
          flexDirection: "column",
          padding: "56px 72px",
          fontFamily: "Inter",
          color: "#2A2118",
          position: "relative",
        }}
      >
        {/* Subtle compass watermark on the right */}
        <div
          style={{
            position: "absolute",
            right: -120,
            top: 60,
            width: 500,
            height: 500,
            display: "flex",
            opacity: 0.06,
          }}
        >
          <svg viewBox="0 0 200 200" stroke="#5C3A21" strokeWidth={0.6} fill="none">
            <circle cx="100" cy="100" r="88" strokeDasharray="1.4 2.8" />
            <circle cx="100" cy="100" r="64" />
            <circle cx="100" cy="100" r="34" />
            <path d="M100 12 L106 100 L100 188 L94 100 Z" fill="#5C3A21" />
            <path d="M12 100 L100 94 L188 100 L100 106 Z" fill="#5C3A21" />
            <path d="M37 37 L100 96 L163 163 L97 104 Z" />
            <path d="M37 163 L96 100 L163 37 L104 96 Z" />
          </svg>
        </div>

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg
              width={32}
              height={32}
              viewBox="0 0 32 32"
              stroke="#5C3A21"
              strokeWidth={1.5}
              fill="none"
            >
              <circle cx="16" cy="16" r="12.5" />
              <path d="M16 4 L18 16 L16 28 L14 16 Z" fill="#5C3A21" />
              <path d="M4 16 L16 14 L28 16 L16 18 Z" />
            </svg>
            <span
              style={{
                fontFamily: "Fraunces",
                fontSize: 30,
                color: "#2A2118",
                letterSpacing: "-0.01em",
              }}
            >
              atlas
            </span>
          </div>
          <span
            style={{
              fontFamily: "Caveat",
              fontSize: 26,
              color: "#7A6B57",
              transform: "rotate(-1deg)",
            }}
          >
            a coffee journal
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          {origin && (
            <div
              style={{
                display: "flex",
                fontSize: 24,
                color: "#7A6B57",
                marginBottom: 14,
                letterSpacing: "0.01em",
              }}
            >
              {origin}
            </div>
          )}

          <div
            style={{
              display: "flex",
              fontFamily: "Fraunces",
              fontSize: 104,
              fontWeight: 500,
              lineHeight: 1.05,
              color: "#2A2118",
              letterSpacing: "-0.02em",
              maxWidth: 950,
            }}
          >
            {coffee.name}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginTop: 22,
              fontSize: 18,
            }}
          >
            {coffee.roaster && (
              <span
                style={{
                  color: "#5C3A21",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                }}
              >
                {coffee.roaster}
              </span>
            )}
            {coffee.roastLevel && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#5C3A21",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    background: ROAST_COLOR[coffee.roastLevel] ?? "#5C3A21",
                  }}
                />
                {ROAST_LABEL[coffee.roastLevel]} Roast
              </span>
            )}
            {coffee.brewMethod && (
              <span style={{ color: "#5C3A21" }}>· {coffee.brewMethod}</span>
            )}
          </div>
        </div>

        {/* Flavors */}
        {coffee.flavors.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginBottom: 28,
              maxWidth: 920,
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: "Caveat",
                fontSize: 22,
                color: "#7A6B57",
                marginBottom: 4,
                transform: "rotate(-0.4deg)",
              }}
            >
              tasting
            </div>
            {coffee.flavors.slice(0, 3).map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 22,
                  color: "#4A3D2E",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    background: "#5C3A21",
                  }}
                />
                <span>{f.replaceAll(">", " › ")}</span>
              </div>
            ))}
            {coffee.flavors.length > 3 && (
              <div
                style={{
                  display: "flex",
                  fontSize: 18,
                  color: "#7A6B57",
                  marginTop: 2,
                  paddingLeft: 16,
                }}
              >
                + {coffee.flavors.length - 3} more
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            borderTop: "1px solid #D5C9B5",
            paddingTop: 16,
            fontFamily: "Caveat",
            fontSize: 22,
            color: "#7A6B57",
          }}
        >
          <span>atlas of @{coffee.user.name ?? "anon"}</span>
          <span>{date}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, style: "normal", weight: 500 },
        { name: "Caveat", data: caveat, style: "normal", weight: 500 },
        { name: "Inter", data: inter, style: "normal", weight: 500 },
      ],
    },
  );
}
