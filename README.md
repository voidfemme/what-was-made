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
barely take hold outside them, because it consumes **what people made** —
worked stone, worked timber, tilled ground — and leaves living wood and wild
earth alone. That rule isn't stated to the player anywhere. It's meant to be
inferred from watching a wall rot while the tree beside it doesn't.

Seven magic trees, all reaching the same endgame by different routes: Botania,
Malum, Hex Casting, Occultism, EvilCraft, Biomancy, Sons of Sins. Create is the
industrial spine rather than an eighth tree.

---

## What's here

### `kubejs/data/`

**The infection whitelist.** Spore's block-conversion map is a whitelist —
anything not in it cannot be infected. The shipped default catches every stone,
wood and dirt block in the game via `#minecraft:mineable/*` tags. Replaced with
three narrow tags:

- `infectable_masonry` — 72 entries, all manufactured
- `infectable_timber` — planks, doors, stairs, fences. Worked wood only; logs
  and leaves deliberately absent
- `infectable_soil` — farmland, dirt path, coarse dirt. Worked ground only

The worked-versus-wild distinction appears in two materials on purpose. One
material isn't enough surface area to infer a rule from.

**Visceral Heap worldgen.** BOP's Nether flesh biome, extended: Biomancy
malignant flesh as buried blobs and multiface wall veins, flesh livestock added
to the spawn list, and BOP's blood lakes and springs swapped for Biomancy's
gastric acid.

**Cross-mod bridges.** BOP flesh added to Biomancy's `allow_veins_to_attach`
and `decay_destructible`, and moved from axe- to hoe-mineable to match
Biomancy's ~76 flesh blocks. Spore's Infected Sickle and Cleaver plus
Biomancy's Flesh Plunderer added to `sons_of_sins:is_slicer`, so organs for
necromancy can be harvested with an infected blade.

**Spore structure spacing.** Note that every Spore structure is bound to a
single vanilla biome — hospital to plains, biomass tower to mushroom fields —
so effective rarity is biome frequency × spacing.

### `kubejs/server_scripts/`

|                 |                                                                                                                                                                                                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `capstone`      | 13 recipes. Six trees each convert cheap infected drops into scarce ones using their own endgame reagent. The endgame is Spore's Living MK2 set, whose grafting chain is entirely infected-only drops — so the infection is the shared spine, and your tree only sets the exchange rate. |
| `visceral_heap` | Create chains turning BOP flesh into Biomancy flesh; a one-way lossy conversion from BOP blood to EvilCraft blood.                                                                                                                                                                       |
| `loot`          | Magic tree starter reagents seeded into Spore's chest tables, so the only way to bootstrap a tree is to enter infected territory. Armour fragments gated behind player kills so mob farms can't shortcut the ladder.                                                                     |
| `mosquito`      | Crimson mosquitoes removed from natural spawning; a Bio-Forge recipe grows the larva instead. They exist, they're just manufactured on purpose.                                                                                                                                          |
| `fixes`         | Shims for other mods' bugs. Currently Spore's halogen lights, which ship 1.21 recipe syntax on 1.20.1 and are uncraftable without it.                                                                                                                                                    |
| `invariants`    | Design rules enforced rather than assumed. Currently: no infinite blood source.                                                                                                                                                                                                          |

### `config/`

`sporeconfig.toml` carries roughly 30 hand edits among ~1600 generated lines.
The principle is that the infection is made **spatial, not weak** — global
damage, health and armour are untouched at 1.0 and no mob stat is changed. What
changes is reach and the rate at which the macro ladder climbs unattended:

- All three chunkloaders off, so the infection only advances where a player is
- Evolution kill floors 1→4 and 7→12, so evolving is earned by winning fights
  rather than by the clock
- Womb clock 30→90s, assimilation 5→8, calamity threshold 100→200 — calamities
  appear because the infection has been winning, not because the world has been
  loaded a while
- Mound late-age ranges tightened, Proto World Modifier 3→5, mob caps cut ~40%

`canary.properties` disables one mixin that conflicts with C2ME and hard-crashes
world creation. `alexsmobs.toml` zeroes crimson mosquito spawns.

### `notes/`

Why each batch of changes was made, and what each experiment was testing.
Worth more than the diffs.

---

## Running it

Launched through a Prism instance that syncs from this repo:

```bash
./prism-prelaunch.sh    # packwiz serve + packwiz-installer-bootstrap
```

Configured as a pre-launch command in the Prism instance settings. The instance
is disposable; this repository is the source of truth.

---

## Status

Not released, not balanced, not finished. First successful boot was 28 August 2026.

**Working and confirmed in-world:** the infection whitelist, both Visceral Heap
worldgen features, the Sons of Sins harvesting bridge, all 18 custom recipes
loading.

**Known open:** flesh livestock don't spawn despite the biome modifier applying;
LootJS is entirely untested; recipes have been seen in JEI but not crafted; oak
logs may still rot through a second hardcoded Spore system separate from the
conversion map. The Sons of Sins capstone route isn't written. The sparse-cities
Lost Cities profile isn't configured yet.

---

## Design rules

Three, and they've decided every call so far:

1. **Premise as a filter.** If a mod doesn't answer the sentence at the top of
   this file, it doesn't go in. A pack that can't reject anything ends up at
   200 mods.
2. **One mod per job.** Six systems, not six versions of one system. Two mods
   answering the same question is worse than either alone.
3. **Cut too much rather than add too much.** Pieces go back in when
   playtesting shows a gap, not before.

Mods removed for cause so far: Spore Inquisition (ran a parallel 12-hour
progression clock and its own chunkloader, both fighting the config above),
Extra Sins (43 decomposing recipes, 42 outputting the same resource, one of them
a net multiplier), Unusual End and Ender Sins, the Simply Swords cluster, both
Better Mob Combat jars, Distraction Free Recipes.

---

## Licence

Configs and scripts here are mine. The mods they configure belong to their
authors and are not redistributed — `mods/` contains only packwiz metadata
pointing at Modrinth and CurseForge.
