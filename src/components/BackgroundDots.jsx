"use client";
import React, { useEffect, useRef } from "react";
import { useDashboardStore } from "@/store/dashboardStore";

export default function BackgroundDots() {
  const canvasRef = useRef(null);
  const isDarkMode = useDashboardStore((s) => s.isDarkMode);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf = null;

    function render() {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(window.innerWidth, 300);
      const h = Math.max(window.innerHeight, 300);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const spacing = 24;
      const radius = 1.6;
      const baseAlpha = isDarkMode ? 0.06 : 0.08;

      const fadeStart = 0.0;
      const fadeEnd = 1;  

      for (let y = 0; y < h; y += spacing) {
        const t = y / h;
        // linear fade multiplier
        let mult = 1 - (t - fadeStart) / (fadeEnd - fadeStart);
        if (mult > 1) mult = 1;
        if (mult < 0) mult = 0;

        const rowOffset = (Math.floor(y / spacing) % 2) * (spacing / 2);
        for (let x = 0; x < w; x += spacing) {
          const cx = x + rowOffset + spacing / 2;
          const cy = y + spacing / 2;
          const alpha = baseAlpha * mult;
          if (alpha <= 0) continue;
          const color = isDarkMode ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function onResize() {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(render);
    }

    onResize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isDarkMode]);

  return (
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
      />
  );
}
