import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Site from "@/models/Site";
import { normalizeSiteData } from "@/lib/normalizeSiteData";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const raw = await Site.findOne({}).lean();
    const data = normalizeSiteData(raw ?? {});
    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
