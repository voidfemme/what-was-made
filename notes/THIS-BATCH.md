# Batch — playtest 3

Four changes. Two are new files, one is a rewrite, one is a mod removal you do
by hand.

## By hand first

    cd ~/minecraft/modpacks/Bio-Magic
    packwiz remove extra-sins
    packwiz refresh

**Why.** Extra Sins ships 43 Biomancy decomposing recipes and 42 of them output
ether ashes. Two are outright broken economically:

- `spider_heart` -> 3-9 ashes for 1 nutrient. Spider spawner, slicer,
  decomposer, and you have industrial ether ash.
- `urn` -> 1-2 ashes for 6 nutrients. An urn costs 1 ash to make. Expected
  return 1.5. That's a **loop**, not a conversion.

Ether ashes being drop-only is what made Sons of Sins a combat tree — you get
them by killing things with an osseous weapon. This let Biomancy farm them, and
Bio-Factory automates Biomancy's nutrient supply. Same failure as the armor
fragment recipe that output 3 for 2 inputs, except shipped by a mod and liable
to come back on any update without a log line.

**What you lose, deliberately:**
- ~20 extra entries in `#sons_of_sins:is_slicer` (your own three remain)
- Create blood filling and emptying, bottle and bucket, both directions. This
  is the one part of the mod that helped your blood economy. You never designed
  it, but you're giving it up on purpose rather than finding it gone later.
- The weapon roster.

It's a leaf — nothing depends on it.

## New: `biomagic_invariants.js`

Enforces no-infinite-blood rather than relying on luck. Extra Sins'
`blood_recipe_3` turns ether ashes + **milk** into 1000mB of blood; milk is
renewable, so it's a blood printer. It was inert only because
`warriorsofpastepoch:crystal_blood` isn't installed.

Removing it is a no-op today and a guard forever — including after Extra Sins
is cut, in case it or something like it is ever re-added. `_1` and `_2` are
removed too; they don't exist in 1.0.4 but may in other versions.

There's a commented-out broad filter on anything producing
`biomesoplenty:blood`. Left off because a wide output filter on a fluid can
silently remove something you wanted. Uncomment if you'd rather have the
guarantee than the flexibility.

## New: `biomagic_fixes.js`

Spore 2.2.0j ships both halogen light recipes with 1.21's result format
(`"result": {"id": ...}`) on 1.20.1, where the key is `"item"`. Both fail to
parse and the block is uncraftable. Two of your five failed recipes are this.

Ingredients copied exactly from Spore's own files — a format fix, not a
rebalance. Shaped: iron nuggets and glass panes around redstone. Shapeless:
a Shattered Halogen Light plus a glass pane repairs it.

**Delete this block when Spore fixes it upstream**, or you'll have duplicate
recipes.

Relevant now because you're about to care a great deal about light sources in
the Visceral Heap.

## Rewritten: `infectable_soil.json`

Was: grass, dirt, coarse dirt, rooted dirt, podzol, dirt path, farmland, mud,
clay, moss. Now: **farmland, dirt path, coarse dirt only.**

**Why.** Grass being infectable meant a mound in a forest converted all the
ground and left the trees standing in rooted mycelium — "forests are safe" was
only cosmetically true.

The deeper reason is rule surface area. Worked-versus-wild currently exists in
exactly one material (wood) and is only visible where planks and logs sit side
by side, which is only in cities. Splitting soil the same way puts the same
distinction in a second material and a second context, which is what lets a
player infer the principle rather than memorising two separate facts. That
matters for a pack meant to teach without a guidebook.

Cutting soil entirely was the other option and it's cleaner still, but it drops
back to one axis and loses the creep outward from a city's edge.

Note the shape this settles on: **wood split, soil split, masonry uniform.**
All 72 masonry entries are manufactured, so it has no wild counterpart by
nature.

## Not in this batch

**The bloomlight replacement mod.** Scoped as a generic
`biomagic:replace_blocks` feature — codec of two fields, from and to, placed at
a late decoration step and scoped to `visceral_heap` by the existing biome
modifier. ~40 lines, reusable, touches no BOP code, sidesteps the licensing
question. Being built separately.

**Replacing Extra Sins' `is_slicer` entries.** You keep your three; the ~20 it
supplied are gone. Worth adding back the ones you actually want by hand.

## Test order

1. **Visceral Heap: are the malignant flesh blobs and wall veins there?** They
   were confirmed in a world that has since been deleted, never in the current
   one. If absent, biome modifiers aren't applying in this world at all — which
   would be a single root cause for both the flesh livestock and the Alex's
   Mobs absence, since `add_features` and `add_spawns` terminate at the same
   builder. **Do this before anything else.**

2. **Oak log, with a control:**

        /setblock ~3 ~ ~ minecraft:oak_log
        /setblock ~4 ~ ~ minecraft:stone_bricks
        /summon spore:mound ~3 ~1 ~

   Flat ground away from any city. Five minutes without leaving — range 5,
   cooldown 45s. Stone bricks are the in-frame positive control: if they
   convert and the log doesn't, the identity-map theory holds and the 40 log
   entries stay. If the log becomes `spore:rotten_log`, FoliageSpread wins and
   they can go.

3. Halogen light craftable in JEI.

4. Farmland converts near a mound; grass no longer does.

## Added after the fact: acid instead of blood in the Visceral Heap

`kubejs/data/biomesoplenty/worldgen/configured_feature/blood_lake.json`
`kubejs/data/biomesoplenty/worldgen/configured_feature/blood_spring.json`

Both are byte-for-byte BOP's originals with one field changed:
`biomesoplenty:blood` -> `biomancy:acid_fluid_block` (Gastric Acid). Verified
programmatically that nothing else differs. Barrier stays
`biomesoplenty:flesh`, spring `valid_blocks` unchanged, both placed features
untouched (lake count 5, spring count 12).

`AcidFluid$Source` and `$Flowing` confirm it's a proper FlowingFluid, so the
`level` and `falling` properties carry over unchanged.

**This deliberately does NOT belong in the compat mod.** Adding Biomancy flesh
alongside BOP flesh is compat; removing a BOP fluid from a BOP biome is a
pack-level opinion. A stranger installing a BOP x Biomancy bridge would not
expect their blood lakes to disappear.

### Two consequences, both intended

**The Heap becomes hazardous.** Biomancy acid has its own death messages
("succumbed to severe acid burns") and its own `acid_destructible` block tag,
so it dissolves things. BOP blood was decoration; this is terrain that fights
back. Worth confirming in-world what standing in it actually does, because
"the Visceral Heap has lakes that hurt you" is a different biome to design
around than "the Visceral Heap has lakes."

**The blood chain loses its source.** `biomagic_visceral_heap.js` converts
1000mB BOP blood + 2 nether wart into 250mB evilcraft:blood via superheated
mixing. The Heap was the only source of BOP blood in the world. With the lakes
gone, that recipe still exists and is now unreachable — "descend into hell,
find a lake of blood, power your blood magic" is no longer a route.

Left in place rather than removed, since it costs nothing dormant and BOP blood
could be reintroduced elsewhere. EvilCraft has its own blood sources, so the
tree isn't blocked.

Also gone: blood + lava -> flesh, which was BOP blood's only mechanical
behaviour.
