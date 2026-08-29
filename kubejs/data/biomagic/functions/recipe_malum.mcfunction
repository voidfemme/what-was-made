# Bio-Magic — Malum capstone routes (2 recipes)
#   /function biomagic:recipe_malum
#
# biomagic:malum/armor_fragment      4 claw_fragment + 2 processed_soulstone
#                                    + 8 wicked + 4 eldritch
# biomagic:malum/organoid_membrane   6 mutated_fiber + 1 hallowed_gold_ingot
#                                    + 8 eldritch + 4 earthen
#
# SETUP: place the Spirit Altar. Put the main input in the altar, the extra
# items on pedestals or thrown in, and feed the spirits.

clear @s
give @s malum:spirit_altar 1
give @s spore:claw_fragment 32
give @s spore:mutated_fiber 32
give @s malum:processed_soulstone 16
give @s malum:hallowed_gold_ingot 8
give @s malum:wicked_spirit 32
give @s malum:eldritch_spirit 32
give @s malum:earthen_spirit 32
say Malum: spirit altar. Wicked+eldritch for fragments, eldritch+earthen for membrane.
