/**
 * Canonical URLs for the three design directions.
 *
 * Built from Vite's BASE_URL so the links stay correct whether the site is
 * served from a project subpath (/culture-peptides/) or a domain root (/).
 */
const B = import.meta.env.BASE_URL; // always ends in "/"

export const DIRECTIONS = [
  { n: "01", name: "Decoded", href: `${B}decoded/`, note: "Dark hype-brand" },
  { n: "02", name: "The Record", href: `${B}record/`, note: "Light analytical" },
  { n: "03", name: "The Vault", href: `${B}vault/`, note: "Everything" },
] as const;

export const DIR = {
  decoded: `${B}decoded/`,
  record: `${B}record/`,
  vault: `${B}vault/`,
};
