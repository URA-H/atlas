"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";

const PALETTE = ["#8B5A3C", "#7C8559", "#9B3A2A"] as const;

export function RoughFrame({ index = 0 }: { index?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const draw = () => {
      const wrap = wrapRef.current;
      const svg = svgRef.current;
      if (!wrap || !svg) return;

      const parent = wrap.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      if (width === 0 || height === 0) return;

      const w = Math.round(width) + 4;
      const h = Math.round(height) + 4;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      svg.setAttribute("width", String(w));
      svg.setAttribute("height", String(h));

      svg.replaceChildren();
      const rc = rough.svg(svg);
      const node = rc.rectangle(2, 2, w - 4, h - 4, {
        stroke: PALETTE[index % PALETTE.length],
        strokeWidth: 1.4,
        roughness: 1.5,
        fillStyle: "solid",
      });
      svg.appendChild(node);
    };

    draw();
    const ro = new ResizeObserver(() => draw());
    if (wrapRef.current?.parentElement) {
      ro.observe(wrapRef.current.parentElement);
    }
    return () => ro.disconnect();
  }, [index]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: -2,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <svg ref={svgRef} style={{ position: "absolute", top: 0, left: 0 }} />
    </div>
  );
}
