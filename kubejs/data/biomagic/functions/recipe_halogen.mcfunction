# Bio-Magic — halogen light shims (2 recipes)
#   /function biomagic:recipe_halogen
#
# Builds EAST of you (+X).
#
# fix/halogen_light              XRX / TRT / XRX
#                                X = iron nugget, R = glass pane, T = redstone
# fix/halogen_light_from_broken  broken_halogen_light + glass pane
#
# Spore ships both with 1.21's result format on 1.20.1, so both fail upstream
# and the block is uncraftable without the shim. Already confirmed working —
# this is a regression check after a Spore update, at which point the shim
# should be DELETED to avoid duplicates.

fill ~1 ~ ~-1 ~4 ~1 ~1 minecraft:air
setblock ~2 ~ ~ minecraft:crafting_table

clear @s
give @s minecraft:iron_nugget 64
give @s minecraft:glass_pane 64
give @s minecraft:redstone 64
give @s spore:broken_halogen_light 8

say Crafting table placed east.
say Shaped: 4 iron nuggets in corners, 3 glass panes down the middle, 2 redstone.
