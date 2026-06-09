import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "atlas — a coffee journal of the world";

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

export default async function Image() {
  const [fraunces, caveat, inter] = await Promise.all([
    loadGoogleFont("Fraunces", 500),
    loadGoogleFont("Caveat", 500),
    loadGoogleFont("Inter", 500),
  ]);

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
        {/* Compass watermark */}
        <div
          style={{
            position: "absolute",
            right: -140,
            top: 40,
            width: 560,
            height: 560,
            display: "flex",
            opacity: 0.08,
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
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg
              width={36}
              height={36}
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
                fontSize: 34,
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
              fontSize: 28,
              color: "#7A6B57",
              transform: "rotate(-1.2deg)",
            }}
          >
            a coffee journal of the world
          </span>
        </div>

        {/* Main */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginTop: 32,
            maxWidth: 920,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Fraunces",
              fontSize: 96,
              fontWeight: 500,
              lineHeight: 1.05,
              color: "#2A2118",
              letterSpacing: "-0.025em",
            }}
          >
            Map every cup.
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Fraunces",
              fontSize: 96,
              fontWeight: 500,
              lineHeight: 1.05,
              color: "#5C3A21",
              letterSpacing: "-0.025em",
              marginTop: 4,
            }}
          >
            Share it as a page.
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#7A6B57",
              marginTop: 36,
            }}
          >
            飲んだ一杯を、産地と風味と一緒に綴じていく地図帳。
          </div>
        </div>

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
          <span>atlas — a coffee journal</span>
          <span style={{ fontFamily: "Inter", fontSize: 16, letterSpacing: "0.08em" }}>
            ATLAS-EIGHT-MAUVE.VERCEL.APP
          </span>
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
