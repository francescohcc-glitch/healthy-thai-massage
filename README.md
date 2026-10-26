# Healthy Thai Massage

A standalone Next.js + TypeScript + Tailwind CSS website. This project does not touch the Massimo website, DNS, or the existing business domain. No deployment has been performed.

## Preview

Requires Node.js 20.9+ (Node 22 recommended).

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. For production: `npm run build`; the complete static website is generated in `out/`. Run `npm run preview` to serve that export.

## Edit content

- `lib/content.ts`: contact information, about copy, services, image paths, and hours.
- `app/page.tsx`: section copy and composition.
- `app/globals.css`: colors, typography, spacing, responsive layouts.
- `public/images/`: replace sample photographs with owner-approved photographs; update alt text and remove illustrative image labels only after replacement.
- Services are provisional, with no invented prices, durations, reviews, qualifications, or medical claims. Confirm actual offerings before launch.

## Enable appointment requests only after delivery testing

The form deliberately does not submit in the delivered presentation configuration. Call and SMS links work without a provider. No database or paid scheduler is required.

1. Create a Formspree form, configure and verify recipient **6464healthy@gmail.com** in the provider dashboard. The recipient is configured there, never via a client-controlled form field. Review the current free-tier limits and privacy terms.
2. Enable provider spam filtering and provider-side validation. The code includes a `_gotcha` honeypot, browser constraints, and client validation. Client checks alone are not an abuse-control boundary. If abuse occurs, add the provider's supported CAPTCHA before enabling delivery.
3. Copy `.env.example` to `.env.local`. Set `NEXT_PUBLIC_FORMSPREE_ENDPOINT` to the public `https://formspree.io/f/FORM_ID` endpoint. Keep `NEXT_PUBLIC_FORM_DELIVERY_VERIFIED=false` initially. A form endpoint is public; never place credentials or secret API keys in a `NEXT_PUBLIC_` variable.
4. Submit a test directly through the provider's test workflow to verify the owner receives it. To exercise the actual interface, temporarily set the verified flag to true **only in an isolated local preview**, rebuild/restart, send an end-to-end request, and verify receipt at the owner's inbox (including spam). Check invalid fields, provider failures, and duplicate-click prevention. Do not publish this test configuration before completing the checks.
5. If successful, retain `NEXT_PUBLIC_FORM_DELIVERY_VERIFIED=true` for launch. If any test fails, return the flag to false and rebuild. The UI reports success only after a successful HTTP response with Formspree's `ok: true`; it never treats a request as an appointment confirmation.

Optional dates and times are preferences in Houston time, not a promise of availability. The phone/name fields are required; email is optional. No payment data is collected. No personal information is written to local storage or application logs.

## Cloudflare Pages hosting (prepared, not deployed)

Uses Next.js `output: 'export'`, with no API routes, runtime secrets, image-optimization server, or custom backend. This matches Cloudflare's static Next.js deployment method:
https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/

- Build: `npm run build`
- Output directory: `out`
- Node: 22
- Keep DNS and `massagehealthy.com` unchanged until the owner authorizes launch.
- Preview builds default to `noindex` and robots disallow; no canonical URL is invented.
- At approved production launch, set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin, rebuild, verify canonical/Open Graph/sitemap/robots, and deploy. This enables indexing. Review all placeholder labels, prices, services, real photos, hours, provider privacy/retention, and delivered-request tests first.
- Environment values are build-time configuration; changing them requires a rebuild.
- `public/_headers` is emitted for Cloudflare Pages security headers.

## Checks

```sh
npm test
npm run typecheck
npm run build
```

Google Maps is lazy-loaded and uses an external Google embed. The privacy notice names this. Images are self-hosted, with no runtime photography dependency. Motion respects reduced-motion preferences. The form has explicit labels, keyboard focus indicators, and error/status announcements.
