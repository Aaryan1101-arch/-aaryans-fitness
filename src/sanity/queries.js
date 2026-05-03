// One round-trip GROQ query that pulls everything the site needs.
// Keep it small — this site is single-page so caching one big response is fine.
export const SITE_CONTENT_QUERY = `{
  "siteSettings": *[_type == "siteSettings"][0],
  "hero": *[_type == "heroSection"][0],
  "plans": *[_type == "membershipPlan"] | order(order asc),
  "services": *[_type == "service"] | order(order asc),
  "gallery": *[_type == "galleryItem"] | order(order asc),
  "team": *[_type == "teamMember"] | order(order asc),
  "reviews": *[_type == "review"] | order(order asc)
}`;
