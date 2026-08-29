# Bio-Magic — Occultism capstone routes (2 recipes)
#   /function biomagic:recipe_occultism
#
# biomagic:occultism/armor_fragment     spirit_fire: claw_fragment
# biomagic:occultism/organoid_membrane  spirit_trade: mutated_fiber + otherstone
#
# KNOWN ISSUE: the spirit_trade recipe loads without error but has NO JEI
# category, because spirit trades are consumed by a summoned trader rather than
# a machine. This function is also the test for whether it works at all.
#
# SETUP: place Spirit Fire, throw claw fragments into it.

clear @s
give @s occultism:spirit_fire 4
give @s occultism:otherstone 16
give @s spore:claw_fragment 16
give @s spore:mutated_fiber 16
say Occultism: place spirit fire, throw claw fragments in.
say The membrane recipe needs a summoned trader — this is the untested one.
