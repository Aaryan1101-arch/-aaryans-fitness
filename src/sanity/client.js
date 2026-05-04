import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.REACT_APP_SANITY_PROJECT_ID;
const dataset = process.env.REACT_APP_SANITY_DATASET || "production";

// If env vars are missing the site still renders (using fallback content).
// We log a hint so misconfiguration is obvious during development.
if (!projectId) {
  // eslint-disable-next-line no-console
  console.warn(
    "[sanity] REACT_APP_SANITY_PROJECT_ID is not set — site will use fallback content. " +
      "Set it in .env.local for local dev or in Vercel project settings for production."
  );
}

export const sanityConfigured = Boolean(projectId);

export const client = sanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: true, // CDN cache, fine for public content
    })
  : null;

const builder = client ? imageUrlBuilder(client) : null;

/**
 * urlFor(image) → URL string for a Sanity image asset.
 * Returns null if Sanity isn't configured or the image is missing,
 * so callers can fall back gracefully.
 */
export function urlFor(image) {
  if (!builder || !image) return null;
  try {
    return builder.image(image).auto("format").quality(82).url();
  } catch {
    return null;
  }
}
