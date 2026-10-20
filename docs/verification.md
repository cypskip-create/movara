# Verification — 20 October 2026

## Automated checks

- Production build: `npm run build` passed.
- Store tests: `npm test`, five tests passed. Coverage includes capacity and route mismatch, reserved vehicles, duplicate bookings, sequential milestones, delivery confirmation, simulated payments, date validation, duplicate registrations and restart persistence.
- HTTP smoke checks: homepage returned 200; state identified local-demo mode; active-booking vehicles remained reserved; hostile-origin mutation returned 403; null JSON payload returned 400.
- Dependency installation audit reported zero known vulnerabilities at installation time.

## Browser checks

Verified in the in-app browser:

- Search → create compatible shipment → save → request booking → booking details.
- Simulated payment confirmation and persisted ledger status.
- Booking conversation: message saved, displayed, and retained across reload. An effect-cleanup rendering error discovered during testing was fixed and the flow retested.
- Driver trip: requested → confirmed → pickup → in transit → delivered, with a required confirmation note.
- Desktop screenshots at 1440 × 1000 and mobile screenshots at 390 × 844.
- Mobile overflow checks passed for search, shipment creation, booking, tracking, messaging, carrier dashboard, fleet and administration. Mobile homepage also passed.
- New QA tab reported no JavaScript console errors across tested operational screens after the message fix.

`docs/qa/` contains the initial screenshot baselines for future visual regression comparisons. The supplied composite mockup was used for qualitative review of hierarchy, white/orange palette, truck presentation, card spacing and operational layout. These are not pixel-identical reproductions or an automated pixel-diff comparison against the composite.

## Performance and limits

The truck bitmap is compressed to an approximately 122 KB transparent WebP. The optional 3D bundle is separated from the initial page preload and loads only on request. Vite reports a size warning for that optional bundle (approximately 882 KB uncompressed). The scene uses demand rendering and capped device pixel ratio. Reduced-motion and data-saving preferences retain the static artwork.

No real-device Core Web Vitals, screen-reader audit, production load test, or production provider integration test has been performed. External font loading has system fallbacks. See production-checklist.md for outstanding production integration work.

Local demo records created during browser checks are ignored by Git. No real carrier was contacted and no real payment was made.
