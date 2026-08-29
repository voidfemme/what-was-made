# Bio-Magic — tear down the conversion test pad
#   /function biomagic:testpad_clear
#
# Kills any mound within 16 blocks and clears the area. Blocks already converted
# are removed with everything else.
#
# Note: "Should Scampers summon Mounds on death?" is true in sporeconfig, so a
# passing Scamper can leave a mound you didn't place. This kills those too.

kill @e[type=spore:mound,distance=..16]
kill @e[type=spore:scamper,distance=..16]
fill ~-6 ~-1 ~-6 ~6 ~3 ~6 minecraft:air
say Test pad cleared.
