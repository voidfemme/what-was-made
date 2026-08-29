# Bio-Magic — Hex Casting capstone routes (2 recipes)
#   /function biomagic:recipe_hex
#
# biomagic:hexcasting/armor_fragment     claw_fragment + 2 charged_amethyst
# biomagic:hexcasting/organoid_membrane  2 mutated_fiber + 1 quenched_allay_shard -> 2
#
# The only tree with no processing machine, so its gate is material scarcity
# rather than a machine tier. Plain crafting table.

clear @s
give @s minecraft:crafting_table 1
give @s spore:claw_fragment 16
give @s spore:mutated_fiber 16
give @s hexcasting:charged_amethyst 32
give @s hexcasting:quenched_allay_shard 16
say Hex: crafting table. Quenched allay shard is the late-game gate.
