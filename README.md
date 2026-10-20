# Movara

A local Kenyan freight marketplace preview built from the supplied design addendum and composite mockup.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run build
npm start
```

Open **http://localhost:3000**. The server binds to 127.0.0.1 only. For frontend development, run npm run dev on port 5173 while npm start provides the API on port 3000.

Run business-rule and persistence tests with npm test.

## Included experiences

- Responsive landing page, original truck artwork, GSAP scroll animation, interactive return-load story, booking steps, services, vehicle categories and FAQ.
- Optional lazy-loaded React Three Fiber vehicle concept with demand rendering and image fallback.
- Customer route/capacity search, shipment creation, compatible vehicle booking requests, booking details and milestone timeline.
- Simulated payment ledger, illustrative tracking route and local booking conversations.
- Carrier dashboard with calculated metrics, vehicle registration, fleet listings and compatible load matching.
- Mobile driver portal, sequential milestone updates and delivery confirmation notes.
- Local administration overview and JSON export.

## Operating boundary

This is a **local functional demonstration**, not a production transport service. Seeded carriers, rates, bookings and locations are fixtures. New demo records persist in data/marketplace.json, excluded from Git. Workspace roles are unrestricted demo profiles. Do not enter sensitive information.

No live payment, GPS, carrier verification, production authentication, notifications, insurance checking or dispatch provider is connected. Payment buttons only record an explicitly labeled simulation. Messaging stays on this computer; no real recipient is contacted. The map is an original schematic. External directions open Google Maps without an embedded credential.

The addendum refers to an earlier master specification and seven screenshots that were not supplied. This repository implements the supplied baseline and does not claim to satisfy unspecified requirements.

## Source map

- src/pages/Landing.jsx: public experience.
- src/pages/Workspace.jsx: customer, carrier, driver and administration screens.
- src/scene/TruckScene.jsx: optional original 3D concept.
- src/ui.jsx and src/styles.css: shared UI and responsive styling.
- config/brand.json: brand name and base palette.
- lib/store.mjs and server.mjs: validated local API and atomic JSON persistence.
- tests/store.test.mjs: booking, validation, milestones and persistence checks.
- docs/: architecture, references, asset provenance and verification notes.

Before public deployment, add production identity/authorization, a transactional database, payment integration, licensed maps/location consent, verification, operational policies and monitoring. Do not expose this local demo server on a public interface.
