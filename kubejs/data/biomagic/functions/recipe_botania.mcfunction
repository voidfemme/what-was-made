# Bio-Magic — Botania capstone routes (2 recipes)
#   /function biomagic:recipe_botania
#
# biomagic:botania/armor_fragment      claw_fragment  + 30000 mana over Alchemy Catalyst
# biomagic:botania/organoid_membrane   mutated_fiber  + 45000 mana over Conjuration Catalyst
#
# SETUP: place the Creative Pool (infinite mana), put the catalyst DIRECTLY
# BELOW it, then throw the input item into the pool.

clear @s
give @s botania:creative_pool 2
give @s botania:alchemy_catalyst 1
give @s botania:conjuration_catalyst 1
give @s spore:claw_fragment 16
give @s spore:mutated_fiber 16
say Botania: creative pool, catalyst underneath, throw the item in.
