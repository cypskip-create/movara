# Asset provenance

`public/assets/movara-truck-v2.webp` is original AI-generated illustrative artwork created with the built-in image generation tool for this project. It is not a photograph of company-owned vehicles. The final PNG was compressed to WebP while preserving transparency.

Generation prompt: “Create a photorealistic commercial medium-duty white box lorry for Movara Kenyan freight marketplace website hero. Three-quarter front view facing left, entire truck visible with all tires, white cab and large rectangular white cargo box, practical realistic commercial proportions. Original small black wordmark ‘Movara’ on cargo box, elegant diagonal orange stripe along lower side. No manufacturer logos. Studio product photography on very light warm grey seamless ground, realistic soft contact shadow, daylight, crisp details, premium editorial advertising. Wide landscape composition with truck centered, generous margins, no other text or graphics. This is illustrative artwork, not an existing fleet.”

Follow-up edit prompt: “Remove the background from this original Movara truck artwork. Preserve the whole truck exactly, original Movara wordmark and orange stripe, realistic tire edges and proportions. Output a clean transparent-background cutout, no surrounding studio ground or background. Preserve subtle contact shadow only if it can be on transparency. Do not crop any part of truck.”

The interactive low-poly truck is original procedural geometry in `src/scene/TruckScene.jsx`; no third-party vehicle model is used. Icons and route schematics are inline SVG. The supplied mockup is preserved as a reference only.

DM Sans and Barlow Condensed are requested through Google Fonts, with system fallbacks. Font loading is not required to expose content.

Implementation API references checked: [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()), [React Three Fiber Canvas](https://r3f.docs.pmnd.rs/api/canvas), [React Three Fiber performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance), and [Motion configuration](https://motion.dev/docs/react-motion-config).
