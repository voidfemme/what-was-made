# Bio-Magic — halogen light shims (2 recipes)
#   /function biomagic:recipe_halogen
#
# biomagic:fix/halogen_light              XRX / TRT / XRX
#                                         X = iron nugget, R = glass pane, T = redstone
# biomagic:fix/halogen_light_from_broken  broken_halogen_light + glass pane
#
# Spore ships both of these with 1.21's result format on 1.20.1, so both fail
# to parse upstream and the block is uncraftable without the shim. Two of the
# three "failed recipes" in the log are these.
#
# ALREADY CONFIRMED CRAFTABLE — this is here for regression checking after a
# Spore update, at which point the shim should be DELETED to avoid duplicates.

clear @s
give @s minecraft:crafting_table 1
give @s minecraft:iron_nugget 64
give @s minecraft:glass_pane 64
give @s minecraft:redstone 64
give @s spore:broken_halogen_light 8
say Halogen: 4 iron nuggets corners, 3 glass panes middle column, 2 redstone sides.
