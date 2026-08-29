// Bio-Magic — shims for other mods' broken recipes
//
// Things that are bugs in someone else's mod, patched here rather than waiting
// for an upstream fix. Each entry names what's wrong so it can be deleted when
// the mod is updated.

ServerEvents.recipes((event) => {
  // -------------------------------------------------------------------
  // SPORE — halogen lights, both recipes.
  //
  // Spore 2.2.0j ships these with 1.21's result format:
  //     "result": { "id": "spore:halogen_light" }
  // On 1.20.1 the key is "item", not "id", so both fail to parse with
  // "Missing item, expected to find a string" and the block is uncraftable.
  // Verified in the jar at data/spore/recipes/halogen_light.json and
  // broken_halogen_light.json.
  //
  // Ingredients below are copied exactly from Spore's own files, so this is
  // a format fix and not a rebalance.
  //
  // DELETE THIS BLOCK when Spore fixes it upstream — otherwise you'll have
  // two identical recipes and a duplicate-id warning.
  // -------------------------------------------------------------------
  event.shaped('spore:halogen_light', [
    'XRX',
    'TRT',
    'XRX'
  ], {
    R: '#forge:glass_panes/colorless',
    T: 'minecraft:redstone',
    X: 'minecraft:iron_nugget'
  }).id('biomagic:fix/halogen_light')

  // Repairs a Shattered Halogen Light back into a working one.
  event.shapeless('spore:halogen_light', [
    'spore:broken_halogen_light',
    '#forge:glass_panes/colorless'
  ]).id('biomagic:fix/halogen_light_from_broken')
})
