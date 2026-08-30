# Bio-Magic — Occultism capstone routes (2 recipes)
#   /function biomagic:recipe_occultism
#
# Builds EAST of you (+X).
#
# armor_fragment     spirit_fire: throw claw_fragment in
# organoid_membrane  spirit_trade: mutated_fiber + otherstone
#
# EXPECTED TO PARTLY FAIL. spirit_trade recipes are consumed by a summoned
# trader, not a machine, which is why it has no JEI category. This function is
# the test for whether it works at all.

fill ~1 ~-1 ~-1 ~4 ~1 ~1 minecraft:air
setblock ~2 ~-1 ~ minecraft:netherrack
setblock ~2 ~ ~ occultism:spirit_fire

clear @s
give @s occultism:otherstone 16
give @s spore:claw_fragment 16
give @s spore:mutated_fiber 16

say Spirit fire placed east. Throw claw fragments into it.
say The membrane recipe needs a summoned trader — that's the untested half.
