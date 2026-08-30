# Bio-Magic — Malum capstone routes (2 recipes)
#   /function biomagic:recipe_malum
#
# Builds EAST of you (+X).
#
# armor_fragment      4 claw_fragment + 2 processed_soulstone + 8 wicked + 4 eldritch
# organoid_membrane   6 mutated_fiber + 1 hallowed_gold_ingot + 8 eldritch + 4 earthen

fill ~1 ~ ~-1 ~4 ~1 ~1 minecraft:air
setblock ~2 ~ ~ malum:spirit_altar

clear @s
give @s spore:claw_fragment 32
give @s spore:mutated_fiber 32
give @s malum:processed_soulstone 16
give @s malum:hallowed_gold_ingot 8
give @s malum:wicked_spirit 32
give @s malum:eldritch_spirit 32
give @s malum:earthen_spirit 32

say Spirit altar placed east. Main input in the altar, extras thrown in.
say Wicked+eldritch for fragments. Eldritch+earthen for membrane.
