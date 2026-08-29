// Bio-Magic — Visceral Heap economy
//
// The Visceral Heap (biomesoplenty:visceral_heap) is a Nether biome made of
// flesh, with lakes of biomesoplenty:blood. Vanilla BOP gives both of those
// almost no mechanical purpose — flesh is decoration, and blood exists only to
// turn other liquids into flesh. This script makes the biome a quarry.
//
// Two chains:
//   FLESH  -> Create crushing/compacting -> Biomancy flesh, feeding Bio-Factory's
//             existing compacting ladder (bits -> flesh -> packed, malignant ->
//             primal).
//   BLOOD  -> Create mixing -> evilcraft:blood, at a deliberately punishing rate.
//
// Schemas verified against the jars: create:crushing and create:compacting take
// "ingredients"/"results" with optional "chance" and "heatRequirement"
// ("heated" / "superheated"), confirmed against create's brass_ingot.json and
// Bio-Factory's own compacting recipes.

ServerEvents.recipes((event) => {
  // ---------------------------------------------------------------------
  // THE QUARRY — raw teardown.
  //
  // Crushing is the volume route. A Crushing Wheel pair is cheap, so this is
  // the thing you set up first: haul BOP flesh back, feed it in, get Biomancy
  // flesh bits. From there Bio-Factory's own recipe (4 bits -> biomancy:flesh)
  // closes the loop without anything further from us.
  // ---------------------------------------------------------------------
  event.custom({
    type: 'create:crushing',
    ingredients: [{ item: 'biomesoplenty:flesh' }],
    processingTime: 250,
    results: [
      { item: 'biomancy:flesh_bits', count: 2 },
      { item: 'biomancy:flesh_bits', chance: 0.5 }
    ]
  }).id('biomagic:create/flesh_bits_from_bop_flesh')

  // Porous flesh is the rarer patch block, so it gives the more useful output.
  event.custom({
    type: 'create:crushing',
    ingredients: [{ item: 'biomesoplenty:porous_flesh' }],
    processingTime: 250,
    results: [
      { item: 'biomancy:flesh_bits', count: 2 },
      { item: 'biomancy:organic_matter', chance: 0.65 },
      { item: 'biomancy:elastic_fibers', chance: 0.25 }
    ]
  }).id('biomagic:create/organic_matter_from_porous_flesh')

  // ---------------------------------------------------------------------
  // THE QUARRY — direct block route.
  //
  // Skips the bits entirely and lands you at malignant flesh, which Bio-Factory
  // already compacts into primal flesh. This is the shortcut for someone who
  // has committed to the Nether trip: heated compacting is a bigger setup than
  // crushing wheels, and it wants a Biomancy binder, but it converts blocks to
  // blocks at 4:1 instead of 8:1 through the bits chain.
  //
  // Deliberately mirrors the shape of Bio-Factory's own
  // malignant_flesh_block_from_veins recipe so it reads as part of that set.
  // ---------------------------------------------------------------------
  event.custom({
    type: 'create:compacting',
    heatRequirement: 'heated',
    ingredients: [
      { item: 'biomesoplenty:flesh' },
      { item: 'biomesoplenty:flesh' },
      { item: 'biomesoplenty:flesh' },
      { item: 'biomesoplenty:flesh' },
      { item: 'biomancy:flesh_bits' },
      { item: 'biomancy:tough_fibers' }
    ],
    results: [{ item: 'biomancy:malignant_flesh' }]
  }).id('biomagic:create/malignant_flesh_from_bop_flesh')

  // ---------------------------------------------------------------------
  // BLOOD — one-way, lossy, and it wants a supply line.
  //
  // Design constraints, stated:
  //   - two separate fluids, never unified
  //   - one-way only (BOP -> EvilCraft, never back)
  //   - no infinite source
  //   - expensive and tedious enough that hauling from the Nether is an
  //     alternative to a Sanguinary Pedestal farm, not a replacement
  //
  // The 4:1 loss plus superheat plus a nether wart cost does that. Nether wart
  // is the catalyst because it's the only living thing native to the Nether,
  // and because it's tree-neutral — this route shouldn't require Biomancy or
  // Malum to walk.
  //
  // NO INFINITE SOURCE: neither fluid forms infinite sources, and there is
  // deliberately no recipe anywhere in this pack that PRODUCES
  // biomesoplenty:blood. The only source in the world is bucketing it out of a
  // Visceral Heap lake, one bucket at a time. Adding any blood-producing
  // recipe later would break that, so it's worth a comment here.
  //
  // Create handles bucket emptying generically, so no create:emptying recipe
  // is needed for biomesoplenty:blood_bucket — an Item Drain or a Basin will
  // take it as-is.
  // ---------------------------------------------------------------------
  event.custom({
    type: 'create:mixing',
    heatRequirement: 'superheated',
    ingredients: [
      { fluid: 'biomesoplenty:blood', amount: 1000, nbt: {} },
      { item: 'minecraft:nether_wart' },
      { item: 'minecraft:nether_wart' }
    ],
    results: [{ fluid: 'evilcraft:blood', amount: 250 }]
  }).id('biomagic:create/evilcraft_blood_from_bop_blood')
})
