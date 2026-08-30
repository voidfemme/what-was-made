# Bio-Magic — Hex Casting capstone routes (2 recipes)
#   /function biomagic:recipe_hex
#
# Builds EAST of you (+X).
#
# armor_fragment     claw_fragment + 2 charged_amethyst
# organoid_membrane  2 mutated_fiber + 1 quenched_allay_shard -> 2
#
# The only tree with no processing machine, so its gate is material scarcity
# rather than a machine tier.

fill ~1 ~ ~-1 ~4 ~1 ~1 minecraft:air
setblock ~2 ~ ~ minecraft:crafting_table

clear @s
give @s spore:claw_fragment 16
give @s spore:mutated_fiber 16
give @s hexcasting:charged_amethyst 32
give @s hexcasting:quenched_allay_shard 16

say Crafting table placed east. Both recipes are shapeless.
