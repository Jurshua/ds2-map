import type { Enemy } from "./types";
import { FEX } from "./helpers";

/**
 * Farmable enemies and their documented drops (SotFS). Drop rates are only given where the wiki
 * states one. Most enemies stop respawning after ~12 kills (the wiki says 10–15); burning a Bonfire
 * Ascetic at the area's bonfire resets the counter (and raises the area's intensity), and members of
 * the Company of Champions have no spawn limit at all (since patch 1.10).
 */
export const DESPAWN_NOTE =
  "Normal enemies stop respawning after roughly 12 kills (wiki: 10–15). Burning a Bonfire Ascetic at a nearby bonfire respawns them permanently at the next NG intensity; joining the Company of Champions (Victor's Stone, Majula) removes the spawn limit entirely.";

const E = (e: Enemy): Enemy => e;

export const enemies: Enemy[] = [
  E({
    id: "en.falconer", name: "Falconer", areaIds: ["shaded", "tseldora", "things_betwixt"], node: "shaded.falconer_path", despawns: true,
    drops: [
      { item: "Falconer Armor / Gloves / Boots" },
      { item: "Sunlight Medal", rate: "~1%" },
    ],
    farmingNote: "Best spot: the left (Shrine of Winter) path from the Ruined Fork Road bonfire in the Shaded Woods, where five Falconers patrol in SotFS; also the Royal Army Campsite in Tseldora. Fextralife lists only their armor and Sunlight Medals as drops (no Petrified Dragon Bone).",
    source: FEX + "Falconer",
  }),
  E({
    id: "en.dragon_knight", name: "Dragon Knight", areaIds: ["dshrine"], node: "dshrine.stairs", despawns: true,
    drops: [
      { item: "Dragon Scale" },
      { item: "Black Dragon Warpick / Sword / Greataxe / Shield", note: "only from the knights wielding them" },
    ],
    farmingNote: "Nine knights line the great staircase before the Ancient Dragon (Shrine Entrance bonfire). They are passive in SotFS; only the top-middle one attacks unless you provoke them, summon a phantom or flee a Drakekeeper. Farm Dragon Scales for the Dragon Remnants covenant here.",
    source: FEX + "Dragon+Knight",
  }),
  E({
    id: "en.guardian_dragon_wyvern", name: "Guardian Dragon (Aerie wyverns)", areaIds: ["aerie"], node: "aerie.dragon1", despawns: false,
    drops: [
      { item: "Fire Tempest", note: "non-boss wyverns" },
      { item: "Twinkling Titanite", rate: "random" },
      { item: "Petrified Dragon Bone", rate: "random" },
    ],
    farmingNote: "The three nesting dragons in the Dragon Aerie do not respawn without a Bonfire Ascetic at the Dragon Aerie bonfire; higher bonfire intensity raises their drop rates. The 11 Crystal Lizards around them give a fixed 6–10 Twinkling Titanite and 6–10 Petrified Dragon Bone per Ascetic loop.",
    source: FEX + "Guardian+Dragon",
  }),
  E({
    id: "en.sanctum_knight", name: "Sanctum Knight", areaIds: ["sanctum"], node: "sanctum.key_room", despawns: true,
    drops: [
      { item: "Sanctum Knight Set" },
      { item: "Sanctum Crossbow" },
      { item: "Sanctum Repeating Crossbow" },
      { item: "Repair Powder" },
    ],
    farmingNote: "Spectral until their armour statues are broken (immune to physical damage, weak to backstabs once visible). The three-knight room where the Eternal Sanctum Key lies (Hidden Sanctum Chamber bonfire) is the densest spot.",
    source: FEX + "Sanctum+Knight",
  }),
  E({
    id: "en.alonne_knight", name: "Alonne Knight", areaIds: ["iron_keep", "mem_oik"], node: "ik.scenic", despawns: true,
    drops: [
      { item: "Alonne Knight Set" },
      { item: "Blacksteel Katana" },
      { item: "Alonne Greatbow" },
      { item: "Iron Greatarrow" },
      { item: "Destructive Greatarrow" },
    ],
    farmingNote: "Everywhere in Iron Keep (450 souls each in NG). The rooftop with three knights on the scenic route and the Memory of the Old Iron King's great hall are the densest. Fextralife lists no titanite drops for them; farm chunks from Gyrm Warriors, Coal Tars or Possessed Armors instead.",
    source: FEX + "Alonne+Knight",
  }),
  E({
    id: "en.alonne_captain", name: "Alonne Knight Captain", areaIds: ["iron_keep", "drangleic", "mem_oik"], node: "ik.furnace", despawns: true,
    drops: [
      { item: "Blacksteel Katana" },
      { item: "Alonne Captain Helm / Armor, Alonne Knight Gauntlets / Leggings" },
      { item: "Alonne Greatbow" },
      { item: "Monastery Charm" },
      { item: "Destructive Greatarrow", note: "x3" },
      { item: "Awestone", note: "Company of Champions members only" },
    ],
    farmingNote: "Greatbow captains snipe from the furnace-room ladders and the lever hall; 1,500 souls each in NG. Awestones for the Company of Champions drop here.",
    source: FEX + "Alonne+Knight+Captain",
  }),
  E({
    id: "en.iron_warrior", name: "Iron Warrior", areaIds: ["brume", "iron_passage"], node: "brume.tower_key_field", despawns: true,
    drops: [
      { item: "Smelter Hammer" },
      { item: "Minotaur Helm" },
      { item: "Firedrake Stone" },
      { item: "Titanite Slab", rate: "rare" },
    ],
    farmingNote: "Headless lava giants. Three emerge from the ash field below the Foyer elevator (Tower Key field); two guard the Lowermost Floor bonfire. Barrel Carriers or flame jets kill them quickly. Rare Titanite Slab drop.",
    source: FEX + "Iron+Warrior",
  }),
  E({
    id: "en.ashen_warrior", name: "Ashen Warrior", areaIds: ["brume", "iron_passage"], node: "brume.idol_hall", despawns: true,
    drops: [
      { item: "Ashen Warrior Sword / Battle Axe / Halberd", note: "by wielder" },
      { item: "Charcoal Pine Resin" },
      { item: "Small Orange Burr" },
    ],
    farmingNote: "Rise from the ash fields all over Brume Tower; the Ashen Idol hall below the Throne Floor and the Iron Passage cells hold groups of four.",
    source: FEX + "Ashen+Warrior",
  }),
  E({
    id: "en.fume_sorcerer", name: "Fume Sorcerer", areaIds: ["brume", "iron_passage"], node: "brume.scepter_route", despawns: true,
    drops: [
      { item: "Fume Sorcerer Set" },
      { item: "Blue Dagger" },
      { item: "Umbral Dagger" },
    ],
    farmingNote: "Teleporting dagger casters along the fire-head halls on the Scorching Iron Scepter route and in the Iron Passage. Low poise; stunlock them or backstab.",
    source: FEX + "Fume+Sorcerer",
  }),
  E({
    id: "en.charred_loyce", name: "Charred Loyce Knight", areaIds: ["old_chaos"], node: "oc.arena", despawns: true,
    drops: [
      { item: "Loyce Soul" },
      { item: "Charred Loyce Greatsword / Shield" },
      { item: "Charred Loyce Helm / Armor / Gauntlets / Leggings" },
    ],
    farmingNote: "Spawn from the three portals in the Old Chaos until your Loyce Knights seal them; after the Burnt Ivory King they keep respawning (about 45 times) for Loyce Souls (35 for the Loyce Set, 50 for Alsanna's soul). Drops also count when summoned as a phantom.",
    source: FEX + "Charred+Loyce+Knight",
  }),
  E({
    id: "en.steelworker", name: "Undead Steelworker", areaIds: ["harvest", "earthen"], node: "harvest.peak_gate", despawns: true,
    drops: [
      { item: "Titanite Shard" },
      { item: "Old Mundane Stone" },
      { item: "Small Smooth & Silky Stone" },
    ],
    farmingNote: "Hammer giants in the poison-urn yard before Earthen Peak and inside the Peak. Let them smash the poison urns and die to their own poison. 400 souls in NG.",
    source: FEX + "Undead+Steelworker",
  }),
  E({
    id: "en.old_knight", name: "Old Knight", areaIds: ["heides"], node: "heide.three_knights", despawns: true,
    drops: [
      { item: "Old Knight Greatsword / Ultra Greatsword / Hammer" },
      { item: "Old Knight Set" },
      { item: "Old Knight Shield" },
      { item: "Cracked Blue Eye Orb" },
      { item: "Palestone" },
      { item: "Human Effigy" },
      { item: "Amber Herb / Green Blossom" },
    ],
    farmingNote: "Slow brass giants of Heide's Tower of Flame (400 souls). Weak to strike and magic. The tower with three knights past the first lever is the best cluster; they despawn after ~12 kills each.",
    source: FEX + "Old+Knight",
  }),
  E({
    id: "en.heide_knight", name: "Heide Knight", areaIds: ["heides", "bastille", "winter", "gutter", "sinners_rise"], node: "heide.entrance", despawns: true,
    drops: [
      { item: "Heide Knight Sword", note: "Forest of Fallen Giants (vanilla only)" },
      { item: "Heide Spear", note: "Lost Bastille / Sinners' Rise" },
      { item: "Heide Lance", note: "Shrine of Winter, The Gutter (SotFS)" },
      { item: "Heide Knight Set" },
    ],
    farmingNote: "Passive until attacked (or until the Dragonrider dies in Heide's, where SotFS adds four respawning knights). 3,000 souls each in NG. Their weapon depends on the location.",
    source: FEX + "Heide+Knight",
  }),
  E({
    id: "en.royal_swordsman", name: "Royal Swordsman", areaIds: ["fofg", "bastille", "drangleic", "winter"], node: "bast.swarm_room", despawns: true,
    drops: [
      { item: "Royal Swordsman Set" },
      { item: "Heavy Crossbow", note: "crossbow wielders" },
      { item: "Royal Greatsword" },
      { item: "Lifegem" },
      { item: "Common Fruit" },
    ],
    farmingNote: "The swarm room before the Ruin Sentinels (Lost Bastille) holds the biggest group; the castle variants hit harder. 180–200 souls.",
    source: FEX + "Royal+Swordsman",
  }),
  E({
    id: "en.syan_soldier", name: "Syan Soldier", areaIds: ["fofg", "heides", "copse", "drangleic", "shaded"], node: "dc.foyer", despawns: true,
    drops: [
      { item: "Syan's Set" },
      { item: "Syan's Halberd" },
      { item: "Greatsword" },
      { item: "Green Blossom" },
      { item: "Monastery Charm" },
      { item: "Mastodon Greatsword / Greatshield", note: "Drangleic Castle statue variants" },
    ],
    farmingNote: "Living statues in Drangleic Castle's halls (900–1,100 souls); single guards elsewhere (King's Gate courtyard, Sublime Bone Dust chests).",
    source: FEX + "Syan+Soldier",
  }),
  E({
    id: "en.drakekeeper", name: "Drakekeeper", areaIds: ["dshrine"], node: "dshrine.lower", despawns: true,
    drops: [
      { item: "Drakekeeper Set", rate: "rare" },
      { item: "Drakekeeper's Sword / Great Hammer / Warpick / Ultra Greatsword", rate: "very rare", note: "by wielder" },
      { item: "Drakekeeper's Shield / Greatshield of Glory", rate: "rare / very rare" },
      { item: "Dragon Charm", rate: "uncommon" },
    ],
    farmingNote: "Four heavy guardians on the Dragon Shrine stairs (1,900 souls). Weak to strike, fire and lightning; fleeing from one turns the Dragon Knights hostile.",
    source: FEX + "Drakekeeper",
  }),
  E({
    id: "en.gyrm_warrior", name: "Gyrm Warrior", areaIds: ["pharros"], node: "pharros.upper", despawns: true,
    drops: [
      { item: "Gyrm Warrior Set / Greathelm" },
      { item: "Gyrm Great Hammer / Greatshield / Greataxe" },
      { item: "Titanite Chunk", rate: "~3% with item-discovery gear" },
      { item: "Magic Stone" },
      { item: "Old Mundane Stone" },
    ],
    farmingNote: "Doors of Pharros second level (Ordeal's End bonfire) has the most Gyrm Warriors; ~3% Titanite Chunk with Jester's Cap, Prisoner's Tatters and Covetous Gold Serpent Ring +2.",
    source: FEX + "Gyrm+Warrior",
  }),
  E({
    id: "en.hollow_infantry", name: "Hollow Infantry", areaIds: ["fofg", "heides"], node: "fofg.rotunda", despawns: true,
    drops: [
      { item: "Hollow Infantry Set" },
      { item: "Short Bow / Infantry Axe / Bandit's Knife / Foot Soldier Sword / Foot Soldier Shield" },
      { item: "Throwing Knife / Fire Arrow" },
      { item: "Lifegem" },
    ],
    farmingNote: "Twelve play dead in the Mossy Rotunda near the Crestfallen's Retreat bonfire. Early Lifegem source (50 souls each).",
    source: FEX + "Hollow+Infantry",
  }),
  E({
    id: "en.flame_salamander", name: "Flame Salamander", areaIds: ["fofg", "mem_oik"], node: "fofg.lizard_pit", despawns: true,
    drops: [
      { item: "Cracked Red Eye Orb" },
      { item: "Fireball / Fire Orb / Great Fireball", rate: "rare" },
    ],
    farmingNote: "Four in the Flame Lizard pit below the Cardinal Tower bridge (Iron Key door from the Last Giant tunnel). 900 souls each; poison arrows from the bridge work well.",
    source: FEX + "Flame+Salamander",
  }),
  E({
    id: "en.leydia_pyromancer", name: "Leydia Pyromancer", areaIds: ["crypt"], node: "crypt.velstadt", despawns: false,
    drops: [
      { item: "Leydia White Set" },
      { item: "Blue Flame" },
      { item: "Magic Shield" },
      { item: "Darknight Stone" },
      { item: "Faintstone" },
      { item: "Magic Stone" },
    ],
    farmingNote: "Respawn endlessly from their sword statues whenever a bell rings; 380 souls each. Best farm: leave the bell hollow alive in the hallway before Velstadt's arena and snipe the pyromancers from the pillared hall (Faintstone and Darknight Stone).",
    source: FEX + "Leydia+Pyromancer",
  }),
  E({
    id: "en.leydia_witch", name: "Leydia Witch", areaIds: ["crypt"], node: "crypt.witches", despawns: true,
    drops: [
      { item: "Leydia Black Set" },
      { item: "Black Witch's Staff" },
      { item: "Dark Quartz Ring +2" },
      { item: "Simpleton's Spice / Skeptic's Spice" },
      { item: "Magic Stone" },
    ],
    farmingNote: "Two in the hall past the first Imperious Knight (Undead Crypt Entrance) and one guarding the Dried Fingers chest. 1,100 souls.",
    source: FEX + "Leydia+Witch",
  }),
  E({
    id: "en.grave_warden", name: "Grave Warden", areaIds: ["earthen", "crypt"], node: "earthen.windmill", despawns: true,
    drops: [
      { item: "Grave Warden Set" },
      { item: "Silverblack Spear / Silverblack Sickle" },
      { item: "Silverblack Shield" },
    ],
    farmingNote: "Shield-heavy Fenito knights on Earthen Peak's walkways (Lower and Central bonfires) and around Agdayne. Guard-break them; they heal at low HP.",
    source: FEX + "Grave+Warden",
  }),
  E({
    id: "en.dragon_acolyte", name: "Dragon Acolyte", areaIds: ["aldias", "tseldora"], node: "aldias.cage_hall", despawns: true,
    drops: [
      { item: "Petrified Dragon Bone", rate: "good drop rate (NG and NG+)" },
      { item: "Dragon Acolyte Set" },
      { item: "Witching Urn" },
    ],
    farmingNote: "Fextralife's recommended Petrified Dragon Bone farm without Ascetics: the acolytes behind the paintings in the cage hall and in the Aldia Key room (Ritual Site bonfire). Company of Champions makes them unlimited.",
    source: FEX + "Petrified+Dragon+Bone",
  }),
  E({
    id: "en.imperfect", name: "The Imperfect", areaIds: ["sanctum"], node: "sanctum.lair", despawns: true,
    drops: [
      { item: "Petrified Dragon Bone", rate: "relatively high" },
      { item: "Titanite Slab", rate: "rare" },
      { item: "Twinkling Titanite" },
      { item: "Dragon Scale" },
    ],
    farmingNote: "Four wade in the shallow water around the Lair of the Imperfect bonfire. Rest and repeat for Petrified Dragon Bones, Twinkling Titanite and the occasional Slab; item-discovery gear helps.",
    source: FEX + "Petrified+Dragon+Bone",
  }),
  E({
    id: "en.frozen_reindeer", name: "Frozen Reindeer", areaIds: ["frigid"], node: "frigid.ruins", despawns: true,
    drops: [
      { item: "Petrified Dragon Bone", rate: "~5%" },
      { item: "Bone Fist", rate: "rare" },
    ],
    farmingNote: "Spawn with every blizzard in the Frigid Outskirts (about 17 after the first ruin, 22 after the second, 30 before the bridge) and then stop for good.",
    source: FEX + "Frigid+Outskirts",
  }),
  E({
    id: "en.coal_tar", name: "Coal Tar / Darksucker", areaIds: ["gulch", "gutter"], node: "gulch.oil_field", despawns: true,
    drops: [
      { item: "Titanite Chunk", rate: "5%" },
      { item: "Large Titanite Shard", rate: "10%" },
    ],
    farmingNote: "Hide in the tar pools of the Black Gulch; igniting the oil kills them without a fight (drops still land). Black Gulch Mouth bonfire is next to the first pools.",
    source: FEX + "Titanite+Chunk",
  }),
  E({
    id: "en.stone_soldier", name: "Stone Soldier", areaIds: ["drangleic"], node: "dc.golem_hall", despawns: false,
    drops: [
      { item: "Titanite Slab", rate: "rare" },
      { item: "Stone Soldier Spear" },
      { item: "Stone Twinblade" },
    ],
    farmingNote: "Respawn infinitely in the golem door hall by the King's Gate bonfire; kill them beside the golems to open the doors. Rare Titanite Slab drop; the Ruin Sentinels behind the doors also respawn and drop their armour.",
    source: FEX + "Drangleic+Castle",
  }),
  E({
    id: "en.amana_priestess", name: "Amana Shrine Maiden / Archdrake Pilgrim", areaIds: ["amana"], node: "amana.second_cavern", despawns: true,
    drops: [
      { item: "Twinkling Titanite" },
      { item: "Archdrake Set / Amana Shrine Maiden gear" },
    ],
    farmingNote: "Fextralife calls the Archdrake Pilgrims and Priestesses of the Shrine of Amana the best Twinkling Titanite farm without Ascetics, especially in the Company of Champions (infinite respawns). Crumbled Ruins and Rhoy's Resting Place bonfires.",
    source: FEX + "Twinkling+Titanite",
  }),
  E({
    id: "en.rampart_golem", name: "Rampart Golem", areaIds: ["eleum", "frigid"], node: "eleum.golem_yard", despawns: true,
    drops: [
      { item: "Twinkling Titanite" },
      { item: "Ivory King gear (rare)" },
    ],
    farmingNote: "Lance-wielding golems guarding Eleum Loyce's gates and the Azal's Staff bridge; drop Twinkling Titanite.",
    source: FEX + "Twinkling+Titanite",
  }),
  E({
    id: "en.crystal_lizard", name: "Crystal Lizard", areaIds: ["fofg", "wharf", "copse", "harvest", "iron_keep", "winter", "tseldora", "aerie", "drest", "brume", "shaded"], node: "aerie.dragon3", despawns: true,
    drops: [
      { item: "Titanite Shard / Large Titanite Shard / Chunk / Slab" },
      { item: "Twinkling Titanite" },
      { item: "Petrified Dragon Bone" },
      { item: "Element stones" },
    ],
    farmingNote: "Fixed drops per lizard; they flee after ~6 seconds and never respawn once killed (they do respawn if they escape). The Dragon Aerie's 11 lizards are the classic Ascetic loop; Dragon's Rest hides four behind the floor switch.",
    source: FEX + "Crystal+Lizard",
  }),
  E({
    id: "en.undead_devourer", name: "Undead Devourer (pig)", areaIds: ["majula", "tseldora"], node: "maj.village", despawns: true,
    drops: [
      { item: "Cracked Red Eye Orb" },
    ],
    farmingNote: "Three pigs in the mud patch by Majula's houses. SotFS: after 12 kills they become two boars, then one huge boar that drops 3 Cracked Red Eye Orbs and never returns.",
    source: "http://darksouls2.wikidot.com/scholar-of-the-first-sin",
  }),
  E({
    id: "en.hollow_peasant", name: "Hollow Peasant", areaIds: ["tseldora"], node: "tseld.campsite", despawns: true,
    drops: [
      { item: "Titanite Chunk", rate: "~3%" },
      { item: "Peasant tools" },
    ],
    farmingNote: "Curse-inflicting peasants around the Royal Army Campsite; the three before the upper Prowling Magus gate seem to drop chunks more often. Not an efficient farm.",
    source: FEX + "Titanite+Chunk",
  }),
  E({
    id: "en.possessed_armor", name: "Possessed Armor", areaIds: ["brume", "iron_passage", "eleum"], node: "brume.patched_floors", despawns: true,
    drops: [
      { item: "Titanite Chunk" },
      { item: "Possessed Armor Sword / Shield" },
    ],
    farmingNote: "Rise from the ground on the patched-floor descent and by the big door in Brume Tower; explode Barrel Carriers next to them.",
    source: FEX + "Titanite+Chunk",
  }),
  E({
    id: "en.lizardman", name: "Amana Aberration (Lizardman)", areaIds: ["amana"], node: "amana.first_cavern", despawns: true,
    drops: [
      { item: "Human Effigy", rate: "fairly high" },
    ],
    farmingNote: "Water-dwellers with a tiny aggro range along the Shrine of Amana walkways; a good Human Effigy source near the Tower of Prayer bonfire.",
    source: FEX + "Shrine+of+Amana",
  }),
  E({
    id: "en.insolent_spirit", name: "Insolent Spirit", areaIds: ["crypt"], node: "crypt.lower_side", despawns: false,
    drops: [
      { item: "Insolent Set" },
    ],
    farmingNote: "Eleven non-respawning red phantoms appear across the Undead Crypt once you light the woman statue with a torch (SotFS). Reset with a Bonfire Ascetic.",
    source: "http://darksouls2.wikidot.com/scholar-of-the-first-sin",
  }),
  E({
    id: "en.great_basilisk_copse", name: "Great Basilisk (Copse)", areaIds: ["copse"], node: "copse.lower_cave", despawns: true,
    drops: [
      { item: "Large Titanite Shard", note: "x3" },
    ],
    farmingNote: "Lower moth cave below the Bridge Approach bonfire; drops three Large Titanite Shards.",
    source: FEX + "Huntsman's+Copse",
  }),
  E({
    id: "en.ruin_sentinel", name: "Ruin Sentinel (castle)", areaIds: ["drangleic"], node: "dc.golem_hall", despawns: true,
    drops: [
      { item: "Ruin Sentinel Set" },
      { item: "Ruin Sentinel Soul (boss only)" },
    ],
    farmingNote: "One waits behind each golem door in the King's Gate hall; kite them into the bonfire corridor. They respawn in NG (reports vary for NG+).",
    source: FEX + "Drangleic+Castle",
  }),
  E({
    id: "en.giant_gulch", name: "Giant (Black Gulch)", areaIds: ["gulch"], node: "gulch.forgotten_door", despawns: false,
    drops: [
      { item: "Soul of a Giant", note: "first kill only" },
      { item: "Forgotten Key", note: "first kill only" },
    ],
    farmingNote: "The two Giants under the Forgotten Door respawn (good souls with a soul-boost set) but only drop loot on the first kill. Very weak to poison.",
    source: FEX + "Black+Gulch",
  }),
  E({
    id: "en.giant_lord_farm", name: "Giant Lord (Ascetic farm)", areaIds: ["mem_jeigh"], node: "mem_jeigh.giant_lord", despawns: false,
    drops: [
      { item: "Giant Lord Soul" },
      { item: "Bonfire Ascetic (on the wall)", note: "respawns with each Ascetic" },
    ],
    farmingNote: "Burn a Bonfire Ascetic at The Place Unbeknownst, run the memory in 3–4 minutes, pick up the Ascetic on the battlement and repeat: the best soul farm in the game (up to ~540,000 souls per run at +7 intensity with Nahr Alma / Tseldora soul gear).",
    source: FEX + "Memory+of+Jeigh",
  }),
];
