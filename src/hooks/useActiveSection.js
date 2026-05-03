import { useEffect, useState } from "react";

/**
 * Tracks which of the given section IDs is currently in view.
 * Uses IntersectionObserver — scrolling between sections updates the active id
 * so the navbar can highlight the corresponding link.
 */
export default function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] || null);

  useEffect(() => {
    if (!ids || !ids.length || typeof window === "undefined") return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return;

    // Track the entry whose centre is closest to the viewport top edge,
    // weighted by how visible it is.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
