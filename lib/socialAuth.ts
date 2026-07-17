import { timingSafeEqual } from "crypto";

/** Simple shared-secret auth for /admin/social and social APIs. */
export function assertSocialAdmin(req: Request): void {
  const secret = process.env.SOCIAL_ADMIN_SECRET?.trim();
  if (!secret) {
    throw new AdminAuthError(
      "SOCIAL_ADMIN_SECRET is not set on the server",
      503,
    );
  }

  const header = req.headers.get("x-social-admin-secret")?.trim() || "";
  const url = new URL(req.url);
  const query = url.searchParams.get("secret")?.trim() || "";
  const provided = header || query;

  if (!provided || !safeEqual(provided, secret)) {
    throw new AdminAuthError("Unauthorized", 401);
  }
}

export class AdminAuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}
