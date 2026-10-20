import React, { useState, useRef, useEffect, lazy, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icon, Logo, Button, TruckImage, RouteMap } from "../ui";
import { useApp, go } from "../main";
gsap.registerPlugin(ScrollTrigger);
const TruckScene = lazy(() =>
  import("../scene/TruckScene").catch(() => ({
    default: () => (
      <div>
        <TruckImage />
        <p className="fine-print">
          3D preview unavailable. Static artwork is shown instead.
        </p>
      </div>
    ),
  })),
);
const services = [
  [
    "Return loads",
    "Turn a return journey into an opportunity. Find compatible cargo along an existing route.",
    "route",
  ],
  [
    "Dedicated transport",
    "Find a truck for your shipment, with the space and vehicle category your cargo needs.",
    "truck",
  ],
  [
    "Scheduled routes",
    "Plan recurring movements between towns and coordinate collection dates in one place.",
    "clock",
  ],
  [
    "Shipment tracking",
    "Keep shipment milestones and carrier updates together. Our local preview uses a clearly labeled route simulation.",
    "pin",
  ],
  [
    "Business freight",
    "Organize repeat deliveries and keep your bookings and conversations in one workspace.",
    "box",
  ],
];
const steps = [
  [
    "Post your cargo",
    "Tell us what you’re moving, where it’s going, and when it needs to arrive.",
    "box",
  ],
  [
    "Find the right truck",
    "Compare suitable vehicles by route, carrying capacity, and availability.",
    "truck",
  ],
  [
    "Book & coordinate",
    "Request your booking and keep the shipment conversation in one place.",
    "route",
  ],
  [
    "Confirm delivery",
    "Follow each milestone and record the delivery confirmation.",
    "check",
  ],
];
export default function Landing() {
  const { modal, toast } = useApp(),
    [menu, setMenu] = useState(false),
    [service, setService] = useState(0),
    [step, setStep] = useState(0),
    [story, setStory] = useState(0),
    [three, setThree] = useState(false);
  const root = useRef();
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".hero-copy > *", {
        y: 25,
        opacity: 0,
        stagger: 0.09,
        duration: 0.7,
        clearProps: "all",
      });
      gsap.from(".hero-art", {
        x: 50,
        opacity: 0,
        duration: 1,
        clearProps: "all",
      });
      gsap.utils.toArray(".reveal").forEach((el) =>
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.65,
          scrollTrigger: { trigger: el, start: "top 92%" },
          clearProps: "all",
        }),
      );
      gsap.to(".hero-art-inner", {
        y: 55,
        rotation: 1,
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      if (innerWidth > 850)
        gsap.utils.toArray(".process-card").forEach((el, i) =>
          gsap.fromTo(
            el,
            { y: 35 + i * 15, rotation: (i - 1.5) * 4 },
            {
              y: 0,
              rotation: (i - 1.5) * 1.3,
              scrollTrigger: {
                trigger: ".process-grid",
                start: "top 90%",
                end: "center 45%",
                scrub: 1,
              },
            },
          ),
        );
      gsap.fromTo(
        ".return-section .map-route",
        { strokeDasharray: 500, strokeDashoffset: 500 },
        {
          strokeDashoffset: 0,
          scrollTrigger: {
            trigger: ".return-section",
            start: "top 80%",
            end: "bottom 70%",
            scrub: 1,
          },
        },
      );
    });
    return () => mm.revert();
  }, []);
  const jump = (id) => {
    setMenu(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  const access = () =>
    modal({
      title: "Explore the Movara workspace",
      content: (
        <div className="role-options">
          <p className="muted">
            Local development preview. These demo roles don’t require an
            account. No real carrier or customer data is used.
          </p>
          {[
            [
              "Customer",
              "Find trucks, post cargo, manage bookings",
              "find",
              "box",
            ],
            [
              "Carrier",
              "Manage vehicles and freight requests",
              "carrier",
              "truck",
            ],
            [
              "Driver",
              "View your trip and update milestones",
              "driver",
              "route",
            ],
          ].map(([title, copy, path, icon]) => (
            <button
              key={title}
              onClick={() => {
                modal(null);
                go("/" + path);
              }}
            >
              <Icon name={icon} />
              <div>
                <strong>{title}</strong>
                <p>{copy}</p>
              </div>
              <Icon />
            </button>
          ))}
        </div>
      ),
    });
  return (
    <div ref={root} className="landing">
      <div className="announcement">
        <span className="status-dot" /> Built for the road ahead. Made for
        Kenya.
        <span className="announcement-right">LOCAL DEVELOPMENT PREVIEW</span>
      </div>
      <header className="public-nav">
        <Logo />
        <nav className={menu ? "open" : ""} aria-label="Main navigation">
          <button onClick={() => jump("how-it-works")}>How it works</button>
          <button onClick={() => jump("services")}>Our services</button>
          <button onClick={() => jump("carriers")}>For carriers</button>
          <button onClick={() => jump("about")}>About Movara</button>
        </nav>
        <div className="nav-actions">
          <button className="login" onClick={access}>
            Explore workspace <Icon name="external" size={14} />
          </button>
          <Button onClick={() => go("/post")}>
            Get started <Icon size={16} />
          </Button>
          <button
            className="menu-button"
            aria-label="Toggle navigation"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            <Icon name={menu ? "close" : "menu"} />
          </button>
        </div>
      </header>
      <main id="main-content">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="tiny-mark">↗</span> A BETTER WAY FORWARD
            </div>
            <h1>
              THE SMARTER
              <br />
              WAY TO MOVE
              <br />
              <span>FREIGHT.</span>
            </h1>
            <p>
              Big plans. Better journeys.
              <br />
              Connect with the right truck and move your
              <br className="desktop-break" /> cargo across Kenya.
            </p>
            <div className="hero-buttons">
              <Button onClick={() => go("/find")}>
                Find a truck <Icon size={18} />
              </Button>
              <Button secondary onClick={() => go("/register")}>
                List your vehicle <Icon name="plus" size={18} />
              </Button>
            </div>
            <div className="hero-footnote">
              <Icon name="shield" size={16} />
              <span>Independent carriers. One connected marketplace.</span>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-word">MOVE.</div>
            <div className="orange-slash" />
            <div className="hero-art-inner">
              <TruckImage fetchPriority="high" />
              <span className="asset-caption">
                ORIGINAL ILLUSTRATIVE ARTWORK
              </span>
            </div>
            <div className="annotation ann-one">
              <span className="annotation-dot" />
              <strong>
                Your cargo.
                <br />
                The right connection.
              </strong>
              <span>Built around your route.</span>
            </div>
            <div className="annotation ann-two">
              <Icon name="route" size={20} />
              <div>
                <strong>More loaded journeys.</strong>
                <span>Fewer empty kilometres.</span>
              </div>
            </div>
            <div className="hero-coordinate">
              01°17′ S &nbsp; 36°49′ E <span>NAIROBI, KENYA</span>
            </div>
          </div>
          <button className="scroll-cue" onClick={() => jump("platform")}>
            <span>SCROLL TO EXPLORE</span>
            <span>↓</span>
          </button>
        </section>
        <section className="value-strip" id="platform">
          <div>
            <Icon name="truck" />
            <span>Freight across Kenya</span>
          </div>
          <div>
            <Icon name="route" />
            <span>Smarter return journeys</span>
          </div>
          <div>
            <Icon name="chat" />
            <span>Connected coordination</span>
          </div>
          <div>
            <Icon name="box" />
            <span>From pickup to delivery</span>
          </div>
        </section>
        <section className="intro section-pad reveal" id="about">
          <div className="eyebrow">01 / BUILT TO CONNECT</div>
          <h2>
            A country on the move.
            <br />
            <span>A better way to connect it.</span>
          </h2>
          <p>
            Great journeys start with the right connection. Movara brings
            customers and independent truck owners together—making room for
            better freight journeys, from the first mile to the last.
          </p>
        </section>
        <section className="return-section section-pad" id="return-loads">
          <div className="return-copy reveal">
            <div className="eyebrow">02 / MAKE THE RETURN COUNT</div>
            <h2>
              Empty miles.
              <br />
              <span>Full of possibility.</span>
            </h2>
            <p>
              A delivery shouldn’t be the end of the opportunity. Match cargo
              with a truck already heading back your way.
            </p>
            <div
              className="story-tabs"
              role="tablist"
              aria-label="Return load demonstration stages"
            >
              {["The delivery", "The match", "The return"].map((s, i) => (
                <button
                  role="tab"
                  aria-selected={i === story}
                  key={s}
                  onClick={() => setStory(i)}
                >
                  <span>0{i + 1}</span>
                  {s}
                </button>
              ))}
            </div>
            <div className="story-note" role="tabpanel">
              <strong>
                {
                  [
                    "A truck arrives in Eldoret.",
                    "Your cargo needs a lift to Nairobi.",
                    "One route. A new opportunity.",
                  ][story]
                }
              </strong>
              <p>
                {
                  [
                    "The original delivery is complete. The truck now has space for its journey back.",
                    "A compatible return shipment can connect with that available carrying capacity.",
                    "The carrier can earn on the return journey while the customer finds suitable transport.",
                  ][story]
                }
              </p>
            </div>
            <span className="fine-print">
              Illustrative matching scenario. Availability and pricing depend on
              actual carriers.
            </span>
          </div>
          <div className="return-map reveal">
            <RouteMap progress={[1, 0.52, 0.05][story]} />
            <div className="route-floating">
              <span className="status-dot" />
              <div>
                <strong>
                  {
                    ["Delivery complete", "Compatible route", "Return journey"][
                      story
                    ]
                  }
                </strong>
                <small>
                  Eldoret <Icon size={12} /> Nairobi
                </small>
              </div>
              <span className="round-icon">
                <Icon name="truck" />
              </span>
            </div>
          </div>
        </section>
        <section className="process-section section-pad" id="how-it-works">
          <div className="section-top">
            <div>
              <div className="eyebrow">03 / LESS FRICTION. MORE FORWARD.</div>
              <h2>
                From cargo
                <br />
                to <span>consider it moved.</span>
              </h2>
            </div>
            <p>
              Four straightforward steps.
              <br />
              One connected journey.
            </p>
          </div>
          <div className="process-grid">
            {steps.map(([title, copy, icon], i) => (
              <button
                key={title}
                className={`process-card ${step === i ? "active" : ""}`}
                onClick={() => setStep(i)}
                aria-pressed={step === i}
              >
                <div className="card-number">
                  0{i + 1}
                  <span>↗</span>
                </div>
                <Icon name={icon} size={52} />
                <h3>{title}</h3>
                <p>{copy}</p>
                <span className="card-rule" />
              </button>
            ))}
          </div>
          <div className="process-bottom">
            <span>YOUR NEXT MOVE STARTS HERE.</span>
            <button className="text-link" onClick={() => go("/post")}>
              Post a shipment <Icon />
            </button>
          </div>
        </section>
        <section className="services-section section-pad" id="services">
          <div className="service-copy">
            <div className="eyebrow">04 / OUR SERVICES</div>
            <h2>
              Every load.
              <br />A way forward.
            </h2>
            <p className="muted">
              From a one-off delivery to your regular routes, find transport
              that fits the way you work.
            </p>
            <div className="service-list">
              {services.map(([name, desc, icon], i) => (
                <button
                  key={name}
                  onMouseEnter={() => setService(i)}
                  onFocus={() => setService(i)}
                  onClick={() => setService(i)}
                  aria-expanded={service === i}
                  className={service === i ? "selected" : ""}
                >
                  <Icon name={icon} />
                  <div>
                    <strong>{name}</strong>
                    {service === i && <p>{desc}</p>}
                  </div>
                  <Icon name="arrow" size={18} />
                </button>
              ))}
            </div>
            <button className="text-link" onClick={() => go("/find")}>
              Explore available trucks <Icon />
            </button>
          </div>
          <div className="service-visual">
            <div className="service-image">
              <div className="road-lines" />
              <TruckImage loading="lazy" />
              <span className="image-label">
                ILLUSTRATIVE TRANSPORT ARTWORK
              </span>
            </div>
            <div className="service-orange">
              <span>0{service + 1} / MOVARA SERVICES</span>
              <h3>
                {[
                  "More loads.<br/>Less empty kilometres.",
                  "A truck that fits.<br/>A journey that works.",
                  "Regular routes.<br/>Better coordination.",
                  "Every milestone.<br/>One clear picture.",
                  "Your business.<br/>Moving forward.",
                ][service]
                  .split("<br/>")
                  .map((line, i) => (
                    <React.Fragment key={line}>
                      {i > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
              </h3>
              <button
                aria-label={`Find trucks for ${services[service][0]}`}
                onClick={() => go("/find")}
              >
                <Icon />
              </button>
            </div>
          </div>
        </section>
        <section className="benefits-section section-pad" id="carriers">
          <div className="section-top reveal">
            <div>
              <div className="eyebrow">05 / TWO SIDES. ONE ROAD.</div>
              <h2>
                Good for your cargo.
                <br />
                <span>Great for your business.</span>
              </h2>
            </div>
          </div>
          <div className="benefit-grid">
            <article className="benefit-card">
              <span className="tag">FOR CUSTOMERS</span>
              <h3>
                Your next delivery,
                <br />
                without the runaround.
              </h3>
              <ul>
                <li>
                  <Icon name="check" />
                  Compare trucks for your route and load
                </li>
                <li>
                  <Icon name="check" />
                  Keep booking details in one place
                </li>
                <li>
                  <Icon name="check" />
                  Coordinate directly within your booking
                </li>
              </ul>
              <Button onClick={() => go("/post")}>
                Move your cargo <Icon />
              </Button>
            </article>
            <article className="benefit-card dark">
              <span className="tag">FOR INDEPENDENT CARRIERS</span>
              <h3>
                Your truck.
                <br />
                More possibilities.
              </h3>
              <ul>
                <li>
                  <Icon name="check" />
                  List vehicle capacity and routes
                </li>
                <li>
                  <Icon name="check" />
                  Explore compatible return loads
                </li>
                <li>
                  <Icon name="check" />
                  Manage trips and delivery milestones
                </li>
              </ul>
              <Button onClick={() => go("/register")}>
                Join as a carrier <Icon />
              </Button>
            </article>
          </div>
        </section>
        <section className="vehicles-section section-pad">
          <div className="section-top">
            <div>
              <div className="eyebrow">06 / THE RIGHT FIT</div>
              <h2>
                Different cargo.
                <br />
                <span>Different capabilities.</span>
              </h2>
            </div>
            <p>
              Choose by carrying capacity,
              <br />
              cargo requirements, and route.
            </p>
          </div>
          <div className="vehicle-categories">
            {[
              [
                "Light trucks",
                "Smaller deliveries, local distribution.",
                "Up to 5 tonnes",
              ],
              [
                "Medium lorries",
                "Regional cargo, room to grow.",
                "5–10 tonnes",
              ],
              ["Heavy trucks", "Larger loads, longer journeys.", "10+ tonnes"],
            ].map(([name, copy, capacity], i) => (
              <button
                className="vehicle-category"
                key={name}
                onClick={() =>
                  go(
                    "/find?category=" +
                      encodeURIComponent(
                        ["Light truck", "Medium lorry", "Heavy truck"][i],
                      ),
                  )
                }
              >
                <span>0{i + 1}</span>
                <TruckImage
                  loading="lazy"
                  style={{ transform: `scale(${0.8 + i * 0.08})` }}
                />
                <h3>
                  {name}
                  <Icon />
                </h3>
                <p>{copy}</p>
                <small>{capacity} · Illustrative categories</small>
              </button>
            ))}
          </div>
        </section>
        <section className="trust-section section-pad reveal">
          <Icon name="shield" size={48} />
          <div>
            <div className="eyebrow">CLARITY BUILDS CONFIDENCE</div>
            <h2>
              Know the details.
              <br />
              Before you move.
            </h2>
          </div>
          <div>
            <p>
              Vehicle capacity, route, booking milestones, and shipment
              conversations belong together. Movara keeps the information you
              need within reach.
            </p>
            <p className="fine-print">
              This is a local preview. Carrier identity checks and verification
              services are not yet connected. All sample carriers are demo
              records.
            </p>
          </div>
        </section>
        <section className="tracking-section section-pad">
          <div className="tracking-visual">
            <RouteMap />
            <div className="tracking-mini">
              <span className="status-dot" />
              <strong>On the road</strong>
              <span>Demo trip · Nairobi → Eldoret</span>
              <div className="tracking-milestones">
                <i />
                <i />
                <i />
                <i />
              </div>
              <small>Sample milestone illustration</small>
            </div>
          </div>
          <div className="tracking-copy">
            <div className="eyebrow">07 / STAY IN THE LOOP</div>
            <h2>
              The journey matters.
              <br />
              <span>Follow every step.</span>
            </h2>
            <p>
              From pickup to delivery, keep your trip details, progress, and
              conversations together.
            </p>
            <Button secondary onClick={() => go("/tracking/MV-DEMO-001")}>
              Explore tracking demo <Icon />
            </Button>
            <span className="fine-print">
              Illustrative route. No real-time GPS connection.
            </span>
          </div>
        </section>
        <section className="three-section section-pad">
          <div>
            <div className="eyebrow">A CLOSER LOOK</div>
            <h2>
              Built for the
              <br />
              <span>everyday journey.</span>
            </h2>
            <p>
              Explore an original lightweight vehicle concept. The full artwork
              stays available on every device.
            </p>
            <Button
              secondary
              onClick={() => {
                if (
                  !three &&
                  (matchMedia("(prefers-reduced-motion: reduce)").matches ||
                    navigator.connection?.saveData)
                ) {
                  toast(
                    "Static artwork is enabled for your motion or data-saving preference.",
                  );
                  return;
                }
                setThree(!three);
              }}
            >
              {three ? "Return to artwork" : "Explore 3D concept"}{" "}
              <Icon name="refresh" />
            </Button>
          </div>
          <div className="three-stage">
            {three ? (
              <Suspense fallback={<TruckImage />}>
                <TruckScene />
              </Suspense>
            ) : (
              <TruckImage loading="lazy" />
            )}
            <span className="fine-print">
              Original illustrative concept ·{" "}
              {three ? "Drag to rotate" : "Static artwork"}
            </span>
          </div>
        </section>
        <section className="faq-section section-pad" id="faq">
          <div>
            <div className="eyebrow">08 / A FEW THINGS TO KNOW</div>
            <h2>
              Clear answers.
              <br />
              <span>Better journeys.</span>
            </h2>
          </div>
          <div className="faq-list">
            {[
              [
                "What is Movara?",
                "Movara is a freight marketplace concept connecting customers and independent truck owners in Kenya. This build is a local development preview you can explore on your computer.",
              ],
              [
                "Does Movara own the trucks?",
                "No. The marketplace is designed for independent truck owners. The vehicles shown in this preview are clearly labeled demo records.",
              ],
              [
                "How do return loads work?",
                "A carrier completing a delivery can find compatible cargo for its return route. Matching depends on pickup, destination, vehicle capacity, and timing.",
              ],
              [
                "Can I book and pay in this preview?",
                "You can create shipments, request local demo bookings, exchange local messages, and record simulated payments. No money is collected and no real shipment is dispatched.",
              ],
              [
                "Is tracking live?",
                "No. The tracking preview is a route diagram and simulation. Live tracking requires an authorized location provider and driver consent.",
              ],
              [
                "How are prices and carriers verified?",
                "All sample rates are development fixtures. Production pricing, identity verification, insurance checks, and operating terms must be configured before launch.",
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <Icon name="plus" size={18} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="final-cta section-pad">
          <div className="eyebrow">LET’S KEEP KENYA MOVING.</div>
          <h2>
            Your cargo.
            <br />
            Your next <span>move.</span>
          </h2>
          <div>
            <Button className="black-btn" onClick={() => go("/find")}>
              Find a truck <Icon />
            </Button>
            <Button secondary onClick={() => go("/register")}>
              List your vehicle <Icon name="plus" />
            </Button>
          </div>
          <span className="cta-arrow">↗</span>
        </section>
      </main>
      <footer className="footer section-pad">
        <div className="footer-top">
          <div>
            <Logo light />
            <p>
              Freight, moving forward.
              <br />
              Connecting journeys across Kenya.
            </p>
          </div>
          <div>
            <strong>Explore</strong>
            <button onClick={() => jump("how-it-works")}>How it works</button>
            <button onClick={() => jump("services")}>Our services</button>
            <button onClick={() => go("/find")}>Find a truck</button>
          </div>
          <div>
            <strong>For the road</strong>
            <button onClick={() => go("/register")}>Become a carrier</button>
            <button onClick={() => go("/driver")}>Driver workspace</button>
            <button onClick={() => jump("faq")}>
              Frequently asked questions
            </button>
          </div>
          <div>
            <strong>Build preview</strong>
            <button onClick={access}>Explore workspaces</button>
            <button onClick={() => go("/admin")}>
              Local demo administration
            </button>
            <small>
              Demo data only.
              <br />
              No live transport services.
            </small>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Movara. Built for what’s next.
          </span>
          <span>
            KENYA <span className="status-dot" />
          </span>
        </div>
      </footer>
    </div>
  );
}
