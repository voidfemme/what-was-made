# Bio Magic

<p align="center"><img src="assets/Bio-Magic-Logo.png" alt="Bio Magic Logo" width="200"/></p>

Configs, datapacks and scripts for **Bio-Magic**, a Minecraft 1.20.1 Forge
modpack. Managed with [packwiz](https://packwiz.infra.link/).

This repository is not the modpack. It's the custom work layered on top of it —
the mod list lives in `mods/` as packwiz metadata, and everything else here is
the part that makes 81 mods behave like one thing.

---

## The premise

Something is remaking the world into flesh. You learn to remake flesh back.

The overworld is sparse Lost Cities. The infection lives in the cities and can
barely take hold outside them, because it consumes **what people made** — worked
stone, worked timber, tilled ground — while natural stone, dirt, grass, sand and
clay are immune. That rule isn't stated to the player anywhere. It's meant to be
inferred from watching a cobblestone wall rot while the stone it was quarried
from doesn't.

That rule is currently enforced in masonry and ground but **not in wood** — see
the three-systems note below.

### Seven trees, one ceiling

Botania, Malum, Hex Casting, Occultism, EvilCraft, Biomancy, Sons of Sins.
Create is the industrial spine rather than an eighth tree.

These are **not seven progression systems to work through.** They're seven
specialisations, and the intent is that a player picks one:

> Your tree is the efficient path. The other six are tempting side roads.

The infection supplies the shared material problem. Your chosen tree determines
how you solve it. The capstone is reachable down any of them, so the trees are
comparable without being interchangeable — and the journeys being strange and
unequal is the point.

---

## What's here

### The three conversion systems

Worth stating up front, because it took two days to find and it reframes
everything else. `FoliageSpread.SpreadFoliageAndConvert` runs **four**
converters per block:

| converter         | source                                 | reachable from data?                  |
| ----------------- | -------------------------------------- | ------------------------------------- |
| `convertBlocks`   | `sporedata.toml` `["Block infection"]` | **yes** — plain TOML list             |
| `convertWood`     | hardcoded vanilla `BlockTags`          | **no** — needs a mixin                |
| `convertFromJson` | `spore_block_conversion` map           | **yes** — datapack                    |
| `place*Foliage`   | —                                      | additive decoration, destroys nothing |

Blocks appearing in more than one source are raced, each rolling independently.
All four are gated behind `mound_foliage`, which reads "Should the mound spread
foliage and infect blocks?" and means both — setting it false stops everything.

So enforcing worked-versus-wild took **two** surfaces, not one. The
`sporedata.toml` list was converting stone, deepslate, sand, gravel, dirt,
podzol and grass from a config nobody had touched.

**Wood is the remaining hole.** `convertWood` is hardcoded and rots logs and
planks regardless of any tag. That's the sole justification for a companion mod.

### `kubejs/data/`

**The infection whitelist.** Spore's own `default_conversions.json` is empty, so
this file _is_ the map rather than an override of one.

- `infectable_masonry` — worked stone, brick, concrete, terracotta that doesn't
  generate naturally
- `infectable_timber` — planks, doors, stairs, fences. Worked wood only
- `infectable_soil` — farmland, dirt path, coarse dirt. Worked ground only

Verified on a controlled test pad, which lives in
`kubejs/data/biomagic/functions/` so it's repeatable rather than retyped.

**Visceral Heap worldgen.** BOP's Nether flesh biome, extended with Biomancy
malignant flesh as buried blobs and multiface wall veins, flesh livestock in the
spawn list, blood lakes weighted 7:3 blood to Biomancy's gastric acid, and a
**buried Primordial Cradle** — a single block replacing one flesh block, always
fully encased, never visible, that has to be dug out. Its sacrifice handler and
primal energy both start empty, so what you find is a functional machine with
nothing in it.

**Cross-mod bridges.** BOP flesh added to Biomancy's `allow_veins_to_attach` and
`decay_destructible`, and moved from axe- to hoe-mineable to match Biomancy's
~76 flesh blocks. Spore's Infected Sickle and Cleaver plus Biomancy's Flesh
Plunderer added to `sons_of_sins:is_slicer`, so organs for necromancy can be
harvested with an infected blade.

**Spore structure spacing.** Every Spore structure is bound to a single vanilla
biome — hospital to plains, biomass tower to mushroom fields — so effective
rarity is biome frequency × spacing, and only spacing had ever been tuned.

### `kubejs/server_scripts/`

|                 |                                                                                                                                                                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `capstone`      | 13 recipes. Six trees each convert cheap infected drops into scarce ones using their own endgame reagent. The endgame is Spore's Living MK2 set, whose grafting chain is entirely infected-only drops — so the infection is already the shared spine, and your tree only sets the exchange rate. |
| `visceral_heap` | Create chains turning BOP flesh into Biomancy flesh; a one-way lossy conversion from BOP blood to EvilCraft blood.                                                                                                                                                                               |
| `loot`          | Magic tree starter reagents seeded into Spore's chest tables, so the only way to bootstrap a tree is to enter infected territory. Armour fragments gated behind player kills so mob farms can't shortcut the ladder.                                                                             |
| `mosquito`      | Crimson mosquitoes removed from natural spawning; a Bio-Forge recipe grows the larva instead. They exist, they're just manufactured on purpose.                                                                                                                                                  |
| `fixes`         | Shims for other mods' bugs. Currently Spore's halogen lights, which ship 1.21 recipe syntax on 1.20.1 and are uncraftable without it.                                                                                                                                                            |
| `invariants`    | Design rules enforced rather than assumed. Currently: no infinite blood source.                                                                                                                                                                                                                  |

Twenty custom recipes in total.

### `config/`

`sporeconfig.toml` carries roughly 30 hand edits among ~1600 generated lines,
applied by a patch script that asserts each target matches exactly once and
aborts if a Spore update moves anything.

The principle is that the infection is made **spatial, not weak** — global
damage, health and armour untouched at 1.0, no mob stat changed. What changes is
reach and the rate the macro ladder climbs unattended:

- All three chunkloaders off, so the infection only advances where a player is
- Evolution kill floors 1→4 and 7→12, so evolving is earned by winning fights
  rather than by the clock
- Womb clock 30→90s, assimilation 5→8, calamity threshold 100→200 — calamities
  appear because the infection has been winning, not because the world has been
  loaded a while
- Mound late-age ranges tightened, Proto World Modifier 3→5, mob caps cut ~40%

`sporedata.toml` holds the second conversion surface, cut from 32 entries to 15.

`canary.properties` disables one mixin that conflicts with C2ME and hard-crashes
world creation.

`alexsmobs.toml` zeroes crimson mosquito spawn weight.

### `notes/`

Why each batch of changes was made, and what each experiment was testing —
including the ones that failed. Worth more than the diffs.

---

## Running it

Launched through a Prism instance that syncs from this repo:

```bash
./prism-prelaunch.sh    # packwiz serve + packwiz-installer-bootstrap
```

Configured as a pre-launch command in the Prism instance settings. The instance
is disposable; this repository is the source of truth.

The pre-commit hook in `.githooks/` runs `packwiz refresh` and stages the index,
so a stale index can't be committed. Fresh clones need it enabled once:

```bash
git config core.hooksPath .githooks
```

---

## Status

Not released, not balanced, not finished. First successful boot was 28 August 2026.

**Confirmed working in-world:** the infection whitelist across masonry and
ground; both Visceral Heap worldgen features; the buried Cradle, which generates
and is fully functional — worldgen ones accept sacrifices and spawn flesh blobs
exactly like placed ones; the Sons of Sins organ-harvesting bridge; all three
LootJS mechanisms; the halogen light shims.

**Known open:** flesh livestock don't spawn, despite `add_features` and
`add_spawns` sitting in the same file targeting the same biome and the features
demonstrably working. Recipes are visible in JEI but have never been crafted.
Occultism's organoid membrane route loads without error but has no JEI category,
because `spirit_trade` recipes are consumed by a summoned trader rather than a
machine. The Sons of Sins capstone route isn't written. The sparse-cities Lost
Cities profile isn't configured. The armour cut is decided but not done.

---

## Design rules

Four, and they've decided every call so far:

1. **Premise as a filter.** If a mod doesn't answer the sentence at the top of
   this file, it doesn't go in. A pack that can't reject anything ends up at
   200 mods.
2. **One mod per job.** Seven systems, not seven versions of one system. Two
   mods answering the same question is worse than either alone.
3. **Cut too much rather than add too much.** Pieces go back in when
   playtesting shows a gap, not before.
4. **Every mechanic should teach something.** The worked-versus-wild rule
   teaches ecology. The city distribution teaches geography. The capstone
   teaches that every magical tradition learned to exploit the same infection.
   The blood separation teaches that two systems are related without being
   identical.

Mods removed for cause: **Spore Inquisition** (ran a parallel 12-hour
progression clock and its own chunkloader force-loading 100 blocks around every
hivemind, both fighting the config above), **Extra Sins** (43 Biomancy
decomposing recipes, 42 outputting ether ashes, one of them a net multiplier
that let Biomancy farm the seventh tree's gating resource), **LC²H** (its mixin
`@Overwrite`s a method Lost Cities 7.5.2 doesn't have), Unusual End and Ender
Sins, the Simply Swords cluster, both Better Mob Combat jars, Distraction Free
Recipes, Quantified API, Simply Tooltips.

Considered and rejected: **Macabre** — sails through the theme filter, fails
one-mod-per-job in four places at once. **Rain washing away infection** —
reintroduces a global timer outside player control, the exact thing removed by
cutting Inquisition.

---

## Licence

Configs and scripts here are mine. The mods they configure belong to their
authors and are not redistributed — `mods/` contains only packwiz metadata
pointing at Modrinth.
