# Bio-Magic — EvilCraft capstone routes (2 recipes)
#   /function biomagic:recipe_evilcraft
#
# Builds EAST of you (+X).
#
# armor_fragment     TIER 1: claw_fragment + 4000mB blood
# organoid_membrane  TIER 2: mutated_fiber + 12000mB blood
#
# Note the tier difference. If only the fragment recipe works, the infuser
# needs upgrading — that's the reason, not a broken recipe.
#
# The infuser needs filling with blood first. Dark tank given for transport.

fill ~1 ~ ~-1 ~4 ~1 ~1 minecraft:air
setblock ~2 ~ ~ evilcraft:blood_infuser

clear @s
give @s spore:claw_fragment 16
give @s spore:mutated_fiber 16
give @s evilcraft:dark_tank 2

say Blood infuser placed east. Fill it with blood before testing.
say Membrane recipe needs TIER 2 — upgrade the infuser for that one.
