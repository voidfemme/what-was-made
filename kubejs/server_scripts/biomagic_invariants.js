// Bio-Magic — design invariants, enforced
//
// Rules the pack depends on that no config guarantees. Each one is enforced
// here rather than merely observed, so that adding a mod later can't quietly
// break a design decision without anything appearing in a log.

ServerEvents.recipes((event) => {
  // -------------------------------------------------------------------
  // NO INFINITE BLOOD.
  //
  // The Visceral Heap blood economy rests on there being exactly one source of
  // biomesoplenty:blood in the world — bucketing it out of a lake — and one
  // lossy one-way conversion into evilcraft:blood (superheated mixing,
  // 1000mB + 2 nether wart -> 250mB). Neither fluid forms infinite sources.
  //
  // Extra Sins ships create:mixing/compat/sons_of_sins/blood_recipe_3, which
  // turns 2 ether ashes + 3 crystal blood + 1000mB MILK into 1000mB
  // sons_of_sins:blood. Milk is renewable, so that's a blood printer.
  //
  // It is currently inert only because warriorsofpastepoch:crystal_blood isn't
  // installed. That's luck, not design. Removing it here is a harmless no-op
  // while the dependency is missing and takes effect the moment it isn't.
  //
  // Still worth keeping even after cutting Extra Sins: if it or a similar mod
  // is ever re-added, the invariant holds without anyone remembering why.
  // -------------------------------------------------------------------
  event.remove({ id: 'create:mixing/compat/sons_of_sins/blood_recipe_3' })
  event.remove({ id: 'create:mixing/compat/sons_of_sins/blood_recipe_2' })
  event.remove({ id: 'create:mixing/compat/sons_of_sins/blood_recipe_1' })

  // Belt and braces: anything anywhere that produces biomesoplenty:blood as a
  // fluid result. There is deliberately no such recipe in the pack, and this
  // catches one arriving from a mod update without a log line.
  //
  // Commented out rather than active, because a broad output filter on a fluid
  // is the kind of thing that silently removes something you wanted. Uncomment
  // if you'd rather have the guarantee than the flexibility.
  //
  // event.remove({ output: 'biomesoplenty:blood' })
})
