import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
export const statuses = [
  "Requested",
  "Confirmed",
  "Pickup",
  "In transit",
  "Delivered",
];
export function seed() {
  return {
    vehicles: [
      {
        id: "v1",
        name: "Medium box truck",
        category: "Medium lorry",
        capacity: 10,
        price: 85000,
        origin: "Nairobi",
        destination: "Eldoret",
        availability: "Return load",
        registration: "DEMO 001",
        carrier: "Demo carrier",
        status: "Booked",
      },
      {
        id: "v2",
        name: "Open body lorry",
        category: "Heavy truck",
        capacity: 15,
        price: 110000,
        origin: "Nairobi",
        destination: "Eldoret",
        availability: "Open for hire",
        registration: "DEMO 002",
        carrier: "Demo carrier",
        status: "Available",
      },
      {
        id: "v3",
        name: "Regional box truck",
        category: "Medium lorry",
        capacity: 8,
        price: 75000,
        origin: "Nairobi",
        destination: "Eldoret",
        availability: "Scheduled route",
        registration: "DEMO 003",
        carrier: "Demo carrier",
        status: "Available",
      },
      {
        id: "v4",
        name: "Light delivery truck",
        category: "Light truck",
        capacity: 5,
        price: 55000,
        origin: "Nakuru",
        destination: "Nairobi",
        availability: "Return load",
        registration: "DEMO 004",
        carrier: "Demo carrier",
        status: "Available",
      },
    ],
    shipments: [
      {
        id: "s-demo",
        pickup: "Nairobi",
        dropoff: "Eldoret",
        cargo: "General goods",
        weight: 8,
        date: "2026-10-22",
        deadline: "2026-10-23",
        packaging: "Pallets",
        requirements: "Loading assistance",
        status: "Booked",
      },
    ],
    bookings: [
      {
        id: "MV-DEMO-001",
        shipmentId: "s-demo",
        vehicleId: "v1",
        status: "In transit",
        payment: "Unpaid",
        createdAt: "2026-10-20T08:00:00.000Z",
        history: [
          { status: "Requested", at: "2026-10-20T08:00:00.000Z" },
          { status: "Confirmed", at: "2026-10-20T08:05:00.000Z" },
          { status: "Pickup", at: "2026-10-20T09:00:00.000Z" },
          { status: "In transit", at: "2026-10-20T09:20:00.000Z" },
        ],
      },
    ],
    messages: [
      {
        id: "m-demo",
        bookingId: "MV-DEMO-001",
        sender: "Driver",
        text: "Welcome to the Movara demo. Messages you send here are saved locally. No real carrier will receive them.",
        at: "2026-10-20T09:20:00.000Z",
      },
    ],
  };
}
const fail = (message) => {
  const e = new Error(message);
  e.status = 400;
  throw e;
};
const str = (v, name, max = 200) =>
  typeof v === "string" && v.trim().length && v.trim().length <= max
    ? v.trim()
    : fail(`Enter a valid ${name}.`);
const number = (v, name, min, max) =>
  Number.isFinite(Number(v)) && Number(v) >= min && Number(v) <= max
    ? Number(v)
    : fail(`Enter a valid ${name} (${min}–${max}).`);
const date = (v, name) =>
  /^\d{4}-\d{2}-\d{2}$/.test(v || "") &&
  !Number.isNaN(Date.parse(v)) &&
  new Date(v).toISOString().slice(0, 10) === v
    ? v
    : fail(`Enter a valid ${name}.`);
export function mutate(state, action, body) {
  const now = new Date().toISOString();
  if (action === "shipments") {
    const item = {
      id: randomUUID(),
      pickup: str(body.pickup, "pickup"),
      dropoff: str(body.dropoff, "destination"),
      cargo: str(body.cargo, "cargo type"),
      weight: number(body.weight, "weight", 0.1, 40),
      date: date(body.date, "collection date"),
      deadline: date(body.deadline, "deadline"),
      packaging: str(body.packaging, "packaging"),
      requirements:
        typeof body.requirements === "string"
          ? body.requirements.slice(0, 500)
          : "",
      status: "Open",
    };
    if (item.pickup.toLowerCase() === item.dropoff.toLowerCase())
      fail("Pickup and destination must be different.");
    if (item.deadline < item.date)
      fail("Delivery deadline cannot be before collection.");
    state.shipments.push(item);
    return item;
  }
  if (action === "bookings") {
    const vehicle = state.vehicles.find((v) => v.id === body.vehicleId),
      shipment = state.shipments.find((s) => s.id === body.shipmentId);
    if (!vehicle || !shipment) fail("Choose an existing vehicle and shipment.");
    if (shipment.status === "Booked")
      fail("This shipment already has a booking.");
    if (
      vehicle.status !== "Available" ||
      state.bookings.some(
        (b) => b.vehicleId === vehicle.id && b.status !== "Delivered",
      )
    )
      fail("This vehicle is unavailable.");
    if (shipment.weight > vehicle.capacity)
      fail("This shipment exceeds the vehicle capacity.");
    if (
      vehicle.origin.toLowerCase() !== shipment.pickup.toLowerCase() ||
      vehicle.destination.toLowerCase() !== shipment.dropoff.toLowerCase()
    )
      fail("Vehicle route does not match this shipment.");
    const item = {
      id: `MV-${randomUUID().slice(0, 8).toUpperCase()}`,
      shipmentId: shipment.id,
      vehicleId: vehicle.id,
      status: "Requested",
      payment: "Unpaid",
      createdAt: now,
      history: [{ status: "Requested", at: now }],
    };
    state.bookings.push(item);
    shipment.status = "Booked";
    vehicle.status = "Booked";
    return item;
  }
  if (action === "messages") {
    if (!state.bookings.some((b) => b.id === body.bookingId))
      fail("Booking not found.");
    const item = {
      id: randomUUID(),
      bookingId: body.bookingId,
      sender: ["Customer", "Carrier", "Driver"].includes(body.sender)
        ? body.sender
        : "Customer",
      text: str(body.text, "message", 2000),
      at: now,
    };
    state.messages.push(item);
    return item;
  }
  if (action === "vehicles") {
    const item = {
      id: randomUUID(),
      name: str(body.name, "vehicle name"),
      registration: str(body.registration, "registration", 30),
      category: str(body.category, "category"),
      capacity: number(body.capacity, "capacity", 0.1, 40),
      price: number(body.price, "price", 1, 1000000),
      origin: str(body.origin, "origin"),
      destination: str(body.destination, "destination"),
      availability: "Open for hire",
      carrier: "Local demo carrier",
      status: "Available",
    };
    if (item.origin.toLowerCase() === item.destination.toLowerCase())
      fail("Route origin and destination must be different.");
    if (
      state.vehicles.some(
        (v) => v.registration.toLowerCase() === item.registration.toLowerCase(),
      )
    )
      fail("Registration already exists.");
    state.vehicles.push(item);
    return item;
  }
  const booking = state.bookings.find((b) => b.id === body.bookingId);
  if (!booking) fail("Booking not found.");
  if (action === "status") {
    const index = statuses.indexOf(booking.status);
    if (body.status !== statuses[index + 1])
      fail("Booking milestones must be completed in order.");
    if (body.status === "Delivered" && !body.proof?.trim())
      fail("Delivery confirmation note is required.");
    booking.status = body.status;
    booking.history.push({
      status: body.status,
      at: now,
      ...(body.proof ? { proof: str(body.proof, "delivery note", 500) } : {}),
    });
    if (
      body.status === "Delivered" &&
      !state.bookings.some(
        (b) =>
          b.vehicleId === booking.vehicleId &&
          b.id !== booking.id &&
          b.status !== "Delivered",
      )
    )
      state.vehicles.find((v) => v.id === booking.vehicleId).status =
        "Available";
    return booking;
  }
  if (action === "payments") {
    if (booking.payment === "Simulated paid")
      fail("Demo payment already recorded.");
    booking.payment = "Simulated paid";
    return booking;
  }
  fail("Unknown operation.");
}
export function openStore(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  let state = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, "utf8"))
    : seed();
  const save = (value = state) => {
    fs.writeFileSync(`${file}.tmp`, JSON.stringify(value, null, 2));
    fs.renameSync(`${file}.tmp`, file);
  };
  if (!fs.existsSync(file)) save();
  return {
    read: () => {
      const result = structuredClone(state);
      result.vehicles.forEach((v) => {
        if (
          result.bookings.some(
            (b) => b.vehicleId === v.id && b.status !== "Delivered",
          )
        )
          v.status = "Booked";
      });
      return result;
    },
    write(action, body) {
      const next = structuredClone(state);
      const result = mutate(next, action, body);
      save(next);
      state = next;
      return result;
    },
  };
}
