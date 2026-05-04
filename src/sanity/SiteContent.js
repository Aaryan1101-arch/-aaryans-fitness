import React, { createContext, useContext } from "react";
import { urlFor } from "./client";
import { useSupabaseContent } from "../supabase/useContent";

const SiteContentContext = createContext(null);

// Resolves any image value to a URL string:
//   - plain string URL (Supabase Storage)        → return as-is
//   - { _local: true, src }  (bundled asset)     → return src
//   - Sanity image reference                      → urlFor()
//   - null/undefined                              → null
export function imgUrl(image) {
  if (!image) return null;
  if (typeof image === "string") return image;
  if (image._local) return image.src;
  return urlFor(image);
}

export function SiteContentProvider({ children }) {
  const value = useSupabaseContent();
  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
