// kubejs/server_scripts/wards.js
//
// Everything here fires at a decision point, never per block or per tick.
// evaluate: ~every 5s per ward.  tick: on the ward's tick_interval.
// entity:   per entity inside, on tick_interval.  perimeter: per sampled position.

const SPIRIT_ABILITIES = {
  wicked: "lightning",
  earthen: "thickBorder",
  sacred: "healPlayers",
  aerial: "fastRepel",
};

WardEvents.evaluate((event) => {
  if (!event.id.startsWith("malum:")) return;

  // Malum's own rite ritual is the activation gesture — no custom interaction
  // needed. A base that isn't running a rite projects nothing.
  if (event.nbt.getString("state") !== "active") {
    event.disable();
    return;
  }

  // 'height' is a pole COUNT, not a position. Poles are base.above(1..height).
  let poles = event.nbt.getInt("height");
  let soulwood = event.id === "malum:soulwood_totem_base";

  event.radius = (soulwood ? 24 : 14) + poles * 2;
  event.entityRadius = (soulwood ? 10 : 6) + poles;

  // Reset per-evaluation so removing a pole actually removes its ability.
  event.data.putBoolean("lightning", false);
  event.data.putBoolean("healPlayers", false);

  for (let m of event.modules) {
    let spirit = m.nbt.getString("type");
    let ability = SPIRIT_ABILITIES[spirit];
    if (ability === "lightning") event.data.putBoolean("lightning", true);
    if (ability === "healPlayers") event.data.putBoolean("healPlayers", true);
    if (ability === "thickBorder") event.data.putInt("borderTier", 2);
    if (ability === "fastRepel") event.data.putDouble("repelSpeed", 1.6);
  }
});

WardEvents.tick((event) => {
  if (!event.data.getBoolean("lightning")) return;
  if (event.time % 200 !== 0) return;

  let targets = event.entitiesInside;
  if (targets.length === 0) return;
  event.strikeLightning(targets[0]);
});

WardEvents.entity((event) => {
  if (!event.type.startsWith("spore:")) return;

  event.repel(
    event.data.contains("repelSpeed")
      ? event.data.getDouble("repelSpeed")
      : 1.2,
  );
  event.clearTarget();

  // Escalate on anything that pushes in close anyway.
  if (event.distance < 4) event.hurt(3);

  event.handle(); // handled here; skip the JSON effect list for this entity
});

WardEvents.perimeter((event) => {
  // Leave water and lava alone so borders don't drain lakes.
  if (event.existingId.includes("water") || event.existingId.includes("lava")) {
    event.skip();
    return;
  }
  // Denser border where an earthen spirit is present.
  if (event.data.getInt("borderTier") >= 2 && event.target.y > 60) {
    event.result = "malum:soulstone";
  }
});

WardEvents.effect((event) => {
  // Players inside a ward shrug off the infection's signature effects.
  if (event.isPlayer && event.effect.startsWith("spore:")) event.deny();
});
