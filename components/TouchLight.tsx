"use client";

import { useEffect } from "react";

// Auf Touch-Geräten gibt es kein Überfahren. Dort wird eine .duo-host-Karte farbig,
// solange sie mittig im Bild steht.
export default function TouchLight() {
  useEffect(() => {
    if (!matchMedia("(hover: none)").matches || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("is-lit", e.isIntersecting)),
      { rootMargin: "-35% 0px -35% 0px" },
    );
    document.querySelectorAll(".duo-host").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
