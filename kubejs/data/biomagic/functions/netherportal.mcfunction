# portal.mcfunction — builds a lit nether portal 2 blocks north of where it's run
# Frame spans X, so the portal blocks are axis=x.

# 4 wide x 5 tall obsidian slab, corners included (harmless)
fill ~-1 ~ ~2 ~2 ~4 ~2 minecraft:obsidian

# hollow out the 2x3 interior and light it directly
fill ~ ~1 ~2 ~1 ~3 ~2 minecraft:nether_portal[axis=x]

# fallback lighter, in case you'd rather rebuild or move it
give @s minecraft:flint_and_steel 1
give @s minecraft:fire_charge 4
