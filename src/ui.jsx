import React from "react";
import brand from "../config/brand.json";
export function Icon({ name = "arrow", size = 20, ...props }) {
  const paths = {
    arrow: "M4 12h16m-6-6 6 6-6 6",
    chevron: "m9 5 7 7-7 7",
    truck:
      "M2 5h12v12H2z M14 9h4l4 4v4h-8 M4 17a2 2 0 1 0 4 0m8 0a2 2 0 1 0 4 0",
    pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
    check: "m5 12 4 4L19 6",
    shield: "M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6Z m-5 10 3 3 5-6",
    box: "m12 2 10 5v10l-10 5-10-5V7Z M2 7l10 5 10-5 M12 12v10 M7 4.5l10 5",
    route:
      "M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6 M18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6 M9 6h7a4 4 0 0 1 0 8H8a4 4 0 0 0 0 8",
    search: "M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14 m5 12 6 6",
    menu: "M3 6h18 M3 12h18 M3 18h18",
    close: "m6 6 12 12 M6 18 18 6",
    chat: "M21 11a9 9 0 0 1-9 9H3l2-5A9 9 0 1 1 21 11Z M8 10h8 M8 14h5",
    grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
    clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M12 7v5l3 2",
    wallet: "M3 5h17v15H3Z M3 5V3h14 M14 10h7v6h-7z",
    user: "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M4 22v-3a8 8 0 0 1 16 0v3",
    plus: "M12 4v16 M4 12h16",
    send: "m22 2-7 20-4-9-9-4Z M11 13 22 2",
    bell: "M5 17h14l-2-3V9a5 5 0 0 0-10 0v5Z M10 21h4",
    phone: "M6 3H3v5c0 7 6 13 13 13h5v-4l-5-2-2 2-7-7 2-2Z",
    logout: "M9 3H3v18h6 M8 12h14m-5-5 5 5-5 5",
    star: "m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z",
    leaf: "M20 3C8 1 1 9 6 16s16 3 14-13ZM3 22 15 10",
    download: "M12 3v12m-5-5 5 5 5-5 M3 16v5h18v-5",
    refresh: "M20 8a9 9 0 1 0 1 8 M20 3v5h-5",
    settings:
      "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M12 2v3 M12 19v3 M2 12h3 M19 12h3 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2",
    external: "M14 3h7v7 M21 3 10 14 M10 3H3v18h18v-7",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.arrow} />
    </svg>
  );
}
export const money = (n) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(n || 0);
export function Logo({ light = false }) {
  return (
    <a
      href="#/"
      aria-label="Movara home"
      className={`logo ${light ? "light" : ""}`}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="currentColor"
          d="M2 13 14 3v17L2 30zM18 11 30 1v18L18 29z"
        />
      </svg>
      <span>
        {brand.name}
        <span className="logo-dot">.</span>
      </span>
    </a>
  );
}
export function Button({
  children,
  secondary = false,
  className = "",
  ...props
}) {
  return (
    <button
      className={`btn ${secondary ? "secondary" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
export function Field({ label, children, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children || <input {...props} />}
    </label>
  );
}
export function Badge({ children }) {
  return (
    <span
      className={`badge ${String(children).toLowerCase().replaceAll(" ", "-")}`}
    >
      {children}
    </span>
  );
}
export function Empty({ title, children }) {
  return (
    <div className="empty">
      <Icon name="box" size={34} />
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
export function TruckImage({ className = "", ...props }) {
  return (
    <img
      className={`truck-image ${className}`}
      src="/assets/movara-truck-v2.webp"
      alt="Illustrative white Movara box truck with orange accents"
      {...props}
    />
  );
}
export function RouteMap({ progress = 0.52, compact = false }) {
  return (
    <div
      className={`route-map ${compact ? "compact" : ""}`}
      aria-label="Illustrative route diagram, Nairobi via Nakuru to Eldoret. Not a live map."
    >
      <div className="map-grid" />
      <svg viewBox="0 0 620 480" role="img" aria-label="Demo freight route">
        <defs>
          <pattern
            id="fields"
            width="80"
            height="65"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-18)"
          >
            <path
              d="M0 0h80v65H0Z"
              fill="none"
              stroke="#d5dfc8"
              strokeWidth="1"
            />
            <path d="M32 0v65M0 25h80" stroke="#e0e7d9" strokeWidth="3" />
          </pattern>
        </defs>
        <rect width="620" height="480" fill="url(#fields)" />
        <path
          d="M0 160Q100 130 125 250T90 480"
          stroke="#b9dce1"
          strokeWidth="40"
          fill="none"
        />
        <path
          d="M460 0Q390 110 480 200T520 480"
          stroke="#d3dec7"
          strokeWidth="70"
          fill="none"
        />
        <path
          d="M0 360Q200 230 620 300M80 0Q260 270 600 440M0 85Q240 150 620 50"
          fill="none"
          stroke="white"
          strokeWidth="10"
        />
        <path
          d="M400 395C380 340 320 330 315 255S250 175 220 90"
          stroke="white"
          strokeWidth="14"
          fill="none"
        />
        <path
          className="map-route"
          d="M400 395C380 340 320 330 315 255S250 175 220 90"
          stroke="#ff5a36"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        {[
          [400, 395, "Nairobi"],
          [315, 255, "Nakuru"],
          [220, 90, "Eldoret"],
        ].map(([x, y, name]) => (
          <g key={name}>
            <circle
              cx={x}
              cy={y}
              r="9"
              fill="#ff5a36"
              stroke="white"
              strokeWidth="4"
            />
            <text
              x={x + 18}
              y={y + 5}
              fill="#26372d"
              fontSize="18"
              fontWeight="600"
            >
              {name}
            </text>
          </g>
        ))}
        <g
          transform={`translate(${400 - 180 * progress},${395 - 305 * progress})`}
        >
          <rect
            x="-16"
            y="-24"
            width="32"
            height="48"
            rx="7"
            fill="#17231e"
            stroke="white"
            strokeWidth="4"
          />
          <rect x="-9" y="-16" width="18" height="14" rx="2" fill="#cbdcd7" />
        </g>
        <text x="22" y="455" fontSize="11" fill="#52634f" letterSpacing="2">
          ILLUSTRATIVE ROUTE · NOT TO SCALE
        </text>
      </svg>
      <span className="map-label">SIMULATED EXAMPLE</span>
    </div>
  );
}
