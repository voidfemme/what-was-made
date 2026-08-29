# Bio-Magic — Create routes: capstone + Visceral Heap quarry (5 recipes)
#   /function biomagic:recipe_create
#
# biomagic:create/mutated_fiber                 mixing HEATED: 2 biomass + claw_fragment -> 2
# biomagic:create/flesh_bits_from_bop_flesh     crushing: BOP flesh -> 2 flesh_bits (+50% third)
# biomagic:create/organic_matter_from_porous    crushing: porous flesh -> bits + organic matter
# biomagic:create/malignant_flesh_from_bop      compacting HEATED: 4 BOP flesh + bits + tough fibers
# biomagic:create/evilcraft_blood_from_bop      mixing SUPERHEATED: 1000mB BOP blood
#                                               + 2 nether wart -> 250mB evilcraft blood
#
# Three separate setups: crushing wheels, and a basin under a mixer, and a
# basin under a press. Creative blaze cake gives permanent superheat, which the
# blood recipe needs.
#
# NOTE the blood recipe has three stacked failure points — bucketing BOP blood,
# the superheat, and the fluid conversion. If one fails it may look like all did.

clear @s
give @s create:crushing_wheel 2
give @s create:basin 2
give @s create:mechanical_mixer 1
give @s create:mechanical_press 1
give @s create:blaze_burner 1
give @s create:creative_blaze_cake 1
give @s create:creative_motor 2
give @s spore:biomass 32
give @s spore:claw_fragment 16
give @s biomesoplenty:flesh 64
give @s biomesoplenty:porous_flesh 32
give @s biomesoplenty:blood_bucket 4
give @s minecraft:nether_wart 16
give @s biomancy:flesh_bits 16
give @s biomancy:tough_fibers 16
say Create: crushing wheels, basin+mixer, basin+press.
say Creative blaze cake in the burner = permanent superheat.
