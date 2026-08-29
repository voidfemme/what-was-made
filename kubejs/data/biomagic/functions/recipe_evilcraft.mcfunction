# Bio-Magic — EvilCraft capstone routes (2 recipes)
#   /function biomagic:recipe_evilcraft
#
# biomagic:evilcraft/armor_fragment     tier 1: claw_fragment + 4000mB blood
# biomagic:evilcraft/organoid_membrane  tier 2: mutated_fiber + 12000mB blood
#
# NOTE the tier difference. The membrane recipe needs a Blood Infuser upgraded
# to tier 2, so if only the fragment recipe works, that's the reason.

clear @s
give @s evilcraft:blood_infuser 2
give @s spore:claw_fragment 16
give @s spore:mutated_fiber 16
give @s evilcraft:dark_tank 1
say EvilCraft: blood infuser + blood. Membrane needs TIER 2.
say Fill the infuser with blood first — 4000mB and 12000mB respectively.
