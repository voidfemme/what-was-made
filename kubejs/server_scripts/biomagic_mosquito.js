// Bio-Magic — crimson mosquitoes are manufactured, not encountered
//
// Natural spawning is switched off in config/alexsmobs.toml (see the excerpt in
// config/). This is the other half: if you want mosquitoes, you grow them.
//
// Which is a better story than the default. Biomancy's whole premise is making
// creatures on purpose, so a world where the only crimson mosquitoes in it are
// ones somebody deliberately built in a Bio-Forge is more interesting than one
// where they just show up in the Nether uninvited.

ServerEvents.recipes((event) => {
  // A mosquito larva, read as a parts list: an egg to grow from, soft tissue
  // for the body, elastic fiber for a segmented grub, and a venom gland for
  // the part that bites you. Every ingredient is a Biomancy component that
  // does the obvious thing.
  //
  // Cheap on purpose — 20 nutrients is roughly a tenth of what Acolyte armor
  // costs — because the point isn't to gate mosquitoes behind effort. It's to
  // make them a choice instead of an ambush.
  event.custom({
    type: 'biomancy:bio_forging',
    bio_forge_tab: 'biomancy:misc',
    ingredients: [
      { item: 'biomancy:acidic_egg' },
      { item: 'biomancy:flesh_bits', count: 4 },
      { item: 'biomancy:elastic_fibers', count: 2 },
      { item: 'biomancy:toxin_gland' }
    ],
    nutrientsCost: 20,
    result: { item: 'alexsmobs:mosquito_larva', count: 2 }
  }).id('biomagic:biomancy/mosquito_larva')
})
