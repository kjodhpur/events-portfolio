"use client";
import { useEffect, useRef } from "react";

// Muted video that plays while it's in view and pauses when it scrolls away.
export function AutoVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { v.play().catch(() => {}); }
          else { v.pause(); }
        }
      },
      { threshold: 0.5 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return <video ref={ref} src={src} muted loop playsInline preload="metadata" controls />;
}
