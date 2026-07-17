# Instagram webhooks — auto-reply comments & DMs

Callback (live):

```
https://propogen-ai.vercel.app/api/social/instagram/webhook
```

## What it does

When someone **comments** on @propogen.ai or sends a **DM**:

1. Meta hits our webhook  
2. We ignore our own messages / empties / duplicates  
3. FAQ match **or** short Grok reply  
4. Reply via Graph API  

## Env vars

```env
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=some-long-random-string
INSTAGRAM_ACCESS_TOKEN=...
INSTAGRAM_BUSINESS_ACCOUNT_ID=...
XAI_API_KEY=...
```

`INSTAGRAM_WEBHOOK_VERIFY_TOKEN` must match exactly what you type in Meta.

## Meta App Dashboard steps

1. [developers.facebook.com/apps](https://developers.facebook.com/apps) → **Propogen Social**  
2. Add product **Webhooks** (if not already)  
3. **Webhooks** → select object **Instagram**  
4. **Callback URL:**  
   `https://propogen-ai.vercel.app/api/social/instagram/webhook`  
5. **Verify token:** same as `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`  
6. **Verify and save**  
7. Subscribe fields:
   - `comments`
   - `messages`  
8. Ensure the Instagram professional account **@propogen.ai** is subscribed / enabled for this app  

## Test

1. Comment on one of your posts: `is it free?`  
2. Within a few seconds you should get a reply about free drafts + site  
3. DM: `how does it work?`  

If nothing arrives: check Vercel logs for `[ig-webhook]`, re-verify webhook, confirm app is in Development and your IG user is a tester/admin.

## Safety

- One reply per comment/message id (best-effort)  
- No reply to our own account  
- Soft FAQs only; no asking for cards/passwords  
- Soft sell; points to `propogen-ai.vercel.app`  
