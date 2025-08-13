/* scripts/health-check.ts
 * Kullanım:
 * 1) npm i -D mongoose
 * 2) BASE_URL ve MONGODB_URI ayarla (env)
 * 3) npx ts-node scripts/health-check.ts
 */

import mongoose from "mongoose";

// ====== CONFIG ======
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const MONGODB_URI = process.env.MONGODB_URI || "";
const TIMEOUT_MS = 12000;

// Test edeceğimiz uçlar (projene göre düzenle)
const ENDPOINTS = [
  "/api/public/site-data",
  "/api/public/announcements?status=published&limit=6",
  "/api/public/events?status=published&upcoming=true&limit=6",
  "/api/public/sliders?active=true",
  "/api/public/kamu-ar?status=published",
  // Admin (sadece yetki kontrolü için; 401 bekleriz)
  "/api/admin/site-data",
];

// ====== MODELLER (yalın haliyle) ======
// Yalnızca count için minimal şemalar
const AnnouncementSchema = new mongoose.Schema(
  {
    status: { type: String, enum: ["draft", "published", "archived"] },
    publishDate: Date,
    featured: Boolean,
    category: String,
  },
  { timestamps: true, collection: "announcements" }
);
const EventSchema = new mongoose.Schema(
  { status: String, startDate: Date },
  { timestamps: true, collection: "events" }
);
const SliderSchema = new mongoose.Schema(
  { active: Boolean },
  { timestamps: true, collection: "sliders" }
);
const SiteSchema = new mongoose.Schema({}, { timestamps: true, collection: "sites" });

const Announcement = mongoose.models._HC_Announcement || mongoose.model("_HC_Announcement", AnnouncementSchema);
const EventModel = mongoose.models._HC_Event || mongoose.model("_HC_Event", EventSchema);
const Slider = mongoose.models._HC_Slider || mongoose.model("_HC_Slider", SliderSchema);
const Site = mongoose.models._HC_Site || mongoose.model("_HC_Site", SiteSchema);

// ====== HELPERS ======
function isJson(res: Response) {
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json");
}

function pad(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function safeFetch(url: string) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal as any });
    const raw = isJson(res) ? await res.json() : await res.text();
    return { ok: res.ok, status: res.status, json: isJson(res), body: raw };
  } catch (e: any) {
    return { ok: false, status: 0, json: false, body: String(e?.message || e) };
  } finally {
    clearTimeout(t);
  }
}

function printHeader(title: string) {
  console.log("\n" + "═".repeat(60));
  console.log("🔎 " + title);
  console.log("═".repeat(60));
}

// ====== MAIN ======
(async () => {
  let hasError = false;

  // 1) Mongo bağlantısı ve sayımlar
  printHeader("MongoDB Bağlantı ve Koleksiyon Kontrolleri");
  if (!MONGODB_URI) {
    console.log("❌ MONGODB_URI env tanımlı değil.");
    hasError = true;
  } else {
    try {
      const conn = await mongoose.connect(MONGODB_URI, { dbName: undefined as any });
      console.log("✅ MongoDB bağlandı:", conn.connection.name);

      const [siteDoc, annTotal, annPub, annFuturePub, evTotal, evUpcoming, sliTotal, sliActive] =
        await Promise.all([
          Site.findOne({}).lean(),
          Announcement.countDocuments({}),
          Announcement.countDocuments({ status: "published" }),
          Announcement.countDocuments({
            status: "published",
            publishDate: { $gt: new Date() },
          }),
          EventModel.countDocuments({}),
          EventModel.countDocuments({ startDate: { $gte: new Date() } }),
          Slider.countDocuments({}),
          Slider.countDocuments({ active: true }),
        ]);

      console.log("• Site dokümanı var mı:", !!siteDoc);
      console.log("• Duyurular toplam:", annTotal);
      console.log("   - published:", annPub, " | gelecekte publishDate:", annFuturePub);
      console.log("• Etkinlik toplam:", evTotal, " | upcoming (startDate>=now):", evUpcoming);
      console.log("• Slider toplam:", sliTotal, " | active:true:", sliActive);

      // Yaygın nedenlere dair ipuçları:
      if (annPub === 0 && annTotal > 0) {
        console.log("⚠️  Duyurularda 'status=published' yok. API 'status=published' ile 0 döner.");
      }
      if (annFuturePub > 0) {
        console.log("ℹ️  Gelecekte publishDate olan published duyurular var. Route 'publishDate<=now' filtresi kullanıyorsa 0 dönebilir.");
      }
      if (evUpcoming === 0 && evTotal > 0) {
        console.log("ℹ️  Etkinlik var ama 'upcoming' kriterine uymuyor olabilir (startDate>=now).");
      }
      if (sliActive === 0 && sliTotal > 0) {
        console.log("ℹ️  Slider var ama 'active:true' yok; '/api/public/sliders?active=true' 0 döner.");
      }
    } catch (e: any) {
      console.log("❌ Mongo bağlantı/okuma hatası:", e?.message || e);
      hasError = true;
    } finally {
      await pad(100);
      try { await mongoose.disconnect(); } catch {}
    }
  }

  // 2) Public/Admin API çağrıları
  printHeader("API Çağrıları (JSON & Şema Kontrolü)");
  console.log("BASE_URL:", BASE_URL);

  for (const p of ENDPOINTS) {
    const url = new URL(p, BASE_URL).toString();
    const r = await safeFetch(url);
    const tag = p.startsWith("/api/admin/") ? "admin" : "public";
    const icon = r.ok ? "✅" : "❌";
    console.log(`\n${icon} [${tag}] GET ${url}`);
    console.log("   status:", r.status, "| content-type JSON:", r.json);

    if (!r.ok) {
      if (!r.json && typeof r.body === "string" && r.body.trim().startsWith("<!doctype")) {
        console.log("   ↳ HTML geldi (muhtemelen hata sayfası veya yönlendirme). JSON bekleyen UI parse edemez.");
      } else {
        console.log("   ↳ Hata gövdesi:", typeof r.body === "string" ? r.body.slice(0, 200) : r.body);
      }
      continue;
    }

    // JSON ise yapı kontrolü
    if (r.json) {
      const body: any = r.body;
      const hasOk = Object.prototype.hasOwnProperty.call(body, "ok");
      const hasSuccess = Object.prototype.hasOwnProperty.call(body, "success");

      if (hasSuccess && !hasOk) {
        console.log("   ↳ UYARI: Response { success: ... } dönüyor. UI { ok, data } bekliyorsa 0 gösterebilir.");
      }

      if (hasOk && body.ok) {
        // tipik şekiller
        if (body.data?.items && Array.isArray(body.data.items)) {
          console.log("   ↳ items.length:", body.data.items.length);
          if (body.data.items.length === 0) {
            console.log("     • NEDEN BOŞ? Filtre parametreleri (status/active/upcoming/category) şemayla uyuşmuyor olabilir.");
          }
        } else if (body.data && typeof body.data === "object") {
          // site-data gibi
          const keys = Object.keys(body.data);
          console.log("   ↳ data keys:", keys.slice(0, 12).join(", "));
          if (keys.length <= 1) {
            console.log("     • NEDEN BOŞ? Alan adları UI'nin beklediğiyle uyuşmuyor olabilir (normalizeSiteData önerilir).");
          }
        } else {
          console.log("   ↳ Beklenmeyen JSON şekli. UI sözleşmesine uymuyor olabilir.");
        }
      } else if (hasOk && !body.ok) {
        console.log("   ↳ API hata mesajı:", body.error || body.message);
      } else {
        console.log("   ↳ Beklenmeyen JSON (ne ok ne success). UI bunu tanımayabilir.");
      }
    } else {
      console.log("   ↳ JSON değil. UI parse edemez.");
    }
  }

  // 3) Özet
  printHeader("ÖZET");
  console.log(
    hasError
      ? "⚠️  Bazı kritik hatalar tespit edildi. Yukarıdaki notlara göre düzelt."
      : "✅ Bağlantılar test edildi. Yukarıdaki uçlarda boş dönme nedenleri belirtilmiştir."
  );
})();
