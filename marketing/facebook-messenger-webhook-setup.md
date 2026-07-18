# Facebook Messenger webhook — Propogen AI Page

## Production values

**Callback URL**
```
https://propogen-ai.vercel.app/api/social/facebook/webhook
```

**Verify token** — use the value of env `FACEBOOK_WEBHOOK_VERIFY_TOKEN`  
(also in Desktop file `Propogen-FB-Webhook-Setup.txt` after deploy)

**Page access token env**
```
FACEBOOK_PAGE_ACCESS_TOKEN
```

## Meta setup

1. App → **Webhooks** → object **Page**  
2. Callback URL + verify token → **Verify and save**  
3. Subscribe fields:
   - `messages`
   - `messaging_postbacks`  
4. Subscribe your **Propogen AI** Page to the app  

## Behaviour

- Incoming **messages** → FAQ / default reply via Messenger **Send API** (`POST /me/messages`)  
- Incoming **messaging_postbacks** → reply from payload (e.g. GET_STARTED)  
- Skips echoes and duplicates  
