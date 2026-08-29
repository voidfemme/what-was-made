# Bio-Magic — infection conversion test pad
#   /function biomagic:testpad
#
# Each block gets a 2x2 pad, so a 10% conversion roll has four chances per type
# and you can read partial conversion rather than waiting on a single coin flip.
#
# Layout is a cross on an axis, everything within 4 blocks of centre:
#   NORTH (-Z)  worked stone     should convert
#   SOUTH (+Z)  wild stone       should NOT convert
#   EAST  (+X)  worked ground    should convert
#   WEST  (-X)  wild ground      should NOT convert
#   CORNERS     wood control + discriminators
#
# Water at centre keeps the farmland hydrated. Hydration works at the same Y or
# above, within 4 blocks horizontally — it does NOT work from below.

say Building infection test pad...

fill ~-6 ~ ~-6 ~6 ~2 ~6 minecraft:air
setblock ~ ~ ~ minecraft:water

# NORTH — worked stone. Expect conversion.
fill ~-1 ~ ~-2 ~ ~ ~-1 minecraft:bricks
fill ~-1 ~ ~-4 ~ ~ ~-3 minecraft:cobbled_deepslate
fill ~1 ~ ~-2 ~2 ~ ~-1 minecraft:smooth_stone

# SOUTH — wild stone. Expect NO conversion.
fill ~-1 ~ ~1 ~ ~ ~2 minecraft:stone
fill ~-1 ~ ~3 ~ ~ ~4 minecraft:deepslate
fill ~1 ~ ~1 ~2 ~ ~2 minecraft:gravel

# EAST — worked ground. Expect conversion.
fill ~1 ~ ~-1 ~2 ~ ~ minecraft:farmland
fill ~3 ~ ~-1 ~4 ~ ~ minecraft:dirt_path
fill ~3 ~ ~1 ~4 ~ ~2 minecraft:coarse_dirt

# WEST — wild ground. Expect NO conversion.
fill ~-2 ~ ~-1 ~-1 ~ ~ minecraft:grass_block
fill ~-4 ~ ~-1 ~-3 ~ ~ minecraft:dirt
fill ~-4 ~ ~1 ~-3 ~ ~2 minecraft:podzol

# CORNERS — wood rots via convertWood regardless of config. Control group.
fill ~3 ~ ~3 ~4 ~ ~4 minecraft:oak_log
fill ~-4 ~ ~3 ~-3 ~ ~4 minecraft:oak_planks

# masonry tag check
fill ~3 ~ ~-4 ~4 ~ ~-3 minecraft:stone_bricks

# cobblestone: in the sporedata list, NOT in infectable_masonry.
# Converts -> the list is the source. Survives -> neither is.
fill ~-4 ~ ~-4 ~-3 ~ ~-3 minecraft:cobblestone

# remaining wild cuts
fill ~-2 ~ ~-4 ~-1 ~ ~-3 minecraft:sand
fill ~-2 ~ ~3 ~-1 ~ ~4 minecraft:clay
fill ~1 ~ ~-4 ~2 ~ ~-3 minecraft:terracotta
fill ~1 ~ ~3 ~2 ~ ~4 minecraft:red_terracotta

say Pad built. Summon on the centre water:
say   /summon spore:mound ~ ~1 ~
say Then step clear. 10% roll per attempt — give it several minutes.
