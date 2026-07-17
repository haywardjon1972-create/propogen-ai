import { NextRequest, NextResponse } from "next/server";
import {
  getInstagramConfig,
  isInstagramConfigured,
  verifyInstagramConnection,
} from "@/lib/instagram";
import { AdminAuthError, assertSocialAdmin } from "@/lib/socialAuth";

export async function GET(req: NextRequest) {
  try {
    assertSocialAdmin(req);
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }

  if (!isInstagramConfigured()) {
    return NextResponse.json({
      configured: false,
      message:
        "Set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID (see marketing/instagram-auto-post-setup.md)",
    });
  }

  try {
    const config = getInstagramConfig()!;
    const profile = await verifyInstagramConnection(config);
    return NextResponse.json({
      configured: true,
      ok: true,
      profile,
    });
  } catch (err) {
    return NextResponse.json(
      {
        configured: true,
        ok: false,
        error: err instanceof Error ? err.message : "Connection failed",
      },
      { status: 502 },
    );
  }
}
