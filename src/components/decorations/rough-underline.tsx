"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";

export function RoughUnderline({
  width = 320,
  color = "var(--primary)",
}: {
  width?: number;
  color?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    svg.replaceChildren();

    const computedColor = getComputedStyle(svg).getPropertyValue("color").trim() || "#5C3A21";
    const rc = rough.svg(svg);

    const node = rc.curve(
      [
        [6, 14],
        [width * 0.25, 8],
        [width * 0.5, 12],
        [width * 0.75, 6],
        [width - 6, 11],
      ],
      {
        stroke: computedColor,
        strokeWidth: 2.4,
        roughness: 1.6,
        bowing: 1.5,
      }
    );
    svg.appendChild(node);
  }, [width]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} 22`}
      preserveAspectRatio="none"
      style={{ width, height: 22, color, display: "block" }}
      aria-hidden="true"
    />
  );
}
