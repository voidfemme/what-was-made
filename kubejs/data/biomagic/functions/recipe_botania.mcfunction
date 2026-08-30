# Bio-Magic — Botania capstone routes (2 recipes)
#   /function biomagic:recipe_botania
#
# Builds EAST of you (+X). Stand clear before running.
#
# biomagic:botania/armor_fragment      claw_fragment + 30000 mana, Alchemy Catalyst
# biomagic:botania/organoid_membrane   mutated_fiber + 45000 mana, Conjuration Catalyst
#
# Catalyst goes DIRECTLY BELOW the pool. Throw the input item into the pool.

fill ~1 ~-1 ~-1 ~5 ~1 ~1 minecraft:air

# station 1 — alchemy
setblock ~2 ~-1 ~ botania:alchemy_catalyst
setblock ~2 ~ ~ botania:creative_pool

# station 2 — conjuration
setblock ~5 ~-1 ~ botania:conjuration_catalyst
setblock ~5 ~ ~ botania:creative_pool

clear @s
give @s spore:claw_fragment 16
give @s spore:mutated_fiber 16

say Two creative pools placed east, catalysts underneath.
say Throw claw fragments in the alchemy one, mutated fibre in the conjuration one.
