# Bio-Magic — Biomancy routes + mosquito larva (3 recipes)
#   /function biomagic:recipe_biomancy
#
# biomagic:biomancy/armor_fragment     2 claw_fragment + 8 bone_fragments
#                                      + 8 tough_fibers, 100 nutrients -> 1
#                                      (REBALANCED from 3 out — check it's 1)
# biomagic:biomancy/organoid_membrane  4 mutated_fiber + living_flesh
#                                      + 12 elastic_fibers, 120 nutrients -> 2
# biomagic:biomancy/mosquito_larva     acidic_egg + 4 flesh_bits
#                                      + 2 elastic_fibers + toxin_gland, 20 -> 2
#
# SETUP: place the Bio-Forge and fill its nutrient reserve with nutrient paste.
# Living flesh has NO crafting recipe — it only drops from Flesh Blobs — so
# it's given here directly.

clear @s
give @s biomancy:bio_forge 1
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
say Biomancy: bio-forge, feed it nutrient paste first.
say Armor fragment should output 1, not 3 — that was the rebalance.
