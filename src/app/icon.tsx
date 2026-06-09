import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FAF6EE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width={26}
          height={26}
          viewBox="0 0 32 32"
          stroke="#5C3A21"
          strokeWidth={2}
          fill="none"
        >
          <circle cx="16" cy="16" r="12.5" />
          <path d="M16 4 L18 16 L16 28 L14 16 Z" fill="#5C3A21" />
          <path d="M4 16 L16 14 L28 16 L16 18 Z" />
        </svg>
      </div>
    ),
    size,
  );
}
