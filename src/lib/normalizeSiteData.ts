// src/lib/normalizeSiteData.ts
type MenuItem = {
  id: number;
  title: string;
  url: string;
  order: number;
  visible: boolean;
  target?: string;
};

export type SiteData = {
  menu: MenuItem[];
  sliders: any[];
  announcementsBlock: { limit: number; enabled: boolean; title?: string };
  eventsBlock: { limit: number; enabled: boolean; title?: string };
  hero: { slides: any[] };
  footer: { html?: string; links?: { label: string; url: string }[] };
  social: { name: string; url: string; icon?: string }[];
  settings: Record<string, any>;
  pages: any[];
};

const DEFAULT_SITE: SiteData = {
  menu: [],
  sliders: [],
  announcementsBlock: { limit: 6, enabled: true, title: "Duyurular" },
  eventsBlock: { limit: 6, enabled: true, title: "Etkinlikler" },
  hero: { slides: [] },
  footer: { html: "", links: [] },
  social: [],
  settings: {},
  pages: [],
};

function isObject(v: any) {
  return v && typeof v === "object" && !Array.isArray(v);
}

function deepMerge<T>(base: T, patch: any): T {
  const out: any = Array.isArray(base) ? [...(base as any)] : { ...(base as any) };
  if (Array.isArray(base)) {
    if (Array.isArray(patch)) return patch as T;
    return out;
  }
  if (isObject(patch)) {
    for (const k of Object.keys(patch)) {
      const bv = (base as any)[k];
      const pv = patch[k];
      if (Array.isArray(bv)) out[k] = Array.isArray(pv) ? pv : bv;
      else if (isObject(bv)) out[k] = deepMerge(bv, pv);
      else out[k] = pv ?? bv;
    }
  }
  return out;
}

/** Mongo'dan gelen "site" dokümanını UI'nin beklediği sabit şekle sokar. */
export function normalizeSiteData(raw: any): SiteData {
  const merged = deepMerge(DEFAULT_SITE, raw ?? {});

  // küçük düzeltmeler:
  if (Array.isArray(merged.menu)) {
    merged.menu = merged.menu
      .filter(Boolean)
      .map((m) => ({ target: "_self", ...m }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } else {
    merged.menu = [];
  }

  if (!Array.isArray(merged.hero?.slides)) merged.hero = { slides: [] };
  if (!Array.isArray(merged.sliders)) merged.sliders = [];
  if (!Array.isArray(merged.social)) merged.social = [];
  if (!Array.isArray(merged.pages)) merged.pages = [];
  if (!merged.footer) merged.footer = { html: "", links: [] };
  if (!Array.isArray(merged.footer.links)) merged.footer.links = [];
  if (!merged.announcementsBlock) merged.announcementsBlock = { limit: 6, enabled: true };
  if (!merged.eventsBlock) merged.eventsBlock = { limit: 6, enabled: true };

  return merged;
}
