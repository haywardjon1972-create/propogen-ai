# Instagram auto-post setup (Option C) — @propogen.ai

This uses **Meta’s official Instagram Graph API** (not your password).

Admin UI (after deploy):  
https://propogen-ai.vercel.app/admin/social

---

## What you need

1. Instagram **Business** (@propogen.ai)  
2. **Facebook Page** (Propogen AI) **linked** to that IG  
3. A free **Meta Developer** app  
4. Tokens saved as Vercel env vars  

---

## Step 1 — Confirm Page is linked

- Instagram → Settings → Accounts Centre → Pages  
- Or Facebook Page → Settings → Linked accounts → Instagram  

Both should show connected.

---

## Step 2 — Create Meta app

1. Go to [developers.facebook.com](https://developers.facebook.com/)  
2. **My Apps** → **Create App**  
3. Use case: **Other** / **Business**  
4. App name: `Propogen Social`  
5. Add product: **Instagram** (or **Facebook Login** + Instagram Graph)  

### Permissions to request (Graph API Explorer or App Review later)

For testing as admin of the Page you usually need:

- `instagram_basic`  
- `instagram_content_publish`  
- `pages_show_list`  
- `pages_read_engagement`  
- `business_management` (sometimes)

While the app is in **Development** mode, only app admins/testers can publish.

---

## Step 3 — Get Instagram Business Account ID

1. Open [Graph API Explorer](https://developers.facebook.com/tools/explorer/)  
2. Select your app  
3. Generate token with the permissions above  
4. Call:

```
GET /me/accounts
```

Find your **Propogen AI** Page → note `id` (Page ID).

5. Then:

```
GET /{page-id}?fields=instagram_business_account
```

Copy `instagram_business_account.id`  
→ that is **INSTAGRAM_BUSINESS_ACCOUNT_ID**

---

## Step 4 — Long-lived Page access token

Short tokens expire in hours. For auto-post:

1. Get a **Page** access token (not only user token) that includes Instagram publish  
2. Exchange for a **long-lived** token (Meta docs: long-lived page token)  
3. Save as **INSTAGRAM_ACCESS_TOKEN**

Never commit tokens to Git. Put them only in Vercel / `.env.local`.

---

## Step 5 — Env vars (Vercel + local)

```env
# Instagram Graph API
INSTAGRAM_ACCESS_TOKEN=EAAB...
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841...

# Optional default image (public https URL)
INSTAGRAM_DEFAULT_IMAGE_URL=https://propogen-ai.vercel.app/og-default.png

# Password for /admin/social
SOCIAL_ADMIN_SECRET=pick-a-long-random-string
```

Also keep:

```env
XAI_API_KEY=...   # for AI captions
```

Redeploy after adding env vars on Vercel.

---

## Step 6 — Use the admin panel

1. Open https://propogen-ai.vercel.app/admin/social  
2. Enter **SOCIAL_ADMIN_SECRET**  
3. **Test connection** → should show `@propogen.ai`  
4. Paste a **public https image URL**  
5. **Generate caption** or write your own  
6. **Publish to Instagram**  

### Image rules (Meta)

- Must be **https** and publicly reachable  
- Common formats: JPG/PNG  
- Instagram servers must be able to download it (not behind login)

Easy hosts: Cloudinary, your own `/public` file on Vercel, ImgBB (direct link).

---

## API (for scripts / full auto later)

### Status
```http
GET /api/social/instagram/status
Header: x-social-admin-secret: YOUR_SECRET
```

### Generate caption
```http
POST /api/social/instagram/caption
Header: x-social-admin-secret: YOUR_SECRET
{ "topic": "proposal tip" }
```

### Publish
```http
POST /api/social/instagram/publish
Header: x-social-admin-secret: YOUR_SECRET
{
  "imageUrl": "https://...",
  "caption": "optional — AI fills if empty",
  "topic": "optional for AI",
  "generateCaption": true
}
```

---

## Full auto schedule (next upgrade)

Once publish works once:

- Add a **Vercel Cron** job (e.g. 3× per week) calling `/api/social/instagram/publish`  
- Or use a queue of captions in a spreadsheet / DB  

We’ll add cron after your first successful manual publish from admin.

---

## If publish fails

| Error | Fix |
|--------|-----|
| Invalid OAuth | New token / wrong app |
| (#10) permission | Add `instagram_content_publish` |
| Media download | Image URL not public https |
| User not authorized | App in dev mode — add yourself as tester; or submit App Review for Live |
| Account restricted | Wait out IG limits; soften CTAs |

---

## Security

- Never put `INSTAGRAM_ACCESS_TOKEN` in the browser  
- Only server env + admin secret  
- Rotate token if leaked  
- Don’t share `SOCIAL_ADMIN_SECRET`  

---

## Reality check

| Claim | Truth |
|--------|--------|
| “AI logs into Instagram with password” | We **don’t** do that |
| “AI posts via Meta API” | **Yes — this system** |
| “Zero setup” | You must create Meta app + tokens once |
| “Ban-proof” | Nothing is; posting useful content helps |

When tokens are ready, put them in `.env.local` and Vercel, then open `/admin/social` and hit **Test connection**.
