import test from "node:test";
import assert from "node:assert/strict";
import { seed, mutate, openStore } from "../lib/store.mjs";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
const shipment = {
  pickup: "Nairobi",
  dropoff: "Eldoret",
  cargo: "Maize",
  weight: 8,
  date: "2026-10-22",
  deadline: "2026-10-23",
  packaging: "Bags",
};
test("booking enforces capacity, route and duplicate protection", () => {
  const state = seed();
  const s = mutate(state, "shipments", shipment);
  assert.throws(
    () => mutate(state, "bookings", { vehicleId: "v4", shipmentId: s.id }),
    /capacity/,
  );
  assert.throws(
    () => mutate(state, "bookings", { vehicleId: "v1", shipmentId: s.id }),
    /unavailable/,
  );
  const light = mutate(state, "shipments", { ...shipment, weight: 4 });
  assert.throws(
    () => mutate(state, "bookings", { vehicleId: "v4", shipmentId: light.id }),
    /route/,
  );
  const b = mutate(state, "bookings", { vehicleId: "v3", shipmentId: s.id });
  assert.equal(b.status, "Requested");
  assert.throws(
    () => mutate(state, "bookings", { vehicleId: "v3", shipmentId: s.id }),
    /already/,
  );
});
test("milestones require sequence and proof; simulated payments are explicit", () => {
  const state = seed();
  assert.throws(
    () =>
      mutate(state, "status", {
        bookingId: "MV-DEMO-001",
        status: "Delivered",
      }),
    /confirmation/,
  );
  const b = mutate(state, "status", {
    bookingId: "MV-DEMO-001",
    status: "Delivered",
    proof: "Received by demo consignee",
  });
  assert.equal(b.history.at(-1).proof, "Received by demo consignee");
  assert.throws(
    () => mutate(state, "status", { bookingId: b.id, status: "Confirmed" }),
    /order/,
  );
  assert.equal(
    mutate(state, "payments", { bookingId: b.id }).payment,
    "Simulated paid",
  );
});
test("invalid dates, impossible routes and messages are rejected", () => {
  const state = seed();
  assert.throws(
    () => mutate(state, "shipments", { ...shipment, date: "2026-02-30" }),
    /date/,
  );
  assert.throws(
    () => mutate(state, "shipments", { ...shipment, dropoff: "Nairobi" }),
    /different/,
  );
  assert.throws(
    () => mutate(state, "messages", { bookingId: "missing", text: "Hello" }),
    /not found/,
  );
});
test("vehicle registration rejects duplicates and invalid routes", () => {
  const state = seed();
  const v = {
    name: "Test truck",
    registration: "DEMO 001",
    category: "Medium lorry",
    capacity: 8,
    price: 75000,
    origin: "Nairobi",
    destination: "Eldoret",
  };
  assert.throws(() => mutate(state, "vehicles", v), /already exists/);
  assert.throws(
    () =>
      mutate(state, "vehicles", {
        ...v,
        registration: "TEST 001",
        destination: "Nairobi",
      }),
    /different/,
  );
});
test("local records survive reopening the store", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "movara-test-"));
  const file = path.join(dir, "state.json");
  try {
    const store = openStore(file);
    store.write("messages", {
      bookingId: "MV-DEMO-001",
      text: "Persistence test",
      sender: "Customer",
    });
    assert.equal(
      openStore(file).read().messages.at(-1).text,
      "Persistence test",
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
