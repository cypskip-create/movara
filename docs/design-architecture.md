# Movara design analysis and implementation architecture

## Source boundaries

The supplied composite mockup is the primary visual reference. The supplied addendum is preserved verbatim separately. The earlier master implementation prompt and seven additional screenshots mentioned in it were not supplied. Their functional requirements cannot be assumed. Movara replaces the temporary ShiftHaul name throughout implementation; the original reference remains unchanged as source material.

## Visual analysis

The composite contains eleven views: desktop landing, layered booking steps, services, truck search, shipment creation, booking details, tracking, messaging, carrier dashboard, driver mobile, and mobile landing.

The visual system combines oversized black headings, white surfaces, orange actions, thin dividers, compact operational cards, and generous public-page spacing. The desktop hero balances left-aligned type with a prominent truck illustration. Operational screens use tighter spacing and restrained motion. Mobile needs its own vertical composition and large touch targets.

Create an original Movara wordmark and visual identity. Do not copy reference logos or manufacturer branding. Truck artwork must be original or licensed, with static fallbacks. Do not represent reference imagery as company-owned assets.

## Homepage architecture

1. Navigation: Movara identity, services, how it works, carrier information, and account entry.
2. Hero: expressive freight headline, supporting Kenya-focused copy, truck artwork, Find a Truck and List Your Vehicle actions.
3. Value proposition: explain the independent-carrier marketplace model.
4. Return-load story: clearly labeled Nairobi–Nakuru–Eldoret demonstration with matching stages.
5. Four booking steps: post cargo, match with a truck, book and track, confirm delivery.
6. Services: keyboard- and touch-accessible editorial rows with selected imagery.
7. Customer and carrier benefits: practical, supportable capabilities.
8. Vehicle categories: browse transport requirements without implying owned inventory.
9. Trust: explain verification only after its actual process is defined.
10. Tracking demonstration: labeled simulation, separate from live authenticated tracking.
11. Statistics: omit until genuine data is available.
12. Carrier registration call to action.
13. Customer shipment call to action.
14. FAQ based on confirmed operating policies.
15. Footer with real contact and policy destinations once available.

## Application surfaces

- Truck search: route/date/cargo filters, availability, quote or booking entry.
- Shipment creation: pickup, destination, dates, cargo, weight, vehicle type, packaging, requirements.
- Booking details: status timeline, carrier/driver details, booking terms and communication.
- Tracking: authorized shipment location, timestamp and stale-location behavior.
- Messaging: booking-linked conversations with access control.
- Carrier dashboard: fleet, loads, bookings, earnings and drivers.
- Driver portal: mobile trip details, navigation handoff and delivery milestones.
- Admin console: scope requires the missing master specification or further product decisions.

## Component and data boundaries

Centralize branding and palette in config/brand.json. Build shared navigation, buttons, fields, cards, status badges, booking timeline and responsive shells. Keep demonstration fixtures separate from service integrations. Define authentication, roles, shipment, vehicle, quote, booking, payment, location and message contracts before connecting workflows.

No provider, pricing policy, verification process, payment method or production backend has been selected in this baseline. User accounts, transactions and private shipment information require server-side authorization and validation.

## Progressive implementation

1. Establish the frontend and reusable tokens; build the desktop and mobile layouts with clearly labeled fixtures.
2. Add optimized original truck media, restrained hero movement, return-route explanation, stacked steps and service interactions.
3. Build operational screens and connect confirmed backend workflows.
4. Validate accessibility, responsive behavior, integration failure states and performance.

The supplied addendum proposes GSAP/ScrollTrigger, Motion, and React Three Fiber/Drei. Verify current compatibility when choosing the implementation stack. Avoid competing animation systems on the same properties. Heavy scenes must be lazy-loaded, paused offscreen, and replaced with static media for reduced motion or constrained devices.

## Acceptance evidence

Capture desktop and mobile screenshots for every represented screen and compare hierarchy, proportions, spacing and typography with the reference. Test keyboard navigation, visible focus, form validation, reduced motion, mobile overflow, loading failures and animation cleanup. Verify search, booking, messaging, payment and tracking through real integrations before calling them complete. Measure performance and record actual results; no tests or performance measurements have been run at this documentation stage.
