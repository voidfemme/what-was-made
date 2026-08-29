// Bio-Magic — unified capstone routing
//
// The capstone is Spore's Living MK2 set (spore:inf_up_helmet / _chest / _pants /
// _boots), reached through Spore's own grafting chain:
//     plated_* + integrating_agent + living_*  ->  inf_*
//     inf_*    + reforged_biomass_a + r_elytron -> inf_up_*
//
// Every rung of that chain is built from armor_fragment, mutated_fiber, nerves,
// mutated_heart and organoid_membrane — all of which only drop from infected.
// So the infection is already the shared spine; nothing here changes that.
//
// What these recipes add is SIX WAYS TO CLIMB IT. Each magic tree can convert
// cheap, common infected drops into the scarce ones, using its own endgame
// resource as the reagent. You still have to fight the infection to get input
// material. Your tree only decides how efficiently you convert it.
//
// Conversion targets, cheapest to scarcest:
//     spore:claw_fragment      - basic infected, weight 10
//     spore:mutated_fiber      - basic infected, weight 30
//     spore:armor_fragment     - evolved and up only, weight 45
//     spore:organoid_membrane  - organoids only, weight 40
//
// Tune the ratios below if a tree feels too cheap. The number to move is the
// input count, not the output.
//
// BIO-FACTORY NOTE: every biomancy:bio_forging recipe here carries a
// nutrientsCost, drawn from the Bio-Forge's nutrient reserve. With Bio-Factory
// installed, that reserve is fillable from biofactory:nutrients_fluid, which
// means the Biomancy route is the one that automates. That's correct — it
// should be the tree that speaks Spore's language most fluently. No recipe
// change is needed for this; it happens because Bio-Factory is present.
//
// SONS OF SINS: this pack now has a seventh tree (necromancy by organ
// harvesting), and it wants a conversion route here like the others. Not
// written yet — the Sons of Sins jar hasn't been read, so its item IDs, its
// ritual/urn recipe types, and whether Ether ash is craftable or drop-only are
// all unknown. Guessing at them would produce recipes that silently fail to
// load. Left as a gap on purpose.

ServerEvents.recipes((event) => {
  // ---------------------------------------------------------------------
  // BOTANIA — mana infusion over an Alchemy Catalyst.
  // Cost is mana, which is renewable, so the input count is the real gate.
  // ---------------------------------------------------------------------
  event.custom({
    type: 'botania:mana_infusion',
    catalyst: { type: 'block', block: 'botania:alchemy_catalyst' },
    input: { item: 'spore:claw_fragment' },
    mana: 30000,
    output: { item: 'spore:armor_fragment' }
  }).id('biomagic:botania/armor_fragment')

  event.custom({
    type: 'botania:mana_infusion',
    catalyst: { type: 'block', block: 'botania:conjuration_catalyst' },
    input: { item: 'spore:mutated_fiber' },
    mana: 45000,
    output: { item: 'spore:organoid_membrane' }
  }).id('biomagic:botania/organoid_membrane')

  // ---------------------------------------------------------------------
  // MALUM — spirit infusion. Wicked and eldritch spirits are the thematic
  // fit; both come from killing things, which keeps this pointed at combat.
  // ---------------------------------------------------------------------
  event.custom({
    type: 'malum:spirit_infusion',
    input: { item: 'spore:claw_fragment', count: 4 },
    extra_items: [
      { item: 'malum:processed_soulstone', count: 2 }
    ],
    spirits: [
      { type: 'wicked', count: 8 },
      { type: 'eldritch', count: 4 }
    ],
    output: { item: 'spore:armor_fragment' }
  }).id('biomagic:malum/armor_fragment')

  event.custom({
    type: 'malum:spirit_infusion',
    input: { item: 'spore:mutated_fiber', count: 6 },
    extra_items: [
      { item: 'malum:hallowed_gold_ingot', count: 1 }
    ],
    spirits: [
      { type: 'eldritch', count: 8 },
      { type: 'earthen', count: 4 }
    ],
    output: { item: 'spore:organoid_membrane' }
  }).id('biomagic:malum/organoid_membrane')

  // ---------------------------------------------------------------------
  // OCCULTISM — spirit fire. Cheap per operation, but spirit fire is slow and
  // single-item, so throughput is the cost here rather than materials.
  // ---------------------------------------------------------------------
  event.custom({
    type: 'occultism:spirit_fire',
    ingredient: { item: 'spore:claw_fragment' },
    result: { item: 'spore:armor_fragment' }
  }).id('biomagic:occultism/armor_fragment')

  event.custom({
    type: 'occultism:spirit_trade',
    ingredients: [
      { item: 'spore:mutated_fiber' },
      { item: 'occultism:otherstone' }
    ],
    result: { item: 'spore:organoid_membrane' }
  }).id('biomagic:occultism/organoid_membrane')

  // ---------------------------------------------------------------------
  // EVILCRAFT — blood infuser. Tier 1 so it is reachable early; raise `tier`
  // to 2 or 3 if this ends up being the path everyone takes.
  // ---------------------------------------------------------------------
  event.custom({
    type: 'evilcraft:blood_infuser',
    item: 'spore:claw_fragment',
    fluid: { fluid: 'evilcraft:blood', amount: 4000 },
    result: { item: 'spore:armor_fragment' },
    duration: 400,
    xp: 1.0,
    tier: 1
  }).id('biomagic:evilcraft/armor_fragment')

  event.custom({
    type: 'evilcraft:blood_infuser',
    item: 'spore:mutated_fiber',
    fluid: { fluid: 'evilcraft:blood', amount: 12000 },
    result: { item: 'spore:organoid_membrane' },
    duration: 800,
    xp: 2.0,
    tier: 2
  }).id('biomagic:evilcraft/organoid_membrane')

  // ---------------------------------------------------------------------
  // HEX CASTING — Hex has no processing machine, so the gate is its scarcest
  // material rather than a machine tier. Charged amethyst is mid-game;
  // quenched allay shards are genuinely late and cost an Allay to make.
  // ---------------------------------------------------------------------
  event.shapeless('spore:armor_fragment', [
    'spore:claw_fragment',
    'hexcasting:charged_amethyst',
    'hexcasting:charged_amethyst'
  ]).id('biomagic:hexcasting/armor_fragment')

  event.shapeless('2x spore:organoid_membrane', [
    'spore:mutated_fiber',
    'spore:mutated_fiber',
    'hexcasting:quenched_allay_shard'
  ]).id('biomagic:hexcasting/organoid_membrane')

  // ---------------------------------------------------------------------
  // BIOMANCY — bio-forging. Thematically the closest tree to Spore, so this
  // is deliberately the most material-efficient route and the most expensive
  // in nutrients. Biomancy players should feel like they speak the language.
  // ---------------------------------------------------------------------
  // REBALANCED. This was 2 claw fragments in -> 3 armor fragments out, which
  // made it a net multiplier on the scarcest early material rather than a
  // conversion, and undercut the other five routes entirely. Biomancy should
  // be the most EFFICIENT route, not a printing press. Now 1:1 on the input
  // with a real nutrient cost, which Bio-Factory can automate — that
  // automation is Biomancy's actual advantage, not the ratio.
  event.custom({
    type: 'biomancy:bio_forging',
    bio_forge_tab: 'biomancy:components',
    ingredients: [
      { item: 'spore:claw_fragment', count: 2 },
      { item: 'biomancy:bone_fragments', count: 8 },
      { item: 'biomancy:tough_fibers', count: 8 }
    ],
    nutrientsCost: 100,
    result: { item: 'spore:armor_fragment' }
  }).id('biomagic:biomancy/armor_fragment')

  event.custom({
    type: 'biomancy:bio_forging',
    bio_forge_tab: 'biomancy:components',
    ingredients: [
      { item: 'spore:mutated_fiber', count: 4 },
      { item: 'biomancy:living_flesh', count: 1 },
      { item: 'biomancy:elastic_fibers', count: 12 }
    ],
    nutrientsCost: 120,
    result: { item: 'spore:organoid_membrane', count: 2 }
  }).id('biomagic:biomancy/organoid_membrane')

  // ---------------------------------------------------------------------
  // CREATE — not a magic tree, but it is the pack's industrial spine, so it
  // gets a throughput route rather than a conversion route: bulk, slow, and
  // no upgrade in scarcity tier. Create players grind volume, not rarity.
  //
  // spore:biomass is the input here, and it is a mob drop. If that turns out
  // to be the bottleneck, the Visceral Heap chain in biomagic_visceral_heap.js
  // is the other Create feedstock in the pack — that one runs on quarried BOP
  // flesh instead of kills, so the two together give Create players a route
  // that doesn't depend on combat at all.
  // ---------------------------------------------------------------------
  event.custom({
    type: 'create:mixing',
    ingredients: [
      { item: 'spore:biomass' },
      { item: 'spore:biomass' },
      { item: 'spore:claw_fragment' }
    ],
    results: [{ item: 'spore:mutated_fiber', count: 2 }],
    heatRequirement: 'heated'
  }).id('biomagic:create/mutated_fiber')
})
