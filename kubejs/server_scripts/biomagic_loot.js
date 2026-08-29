// Bio-Magic — loot routing
//
// Verified against LootJS 2.13.1 (com.almostreliable.lootjs.kube). The event
// exposes addLootTableModifier / addEntityLootModifier / addBlockLootModifier;
// the builder exposes addLoot / addWeightedLoot / removeLoot / replaceLoot plus
// randomChance / matchEntity / killedByPlayer / looting conditions.
//
// Note on loot table names: Spore's chests are typed, not structure-named.
// The only chest tables in the jar are:
//     spore:chests/document_chest
//     spore:chests/equipment_chest
//     spore:chests/food_chest
//     spore:chests/ice_chest
//     spore:chests/organ_chest
// Spore Inquisition adds spore:loot_tables/archaelogy/{church,labmap,mines}.
//
// Two jobs here:
//   1. Seed each magic tree's starter reagent into Spore's own chests, so a trip
//      into infected territory is what opens the trees rather than the reverse.
//   2. Keep the scarce Spore materials scarce on the mob-drop side, so the six
//      conversion routes in biomagic_capstone.js are worth building.

LootJS.modifiers((event) => {
  // -------------------------------------------------------------------
  // 1. Infected structures seed the trees.
  //
  // Deliberately written as one modifier per tree rather than one weighted
  // pool: it reads clearly, each tree's rate is tuned independently, and it
  // uses only methods confirmed present in this LootJS build. If you'd rather
  // have a single roll that picks one tree, addWeightedLoot([1,2], [...]) with
  // Item.of(id, n).withChance(w) entries does that in one call.
  // -------------------------------------------------------------------
  const infectedChests = [
    'spore:chests/equipment_chest',
    'spore:chests/document_chest',
    'spore:chests/organ_chest'
  ]

  const seeds = [
    ['botania:mana_powder', 4, 0.30],
    ['malum:crushed_soulstone', 3, 0.30],
    ['occultism:otherworld_ashes', 2, 0.30],
    ['evilcraft:dark_gem', 1, 0.22],
    ['hexcasting:amethyst_dust', 6, 0.30],
    ['biomancy:living_flesh', 1, 0.18]
  ]

  infectedChests.forEach((table) => {
    seeds.forEach(([id, count, chance]) => {
      event
        .addLootTableModifier(table)
        .randomChance(chance)
        .addLoot(Item.of(id, count))
    })
  })

  // -------------------------------------------------------------------
  // 2. Tighten the material ladder.
  //
  // Spore's config already tiers drops (basic -> evolved -> hyper -> organoid
  // -> calamity). What it does not do is stop a player farming basic infected
  // forever. Requiring a player kill means a Mob Grinding Utils farm can't
  // shortcut the ladder, which matters because that mod is in this pack.
  // -------------------------------------------------------------------
  event
    .addEntityLootModifier('spore:inf_human', 'spore:inf_villager', 'spore:inf_husk')
    .killedByPlayer()
    .randomChance(0.08)
    .addLoot('spore:claw_fragment')

  // Organoid membrane should stay an organoid drop. If something else in the
  // pack starts handing it out, strip it here rather than editing that mod.
  event
    .addEntityLootModifier('spore:inf_human', 'spore:inf_villager')
    .removeLoot('spore:organoid_membrane')

  // -------------------------------------------------------------------
  // 3. Calamities are the only unconditional source of everything.
  //
  // This is what keeps the infection as the shared final exam regardless of
  // tree: the conversion recipes accelerate the climb, but a calamity kill is
  // still the fastest route to a full set, and calamities are gated behind the
  // Womb's biomass economy in spore-server.toml.
  // -------------------------------------------------------------------
  event
    .addEntityLootModifier(
      'spore:sieger',
      'spore:howitzer',
      'spore:stahl',
      'spore:hindenburg',
      'spore:verfall',
      'spore:leviathan',
      'spore:gazenbreacher',
      'spore:hohlfresser'
    )
    .killedByPlayer()
    .addLoot(
      Item.of('spore:armor_fragment', 6),
      Item.of('spore:organoid_membrane', 3),
      Item.of('spore:tumor', 4)
    )
})
