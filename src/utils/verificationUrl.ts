export function getPublicSiteOrigin() {
  const envOrigin = import.meta.env.VITE_PUBLIC_SITE_URL;

  if (envOrigin) return String(envOrigin).replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin.replace(/\/$/, "");

  return "";
}

export function buildTahfizhVerificationUrl(token?: string | null) {
  if (!token) return undefined;

  const origin = getPublicSiteOrigin();
  const path = `/verifikasi/tahfizh/${encodeURIComponent(token)}`;

  return origin ? `${origin}${path}` : path;
}
