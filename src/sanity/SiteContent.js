import React, { createContext, useContext, useEffect, useState } from "react";
import { client, sanityConfigured, urlFor } from "./client";
import { SITE_CONTENT_QUERY } from "./queries";
import { FALLBACK_CONTENT } from "./fallbackContent";

const SiteContentContext = createContext({
  content: FALLBACK_CONTENT,
  isLoading: false,
  source: "fallback",
});

/**
 * Resolve any image-shaped value to a URL string.
 * Handles three cases:
 *   - { _local: true, src } → return src directly (bundled asset / external URL)
 *   - Sanity image asset → run through urlFor()
 *   - missing → return null
 */
export function imgUrl(image) {
  if (!image) return null;
  if (image._local) return image.src;
  return urlFor(image);
}

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(FALLBACK_CONTENT);
  const [isLoading, setIsLoading] = useState(sanityConfigured);
  const [source, setSource] = useState(sanityConfigured ? "loading" : "fallback");

  useEffect(() => {
    if (!sanityConfigured || !client) return;
    let cancelled = false;
    client
      .fetch(SITE_CONTENT_QUERY)
      .then((data) => {
        if (cancelled) return;
        // Merge with fallback so missing fields don't blow up the UI.
        setContent({
          siteSettings: data.siteSettings || FALLBACK_CONTENT.siteSettings,
          hero: data.hero || FALLBACK_CONTENT.hero,
          plans: data.plans?.length ? data.plans : FALLBACK_CONTENT.plans,
          services: data.services?.length ? data.services : FALLBACK_CONTENT.services,
          gallery: data.gallery?.length ? data.gallery : FALLBACK_CONTENT.gallery,
          team: data.team?.length ? data.team : FALLBACK_CONTENT.team,
          reviews: data.reviews?.length ? data.reviews : FALLBACK_CONTENT.reviews,
        });
        setSource("sanity");
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.warn("[sanity] fetch failed, using fallback content:", err);
        setSource("fallback");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteContentContext.Provider value={{ content, isLoading, source }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
