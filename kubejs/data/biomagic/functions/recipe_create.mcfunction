# Bio-Magic — Create routes: capstone + Visceral Heap quarry (5 recipes)
#   /function biomagic:recipe_create
#
# Builds EAST of you (+X). Needs about 12 blocks of clear space.
#
# create/mutated_fiber              mixing HEATED: 2 biomass + claw_fragment -> 2
# create/flesh_bits_from_bop_flesh  crushing: BOP flesh -> 2 bits (+50% third)
# create/organic_matter_from_porous crushing: porous flesh -> bits + organic matter
# create/malignant_flesh_from_bop   compacting HEATED: 4 BOP flesh + bits + fibers
# create/evilcraft_blood_from_bop   mixing SUPERHEATED: 1000mB BOP blood
#                                   + 2 nether wart -> 250mB evilcraft blood
#
# HONEST NOTE: Create multiblocks need rotation and alignment that setblock
# can't reliably get right. The basins and lit burners are placed because
# those are positional and fiddly; the mixer, press, wheels and motors are
# given as items so you can place and power them yourself.
#
# Mixer and press each sit 2 blocks above their basin. Crushing wheels must be
# adjacent and counter-rotating. Creative motors power directly.
#
# The blood recipe stacks three failure points — bucketing BOP blood, achieving
# superheat, and the fluid conversion. If it fails, isolate which.

fill ~1 ~-1 ~-2 ~10 ~4 ~2 minecraft:air

# basin + lit burner, station A (mixing)
setblock ~2 ~-1 ~ create:lit_blaze_burner
setblock ~2 ~ ~ create:basin

# basin + lit burner, station B (compacting)
setblock ~6 ~-1 ~ create:lit_blaze_burner
setblock ~6 ~ ~ create:basin

clear @s
give @s create:mechanical_mixer 1
give @s create:mechanical_press 1
give @s create:crushing_wheel 2
give @s create:creative_motor 4
give @s create:shaft 16
give @s create:creative_blaze_cake 2
give @s spore:biomass 32
give @s spore:claw_fragment 16
give @s biomesoplenty:flesh 64
give @s biomesoplenty:porous_flesh 32
give @s biomesoplenty:blood_bucket 4
give @s minecraft:nether_wart 16
give @s biomancy:flesh_bits 16
give @s biomancy:tough_fibers 16

say Two basins with lit burners placed east.
say Mixer/press go 2 blocks above a basin. Creative blaze cake = superheat.
say Crushing wheels are yours to place — they need to counter-rotate.
