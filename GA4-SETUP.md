# Healthy Thai Massage — GA4 update

Measurement ID: **G-PJ0EET004T**
Production site: **https://healthythaimassagehouston.com/**
Repository: **francescohcc-glitch/healthy-thai-massage**, existing `main` source downloaded November 5, 2026.

This is an UPDATE package, not a complete replacement repository. Copy these nine application/test files into the matching paths in the existing repository. Keep all other files, including the existing canonical metadata, robots, sitemap, images, Next.js configuration and Cloudflare settings. No new dependencies are needed. No deployment or GitHub push was performed; the connected GitHub identity has read-only access.

## Before deployment: configure the existing GA4 web stream

1. Sign into Google Analytics, select the Healthy Thai Massage property, then **Admin > Data collection and modification > Data streams**. Open the web stream for `https://healthythaimassagehouston.com` and verify its measurement ID is **G-PJ0EET004T**. Do not create a second stream or tag for the same site.
2. Open **Enhanced measurement > gear/settings**. Turn OFF **Form interactions**, **Outbound clicks**, **Site search**, **File downloads**, **Video engagement**, and **Scrolls** for this minimal collection setup. Under **Page views > advanced settings**, turn OFF **Page changes based on browser history events**. Save. The code sets `send_page_view: false` and explicitly sends one `page_view` per full document load after acceptance. Section anchor navigation is not another page view. Automatic first_visit/session_start/user_engagement events are normal and are not duplicate page views.
3. Under the stream's **Configure tag settings > Manage automatic event detection** (if shown), disable automatic form and other unneeded interaction detection there too. Do not configure a second page-view event, a broad automatic form conversion, a GTM GA4 tag, or a Cloudflare Zaraz Google Analytics tag alongside this integration. Check whether any such independently configured tag exists before launch; the downloaded website source and live HTML contained no existing Google tag.
4. Under **Admin > Data display > Custom definitions > Create custom dimension**, add:
   - Name: Button location; scope: Event; event parameter: `button_location`.
   - Name: Booking mode; scope: Event; event parameter: `booking_mode`.
   Custom dimensions are for breakdowns; they are NOT required for event counts or total users.
5. Under **Admin > Data display > Events**, mark **booking_request_success** as a key event (or create a key event with that exact name before the first live request). If counting options are shown, use **Once per event**. Do not mark demo clicks or automatic `form_submit` as successful appointments. Contact-click events can optionally be marked as separate lead-intent key events, but a click is not a completed call, SMS delivery, WhatsApp message, or confirmed appointment.
6. Under **Admin > Data collection and modification > Data collection**, leave Google signals and user-provided data collection OFF; do not enable enhanced conversions or User-ID collection. Under **Data retention**, choose a retention period appropriate for this minimal reporting setup, such as two months. The code also denies all advertising consent and disables ad personalization/Google signals.

## Events and reports

| Event | Meaning |
| --- | --- |
| `page_view` | One consented page load; no hash-section duplicates |
| `call_click` | Any `tel:` link, including Call Now and phone-number links |
| `sms_click` | Any `sms:` link, including Text Us |
| `whatsapp_click` | Any `whatsapp:` link or wa.me, api.whatsapp.com, web.whatsapp.com link |
| `booking_click` | Any link to `#book`, including navigation, hero, services, footer and mobile bar |
| `booking_submit_click` | Form submit button clicked; `booking_mode` is `demo` or `live`, even if validation then blocks submission |
| `booking_request_success` | Live provider HTTP success AND JSON `ok: true`; once per submission; excludes demo, validation and delivery errors |

There are no WhatsApp links in the current repository, so no WhatsApp event will occur until an actual owner-approved WhatsApp link exists. Recognition is prepared; no contact number or new WhatsApp feature was invented.

Button location is an allowlisted value: header, home, about, services, gallery, book, contact, footer, mobile_bar, or other. Booking mode is included only for submit clicks/success.

For an exact counts/users table, open **Explore > Free form**. Import dimension **Event name** and metrics **Event count** and **Total users**. Add Event name as rows and both metrics as values. Filter Event name to the events above. Optionally import the two custom dimensions to break down location/mode after GA processes them (allow 24–48 hours).

Event count counts repeat interactions. Total users deduplicates recognized users within each event row and selected date range using GA's consented identifiers; it is not an exact count of human beings across browsers/devices. Do not sum event-row user counts to get unique people across the whole report. Users who reject, block, or have not yet granted consent are not counted, and earlier interactions are never replayed. No custom user IDs or fingerprinting are added.

## Consent and data protection implemented

- Basic consent mode: no Google script, Analytics cookies, Analytics requests, or queued interactions before consent. Accept/reject choices are equally available, with a persistent Privacy choices control to withdraw consent.
- Consent choice alone is kept in first-party localStorage for 180 days. No form entries are stored for Analytics. Global Privacy Control or Do Not Track overrides acceptance.
- Withdrawal sets the GA disable flag immediately, deletes accessible first-party `_ga*` cookies, then reloads to unload the Google library. Changing a choice in another tab also reloads safely. Withdrawal does not erase past records already collected by Google.
- Only fixed event names, allowlisted button locations and demo/live flags are sent. No name, phone, email, notes, appointment date/time, selected service, raw link URL/text, query string, fragment, or user ID is included.
- Page location is deliberately fixed to the canonical home URL; page referrer is empty. This sacrifices campaign/referral attribution and individual section reporting to avoid leaking URL information. Google's library still processes technical network/browser data after consent; this is not anonymous/no-data collection.
- Tracking is enabled only on `healthythaimassagehouston.com`. Localhost/Cloudflare preview builds do not send Analytics unless the explicit test-only debug environment variable is set.
- Existing Google Maps embedding and contact-link behavior are unchanged. This consent control covers GA4, not all third-party services.

## Deploy the update to existing GitHub / Cloudflare Pages

1. Extract this ZIP. In your existing repository use **Add file > Upload files**. Upload the contents at the repository root, preserving app/, components/, lib/ and scripts/. The files replace matching paths; the new files are added. Do not upload the ZIP or enclosing update folder. If main has changed since this package was prepared, merge the differences instead of overwriting newer work.
2. Commit on a new branch, such as `ga4-consent-tracking`, with message `Add consent-controlled GA4 visit and booking events`, then create a pull request into the current production branch.
3. Check the diff contains only the listed files and this setup guide. Cloudflare preview deployments intentionally keep Analytics off. Keep booking settings as they already are (demo is still the default).
4. Run `npm ci`, `npm test`, `npm run build`, and `npm run typecheck`. Build remains a Next.js static export. Keep the existing Cloudflare build command (`npm run build`) and output directory (`out`). No new runtime function, secret, paid service, DNS, or custom-domain change is required.
5. After GA settings above are saved, merge the PR. Cloudflare's existing Git integration rebuilds the production branch when automatic deployments are enabled. In **Cloudflare > Workers & Pages > existing Healthy Thai Massage project > Deployments**, check the new commit reports Success and open the existing website.
6. Keep `NEXT_PUBLIC_ANALYTICS_DEBUG` unset or `false` in Cloudflare. The supplied measurement ID is already in lib/analytics.mjs; it is public and does not require an API key or environment variable.

## Verify after deployment

Use a fresh browser session without GPC/DNT or ad blocking when testing acceptance; separately test those privacy controls remain respected.

1. Open browser Developer Tools > Network. Before consent or after Reject, filter for `gtag`, `collect`, `google-analytics`: there should be no GA tag or measurement requests. Maps has its own Google network requests and is not GA.
2. Accept analytics. There should be one gtag.js script for G-PJ0EET004T. Use Google Tag Assistant to confirm that exact destination; inspect GA collect requests for a single `page_view` on a page load, canonical page URL and no personal fields.
3. Click a booking CTA: expect `booking_click`, not a second page_view. Click Call Now/Text Us and, if present, WhatsApp; verify the corresponding event once per click without completing a real call or sending a message.
4. Complete the demo with made-up details: expect booking_submit_click with booking_mode=demo; NEVER booking_request_success. The form should clear as before.
5. A real booking success can be checked only after Formspree is live and delivery verified. Confirm that HTTP success plus `ok: true` generates exactly one booking_request_success; provider failures and invalid input do not. The automated tests cover this gate without sending a real request.
6. In GA4 open **Reports > Realtime** to confirm the property receives the events. Use **Admin > Data display > DebugView** with Google Tag Assistant/debug mode for parameter inspection. Standard reports are not instantaneous. Revoke through Privacy choices and confirm no GA requests after the resulting reload.

For a local developer test only: run `NEXT_PUBLIC_ANALYTICS_DEBUG=true WATCHPACK_POLLING=true npm run dev -- -p 3001`. The visible Analytics debug log shows only sanitized commands and sends events marked debug_mode to the supplied measurement ID after acceptance. Never deploy with this flag enabled. No form data appears in that log.

## Validation performed here

- Production static build, TypeScript, and all ten tests passed.
- Browser: no tag before consent; one tag inserted after acceptance; Google script's load event confirmed; one explicit config/page_view; single booking-click event; demo submit-click event without success; withdrawal reload removes Google tag.
- Contact/WhatsApp classification, privacy allowlists, expiration, duplicate prevention, and verified-success/error/demo gates tested automatically.
- I cannot inspect your authenticated GA property/Realtime reports or change GA Enhanced Measurement settings. Server-side event receipt and real provider delivery still require the post-deployment checks above; they have not been claimed as verified.

## Primary references

- Consent: https://developers.google.com/tag-platform/security/guides/consent
- Page-view duplicate prevention: https://developers.google.com/analytics/devguides/collection/ga4/views
- Enhanced Measurement configuration: https://support.google.com/analytics/answer/9216061
- Reporting metric definitions: https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema
- Custom dimensions: https://support.google.com/analytics/answer/14240153
- Cloudflare Git deployment: https://developers.cloudflare.com/pages/configuration/git-integration/
