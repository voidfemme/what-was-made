# Bio-Magic — Biomancy routes + mosquito larva (3 recipes)
#   /function biomagic:recipe_biomancy
#
# Builds EAST of you (+X).
#
# armor_fragment     2 claw_fragment + 8 bone_fragments + 8 tough_fibers,
#                    100 nutrients -> 1   (REBALANCED from 3 — CHECK THIS)
# organoid_membrane  4 mutated_fiber + living_flesh + 12 elastic_fibers,
#                    120 nutrients -> 2
# mosquito_larva     acidic_egg + 4 flesh_bits + 2 elastic_fibers
#                    + toxin_gland, 20 nutrients -> 2
#
# Feed the Bio-Forge nutrient paste first — nutrients are its fuel, not an
# ingredient. Living flesh has NO crafting recipe anywhere; it only drops from
# Flesh Blobs, so it's given directly here.

fill ~1 ~ ~-1 ~4 ~1 ~1 minecraft:air
setblock ~2 ~ ~ biomancy:bio_forge

clear @s
give @s biomancy:nutrient_paste 64
give @s spore:claw_fragment 16
give @s spore:mutated_fiber 32
give @s biomancy:bone_fragments 32
give @s biomancy:tough_fibers 32
give @s biomancy:elastic_fibers 32
give @s biomancy:living_flesh 8
give @s biomancy:acidic_egg 8
give @s biomancy:flesh_bits 32
give @s biomancy:toxin_gland 8

say Bio-Forge placed east. Feed it nutrient paste first.
say WATCH THE ARMOR FRAGMENT OUTPUT — should be 1, not 3.
