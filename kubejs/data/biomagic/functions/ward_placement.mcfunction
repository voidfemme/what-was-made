# Give necessary tools
give @s minecraft:netherite_sword
give @s minecraft:netherite_pickaxe
give @s minecraft:netherite_axe

# set up flat area to work with
fill ~-100 ~-1 ~-100 ~200 ~50 ~200 minecraft:air

# == Set up primordial cradle ward ==
fill ~ ~-1 ~ biomancy:primordial_cradle
data get block ~ ~-1 ~

# give items to feed primordial cradle
give @s minecraft:mutton 64
give @s minecraft:beef 64
give @s minecraft:porkchop 64
give @s minecraft:chicken 64
give @s minecraft:enchanted_golden_apple 64
give @s minecraft:rotten_flesh 64

# Create a Malum runewood totem
fill ~50 ~-1 ~    ~-50 ~-1 ~   malum:runewood_totem_base
fill ~50 ~ ~      ~-50 ~5 ~    malum:runewood_log
data get block ~-50 ~-1 ~
data get block ~-50 ~ ~
data get block ~-50 ~1 ~
data get block ~-50 ~2 ~
data get block ~-50 ~3 ~
data get block ~-50 ~4 ~

# Create a Malum soulwood totem
fill ~50 ~-1 ~50    ~-50 ~-1 ~50   malum:runewood_totem_base
fill ~50 ~ ~50      ~-50 ~5 ~50    malum:runewood_log
data get block ~-50 ~-1 ~
data get block ~-50 ~ ~
data get block ~-50 ~1 ~
data get block ~-50 ~2 ~
data get block ~-50 ~3 ~
data get block ~-50 ~4 ~

give @s malum:aerial_spirit 64
give @s malum:aqueous_spirit 64
give @s malum:arcane_spirit 64
give @s malum:earthen_spirit 64
give @s malum:eldritch_spirit 64
give @s malum:infernal_spirit 64
give @s malum:sacred_spirit 64
give @s malum:wicked_spirit 64

# Create a Botania mana pool
fill ~100 ~-1 ~ ~-100 ~-1 ~ botania:mana_pool{mana:100}
say figure out list of items to get for botania mod
