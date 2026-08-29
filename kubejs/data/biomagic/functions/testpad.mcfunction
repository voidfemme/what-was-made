# Bio-Magic — infection conversion test pad
#   /function biomagic:testpad
#
# A cross laid out on an axis. Everything sits within 4 blocks of centre, so a
# mound at default range 5 reaches all of it.
#
#   NORTH (-Z)  worked stone     should convert
#   SOUTH (+Z)  wild stone       should NOT convert
#   EAST  (+X)  worked ground    should convert
#   WEST  (-X)  wild ground      should NOT convert
#   CORNERS     wood + leftovers
#
# Water at centre keeps the farmland at ~1 ~ ~ hydrated (same Y or above, within
# 4 blocks horizontally — it does NOT work from below).
#
# Run testpad_clear afterwards to reset.

say Building infection test pad...

# clear the area, including a block of headroom
fill ~-5 ~ ~-5 ~5 ~2 ~5 minecraft:air

# centre — water for farmland hydration, and where the mound goes
setblock ~ ~ ~ minecraft:water

# NORTH — worked stone. Expect conversion.
setblock ~ ~ ~-1 minecraft:bricks
setblock ~ ~ ~-2 minecraft:cobbled_deepslate
setblock ~ ~ ~-3 minecraft:smooth_stone

# SOUTH — wild stone. Expect NO conversion.
setblock ~ ~ ~1 minecraft:stone
setblock ~ ~ ~2 minecraft:deepslate
setblock ~ ~ ~3 minecraft:gravel

# EAST — worked ground. Expect conversion.
setblock ~1 ~ ~ minecraft:farmland
setblock ~2 ~ ~ minecraft:dirt_path
setblock ~3 ~ ~ minecraft:coarse_dirt

# WEST — wild ground. Expect NO conversion.
setblock ~-1 ~ ~ minecraft:grass_block
setblock ~-2 ~ ~ minecraft:dirt
setblock ~-3 ~ ~ minecraft:podzol

# CORNERS
# wood: rots via convertWood regardless of any config. Control group.
setblock ~2 ~ ~2 minecraft:oak_log
setblock ~-2 ~ ~2 minecraft:oak_planks
# masonry tag check
setblock ~2 ~ ~-2 minecraft:stone_bricks
# cobblestone: in the sporedata list but NOT in infectable_masonry.
# Converting means the list is the source; surviving means neither is.
setblock ~-2 ~ ~-2 minecraft:cobblestone
# remaining wild cuts
setblock ~3 ~ ~3 minecraft:sand
setblock ~-3 ~ ~3 minecraft:clay
setblock ~3 ~ ~-3 minecraft:terracotta
setblock ~-3 ~ ~-3 minecraft:red_terracotta

say Pad built. Summon the mound on the centre water:
say   /summon spore:mound ~ ~1 ~
say Then step clear. Conversion is a 10% roll per attempt, so give it minutes.
