# Bio-Magic tuning pack

Everything here was written against the actual jars in your `mods/` folder —
recipe schemas, item IDs, loot table names, config keys and LootJS method
signatures were all pulled from `spore_1.20.1_2.2.0j.jar`,
`spore_inquisition_3.1.jar`, `lootjs-forge-1.20.1-2.13.1.jar` and the six magic
mods, not from memory.

## Install

Drop the two folders into your instance:

```
biomagic-tuning/kubejs/  ->  .minecraft/kubejs/
```

The config excerpt is not a drop-in file. Boot once so Forge generates
`config/spore-server.toml`, then edit the listed keys.

## The core idea

The infection is spatial, not temporal.

Nothing here makes the infected weaker — `global_damage`, `global_health` and
`global_armor` all stay at 1.0. Spore's nasty phases stay nasty. What changes is
where the infection can reach, and how fast the macro ladder (mound → hivemind →
womb → calamity) climbs without a player feeding it.

The lever that does most of the work is `spore_block_conversion`. It is a
**whitelist** — any block not in the map cannot be infected. Spore Inquisition's
default map opens with:

```json
"#minecraft:mineable/pickaxe": "spore:mycelium_block",
"#minecraft:mineable/axe": "spore:rooted_biomass",
"#minecraft:mineable/shovel": "spore:rooted_mycelium"
```

Every stone, every wood, every dirt. That is why it eats the world.

The replacement in `kubejs/data/spore/spore_block_conversion/default_conversions.json`
swaps those three tags for narrow ones defined in
`kubejs/data/biomagic/tags/blocks/`:

- **`biomagic:infectable_masonry`** — stone bricks, concrete, terracotta, bricks,
  worked stone. What Lost Cities builds with.
- **`biomagic:infectable_timber`** — planks, doors, stairs, fences, bookshelves.
  *Worked* wood only. Logs and leaves are deliberately absent.
- **`biomagic:infectable_soil`** — dirt, grass, mud, clay, farmland.

The result: **buildings rot, forests don't.** The infection is at home in cities
and can barely get a hold in the wilderness — which is exactly the sparse-cities
world you described, achieved through block tags instead of a chunk predicate.
That matters because `dimension_parameters` is biome-tag driven and Lost Cities
places cities by chunk-level profile noise, so there's no biome tag to target.
This routes around the problem entirely.

`infection_immune.json` is **not read by Spore** — the map has no "immune"
concept, absence is immunity. It's there so the intent is written down, and so a
future KubeJS block-break guard or mound-suppression check has a tag to
reference. Delete it if it bothers you.

The structure sets in `kubejs/data/spore/worldgen/structure_set/` widen Spore's
placement. `biomass_tower` shipped at `spacing: 3, separation: 1`, which is about
as dense as Minecraft allows; it's now 40/24. The rest went from 32/10 to 48/28,
and the two big set-pieces (cathedral, hospital) to 72/40.

## The capstone

`spore:inf_up_helmet` / `_chest` / `_pants` / `_boots` — the Living MK2 set — is
the god armor. It already exists, with models, textures and a full config block,
and it's the only top-tier armor in your pack gated behind the antagonist rather
than behind a crafting tree. Its chain, from the jar:

```
plated_* + integrating_agent + living_*     -> inf_*        (spore:grafting)
inf_*    + reforged_biomass_a + r_elytron   -> inf_up_*     (spore:grafting)
```

Every rung is built from `armor_fragment`, `mutated_fiber`, `nerves`,
`mutated_heart` and `organoid_membrane` — all infected-only drops. So the
infection is already the shared spine; you don't need to build one.

What `biomagic_capstone.js` adds is **six ways to climb it**. Each tree converts
cheap common drops into scarce ones using its own endgame reagent:

| Tree | Mechanism | Reagent |
|---|---|---|
| Botania | `botania:mana_infusion` | mana + Alchemy/Conjuration Catalyst |
| Malum | `malum:spirit_infusion` | wicked + eldritch spirits, soulstone |
| Occultism | `occultism:spirit_fire`, `spirit_trade` | throughput-limited, cheap per item |
| EvilCraft | `evilcraft:blood_infuser` | blood, tiered |
| Hex Casting | shapeless | charged amethyst / quenched allay shard |
| Biomancy | `biomancy:bio_forging` | nutrients + flesh components |
| Create | `create:mixing` (heated) | bulk throughput, no rarity upgrade |

You still have to fight the infection for input material. Your tree only decides
how efficiently you convert it. Biomancy is deliberately the most
material-efficient — it should feel like it speaks Spore's language. Hex has no
processing machine, so its gate is material scarcity rather than a machine tier;
`quenched_allay_shard` is genuine late-game.

Every one of those recipe types and item IDs was read out of the jars. Malum's
spirit type names (`wicked`, `eldritch`, `earthen`) came from its lang file;
Biomancy's `bio_forge_tab` values are the five it actually registers;
`create:mixing` uses `heatRequirement`, confirmed against `brass_ingot.json`.

## Visceral Heap (Biomes O' Plenty)

BOP is left generating normally in both dimensions — no config changes, so the
overworld region weights stay at their defaults and Lost Cities coexists with
BOP biomes as it's designed to. Lost Cities doesn't generate terrain on 1.20.1;
it layers cities onto whatever the world generator produces, and it's
biome-aware in both directions (its worldstyle JSON already carries `biomes`
blocks with `if_any` / `excluding` lists keyed on biome tags). BOP is an
explicitly supported combination — Lost Cities' own gallery has screenshots
captioned "Biomes O Plenty support."

### Biomancy in the biome

Two features, both attached to `biomesoplenty:visceral_heap` via one Forge
`add_features` modifier:

- **`malignant_flesh_blob`** — a `minecraft:ore` feature. Despite the name,
  that type isn't ore-specific: it places spherical blobs replacing blocks that
  match a predicate. This one is size 12, count 14 per chunk, targeting the
  `#biomesoplenty:flesh` tag (which holds exactly `biomesoplenty:flesh` and
  `biomesoplenty:porous_flesh`). Result: pockets of `biomancy:malignant_flesh`
  buried in the terrain. This is the quarry — you find them by digging.
  BOP's own `porous_flesh` feature is size 16 at count 80, so at 12/14 the
  Biomancy pockets are meaningfully rarer than the native patches.

- **`malignant_flesh_veins`** — a `minecraft:multiface_growth` feature placing
  `biomancy:malignant_flesh_veins` on floors, ceilings and walls, count 40.
  `FleshVeinsBlock extends MultifaceBlock`, verified in the jar, so the vanilla
  feature type accepts it. This is the mood — Biomancy visibly colonising the
  biome, seen on arrival rather than found by mining.

### Tag wiring

Three tag files, all `"replace": false` so they append rather than override,
and all using Forge's `{"id": ..., "required": false}` optional syntax — the
same pattern Biomancy itself uses for its ~70 Alex's Caves entries, so nothing
breaks if BOP is ever removed.

- **`biomancy:allow_veins_to_attach`** — BOP flesh and porous flesh added.
  Biomancy's veins can climb the Visceral Heap. (That tag ships with only three
  entries: dirt path, farmland, vine. It is very hungry for additions.)
- **`biomancy:decay_destructible`** — BOP flesh and porous flesh added.
- **`minecraft:animals_spawnable_on`** — BOP flesh and porous flesh added, so
  the flesh livestock have valid ground.

Deliberately **not** added:

- **`biomancy:flesh_replaceable`** — Biomancy flesh must not overtake BOP
  flesh. The two coexist; neither eats the other.
- **`biomancy:acid_destructible`** — that tag contains no Biomancy blocks at
  all, only leaves, moss, vines and flowers. Matching Biomancy's own behaviour
  means leaving BOP flesh out of it.

The decay/acid split follows Biomancy's own distinction: its *wild* flesh
(malignant, and every primal variant) is decay-destructible; its *crafted*
flesh (`flesh`, `packed_flesh`, `fibrous_flesh`) is not. BOP flesh is naturally
generated, so it matches the wild kind.

### Flesh livestock

`forge:add_spawns` puts Flesh Cows, Pigs, Sheep and Chickens in the Visceral
Heap at weights 22/20/18/14. For scale, the biome's native spawns are
zombified piglins at 100, ghasts at 50, striders at 60 — so the livestock are a
real presence without displacing the vanilla Nether mobs.

**One thing to watch on first boot.** Biomancy's flesh livestock extend vanilla
`Animal`, which means they use `Animal.checkAnimalSpawnRules` — valid ground
(handled by the tag above) *and* a light level above 8. The Visceral Heap is
dark apart from magma blocks and the shroomlights in its flesh strands, so
spawns may cluster near light rather than spreading evenly. If they turn out
too rare, the weights above are the first thing to raise; a light-emitting
feature added to the biome is the second.

## The quarry and the blood

`kubejs/server_scripts/biomagic_visceral_heap.js`.

**Flesh** has two routes. Crushing is the volume route — BOP flesh into
`biomancy:flesh_bits`, from which Bio-Factory's existing 4-bits-to-flesh
compacting recipe takes over with nothing further needed. Porous flesh gives a
richer output (organic matter, sometimes elastic fibers) since it's the rarer
block. The direct route is heated compacting, 4 BOP flesh plus a Biomancy
binder straight to `biomancy:malignant_flesh`, which Bio-Factory already
compacts up to primal flesh. Bigger setup, better ratio. Both recipes are
written to mirror Bio-Factory's own shapes so they read as part of that set.

**Blood** stays two fluids. They aren't the same kind of object:
`biomesoplenty:blood` is terrain with one behaviour (it turns liquids it
touches into flesh); `evilcraft:blood` is a whole economy — Blood Stains,
Sanguinary Pedestals, Dark Tanks, the Blood Infuser's tiered recipes. Merging
them would apply BOP's convert-everything-to-flesh behaviour to every Dark Tank
in a base, and hand EvilCraft's mid-game away for free.

So: one-way conversion only, `create:mixing`, superheated, 1000mB BOP blood
plus two nether wart into 250mB EvilCraft blood. Nether wart is the catalyst
because it's the only living thing native to the Nether and because it's
tree-neutral — this route shouldn't require Biomancy or Malum to walk. The 4:1
loss plus a blaze cake plus the trip is the tedium, by design.

**No infinite source.** Neither fluid forms infinite sources, and there is
deliberately no recipe anywhere in this pack that *produces*
`biomesoplenty:blood`. The only source in the world is bucketing it out of a
Visceral Heap lake, one bucket at a time. Adding a blood-producing recipe later
would quietly break that, which is why it's called out in the script as well.
Create handles bucket emptying generically, so no `create:emptying` recipe is
needed for `biomesoplenty:blood_bucket` — an Item Drain takes it as-is.

## Mosquitoes

`crimsonMosquitoSpawnWeight = 0` and `crimsonMosquitoSpawnRolls = 0` in
`config/alexsmobs.toml`. The rolls key is redundant once weight is zero, but
it's zeroed too so a config reset doesn't quietly restore them at full strength.

The Bio-Forge recipe reads as a parts list: an acidic egg to grow from, flesh
bits for the body, elastic fibers for a segmented grub, a toxin gland for the
part that bites. 20 nutrients — about a tenth of Acolyte armor — because the
point isn't to gate mosquitoes behind effort, it's to make them a choice rather
than an ambush.

## Still open

The **Sons of Sins** conversion route in `biomagic_capstone.js` is a stated gap.
That's a seventh tree and it wants a route like the other six, but its jar
hasn't been read — item IDs, ritual and urn recipe types, and whether Ether ash
is craftable or drop-only are all unknown. Guessing would produce recipes that
fail to load silently. Drop the jar in and it's a short job.

The **loot script is unchanged** and didn't need revision. Its Spore chest
seeds and calamity drops are unaffected by BOP, Bio-Factory, or the Simply
Swords removal.

## Things to check on first boot

1. **Does KubeJS's data folder beat Spore Inquisition's?** Inquisition is a
   `lowcodefml` datapack-only mod, and `kubejs/data` should take priority — but
   verify. Break a stone brick block near a mound and see whether it converts;
   then break an oak log and confirm it doesn't. If Inquisition wins, move the
   `data/` tree into a real datapack in `world/datapacks/` instead.

2. **`Item.of(id, n)` inside LootJS `addLoot`.** The signature is
   `addLoot(LootEntry...)` and KubeJS type-wraps items into entries, so this
   should be fine. If the log complains, plain string IDs work and you lose the
   stack counts.

3. **`spore:chests/*` table names.** These are typed, not structure-named —
   `equipment_chest`, `document_chest`, `organ_chest`, `food_chest`,
   `ice_chest`. If a seed item never appears, run with `event.enableLogging()`
   at the top of the modifiers block to see which tables are actually firing.

4. **`inf_player = true`** is the most thematically correct setting in the pack
   and also the most brutal. It's the first thing to turn off if playtesting
   stops being fun.

5. **The multiface feature.** `minecraft:multiface_growth` requires its `block`
   to be a `MultifaceBlock`. `biomancy:malignant_flesh_veins` is one (verified
   in the jar), but if the feature errors on load, that's where to look.

6. **Flesh livestock light gating**, described above — check whether they
   actually spawn before tuning anything else about them.

7. **Tag references are the fragile part.** `#minecraft:concrete_powder` is an
   ITEM tag with no block-tag equivalent in 1.20.1, and referencing it from a
   block tag made Minecraft discard `biomagic:infectable_masonry` **entirely** —
   silently making every masonry block immune. Fixed by listing all sixteen
   concrete powders explicitly. The lesson generalises: a single bad reference
   nukes the whole tag, and the only symptom is the tag quietly being empty. The
   log line to grep for is `Couldn't load tag`.

   Botania and Forge references in `infection_immune.json` are now marked
   `"required": false` so pulling either mod degrades gracefully. Vanilla
   references stay required, so a typo still fails loudly.

8. **The `#biomesoplenty:flesh` tag** is what both new features target. If BOP
   ever renames or splits it, the blobs and veins stop generating silently
   rather than erroring.

## Two loose threads

Spore ships Create compat recipes already (`data/create/recipes/` — amethyst dust
via crushing, milling and pressing, plus a mixing recipe). That bridge exists
without you doing anything.

Spore Inquisition ships `data/bettercombat/weapon_attributes/` for about a dozen
weapon types that do nothing, because Better Combat isn't in your pack. It's also
carrying dormant compat data for Incendium, Farmer's Delight and the Wither Storm
mod. If you ever add Better Combat, a chunk of Inquisition's weapon design turns
on for free.
