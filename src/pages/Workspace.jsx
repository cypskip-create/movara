import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Icon,
  Logo,
  Button,
  Field,
  Badge,
  TruckImage,
  RouteMap,
  money,
  Empty,
} from "../ui";
import { useApp, go } from "../main";
const stages = ["Requested", "Confirmed", "Pickup", "In transit", "Delivered"];
const formatDate = (d) =>
  d
    ? new Date(d + "T12:00:00").toLocaleDateString("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
const towns = [
  "Nairobi",
  "Nakuru",
  "Eldoret",
  "Mombasa",
  "Kisumu",
  "Thika",
  "Nyeri",
  "Machakos",
];
const SelectTown = ({ name, defaultValue = "Nairobi", ...props }) => (
  <select name={name} defaultValue={defaultValue} required {...props}>
    {towns.map((t) => (
      <option key={t}>{t}</option>
    ))}
  </select>
);
const FormValues = (e) => Object.fromEntries(new FormData(e.currentTarget));
function PageHead({ label, title, copy, action }) {
  return (
    <div className="workspace-heading">
      <div>
        <div className="eyebrow">{label}</div>
        <h1>{title}</h1>
        {copy && <p>{copy}</p>}
      </div>
      {action}
    </div>
  );
}
export default function Workspace() {
  const { state, route, modal } = useApp();
  const [menu, setMenu] = useState(false);
  const path = route.split("?")[0],
    section = path.split("/")[1];
  const operational = [
    "carrier",
    "fleet",
    "loads",
    "earnings",
    "admin",
  ].includes(section);
  const nav = operational
    ? [
        ["carrier", "Dashboard", "grid"],
        ["fleet", "My fleet", "truck"],
        ["loads", "Find loads", "box"],
        ["bookings", "My bookings", "route"],
        ["earnings", "Earnings", "wallet"],
        ["messages", "Messages", "chat"],
        ["driver", "Driver portal", "user"],
        ["admin", "Administration", "settings"],
      ]
    : [
        ["find", "Find trucks", "search"],
        ["post", "Post shipment", "plus"],
        ["bookings", "My bookings", "box"],
        ["messages", "Messages", "chat"],
        ["tracking/MV-DEMO-001", "Tracking demo", "pin"],
      ];
  return (
    <div className={`workspace ${operational ? "operational" : ""}`}>
      <header className="workspace-nav">
        <Logo />
        <div className="workspace-nav-center">
          <span className="workspace-label">
            {operational ? "CARRIER WORKSPACE" : "FREIGHT WORKSPACE"}
          </span>
        </div>
        <div className="workspace-nav-actions">
          <button onClick={() => go("/")} className="back-site">
            Back to website <Icon name="external" size={14} />
          </button>
          <button
            className="profile"
            onClick={() =>
              modal({
                title: "Local demo profiles",
                content: (
                  <div className="role-options">
                    <p>
                      Switch workspaces to explore. These are local development
                      roles, without production authentication.
                    </p>
                    {[
                      ["Customer", "/find"],
                      ["Carrier", "/carrier"],
                      ["Driver", "/driver"],
                    ].map(([r, p]) => (
                      <button
                        key={r}
                        onClick={() => {
                          modal(null);
                          go(p);
                        }}
                      >
                        <Icon name="user" />
                        <strong>{r}</strong>
                        <Icon />
                      </button>
                    ))}
                  </div>
                ),
              })
            }
          >
            <span className="avatar">M</span>
            <span>
              Demo workspace<small>Local development</small>
            </span>
            <Icon name="chevron" size={14} />
          </button>
          <button
            className="menu-button"
            aria-label="Toggle workspace navigation"
            onClick={() => setMenu(!menu)}
          >
            <Icon name="menu" />
          </button>
        </div>
      </header>
      <div className="demo-banner">
        <span className="status-dot" />
        <strong>LOCAL DEMO</strong>
        <span>
          Sample carriers, rates & locations. No real dispatch or money
          movement.
        </span>
      </div>
      <div className="workspace-layout">
        <aside className={`workspace-sidebar ${menu ? "visible" : ""}`}>
          <div className="sidebar-caption">YOUR WORKSPACE</div>
          <nav aria-label="Workspace navigation">
            {nav.map(([p, title, icon]) => (
              <a
                key={p}
                href={"#/" + p}
                className={section === p.split("/")[0] ? "active" : ""}
                onClick={() => setMenu(false)}
              >
                <Icon name={icon} size={18} />
                {title}
                {p === "messages" && (
                  <span className="nav-count">
                    {state?.messages.length || 0}
                  </span>
                )}
              </a>
            ))}
          </nav>
          <div className="sidebar-help">
            <Icon name="route" size={26} />
            <strong>Keep things moving.</strong>
            <p>
              {operational
                ? "Explore the customer experience too."
                : "Have a truck? Explore the carrier experience."}
            </p>
            <a href={operational ? "#/find" : "#/carrier"}>
              {operational ? "Customer workspace" : "Carrier workspace"}{" "}
              <Icon size={15} />
            </a>
          </div>
          <a className="sidebar-home" href="#/">
            <Icon name="logout" size={16} /> Movara home
          </a>
        </aside>
        <main id="main-content" className="workspace-main">
          {!state ? (
            <div className="loading">
              <span />
              Loading Movara workspace…
            </div>
          ) : (
            <motion.div
              key={path}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {section === "find" ? (
                <FindTrucks />
              ) : section === "post" ? (
                <PostShipment />
              ) : section === "bookings" ? (
                <Bookings />
              ) : section === "booking" ? (
                <Booking id={path.split("/")[2]} />
              ) : section === "tracking" ? (
                <Tracking id={path.split("/")[2]} />
              ) : section === "messages" ? (
                <Messages />
              ) : section === "carrier" ? (
                <Carrier />
              ) : section === "fleet" || section === "register" ? (
                <Fleet register={section === "register"} />
              ) : section === "loads" ? (
                <Loads />
              ) : section === "earnings" ? (
                <Earnings />
              ) : section === "driver" ? (
                <Driver />
              ) : section === "admin" ? (
                <Admin />
              ) : (
                <Empty title="This page couldn’t be found.">
                  <a href="#/find">Go to truck search</a>
                </Empty>
              )}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
function FindTrucks() {
  const { state, route } = useApp();
  const initialCategory =
    new URLSearchParams(route.split("?")[1]).get("category") || "All vehicles";
  const [draft, setDraft] = useState({
      pickup: "Nairobi",
      dropoff: "Eldoret",
      weight: "",
      category: initialCategory,
    }),
    [filters, setFilters] = useState(draft),
    [sort, setSort] = useState("match");
  let vehicles = state.vehicles.filter(
    (v) =>
      (!filters.pickup || v.origin === filters.pickup) &&
      (!filters.dropoff || v.destination === filters.dropoff) &&
      (!filters.weight || v.capacity >= Number(filters.weight)) &&
      (filters.category === "All vehicles" ||
        v.category === filters.category) &&
      v.status === "Available",
  );
  if (sort === "price") vehicles.sort((a, b) => a.price - b.price);
  if (sort === "capacity") vehicles.sort((a, b) => b.capacity - a.capacity);
  return (
    <>
      <PageHead
        label="FIND YOUR NEXT CONNECTION"
        title="The right truck. The right route."
        copy="Compare available demo vehicles and request a booking."
      />
      <div className="search-layout">
        <form
          className="panel search-filters"
          onSubmit={(e) => {
            e.preventDefault();
            setFilters(draft);
          }}
        >
          <h3>Your journey</h3>
          <Field label="Pickup location">
            <select
              value={draft.pickup}
              onChange={(e) => setDraft({ ...draft, pickup: e.target.value })}
            >
              <option value="">Any town</option>
              {towns.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Drop-off location">
            <select
              value={draft.dropoff}
              onChange={(e) => setDraft({ ...draft, dropoff: e.target.value })}
            >
              <option value="">Any town</option>
              {towns.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field
            label="Cargo weight (tonnes)"
            type="number"
            min="0.1"
            max="40"
            step="0.1"
            placeholder="Any capacity"
            value={draft.weight}
            onChange={(e) => setDraft({ ...draft, weight: e.target.value })}
          />
          <Field label="Vehicle category">
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            >
              {[
                "All vehicles",
                "Light truck",
                "Medium lorry",
                "Heavy truck",
              ].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Button type="submit">
            Search trucks <Icon name="search" size={17} />
          </Button>
          <button
            type="button"
            className="reset-link"
            onClick={() => {
              const f = {
                pickup: "",
                dropoff: "",
                weight: "",
                category: "All vehicles",
              };
              setDraft(f);
              setFilters(f);
            }}
          >
            Clear filters
          </button>
          <div className="filter-note">
            <Icon name="shield" />
            <p>
              Development fixtures. Prices are illustrative; no carrier identity
              checks are connected.
            </p>
          </div>
        </form>
        <div className="search-results">
          <div className="results-top">
            <strong>
              {vehicles.length} {vehicles.length === 1 ? "truck" : "trucks"}{" "}
              available
            </strong>
            <label>
              Sort by{" "}
              <select
                aria-label="Sort results"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="match">Best match</option>
                <option value="price">Price: low to high</option>
                <option value="capacity">Capacity</option>
              </select>
            </label>
          </div>
          {vehicles.length ? (
            vehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)
          ) : (
            <div className="panel">
              <Empty title="No trucks match this route.">
                Try another town, reduce the cargo weight, or clear the filters.
              </Empty>
            </div>
          )}
          <div className="results-note">
            <Icon name="box" size={18} />
            <span>
              Can’t find the right fit? Post your cargo to keep your
              requirements together.
            </span>
            <a href="#/post">
              Post a shipment <Icon size={14} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
function VehicleCard({ vehicle: v }) {
  const { modal } = useApp();
  return (
    <article className="vehicle-result panel">
      <div className="result-image">
        <TruckImage loading="lazy" />
        <span>DEMO VEHICLE</span>
      </div>
      <div className="result-info">
        <div className="result-title">
          <h3>{v.name}</h3>
          <Badge>{v.availability}</Badge>
        </div>
        <p>
          {v.category} <span>•</span> {v.capacity} tonne capacity
        </p>
        <div className="route-line">
          <Icon name="pin" size={15} />
          {v.origin}
          <Icon size={14} />
          {v.destination}
        </div>
        <small>{v.carrier} · Illustrative listing</small>
      </div>
      <div className="result-price">
        <strong>{money(v.price)}</strong>
        <small>Sample rate · no charge</small>
        <Button
          onClick={() =>
            modal({
              title: "Request a demo booking",
              content: <BookingRequest vehicleId={v.id} />,
            })
          }
        >
          Request booking <Icon size={16} />
        </Button>
      </div>
    </article>
  );
}
function BookingRequest({ vehicleId }) {
  const { state, api, modal, busy } = useApp();
  const vehicle = state.vehicles.find((v) => v.id === vehicleId);
  const compatible = state.shipments.filter(
    (s) =>
      s.status === "Open" &&
      s.pickup === vehicle.origin &&
      s.dropoff === vehicle.destination &&
      s.weight <= vehicle.capacity,
  );
  const [shipment, setShipment] = useState(compatible[0]?.id || ""),
    [error, setError] = useState("");
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const b = await api("bookings", { vehicleId, shipmentId: shipment });
          modal(null);
          go("/booking/" + b.id);
        } catch (e) {
          setError(e.message);
        }
      }}
    >
      <div className="booking-vehicle-summary">
        <TruckImage />
        <div>
          <strong>{vehicle.name}</strong>
          <p>
            {vehicle.origin} → {vehicle.destination}
          </p>
          <strong>{money(vehicle.price)}</strong>
          <small>Sample quote only</small>
        </div>
      </div>
      {compatible.length ? (
        <Field label="Compatible shipment">
          <select
            required
            value={shipment}
            onChange={(e) => setShipment(e.target.value)}
          >
            {compatible.map((s) => (
              <option key={s.id} value={s.id}>
                {s.cargo} · {s.weight}T · {formatDate(s.date)}
              </option>
            ))}
          </select>
        </Field>
      ) : (
        <div className="notice">
          You need an open shipment on this route within the {vehicle.capacity}{" "}
          tonne capacity.
          <Button
            type="button"
            secondary
            onClick={() => {
              modal(null);
              go("/post?vehicle=" + vehicleId);
            }}
          >
            Create compatible shipment <Icon />
          </Button>
        </div>
      )}
      <p className="fine-print">
        This creates a request in your local workspace. It does not book a real
        truck or collect a payment.
      </p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {compatible.length > 0 && (
        <Button disabled={busy} type="submit">
          {busy ? "Saving…" : "Confirm demo request"} <Icon />
        </Button>
      )}
    </form>
  );
}
function PostShipment() {
  const { api, state, route, busy, modal } = useApp();
  const vehicleId = new URLSearchParams(route.split("?")[1]).get("vehicle"),
    vehicle = state.vehicles.find((v) => v.id === vehicleId);
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Africa/Nairobi",
  });
  const [error, setError] = useState("");
  return (
    <>
      <PageHead
        label="MAKE YOUR NEXT MOVE"
        title="Tell us about your cargo."
        copy="Start with the details. Find a suitable truck next."
      />
      <div className="post-layout">
        <form
          className="panel shipment-form"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            try {
              const s = await api("shipments", FormValues(e));
              if (vehicle) {
                modal({
                  title: "Shipment saved. Ready to book?",
                  content: <BookingRequest vehicleId={vehicle.id} />,
                });
              } else {
                go("/bookings");
              }
            } catch (e) {
              setError(e.message);
            }
          }}
        >
          <div className="form-section-title">
            <span>01</span>
            <h3>The journey</h3>
          </div>
          <div className="form-grid">
            <Field label="Pickup location">
              <SelectTown
                name="pickup"
                defaultValue={vehicle?.origin || "Nairobi"}
              />
            </Field>
            <Field label="Drop-off location">
              <SelectTown
                name="dropoff"
                defaultValue={vehicle?.destination || "Eldoret"}
              />
            </Field>
            <Field
              label="Collection date"
              name="date"
              type="date"
              min={today}
              defaultValue={today}
              required
            />
            <Field
              label="Delivery deadline"
              name="deadline"
              type="date"
              min={today}
              defaultValue={today}
              required
            />
          </div>
          <div className="form-section-title">
            <span>02</span>
            <h3>The cargo</h3>
          </div>
          <div className="form-grid">
            <Field label="Cargo type">
              <select name="cargo" required>
                {[
                  "General goods",
                  "Agricultural produce",
                  "Building materials",
                  "Household goods",
                  "Packaged food",
                  "Other goods",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>
            <Field
              label="Weight (tonnes)"
              name="weight"
              type="number"
              min="0.1"
              max={vehicle?.capacity || 40}
              step="0.1"
              placeholder="e.g. 8"
              required
            />
            <Field label="Packaging">
              <select name="packaging" required>
                {["Pallets", "Bags", "Boxes", "Loose cargo", "Other"].map(
                  (x) => (
                    <option key={x}>{x}</option>
                  ),
                )}
              </select>
            </Field>
            <Field label="Special requirements">
              <select name="requirements">
                {[
                  "None",
                  "Loading assistance",
                  "Tail lift",
                  "Careful handling",
                  "Covered vehicle",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="form-section-title">
            <span>03</span>
            <h3>Before you post</h3>
          </div>
          <label className="checkbox-label">
            <input type="checkbox" required />I understand this is a demo
            shipment, saved only in this local workspace.
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="form-actions">
            <span>
              <Icon name="shield" size={16} /> No real dispatch or payment
            </span>
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : "Post shipment"} <Icon />
            </Button>
          </div>
        </form>
        <aside className="post-aside">
          <div className="orange-card">
            <Icon name="box" size={44} />
            <h2>
              Good details.
              <br />
              Better matches.
            </h2>
            <p>
              Tell carriers what they need to know, before the journey begins.
            </p>
            <ul>
              <li>
                <Icon name="check" />
                Accurate cargo weight
              </li>
              <li>
                <Icon name="check" />
                Clear pickup and destination
              </li>
              <li>
                <Icon name="check" />
                Realistic collection dates
              </li>
            </ul>
          </div>
          <div className="panel tips">
            <h3>What happens next?</h3>
            <p>
              Your shipment appears in My Bookings. Select a suitable truck and
              submit a demo booking request.
            </p>
            <a href="#/find" className="text-link">
              Browse trucks <Icon size={16} />
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
function Bookings() {
  const { state } = useApp();
  return (
    <>
      <PageHead
        label="YOUR FREIGHT, ORGANIZED"
        title="My bookings & shipments"
        copy="Every move, from the first request to the final delivery."
        action={
          <Button onClick={() => go("/post")}>
            <Icon name="plus" size={17} />
            Post shipment
          </Button>
        }
      />
      <div className="booking-list">
        {[...state.bookings].reverse().map((b) => (
          <BookingRow key={b.id} booking={b} />
        ))}
      </div>
      <div className="section-subtitle">
        <h2>Open shipments</h2>
        <span>
          {state.shipments.filter((s) => s.status === "Open").length} awaiting a
          truck
        </span>
      </div>
      {state.shipments.filter((s) => s.status === "Open").length ? (
        <div className="open-shipment-grid">
          {state.shipments
            .filter((s) => s.status === "Open")
            .map((s) => (
              <article className="panel open-shipment" key={s.id}>
                <Icon name="box" />
                <Badge>Open</Badge>
                <h3>
                  {s.pickup} → {s.dropoff}
                </h3>
                <p>
                  {s.cargo} · {s.weight} tonnes · {s.packaging}
                </p>
                <small>Collection: {formatDate(s.date)}</small>
                <Button secondary onClick={() => go("/find")}>
                  Find a truck <Icon size={16} />
                </Button>
              </article>
            ))}
        </div>
      ) : (
        <div className="panel">
          <Empty title="No open shipments">
            New shipments will appear here until a booking is requested.
          </Empty>
        </div>
      )}
    </>
  );
}
function BookingRow({ booking: b }) {
  const { state } = useApp();
  const s = state.shipments.find((s) => s.id === b.shipmentId),
    v = state.vehicles.find((v) => v.id === b.vehicleId);
  return (
    <a href={"#/booking/" + b.id} className="panel booking-row">
      <TruckImage />
      <div>
        <strong>{b.id}</strong>
        <p>
          {s.pickup} <Icon size={12} /> {s.dropoff}
        </p>
        <small>
          {formatDate(s.date)} · {s.weight}T · {v.name}
        </small>
      </div>
      <Badge>{b.status}</Badge>
      <div className="booking-row-price">
        <strong>{money(v.price)}</strong>
        <small>Sample quote</small>
      </div>
      <Icon name="chevron" />
    </a>
  );
}
function Booking({ id }) {
  const { state, modal } = useApp();
  const [tab, setTab] = useState("Details");
  const b = state.bookings.find((b) => b.id === id);
  if (!b)
    return (
      <Empty title="Booking not found">
        <a href="#/bookings">View all bookings</a>
      </Empty>
    );
  const s = state.shipments.find((s) => s.id === b.shipmentId),
    v = state.vehicles.find((v) => v.id === b.vehicleId);
  return (
    <>
      <PageHead
        label="YOUR JOURNEY AT A GLANCE"
        title="Booking details"
        copy={b.id}
        action={
          <Button secondary onClick={() => go("/tracking/" + b.id)}>
            Track demo trip <Icon name="pin" />
          </Button>
        }
      />
      <div className="panel booking-detail">
        <Milestones status={b.status} />
        <div className="booking-summary">
          <TruckImage />
          <div>
            <h2>{v.name}</h2>
            <p>
              {v.category} · {v.capacity}T capacity
            </p>
            <Badge>{b.status}</Badge>
          </div>
          <div className="summary-price">
            <strong>{money(v.price)}</strong>
            <small>Illustrative rate · not a real charge</small>
          </div>
        </div>
        <div className="tab-bar" role="tablist">
          {["Details", "Carrier", "Driver", "Timeline"].map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={t === tab}
              className={t === tab ? "active" : ""}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="booking-tab" role="tabpanel">
          {tab === "Details" ? (
            <>
              <div className="detail-grid">
                {[
                  ["Route", s.pickup + " → " + s.dropoff],
                  ["Collection", formatDate(s.date)],
                  ["Delivery deadline", formatDate(s.deadline)],
                  ["Cargo", `${s.weight} tonnes, ${s.cargo}`],
                  ["Packaging", s.packaging],
                  ["Special requirements", s.requirements || "None"],
                  ["Vehicle registration", v.registration],
                  ["Payment", b.payment],
                ].map(([l, val]) => (
                  <div key={l}>
                    <span>{l}</span>
                    <strong>{val}</strong>
                  </div>
                ))}
              </div>
              <div className="booking-actions">
                <Button
                  onClick={() =>
                    modal({
                      title: "Simulated payment",
                      content: <Payment booking={b} vehicle={v} />,
                    })
                  }
                  disabled={b.payment === "Simulated paid"}
                >
                  <Icon name="wallet" size={18} />
                  {b.payment === "Simulated paid"
                    ? "Demo payment recorded"
                    : "Try payment simulation"}
                </Button>
                <Button
                  secondary
                  onClick={() => go("/messages?booking=" + b.id)}
                >
                  <Icon name="chat" size={18} />
                  Open conversation
                </Button>
              </div>
            </>
          ) : tab === "Timeline" ? (
            <div className="timeline">
              {b.history.map((h, i) => (
                <div key={i}>
                  <span className="timeline-dot" />
                  <strong>{h.status}</strong>
                  <time>
                    {new Date(h.at).toLocaleString("en-KE", {
                      timeZone: "Africa/Nairobi",
                    })}{" "}
                    EAT
                  </time>
                  {h.proof && <p>Confirmation: {h.proof}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="contact-panel">
              <span className="avatar large">
                <Icon name={tab === "Carrier" ? "truck" : "user"} size={32} />
              </span>
              <h3>{tab === "Carrier" ? v.carrier : "Demo driver"}</h3>
              <p>Sample profile · identity verification not connected</p>
              <Button secondary onClick={() => go("/messages?booking=" + b.id)}>
                Open local conversation <Icon name="chat" />
              </Button>
              <p className="fine-print">
                No real person receives messages in this preview.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
function Milestones({ status }) {
  const i = stages.indexOf(status);
  return (
    <ol className="milestones">
      {stages.map((s, n) => (
        <li
          key={s}
          className={n <= i ? "complete" : ""}
          aria-current={n === i ? "step" : undefined}
        >
          <span>
            <Icon
              name={
                n < i
                  ? "check"
                  : ["box", "check", "truck", "route", "shield"][n]
              }
              size={18}
            />
          </span>
          <small>{s}</small>
        </li>
      ))}
    </ol>
  );
}
function Payment({ booking, vehicle }) {
  const { api, modal, busy, toast } = useApp();
  const [error, setError] = useState("");
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await api("payments", { bookingId: booking.id });
          modal(null);
          toast("Simulated payment recorded. No money was collected.");
        } catch (e) {
          setError(e.message);
        }
      }}
    >
      <div className="payment-total">
        <span>Sample booking amount</span>
        <strong>{money(vehicle.price)}</strong>
        <small>{booking.id}</small>
      </div>
      <div className="notice">
        This is a simulation. Do not enter card details or an M-Pesa PIN. No
        payment provider is connected.
      </div>
      <label className="checkbox-label">
        <input type="checkbox" required />I understand that no money will move.
      </label>
      {error && <p className="form-error">{error}</p>}
      <Button disabled={busy || booking.payment === "Simulated paid"}>
        {busy ? "Saving…" : "Record simulated payment"} <Icon name="check" />
      </Button>
    </form>
  );
}
function Tracking({ id }) {
  const { state } = useApp();
  const b = state.bookings.find((b) => b.id === id) || state.bookings[0],
    s = state.shipments.find((s) => s.id === b?.shipmentId);
  const [progress, setProgress] = useState(0.48),
    [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(
      () =>
        setProgress((p) => {
          if (p >= 1) {
            setPlaying(false);
            return 1;
          }
          return Math.min(1, p + 0.01);
        }),
      500,
    );
    return () => clearInterval(t);
  }, [playing]);
  if (!b)
    return <Empty title="No trip to track">Create a booking first.</Empty>;
  return (
    <>
      <PageHead
        label="KEEP YOUR JOURNEY IN VIEW"
        title="Shipment tracking"
        copy={b.id}
      />
      <div className="tracking-workspace">
        <div className="tracking-main panel">
          <RouteMap progress={progress} />
          <div className="map-trip-label">
            <span className="status-dot" />
            <div>
              <strong>
                {playing ? "Demo vehicle moving" : "Route simulation"}
              </strong>
              <small>Not a live location feed</small>
            </div>
            <Badge>{b.status}</Badge>
          </div>
          <div className="simulation-control">
            <Button secondary onClick={() => setPlaying(!playing)}>
              {playing ? "Pause demo" : "Play route demo"}
              <Icon name="route" size={17} />
            </Button>
            <Button
              secondary
              onClick={() => {
                setPlaying(false);
                setProgress(0);
              }}
            >
              Reset
            </Button>
            <label>
              Demo route progress{" "}
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(progress * 100)}
                onChange={(e) => {
                  setPlaying(false);
                  setProgress(Number(e.target.value) / 100);
                }}
              />
            </label>
          </div>
        </div>
        <aside className="panel trip-details">
          <span className="eyebrow">TRIP OVERVIEW</span>
          <h2>
            {s.pickup}
            <br />
            <span>↓</span>
            <br />
            {s.dropoff}
          </h2>
          <Badge>{b.status}</Badge>
          <dl>
            <dt>Collection</dt>
            <dd>{formatDate(s.date)}</dd>
            <dt>Cargo</dt>
            <dd>
              {s.weight} tonnes · {s.cargo}
            </dd>
            <dt>Location source</dt>
            <dd>Simulation only</dd>
          </dl>
          <div className="notice">
            The map illustrates Nairobi–Nakuru–Eldoret. For other routes it is a
            generic example. Positions, distance and timing are not live
            telemetry.
          </div>
          <Button onClick={() => go("/messages?booking=" + b.id)}>
            Booking conversation <Icon name="chat" size={16} />
          </Button>
          <Button secondary onClick={() => go("/booking/" + b.id)}>
            View booking <Icon size={16} />
          </Button>
        </aside>
      </div>
    </>
  );
}
function Messages() {
  const { state, api, route, busy } = useApp();
  const wanted = new URLSearchParams(route.split("?")[1]).get("booking");
  const [selected, setSelected] = useState(wanted || state.bookings[0]?.id),
    [text, setText] = useState(""),
    [sender, setSender] = useState("Customer");
  const end = useRef();
  const msgs = state.messages.filter((m) => m.bookingId === selected);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [msgs.length, selected]);
  return (
    <>
      <PageHead
        label="KEEP THE CONVERSATION MOVING"
        title="Messages"
        copy="Local booking conversations. No external messages are sent."
      />
      <div className="messaging panel">
        <aside className="conversation-list">
          <h3>Your conversations</h3>
          {state.bookings.map((b) => {
            const s = state.shipments.find((s) => s.id === b.shipmentId);
            return (
              <button
                key={b.id}
                className={b.id === selected ? "selected" : ""}
                onClick={() => setSelected(b.id)}
              >
                <span className="avatar">
                  <Icon name="truck" />
                </span>
                <div>
                  <strong>
                    {s.pickup} → {s.dropoff}
                  </strong>
                  <small>{b.id}</small>
                  <span>{b.status}</span>
                </div>
              </button>
            );
          })}
        </aside>
        {selected ? (
          <div className="chat-panel">
            <div className="chat-header">
              <span className="avatar">
                <Icon name="user" />
              </span>
              <div>
                <strong>Demo booking conversation</strong>
                <small>{selected}</small>
              </div>
              <button
                aria-label="View conversation booking"
                onClick={() => go("/booking/" + selected)}
              >
                <Icon name="external" />
              </button>
            </div>
            <div className="chat-messages">
              <div className="chat-date">
                LOCAL DEMO · MESSAGES STAY ON THIS COMPUTER
              </div>
              {msgs.map((m) => (
                <div
                  key={m.id}
                  className={`chat-bubble ${m.sender === sender ? "own" : ""}`}
                >
                  <strong>{m.sender}</strong>
                  <p>{m.text}</p>
                  <time>
                    {new Date(m.at).toLocaleTimeString("en-KE", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Africa/Nairobi",
                    })}
                  </time>
                </div>
              ))}
              <div ref={end} />
            </div>
            <form
              className="message-compose"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await api("messages", { bookingId: selected, text, sender });
                  setText("");
                } catch {}
              }}
            >
              <label className="sender-select">
                Demo sender
                <select
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                >
                  {["Customer", "Carrier", "Driver"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="message-input">
                <span className="sr-only">Message</span>
                <input
                  maxLength="2000"
                  required
                  placeholder="Type your message…"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </label>
              <button
                className="send-button"
                disabled={busy || !text.trim()}
                aria-label="Send local message"
              >
                <Icon name="send" />
              </button>
            </form>
          </div>
        ) : (
          <Empty title="No conversations yet">
            Create a booking to start a local conversation.
          </Empty>
        )}
      </div>
    </>
  );
}
function Carrier() {
  const { state } = useApp();
  const active = state.bookings.filter((b) => b.status !== "Delivered"),
    open = state.shipments.filter((s) => s.status === "Open");
  const revenue = state.bookings
    .filter((b) => b.payment === "Simulated paid")
    .reduce(
      (sum, b) =>
        sum + (state.vehicles.find((v) => v.id === b.vehicleId)?.price || 0),
      0,
    );
  return (
    <>
      <PageHead
        label="YOUR BUSINESS, MOVING FORWARD"
        title="Welcome to your dashboard."
        copy="A clear view of your demo fleet and freight activity."
        action={
          <Button onClick={() => go("/fleet")}>
            <Icon name="plus" size={16} />
            Add vehicle
          </Button>
        }
      />
      <div className="stat-grid">
        {[
          ["Simulated receipts", money(revenue), "wallet"],
          ["Active bookings", active.length, "box"],
          ["Open shipments", open.length, "route"],
          ["Listed vehicles", state.vehicles.length, "truck"],
        ].map(([label, value, icon]) => (
          <div className="panel stat" key={label}>
            <span>
              {label}
              <Icon name={icon} size={18} />
            </span>
            <strong>{value}</strong>
            <small>Local workspace records</small>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="panel dashboard-bookings">
          <div className="panel-header">
            <h3>Current bookings</h3>
            <a href="#/bookings">
              View all <Icon size={14} />
            </a>
          </div>
          {active.length ? (
            active.map((b) => <BookingRow key={b.id} booking={b} />)
          ) : (
            <Empty title="All clear for now">
              New booking requests will appear here.
            </Empty>
          )}
        </section>
        <section className="panel activity-chart">
          <div className="panel-header">
            <h3>Booking activity</h3>
            <Icon name="grid" size={16} />
          </div>
          <p>Current records by milestone</p>
          <div className="bar-chart">
            {stages.map((s) => {
              const count = state.bookings.filter((b) => b.status === s).length;
              return (
                <div key={s}>
                  <strong>{count}</strong>
                  <i
                    style={{
                      height: Math.max(
                        5,
                        (count / Math.max(state.bookings.length, 1)) * 160,
                      ),
                    }}
                  />
                  <span>{s}</span>
                </div>
              );
            })}
          </div>
          <small>Calculated from local demo bookings.</small>
        </section>
      </div>
      <div className="carrier-cta">
        <div>
          <Icon name="leaf" />
          <h3>Give the return journey a purpose.</h3>
          <p>Explore open demo shipments and find a compatible route.</p>
        </div>
        <Button secondary onClick={() => go("/loads")}>
          Find loads <Icon />
        </Button>
      </div>
    </>
  );
}
function Fleet({ register = false }) {
  const { state, modal } = useApp();
  return (
    <>
      <PageHead
        label={
          register ? "JOIN THE NEXT JOURNEY" : "YOUR VEHICLES, IN ONE PLACE"
        }
        title={register ? "Put your truck on the map." : "My fleet"}
        copy="Add a vehicle to this local demo. Registration does not create a verified production carrier account."
        action={
          <Button
            onClick={() =>
              modal({ title: "Add a demo vehicle", content: <VehicleForm /> })
            }
          >
            <Icon name="plus" />
            Add vehicle
          </Button>
        }
      />
      {register && (
        <div className="registration-intro">
          <Icon name="truck" size={46} />
          <div>
            <h2>Independent carriers. More possibilities.</h2>
            <p>
              List your truck’s route, capacity, and sample rate to explore the
              marketplace. Production onboarding will require identity, vehicle,
              insurance and operating document checks.
            </p>
          </div>
          <Button
            onClick={() =>
              modal({ title: "Add a demo vehicle", content: <VehicleForm /> })
            }
          >
            Start demo registration <Icon />
          </Button>
        </div>
      )}
      <div className="fleet-grid">
        {state.vehicles.map((v) => (
          <article className="panel fleet-card" key={v.id}>
            <div className="fleet-image">
              <TruckImage loading="lazy" />
              <Badge>{v.status}</Badge>
            </div>
            <div className="fleet-card-body">
              <small>{v.registration} · DEMO LISTING</small>
              <h3>{v.name}</h3>
              <p>
                {v.category} · {v.capacity} tonnes
              </p>
              <div className="route-line">
                <Icon name="pin" size={16} />
                {v.origin} <Icon size={14} /> {v.destination}
              </div>
              <div className="fleet-footer">
                <strong>
                  {money(v.price)}
                  <small>Sample rate</small>
                </strong>
                <Icon name="truck" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
function VehicleForm() {
  const { api, modal, busy, toast } = useApp(),
    [error, setError] = useState("");
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await api("vehicles", FormValues(e));
          modal(null);
          toast("Demo vehicle added to the local fleet.");
          go("/fleet");
        } catch (e) {
          setError(e.message);
        }
      }}
    >
      <div className="form-grid">
        <Field
          label="Vehicle name"
          name="name"
          placeholder="e.g. Regional box truck"
          maxLength="100"
          required
        />
        <Field
          label="Demo registration"
          name="registration"
          placeholder="e.g. DEMO 005"
          maxLength="30"
          required
        />
        <Field label="Vehicle category">
          <select name="category">
            {["Light truck", "Medium lorry", "Heavy truck"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </Field>
        <Field
          label="Capacity (tonnes)"
          name="capacity"
          type="number"
          min="0.1"
          max="40"
          step="0.1"
          required
        />
        <Field label="Route origin">
          <SelectTown name="origin" />
        </Field>
        <Field label="Route destination">
          <SelectTown name="destination" defaultValue="Eldoret" />
        </Field>
        <Field
          label="Sample rate (KES)"
          name="price"
          type="number"
          min="1"
          max="1000000"
          required
        />
      </div>
      <p className="fine-print">
        Use demo details only. No real registration documents or identity
        information are needed in this preview.
      </p>
      {error && <p className="form-error">{error}</p>}
      <Button type="submit" disabled={busy}>
        {busy ? "Saving…" : "Add demo vehicle"}
        <Icon name="plus" />
      </Button>
    </form>
  );
}
function Loads() {
  const { state, modal } = useApp(),
    [town, setTown] = useState("All towns");
  const loads = state.shipments.filter(
    (s) => s.status === "Open" && (town === "All towns" || s.pickup === town),
  );
  return (
    <>
      <PageHead
        label="A BETTER RETURN JOURNEY"
        title="Find loads"
        copy="Open demo cargo requests, ready for a suitable vehicle."
      />
      <div className="inline-filter">
        <label>
          Pickup town{" "}
          <select value={town} onChange={(e) => setTown(e.target.value)}>
            {["All towns", ...towns].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      {loads.length ? (
        <div className="open-shipment-grid">
          {loads.map((s) => {
            const vehicles = state.vehicles.filter(
              (v) =>
                v.status === "Available" &&
                v.capacity >= s.weight &&
                v.origin === s.pickup &&
                v.destination === s.dropoff,
            );
            return (
              <article className="panel open-shipment" key={s.id}>
                <Icon name="box" />
                <Badge>Open</Badge>
                <h3>
                  {s.pickup} → {s.dropoff}
                </h3>
                <p>
                  {s.cargo} · {s.weight}T · {s.packaging}
                </p>
                <small>
                  {formatDate(s.date)} to {formatDate(s.deadline)}
                </small>
                {vehicles.length ? (
                  <Button
                    onClick={() =>
                      modal({
                        title: "Match a demo load",
                        content: <LoadMatch shipment={s} vehicles={vehicles} />,
                      })
                    }
                  >
                    Match vehicle <Icon />
                  </Button>
                ) : (
                  <p className="fine-print">
                    No compatible available vehicle. Add one in My Fleet.
                  </p>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="panel">
          <Empty title="No open demo loads">
            Post a shipment in the customer workspace to explore matching.
          </Empty>
          <div className="center-action">
            <Button onClick={() => go("/post")}>
              Post a demo shipment <Icon />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
function LoadMatch({ shipment, vehicles }) {
  const { api, modal, busy } = useApp();
  const [vehicleId, setVehicle] = useState(vehicles[0].id),
    [error, setError] = useState("");
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const b = await api("bookings", {
            shipmentId: shipment.id,
            vehicleId,
          });
          modal(null);
          go("/booking/" + b.id);
        } catch (e) {
          setError(e.message);
        }
      }}
    >
      <p>
        {shipment.pickup} → {shipment.dropoff} · {shipment.weight}T
      </p>
      <Field label="Compatible available vehicle">
        <select value={vehicleId} onChange={(e) => setVehicle(e.target.value)}>
          {vehicles.map((v) => (
            <option value={v.id} key={v.id}>
              {v.name} · {v.registration} · {money(v.price)}
            </option>
          ))}
        </select>
      </Field>
      <div className="notice">Creates a local demo booking request only.</div>
      {error && <p className="form-error">{error}</p>}
      <Button disabled={busy}>
        Request demo match <Icon />
      </Button>
    </form>
  );
}
function Earnings() {
  const { state } = useApp();
  const paid = state.bookings.filter((b) => b.payment === "Simulated paid");
  return (
    <>
      <PageHead
        label="YOUR LOCAL DEMO LEDGER"
        title="Earnings"
        copy="Simulated receipts only. No money has been collected, held, or paid out."
      />
      <div className="panel ledger-total">
        <Icon name="wallet" size={36} />
        <div>
          <span>Total simulated receipts</span>
          <strong>
            {money(
              paid.reduce(
                (sum, b) =>
                  sum + state.vehicles.find((v) => v.id === b.vehicleId).price,
                0,
              ),
            )}
          </strong>
        </div>
        <Badge>Simulation</Badge>
      </div>
      <div className="section-subtitle">
        <h2>Simulated transactions</h2>
      </div>
      {paid.length ? (
        paid.map((b) => <BookingRow key={b.id} booking={b} />)
      ) : (
        <div className="panel">
          <Empty title="No demo payments recorded">
            Open a booking and try the payment simulation.
          </Empty>
        </div>
      )}
    </>
  );
}
function Driver() {
  const { state, api, busy } = useApp(),
    [id, setId] = useState(state.bookings[0]?.id),
    [proof, setProof] = useState(""),
    [error, setError] = useState("");
  const b = state.bookings.find((b) => b.id === id);
  if (!b)
    return (
      <Empty title="No trips assigned">Create a demo booking first.</Empty>
    );
  const s = state.shipments.find((s) => s.id === b.shipmentId),
    next = stages[stages.indexOf(b.status) + 1];
  return (
    <>
      <PageHead
        label="DRIVER PORTAL"
        title="Your trip. Clear and simple."
        copy="Mobile-first demo trip management. Milestones are saved locally."
      />
      <div className="driver-layout">
        <div className="driver-phone panel">
          <div className="driver-top">
            <Icon name="truck" />
            <div>
              <strong>My trip</strong>
              <small>Local demo assignment</small>
            </div>
            <Badge>{b.status}</Badge>
          </div>
          <Field label="Select demo trip">
            <select
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                setProof("");
                setError("");
              }}
            >
              {state.bookings.map((b) => (
                <option value={b.id} key={b.id}>
                  {b.id}
                </option>
              ))}
            </select>
          </Field>
          <div className="driver-stops">
            <div>
              <span className="stop-dot start" />
              <small>PICKUP</small>
              <h2>{s.pickup}</h2>
              <p>{formatDate(s.date)}</p>
            </div>
            <div>
              <span className="stop-dot end" />
              <small>DELIVERY</small>
              <h2>{s.dropoff}</h2>
              <p>{formatDate(s.deadline)}</p>
            </div>
          </div>
          <div className="driver-cargo">
            <Icon name="box" />
            <div>
              <strong>{s.cargo}</strong>
              <p>
                {s.weight} tonnes · {s.packaging}
              </p>
            </div>
          </div>
          <a
            className="btn secondary"
            target="_blank"
            rel="noreferrer"
            href={
              "https://www.google.com/maps/dir/?api=1&origin=" +
              encodeURIComponent(s.pickup + ", Kenya") +
              "&destination=" +
              encodeURIComponent(s.dropoff + ", Kenya")
            }
          >
            Open route directions <Icon name="external" size={17} />
          </a>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await api("status", { bookingId: b.id, status: next, proof });
                setProof("");
              } catch (e) {
                setError(e.message);
              }
            }}
          >
            {next === "Delivered" && (
              <Field label="Delivery confirmation note">
                <textarea
                  value={proof}
                  maxLength="500"
                  onChange={(e) => setProof(e.target.value)}
                  required
                  placeholder="e.g. Demo cargo received by consignee"
                />
              </Field>
            )}
            {next ? (
              <Button type="submit" disabled={busy}>
                Mark as {next.toLowerCase()} <Icon name="check" />
              </Button>
            ) : (
              <div className="delivery-complete">
                <Icon name="shield" />
                Delivery confirmed
              </div>
            )}
            {error && <p className="form-error">{error}</p>}
          </form>
          <div className="driver-bottom">
            <button onClick={() => go("/messages?booking=" + b.id)}>
              <Icon name="chat" />
              Messages
            </button>
            <button onClick={() => go("/booking/" + b.id)}>
              <Icon name="box" />
              Trip details
            </button>
            <button onClick={() => go("/tracking/" + b.id)}>
              <Icon name="pin" />
              Tracking demo
            </button>
          </div>
        </div>
        <div className="driver-side">
          <RouteMap />
          <div className="notice">
            Local demo role access is unrestricted. Production driver
            authentication, assignment permissions, navigation telemetry and
            location consent are not connected.
          </div>
          <Milestones status={b.status} />
        </div>
      </div>
    </>
  );
}
function Admin() {
  const { state } = useApp();
  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = "movara-local-demo-export.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <>
      <PageHead
        label="LOCAL DEVELOPMENT ADMINISTRATION"
        title="Marketplace overview"
        copy="Inspect local records. This console is a demo with no production role enforcement."
        action={
          <Button secondary onClick={exportData}>
            Export demo records <Icon name="download" />
          </Button>
        }
      />
      <div className="notice">
        Before production: implement authentication, server-side role
        authorization, carrier verification, payment integration, live location
        consent, audit logs, and operational policies. This server is restricted
        to loopback access.
      </div>
      <div className="stat-grid">
        {[
          ["Vehicles", state.vehicles.length],
          ["Shipments", state.shipments.length],
          ["Bookings", state.bookings.length],
          ["Messages", state.messages.length],
        ].map(([k, v]) => (
          <div className="panel stat" key={k}>
            <span>{k}</span>
            <strong>{v}</strong>
            <small>Local records</small>
          </div>
        ))}
      </div>
      <div className="panel admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Booking</th>
              <th>Route</th>
              <th>Milestone</th>
              <th>Payment</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {state.bookings.map((b) => {
              const s = state.shipments.find((s) => s.id === b.shipmentId);
              return (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>
                    {s.pickup} → {s.dropoff}
                  </td>
                  <td>
                    <Badge>{b.status}</Badge>
                  </td>
                  <td>{b.payment}</td>
                  <td>
                    <a href={"#/booking/" + b.id}>
                      Open <Icon size={14} />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
