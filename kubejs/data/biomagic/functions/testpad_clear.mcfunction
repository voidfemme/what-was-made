# Bio-Magic — tear down the conversion test pad
#   /function biomagic:testpad_clear

kill @e[type=spore:mound,distance=..16]
kill @e[type=spore:scamper,distance=..16]
fill ~-8 ~-1 ~-8 ~8 ~3 ~8 minecraft:air
say Test pad cleared.
