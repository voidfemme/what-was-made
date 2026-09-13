// Primordial Cradle ward — rebuilt on the feeding trials.
//
// Three findings from that session drive everything here:
//
//   F8  The resting buffer (Hostile 85, Anomaly 7 in a nether) is the BIOME
//       FLOOR an offering is scored against, not accumulated character. It was
//       byte-identical across five cradles with five different seeds. Absolute
//       thresholds would read every untouched cradle in the world as blood-fed.
//       So the floor is sampled here, at runtime, from the block's own resting
//       state — never hardcoded.
//
//   --  SacrificeHandler is a scratch pad, wiped the instant an offering
//       resolves. Twenty of twenty-four samples were resting. Character cannot
//       be read off the block; it has to be witnessed and banked. The cradle
//       does not remember what you fed it. The ward does.
//
//   F1  Growth begins at the first REJECTED offering, and stored energy has
//       nothing to do with it — the 2,000,000-energy cradle sat inert through a
//       successful spawn and grew nothing until it refused something. So the
//       ward wakes on refusal, not on being fed. What it turns away is what
//       rouses it.
//
// F6 gives a way to detect that without guessing: passive drain is a hard zero
// before the first rejection and never zero after. An unexplained DROP in
// PrimalEnergy is therefore proof the cradle has been roused, and it is the one
// signal in the tag that cannot be produced by feeding.
//
// This depends on ward.data persisting across restarts. It does now.

const CRADLE = "biomancy:primordial_cradle";

// PrimalEnergy observed at 2,075,666 in the trials, with single grants of
// 20-32 x 1024. Endgame scale, not the 5000 I first guessed.
const ENERGY_CAP = 2000000;

WardEvents.tick((event) => {
  if (event.id !== CRADLE) return;

  let sac = event.nbt.getCompound("SacrificeHandler");
  let d = event.data;

  // HasModifiers is the dirty flag, exactly: 1 in the four charged samples,
  // 0 in the twenty resting ones. Byte, not int.
  let charged = sac.getByte("HasModifiers") === 1;
  let energy = event.nbt.getInt("PrimalEnergy");

  // --- floor: learn it while the block is resting ----------------------
  // Refreshed on every resting tick rather than latched once, so a cradle never
  // carries a baseline that has stopped being true.
  if (!charged) {
    d.putInt("floorHostile", sac.getInt("Hostile"));
    d.putInt("floorDisease", sac.getInt("Disease"));
    d.putInt("floorSuccess", sac.getInt("Success"));
    d.putInt("floorLife", sac.getInt("LifeEnergy"));
    d.putBoolean("floorKnown", true);
  }

  // --- witness: bank an offering while it is still in the buffer -------
  // This runs on the ward's tick interval (1s) rather than the 5s evaluate,
  // because an offering can charge and resolve inside one evaluate window. Even
  // at 1s some will be missed; the ward's character is what it saw, not a
  // complete ledger, and that is the honest version.
  if (charged && d.getBoolean("floorKnown") && !d.getBoolean("holding")) {
    d.putBoolean("holding", true);

    let dSuccess = sac.getInt("Success") - d.getInt("floorSuccess");
    let dLife = sac.getInt("LifeEnergy") - d.getInt("floorLife");
    let dHostile = sac.getInt("Hostile") - d.getInt("floorHostile");
    let dDisease = sac.getInt("Disease") - d.getInt("floorDisease");

    d.putInt("fedSuccess", d.getInt("fedSuccess") + Math.max(0, dSuccess));
    d.putInt("fedLife", d.getInt("fedLife") + Math.max(0, dLife));
    d.putInt("fedHostile", d.getInt("fedHostile") + Math.max(0, dHostile));
    d.putInt("fedDisease", d.getInt("fedDisease") + Math.max(0, dDisease));
    d.putInt("witnessed", d.getInt("witnessed") + 1);

    // A negative Success buffer is the signature of a low-quality offering —
    // the -198 reading in the trials. The closest thing in the tag to "this one
    // is about to be refused".
    if (dSuccess < 0) d.putInt("spurned", d.getInt("spurned") + 1);
  }
  if (!charged) d.putBoolean("holding", false);

  // --- rouse: detect the first rejection via drain (F1 + F6) -----------
  let last = d.getInt("lastEnergy");
  if (d.getBoolean("seen") && energy < last && !d.getBoolean("roused")) {
    d.putBoolean("roused", true);
    d.putLong("rousedAt", event.time);
  }
  d.putInt("lastEnergy", energy);
  d.putBoolean("seen", true);

  // Strikes only once roused. Quiet before that whatever it has been fed —
  // refusal is the gate, not appetite.
  if (!d.getBoolean("roused")) return;
  if (event.time % 100 !== 0) return;
  if (d.getString("mood") === "ravenous") {
    let inside = event.entitiesInside;
    if (inside.length > 0) event.strikeLightning(inside[0]);
  }
});

// --------------------------------------------------------------- evaluate

WardEvents.evaluate((event) => {
  if (event.id !== CRADLE) return;

  let d = event.data;
  let energy = event.nbt.getInt("PrimalEnergy");

  // Square root, not linear: a single 20k grant should be visible without one
  // offering saturating a 2,000,000-point scale.
  let fuel = Math.min(1, Math.sqrt(energy / ENERGY_CAP));
  d.putFloat("fuel", fuel);

  // An unroused cradle stays small and quiet no matter how rich it is. The
  // 2,000,000 cradle sat inert through a successful spawn; this is that, made
  // into something a player can feel.
  if (!d.getBoolean("roused")) {
    event.radius = 8;
    event.entityRadius = 5;
    d.putString("mood", "dormant");
    return;
  }

  event.radius = 10 + Math.floor(fuel * 30); // 10 .. 40
  event.entityRadius = 5 + Math.floor(fuel * 11);

  // Character comes from what the ward witnessed, never from the block's
  // current buffer — which is empty most of the time.
  let success = d.getInt("fedSuccess");
  let life = d.getInt("fedLife");
  let hostile = d.getInt("fedHostile");
  let disease = d.getInt("fedDisease");
  let total = success + life + hostile + disease;

  // Anomaly is deliberately absent. It never moved off its floor in twenty-four
  // samples, so anything built on it would be invented, not observed.

  let mood = "merciful";
  if (total > 0) {
    let best = Math.max(success + life, hostile, disease);
    if (best === hostile && hostile > 0) mood = "ravenous";
    else if (best === disease && disease > 0) mood = "plagued";
    d.putFloat("purity", best / total);
  } else {
    d.putFloat("purity", 1);
  }
  d.putString("mood", mood);

  // Upkeep, from F6: drain exists only after rousing and tracks structural
  // growth rather than balance. A cradle that has outgrown its feeding cannot
  // hold its boundary.
  let witnessed = d.getInt("witnessed");
  let starving = witnessed > 0 && energy < witnessed * 1024;
  d.putBoolean("starving", starving);
  if (starving) event.radius = Math.floor(event.radius * 0.6);
});

// ----------------------------------------------------------------- entity

WardEvents.entity((event) => {
  if (event.id !== CRADLE) return;

  let d = event.data;
  let mood = d.getString("mood");

  if (mood === "dormant") {
    // Before its first refusal it only pushes, and has no opinion about anyone.
    if (event.type !== "minecraft:player") event.repel(1.0);
    event.handle();
    return;
  }

  if (event.type === "minecraft:player" && !d.getBoolean("starving")) {
    if (mood === "merciful") event.effect("minecraft:regeneration", 100, 0);
    event.handle();
    return;
  }

  event.repel(mood === "ravenous" ? 1.5 : 1.2);
  event.clearTarget();
  if (mood === "plagued") event.effect("minecraft:poison", 100, 0);
  if (mood === "ravenous" && event.distance < 5) event.hurt(4);
  event.handle();
});

// -------------------------------------------------------------- perimeter

WardEvents.perimeter((event) => {
  if (event.id !== CRADLE) return;
  if (event.existingId.includes("water") || event.existingId.includes("lava")) {
    event.skip();
    return;
  }
  // A dormant cradle builds nothing — matching the trials, where no cradle
  // threw a single vine until its first rejection.
  if (event.data.getString("mood") === "dormant") {
    event.skip();
    return;
  }
  switch (event.data.getString("mood")) {
    case "merciful":
      event.result = "biomancy:primal_flesh";
      break;
    case "ravenous":
      event.result = "biomancy:malignant_flesh";
      break;
    case "plagued":
      event.result = "biomancy:malignant_flesh";
      break;
  }
});

// ------------------------------------------------------------------ effect

WardEvents.effect((event) => {
  if (event.id !== CRADLE) return;
  if (
    event.isPlayer &&
    event.data.getString("mood") === "merciful" &&
    event.effect.startsWith("spore:")
  ) {
    event.deny();
  }
});

console.info(
  "[BIOMAGIC] cradle ward loaded — wakes on refusal, remembers what it was fed",
);
