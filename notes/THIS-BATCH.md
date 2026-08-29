# Batch notes — through 29 Aug 2026

Running record of what changed and why, and what testing actually showed. Where
an earlier conclusion turned out wrong, the correction is here rather than a
quiet edit — the wrong version is usually informative about why it was
believable.

---

# THE BIG ONE: Spore runs three conversion systems, not one

This reframes almost everything below it, and it was only found on 29 Aug.

`FoliageSpread.SpreadFoliageAndConvert` calls four converters per block:

| converter         | source                                 | roll | reachable from data?                  |
| ----------------- | -------------------------------------- | ---- | ------------------------------------- |
| `convertBlocks`   | `sporedata.toml` `["Block infection"]` | 10%  | **yes** — plain TOML list             |
| `convertWood`     | hardcoded vanilla `BlockTags`          | 20%  | **no** — needs a mixin                |
| `convertFromJson` | `spore_block_conversion` map           | 10%  | **yes** — datapack                    |
| `place*Foliage`   | —                                      | —    | additive decoration, destroys nothing |

`convertBlocks` requires a solid block with an exposed face; `convertFromJson`
has no face requirement. Blocks present in more than one source are **raced**,
each rolling independently, which is why some blocks appeared to convert
inconsistently.

**All three are gated behind `mound_foliage`** — the config key whose comment
reads "Should the mound spread foliage and infect blocks?" It means both.
Setting it false stops everything, not just wood. Tested and confirmed.

## Corrections to the 28 Aug pad test

The original table attributed two rows wrongly, because `sporedata.toml` hadn't
been examined yet and was still at defaults.

| block        | became                | previously said                      | **actually**               |
| ------------ | --------------------- | ------------------------------------ | -------------------------- |
| stone bricks | Infested Stone Bricks | "Spore's per-block infested variant" | `sporedata.toml` list      |
| grass        | `minecraft:mycelium`  | "vanilla mycelium spread"            | `sporedata.toml` list      |
| dirt path    | `rooted_mycelium`     | the map                              | the map — correct          |
| coarse dirt  | `rooted_mycelium`     | the map                              | raced between map and list |
| farmland     | `rooted_mycelium`     | the map                              | the map — correct          |
| oak log      | `spore:rotten_log`    | FoliageSpread                        | FoliageSpread — correct    |
| oak planks   | `spore:rotten_planks` | FoliageSpread                        | FoliageSpread — correct    |

The grass one matters: vanilla mycelium spread needs an adjacent mycelium
block, so that explanation never held up. The list was a better answer all
along.

Also wrong at the time: the claim that "natural stone, deepslate and ore are
protected." They weren't. `sporedata.toml` was converting stone, deepslate,
sand, gravel, dirt, coarse dirt, podzol, rooted dirt, clay, cobblestone,
cobbled deepslate, stone bricks, bricks and grass — from a config nobody had
touched.

---

# `sporedata.toml` — the third surface, now ours

Cut from 32 entries to 15. Removed sixteen wild-ground entries: stone, grass,
dirt, coarse dirt, podzol, rooted dirt, deepslate, sand, red sand, gravel,
netherrack, end stone, soul sand, soul soil, clay, sculk.

Kept: worked stone (stone bricks, bricks, cobblestone, cobbled deepslate),
Spore's four lab blocks, and seven inert `the_flesh_that_hates` entries that
cost nothing.

`minecraft:sculk` was cut deliberately and is now load-bearing — see the sculk
note at the bottom.

## Verified on a controlled pad, 29 Aug

**Converted:** cobblestone, cobbled deepslate, stone bricks, smooth stone,
bricks, farmland, dirt path, coarse dirt, oak logs, oak planks.

**Survived:** stone, deepslate, gravel, grass, dirt, podzol, sand, clay,
terracotta.

So **worked-versus-wild now holds in two materials** — masonry and ground —
which is what makes the rule inferable rather than a list of cases to memorise.
The soil split finally does the job it was added for; previously it was
invisible because the list converted everything anyway.

**The only remaining hole is wood**, and it needs the mixin. That is now the
sole justification for a companion mod.

Test pad and teardown live in `kubejs/data/biomagic/functions/` so this is
repeatable and version-controlled rather than retyped.

---

# Failed experiment: identity-mapped logs

Removed 40 identity-mapped log/wood/stem/hyphae entries from
`default_conversions.json`, taking it from 72 entries to 32.

The theory was that Spore's own map uses identity entries (`"spore:remains":
"spore:remains"`) to mark blocks as already-handled, so a block appearing as a
key might be claimed before `convertWood` sees it.

It doesn't. Oak logs still become `spore:rotten_log`. Theory disproved.

---

# `infectable_masonry` corrections

Two mistakes found by playing rather than by reading.

**`minecraft:stone` was in the tag.** Written while thinking "worked stone" and
including the raw block. Removed — it's wild ground and its presence broke the
rule in the most visible possible way.

**Terracotta and the warm colours removed.** Badlands generates plain, white,
brown, red, orange and yellow terracotta in enormous quantity, so the infection
would have been eating a natural biome. Coloured terracotta that doesn't
generate naturally stays.

**Cobblestone:** removed, then added back as a plain entry rather than
`#minecraft:cobblestone`, because that block tag also contains **blackstone**,
which generates in basalt deltas and bastions. Mossy cobblestone kept
separately — it only generates as part of dungeons and jungle temples, which is
ruin rather than terrain.

---

# Visceral Heap

## Weighted lakes

`blood_lake.json` uses `minecraft:weighted_state_provider`, 7:3 blood to acid.
The provider is sampled once per lake, so each lake is entirely one or the
other — no mixed pools.

Springs stay pure acid: `spring_feature` takes a bare `state`, not a
`BlockStateProvider`, so it can't be weighted.

Both lake types reading as one system is the point — something producing blood
_and_ digestive acid is more legibly alive than something producing one. It
also keeps the BOP-blood-to-EvilCraft-blood conversion supplied, so "descend
into hell, find a lake of blood" survives as a route.

Biomancy acid has its own death messages and its own `acid_destructible` tag,
so the Heap is now partly hazardous. Worth watching whether it kills the flesh
livestock, since that would read as "spawns are broken" when they're actually
spawning and dissolving.

## The buried Cradle

Three files: `configured_feature/buried_cradle.json`,
`placed_feature/buried_cradle.json`, and a third entry in
`visceral_heap_biomancy_flesh.json`.

A single `biomancy:primordial_cradle` replacing one `#biomesoplenty:flesh`
block. `discard_chance_on_air_exposure: 1.0` means the placement is discarded if
_any_ face touches air — not "usually buried", always buried. Height range 12
above bottom to 24 below top, clear of the floor and ceiling where air pockets
live. `rarity_filter` 60, and the air check discards on top of that, so the
effective rate is well under one per sixty chunks.

**Why it's an easter egg and not a handout.** `PrimordialCradleBlockEntity`
tracks a `SacrificeHandler` and `primalEnergy`, and both start **empty**. What
you find is a functional machine with nothing in it.

It connects to something real: Cradles spawn Flesh Blobs, Flesh Blobs are the
only source of `biomancy:living_flesh`, and living flesh has **no crafting
recipe** and gates every Biomancy machine and armour piece.

**Found later, worth acting on:** the Cradle carries a third NBT key,
`PROC_GEN_VALUES_KEY`, holding `MoundShape$ProcGenValues`. There's a whole
`world/mound/` package — `MoundGenerator`, `Chamber`, `ChamberFactory`,
decorators for hanging combs and pillars. **Each Cradle carries the seed for a
procedurally generated flesh mound.** Worth finding what triggers that: "dig out
the buried Cradle and something starts building itself" beats "found a machine."

Biomancy also exposes `CanCradleSpawnMobEventKJS` and `OnCradleSpawnMobEventKJS`
via its KubeJS plugin, so buried Cradles could eventually spawn something a
crafted one wouldn't.

---

# LootJS — fully verified 28 Aug

All three mechanisms confirmed.

- **Chest seeding:** 7 of 10 `/loot give` rolls carried reagents, all six
  appeared across the sample, counts matched the script.
- **Calamity drops:** a sieger kill gave 3 organoid membrane — exactly the
  script's amount — and 26 armour fragments, being the script's 6 plus Spore's
  own table plus Looting III.
- **Player-kill gate:** 8 infected humans produced 1 claw fragment. Expected
  0.64 at 8%.
- **Organoid removal:** those same 8 produced zero membrane.

Incidental: 8 basic infected also dropped 25 mutated fibre. Fibre is cheap,
armour fragment is the real gate, and the gate holds.

---

# Recipe test functions

Eight functions in `kubejs/data/biomagic/functions/`, covering all 20 custom
recipes, grouped by station rather than one per recipe — otherwise the same
Bio-Forge gets built three times.

Each does `clear @s` then gives the blocks and every ingredient for that tree.
All item IDs verified against the jars.

    /function biomagic:recipe_botania      2 recipes, creative_pool + catalysts
    /function biomagic:recipe_malum        2 recipes, spirit altar + spirits
    /function biomagic:recipe_occultism    2 recipes, spirit fire — SEE BELOW
    /function biomagic:recipe_evilcraft    2 recipes, note tier 1 vs tier 2
    /function biomagic:recipe_hex          2 recipes, plain crafting table
    /function biomagic:recipe_biomancy     3 recipes, bio-forge + nutrient paste
    /function biomagic:recipe_create       5 recipes, creative blaze cake
    /function biomagic:recipe_halogen      2 recipes, regression check

**Occultism is the one expected to fail.** The organoid membrane recipe uses
`occultism:spirit_trade`, which is consumed by a summoned trader rather than a
machine, and it has no JEI category. The function is really the test for
whether it works at all.

**Watch the Biomancy armour fragment output.** It should be 1, not 3 — that was
the rebalance, and it's the number most worth confirming.

Recipes are confirmed _visible in JEI_ but have never been _crafted_. Visible
proves the ingredient IDs resolve; it doesn't prove the machine accepts them.

---

# Fixes and invariants

## Halogen lights — CONFIRMED CRAFTABLE

Spore 2.2.0j ships both halogen recipes with 1.21's `"result": {"id": ...}`
format on 1.20.1, where the key is `"item"`. Both fail to parse and the block is
uncraftable. Shimmed in `biomagic_fixes.js` with ingredients copied verbatim.

Two of the three remaining "failed recipes" in the log are these, upstream.
**Delete the shim when Spore fixes it**, or you'll have duplicates.

## No infinite blood — now enforced

`biomagic_invariants.js` removes `create:mixing/compat/sons_of_sins/blood_recipe_3`
and its two hypothetical siblings by ID.

Extra Sins shipped a recipe turning ether ashes plus **milk** into 1000mB of
blood. Milk is renewable, so that's a blood printer. It was inert only because
`warriorsofpastepoch:crystal_blood` wasn't installed — luck, not design.

Removing by ID is a no-op while the dependency is missing and takes effect the
moment it isn't. Kept even after cutting Extra Sins.

---

# Cuts

## Spore Inquisition

The significant one. It ran a chunkloader force-loading a 100-block radius
around every hivemind in three concentric rings, ignoring the config
chunkloaders that had just been turned off. It ran a parallel 12-real-hour timer
firing scripted "ordeal" raids. It hooked sleep to teleport players into its own
dimension, force survival mode, and set `doImmediateRespawn` globally.

Two pacing systems fighting each other, and a 12-hour clock is unfair to
players in different timezones.

It had also silently changed Spore's behaviour twice in ways only found by
accident: the block conversion map, and moving biomass towers out of the
overworld into `inqui:wastes`.

Lost with it: archaeology loot (church, mines, labmap), extra structure NBTs,
two dimensions, the ordeal system. Its 32 Better Combat weapon templates turned
out to be Better Combat's own, so nothing lost there.

**Consequence:** Spore's own `default_conversions.json` is empty `{}`.
Inquisition supplied the map ours was overriding. Ours is now the only one.

## Extra Sins

43 Biomancy decomposing recipes, **42 outputting ether ashes**. `spider_heart`
gives 3–9 ashes for 1 nutrient. `urn` gives 1–2 ashes for 6 nutrients, and an
urn costs 1 ash to make — a **loop**.

Ether ashes being drop-only is what made Sons of Sins a combat tree. This let
Biomancy farm them, and Bio-Factory automates Biomancy's nutrients. Same
failure as the armour fragment recipe that output 3 for 2 inputs, except shipped
by a mod and liable to return on any update with no log line.

Lost deliberately: ~20 extra `is_slicer` entries, Create blood filling and
emptying, a weapon roster.

## LC²H and Quantified API

LC²H 3.5.0 `@Overwrite`s `findSafeSpawnPoint` in
`mcjty.lostcities.setup.ForgeEventHandlers`, which doesn't exist in Lost Cities
1.20-7.5.2. Hard crash at `COMMON_SETUP`. 3.5.0 is the latest release, so
there's nothing newer to try.

Quantified API is its dependency, nothing else declares it, and it was spawning
Vulkan probe subprocesses at startup that found no GPU.

Worth noting LC²H also "prevents structures inside cities," which would have
worked against the Spore structure placement tuning.

## Simply Tooltips

Inert since the Simply Swords cut, and its `simplyswords:uniques` tag reference
was failing to load every launch.

## Considered and rejected: Macabre

Not a flesh dimension — 40+ mobs, a boss ladder, a second dimension, ore tiers
with armour sets, prayer altars, and Constructs (buildable familiars).

Sails through the theme filter, fails one-mod-per-job in four places at once:
bosses against Spore's calamities, Constructs against Occultism familiars _and_
the Gulbèr, armour against the ladder, and a flesh dimension against the Heap.
Worst of it, a fourth flesh vocabulary that doesn't connect to the BOP →
Biomancy → Spore economy.

---

# Sons of Sins

**Organ bridge confirmed.** `#sons_of_sins:is_slicer` shipped with only
`sickle_of_struggle` and `butcher_cleaver`. Added `spore:sickle`,
`spore:cleaver` and `biomancy:despoil_sickle`. Organs drop from spider and blaze
via the infected sickle. Three trees feed the seventh.

Corrections to earlier assumptions:

- Ether Ashes are **drop-only**, from any `#is_osseous` main-hand kill
- The **Urn is storage, not the summoner** — a dropped carcass on
  `sons_of_sins:blood` summons a Blüd
- Only **ten `slicing/` loot tables exist**: blaze, cave spider, creeper,
  enderman, iron golem, ravager, slime, snow golem, spider, strider. No zombie,
  no skeleton, **no Spore mob.** A hard constraint on any progression built
  around organs.
- The urn recipe type is `sons_of_sins:etheric_blood_imbibation`, ingredients
  list plus output — which unblocks the seventh capstone route.

Untested past the first stage: the ritual, the Gulbèr, whether abilities differ
by which organs it's fed.

---

# Open

**Flesh livestock don't spawn.** Biome modifiers demonstrably apply in this
world, since the blobs and veins generate, and `add_features` and `add_spawns`
sit in the same file targeting the same biome. So it's specific to `add_spawns`.
`/summon biomancy:flesh_cow` works. flesh_cow is at diagnostic weight 400.
`printSpawns` from KubeJS `WorldgenEvents` is the next instrument.

The `animals_spawnable_on` addition does nothing — Biomancy registers no
`SpawnPlacements` for them at all, so there's no light or ground predicate to
satisfy.

**Occultism organoid membrane** loads without error but has no JEI category.

**Every Spore structure is locked to a single vanilla biome.** Hospital is
plains, biomass tower is mushroom fields. Effective rarity is biome frequency ×
spacing, and only spacing was ever tuned. Widening biomass_tower from 3/1 to
40/24 effectively deleted it; it's at 5/2 now. The other nine want revisiting on
the same grounds.

**Not started:** sparse-cities Lost Cities profile (`rarecities`), the armour
cut, the Sons of Sins capstone route, Better Combat bindings for Spore's
thirteen weapons, and distribution.

---

# Sculk

`minecraft:sculk` was cut from the infection list deliberately, and that's now a
design decision rather than housekeeping.

Sculk is already the answer to this pack's question: another substance that
spreads by consuming what dies in it, with its own bloom and vein blocks,
growing around a thing that shouldn't be there. Reading it as **the previous
infection, which won** means there's one place the flesh never reaches and
nobody explains why.

Direction, not yet built:

- **Sculk catalyst as the sculk ward.** It's the thing that actually spreads,
  so the ward isn't a placed object but a living thing you brought back. It
  costs you something no other ward does — feed it kills and it grows, and if
  catalyst-grown shriekers summon, your ward slowly builds things that kill you.
- **`minecraft:warden` added to Spore's "Mobs that will target infected" list.**
  One config line, free, no mod needed. The Warden still attacks the player —
  it's indiscriminate, that's its identity — but infected register as valid
  targets. Luring infected into the deep dark becomes a real tactic.
- **Catalyst-grown shriekers summoning.** Vanilla sets `can_summon=false` on
  anything not generated in an ancient city. Redirecting that one boolean makes
  sculk a second advancing system, fed by kills rather than by proximity.
- **Reduced shrieker growth rate** and **Spore mobs triggering shriekers** —
  `SculkShriekerBlockEntity` only escalates its warning level for _player_
  vibrations, so that check is the change.

All three code items want separate config toggles. They pull in different
directions — fewer shriekers means fewer Wardens, live catalyst shriekers means
more — and with seven players killing constantly, sculk will spread far more
than in single-player.
