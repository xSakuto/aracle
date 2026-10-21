"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Blendet [data-reveal]-Elemente einmalig ein, sobald sie ins Bild kommen.
export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"),
    );
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((el) => io.observe(el));
    // Sicherheitsnetz: nichts bleibt unsichtbar.
    const t = window.setTimeout(
      () => els.forEach((el) => el.getBoundingClientRect().top < innerHeight && el.classList.add("is-in")),
      1500,
    );
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [pathname]);

  return null;
}
