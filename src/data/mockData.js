// Demo-mode content. This is what the site shows when Firebase isn't configured
// yet, and doubles as the source pushed into Firestore by scripts/seed.js.
//
// scripts/seed.js now skips any document whose ID already exists in
// Firestore — it only ever CREATES documents that are missing, never
// overwrites live-edited content. That means running `npm run seed` is
// safe to do any time you need to push new content added to this file
// (like a new NPC drafted elsewhere and pasted in here), without any risk
// to existing map positions, tree layouts, or anything else already live.
//
// Reconciled 2026-07-09T18:23:46.867Z against a full export of the live
// Firestore project, so existing IDs here match the real documents. New
// content that isn't live yet keeps descriptive kebab-case IDs (e.g.
// 'bld-thistlebrook-warren') until it's seeded, at which point that
// becomes its real, permanent Firestore ID too (seed.js uses these exact
// IDs, it doesn't generate random ones — so these ARE final).

export const mockBuildings = [
  {
    "id": "2K2EkC5QyMPtCppGeiFo",
    "description": "",
    "subheader": "Temple to Sylvanus",
    "icon": "",
    "services": [],
    "menu": [],
    "quadrant": "inhabited",
    "residents": [],
    "interiorLayoutImage": "",
    "priceMultiplier": 1.5,
    "type": "Shrine",
    "coords": {
      "y": 72.8,
      "x": 20.8
    },
    "name": "The Oakenhall",
    "wares": []
  },
  {
    "id": "8tyssIjcNiecXRFTgsn2",
    "interiorLayoutImage": "",
    "quadrant": "inhabited",
    "residents": [],
    "type": "Shop",
    "priceMultiplier": 1.5,
    "coords": {
      "y": 62.4,
      "x": 85.4
    },
    "revealed": false,
    "wares": [],
    "name": "The Sharp Cleaver",
    "description": "",
    "subheader": "Butcher's Shop",
    "services": [],
    "icon": "",
    "menu": []
  },
  {
    "id": "9DVdbDyeq4AHI0F7lzNW",
    "priceMultiplier": 1.5,
    "type": "Shop",
    "interiorLayoutImage": "",
    "residents": [],
    "quadrant": "inhabited",
    "name": "Lavender and Dragon Thistle Apothecary",
    "wares": [
      {
        "name": "Alchemist's Fire (flask)",
        "description": "Ignites on impact and keeps burning.",
        "priceOverride": "",
        "quantity": 1,
        "basePrice": 50,
        "rowId": "row-1783489956465-s0iei"
      },
      {
        "name": "Antitoxin (vial)",
        "description": "A bitter draught said to fight off poison.",
        "priceOverride": "",
        "basePrice": 50,
        "quantity": 1,
        "rowId": "row-1783489961736-y612y"
      },
      {
        "description": "Sealed and corrosive; handle it carefully.",
        "priceOverride": "",
        "rowId": "row-1783489971862-ojgkm",
        "quantity": 1,
        "basePrice": 25,
        "name": "Acid (vial)"
      },
      {
        "name": "Perfume (vial)",
        "description": "A small luxury, imported at a markup.",
        "priceOverride": "",
        "rowId": "row-1783489995020-aldh0",
        "quantity": 1,
        "basePrice": 5
      },
      {
        "quantity": 1,
        "basePrice": 50,
        "rowId": "row-1783490000882-xyy08",
        "description": "A ruby-red draught that knits wounds quickly.",
        "priceOverride": "",
        "name": "Potion of Healing"
      },
      {
        "name": "Oil (flask)",
        "priceOverride": "",
        "description": "Burns well in a lamp, or thrown at something worse.",
        "rowId": "row-1783490025349-q7ou2",
        "quantity": 1,
        "basePrice": 0.1
      },
      {
        "priceOverride": "",
        "description": "Bandages, salves, and splints for field treatment.",
        "quantity": 1,
        "basePrice": 5,
        "rowId": "row-1783490030370-qz7nb",
        "name": "Healer's Kit"
      },
      {
        "basePrice": 5,
        "quantity": 1,
        "rowId": "row-1783490033415-9vexc",
        "description": "Pouches and tools for gathering and treating herbs.",
        "priceOverride": "",
        "name": "Herbalism Kit"
      },
      {
        "name": "Poisoner's Kit",
        "priceOverride": "",
        "description": "Vials and tools for handling toxins safely — or not.",
        "quantity": 1,
        "basePrice": 50,
        "rowId": "row-1783490037320-lqpeo"
      },
      {
        "name": "Alchemist's Supplies",
        "basePrice": 50,
        "quantity": 1,
        "rowId": "row-1783490054516-g4348",
        "priceOverride": "",
        "description": "Vials, burners, and reagents for basic alchemy."
      },
      {
        "name": "Brewer's Supplies",
        "rowId": "row-1783490058499-01r8m",
        "basePrice": 20,
        "quantity": 1,
        "description": "Everything needed to ferment a decent batch.",
        "priceOverride": ""
      }
    ],
    "coords": {
      "y": 41.3,
      "x": 75.7
    },
    "subheader": "Herbs, Potions, and Salves",
    "description": "",
    "menu": [],
    "icon": "",
    "services": []
  },
  {
    "id": "KM5xfMaXQiPBESP3ZeXt",
    "interiorLayoutImage": "",
    "quadrant": "inhabited",
    "residents": [
      "npc-pell-thistlebrook"
    ],
    "priceMultiplier": 1.5,
    "type": "Shop",
    "revealed": false,
    "coords": {
      "y": 53.7,
      "x": 86.2
    },
    "name": "Outrider's Scraps and Scabbards",
    "wares": [
      {
        "name": "Saddle, Riding",
        "rowId": "row-1783530868804-lat0x",
        "quantity": 6,
        "basePrice": 10,
        "priceOverride": "",
        "description": "A standard saddle for everyday travel."
      },
      {
        "name": "Leather Armor",
        "rowId": "row-1783530876096-68emg",
        "quantity": 1,
        "basePrice": 10,
        "description": "Boiled and shaped hide, light enough to move freely in.",
        "priceOverride": ""
      },
      {
        "name": "Studded Leather Armor",
        "rowId": "row-1783530879225-xyvoc",
        "basePrice": 45,
        "quantity": 1,
        "description": "Leather reinforced with rivets and small plates.",
        "priceOverride": ""
      },
      {
        "rowId": "row-1783530882900-dzc57",
        "quantity": 1,
        "basePrice": 5,
        "description": "Awls, needles, and a stretching frame.",
        "priceOverride": "",
        "name": "Leatherworker's Tools"
      }
    ],
    "description": "A working tannery and leatherworking shop where the local hunters come to sell their kills, post local bounties, and pick up jobs. The walls are all adorned with hunting trophies of all sizes, mostly stuffed heads on plaques. The back houses a large yard with several overturned logs split in half where  a few hunters skin their kills.",
    "subheader": "The local leatherworking shop and a make-shift Hunter's Guild",
    "icon": "",
    "services": [],
    "menu": []
  },
  {
    "id": "LgpXEydOUyVOhMGhbl1m",
    "wares": [],
    "name": "House of the Unsleeping Watcher",
    "menu": [],
    "services": [],
    "coords": {
      "y": 39.1,
      "x": 57.2
    },
    "type": "Shrine",
    "priceMultiplier": 1.5,
    "subheader": "Temple to Helm",
    "quadrant": "inhabited",
    "residents": [],
    "description": "",
    "interiorLayoutImage": ""
  },
  {
    "id": "bld-branners-cottage",
    "name": "Branner's Cottage",
    "wares": [],
    "menu": [],
    "services": [],
    "coords": {
      "y": 31.5,
      "x": 12.1
    },
    "priceMultiplier": 1.5,
    "type": "Residence",
    "subheader": "A Hunter's Retirement",
    "quadrant": "inhabited",
    "residents": [
      "npc-branner-vod"
    ],
    "interiorLayoutImage": "",
    "description": "A small, cluttered cottage near the Vod Homestead, packed with old hunting gear its owner refuses to part with."
  },
  {
    "id": "bld-crowing-cockatrice",
    "description": "A tavern built to serve a much larger town, now warmly overfull with the handful of regulars who keep its hearth lit. Most of its guest rooms are shuttered, but the common room still fills most nights.",
    "interiorLayoutImage": "",
    "residents": [
      "7QQFmwsWLScKMhf6E6kJ"
    ],
    "quadrant": "inhabited",
    "subheader": "Tavern & Inn",
    "type": "Tavern",
    "priceMultiplier": 1.5,
    "coords": {
      "y": 71,
      "x": 32
    },
    "services": [
      {
        "name": "Inn Stay, Modest (per night)",
        "priceOverride": "",
        "description": "A decent bed and a locked door.",
        "rowId": "row-1783490215799-19x7g",
        "quantity": 3,
        "basePrice": 0.5
      },
      {
        "name": "Inn Stay, Poor (per night)",
        "quantity": 5,
        "basePrice": 0.1,
        "rowId": "row-1783490219277-0ou3d",
        "priceOverride": "",
        "description": "A shared bunk in a room with several others."
      },
      {
        "name": "Messenger (per mile)",
        "rowId": "row-1783490231644-7rkv3",
        "quantity": "infinite",
        "basePrice": 0.02,
        "description": "Carries word or small parcels at a price per distance — a rare service this deep in the Marches.",
        "priceOverride": ""
      }
    ],
    "menu": [
      {
        "quantity": "infinite",
        "basePrice": 0.04,
        "rowId": "row-1783490206448-qcjm6",
        "priceOverride": "",
        "description": "The standard pour, brewed in-house.",
        "name": "Ale (mug)"
      },
      {
        "description": "Baked fresh most mornings.",
        "priceOverride": "",
        "basePrice": 0.02,
        "quantity": "infinite",
        "rowId": "row-1783490208907-0cd2z",
        "name": "Bread (loaf)"
      },
      {
        "priceOverride": "",
        "description": "One of the only Jalanthar is famous for, other than burning down of course.",
        "quantity": "infinite",
        "basePrice": 0.06,
        "rowId": "row-1783490322628-z3bh7",
        "name": "Jalanthar Ale (mug)"
      }
    ],
    "wares": [],
    "name": "The Thrice Crowned Cockatrice"
  },
  {
    "id": "bld-garrison-quarters",
    "description": "Repurposed from what was once a militia hall, this building now houses the permanent protective garrison assigned to Jalanthar.",
    "interiorLayoutImage": "",
    "residents": [
      "89lzexuOe7eJMOFcNBJJ"
    ],
    "quadrant": "inhabited",
    "subheader": "Town Guard Barracks and Offices",
    "type": "Garrison",
    "priceMultiplier": 1.5,
    "coords": {
      "y": 54.1,
      "x": 18.7
    },
    "services": [],
    "menu": [],
    "wares": [],
    "name": "Garrison Quarters"
  },
  {
    "id": "bld-jalanthar-schoolhouse",
    "wares": [],
    "name": "Jalanthar Schoolhouse",
    "menu": [],
    "services": [],
    "coords": {
      "y": 55.7,
      "x": 31.7
    },
    "type": "Civic",
    "priceMultiplier": 1.5,
    "subheader": "The Town Classroom",
    "residents": [],
    "quadrant": "inhabited",
    "description": "A single-room schoolhouse where Tana Pasho teaches the town's children their letters and numbers.",
    "interiorLayoutImage": ""
  },
  {
    "id": "bld-lu-tana-residence",
    "quadrant": "inhabited",
    "residents": [
      "npc-lu-pasho",
      "npc-tana-pasho",
      "npc-nyra-pasho"
    ],
    "interiorLayoutImage": "",
    "description": "A modest home shared by the Pasho couple and their infant daughter, books stacked in every room.",
    "priceMultiplier": 1.5,
    "type": "Residence",
    "subheader": "A Home Half Full of Books",
    "services": [],
    "coords": {
      "y": 68.3,
      "x": 10.3
    },
    "name": "Willowmere Cottage",
    "wares": [],
    "menu": []
  },
  {
    "id": "bld-magistrate-house",
    "residents": [
      "npc-magistrate",
      "08oteThmyEqNmQiTooc6",
      "PIAl7avdltjDfYdQCmTa",
      "owz4e8Fwl4k6dpnAJrXi"
    ],
    "quadrant": "inhabited",
    "description": "Originally built as a guildhall for a town three times Jalanthar's current size, this squared timber building now serves as both home and office for the magistrate. Its outer rooms sit empty and dust-sheeted; only the study and a single bedroom see regular use.",
    "interiorLayoutImage": "",
    "type": "Civic",
    "priceMultiplier": 1.5,
    "subheader": "Seat of Governance",
    "services": [],
    "coords": {
      "y": 22,
      "x": 24
    },
    "wares": [],
    "name": "Magistrate's House",
    "menu": []
  },
  {
    "id": "bld-met-pasho-residence",
    "subheader": "A Quiet Devotion",
    "type": "Residence",
    "priceMultiplier": 1.5,
    "description": "A small, quiet home kept by Met Pasho alone, sparsely decorated apart from a few devotional items.",
    "interiorLayoutImage": "",
    "residents": [
      "npc-met-pasho"
    ],
    "quadrant": "inhabited",
    "menu": [],
    "wares": [],
    "name": "The Hollow Bough",
    "coords": {
      "y": 70.6,
      "x": 8.4
    },
    "services": []
  },
  {
    "id": "bld-old-vod-house",
    "subheader": "Where the Ledgers Are Kept",
    "type": "Residence",
    "priceMultiplier": 1.5,
    "description": "Smaller and tidier than the main homestead, stacked with the ledgers and records its owner keeps for the magistrate.",
    "interiorLayoutImage": "",
    "quadrant": "inhabited",
    "residents": [
      "npc-senna-vod",
      "npc-aldous-vod"
    ],
    "menu": [],
    "wares": [],
    "name": "The Old Vod House",
    "coords": {
      "y": 85.5,
      "x": 80
    },
    "services": []
  },
  {
    "id": "bld-pasho-manor",
    "quadrant": "inhabited",
    "residents": [
      "npc-cassian-pasho",
      "npc-liora-pasho"
    ],
    "interiorLayoutImage": "",
    "description": "A large manor house that once held a household of servants and fine furnishings, now mostly empty rooms kept as presentable as its owners can manage.",
    "priceMultiplier": 1.5,
    "type": "Residence",
    "subheader": "Ancestral Home",
    "services": [],
    "coords": {
      "y": 85,
      "x": 34.4
    },
    "name": "Pasho Manor",
    "wares": [],
    "menu": []
  },
  {
    "id": "bld-rihlo-house",
    "residents": [
      "npc-krikas-rihlo",
      "npc-olma-rihlo",
      "npc-el-pasho"
    ],
    "quadrant": "inhabited",
    "interiorLayoutImage": "",
    "description": "An old, well-kept house at the edge of town, its garden unusually lush for the region — tended personally by its elven owner.",
    "priceMultiplier": 1.5,
    "type": "Residence",
    "subheader": "Where the Garden Never Wilts",
    "services": [],
    "coords": {
      "y": 84.1,
      "x": 21.8
    },
    "name": "Rihlo House",
    "wares": [],
    "menu": []
  },
  {
    "id": "bld-silverleaf-stage",
    "quadrant": "inhabited",
    "residents": [],
    "interiorLayoutImage": "",
    "description": "Jalanthar's first playhouse, funded and overseen by Lu Pasho and written for by his sister Ven. Construction is underway but not yet complete.",
    "priceMultiplier": 1.5,
    "type": "Civic",
    "subheader": "Playhouse (Under Construction)",
    "services": [],
    "coords": {
      "y": 94.6,
      "x": 62.6
    },
    "name": "The Silverleaf Stage",
    "wares": [],
    "menu": []
  },
  {
    "id": "bld-triad-shrine",
    "services": [
      {
        "name": "Minor spellcasting service",
        "basePrice": 10,
        "rowId": "seed-svc-1",
        "description": "A simple spell cast on your behalf, if someone capable is willing.",
        "priceOverride": ""
      }
    ],
    "coords": {
      "y": 40,
      "x": 50
    },
    "name": "Shrine of the Triad",
    "wares": [],
    "menu": [],
    "residents": [],
    "quadrant": "inhabited",
    "interiorLayoutImage": "",
    "description": "A modest shrine at the edge of the central plaza, tended without a proper cleric — the town relies on a lay caretaker and traveling priests passing the Moon Pass road.",
    "priceMultiplier": 1.5,
    "type": "Shrine",
    "subheader": "Helm, Ilmater, Torm"
  },
  {
    "id": "bld-ven-pasho-residence",
    "interiorLayoutImage": "",
    "description": "A cluttered single-room home, more workspace than living space — drafts of plays cover most surfaces.",
    "quadrant": "inhabited",
    "residents": [
      "npc-ven-pasho"
    ],
    "subheader": "Drafts and Ambition",
    "priceMultiplier": 1.5,
    "type": "Residence",
    "coords": {
      "y": 63.1,
      "x": 9.3
    },
    "services": [],
    "menu": [],
    "name": "The Inkwell",
    "wares": []
  },
  {
    "id": "bld-vod-homestead",
    "interiorLayoutImage": "",
    "description": "A sprawling, patched-together house at the edge of town, expanded haphazardly across four generations. Loud most nights.",
    "quadrant": "inhabited",
    "residents": [
      "npc-tomas-vod",
      "npc-ressa-vod",
      "npc-garrick-vod",
      "npc-finn-vod",
      "npc-emeric-vod",
      "npc-wren-vod"
    ],
    "subheader": "Family Seat",
    "priceMultiplier": 1.5,
    "type": "Residence",
    "coords": {
      "y": 70.8,
      "x": 76.1
    },
    "services": [],
    "menu": [],
    "name": "Vod Homestead",
    "wares": []
  },
  {
    "id": "xmZvRARmOG5P103hNS4J",
    "menu": [],
    "name": "Wares for the Clever Northman",
    "wares": [
      {
        "description": "A stout length of wood, favored by those who can't afford better.",
        "priceOverride": "",
        "rowId": "row-1783481011796-bdbb0",
        "basePrice": 0.1,
        "quantity": 13,
        "name": "Club"
      },
      {
        "name": "Dagger",
        "basePrice": 2,
        "quantity": 35,
        "rowId": "row-1783481014591-g809k",
        "description": "Light and easily concealed; a favorite backup blade.",
        "priceOverride": ""
      },
      {
        "name": "Greatclub",
        "quantity": 15,
        "basePrice": 0.2,
        "rowId": "row-1783481017261-j12mo",
        "description": "A heavy, roughly shaped bludgeon swung with both hands.",
        "priceOverride": ""
      },
      {
        "name": "Handaxe",
        "priceOverride": "",
        "description": "Small enough to throw, sharp enough to matter.",
        "basePrice": 5,
        "quantity": 8,
        "rowId": "row-1783481021137-kpur6"
      },
      {
        "name": "Javelin",
        "priceOverride": "",
        "description": "A simple thrown spear, cheap enough to lose in a fight.",
        "rowId": "row-1783481024237-5n51p",
        "quantity": 3,
        "basePrice": 0.5
      },
      {
        "name": "Spear",
        "description": "Reaches further than most blades and can be thrown in a pinch.",
        "priceOverride": "",
        "quantity": 5,
        "basePrice": 1,
        "rowId": "row-1783481035654-8ngby"
      },
      {
        "quantity": 2,
        "basePrice": 10,
        "rowId": "row-1783481048120-7dgt5",
        "description": "Boiled and shaped hide, light enough to move freely in.",
        "priceOverride": "",
        "name": "Leather Armor"
      },
      {
        "name": "Studded Leather Armor",
        "rowId": "row-1783481055359-aewcw",
        "quantity": 3,
        "basePrice": 45,
        "description": "Leather reinforced with rivets and small plates.",
        "priceOverride": ""
      },
      {
        "basePrice": 10,
        "quantity": 5,
        "rowId": "row-1783481060291-nn0rq",
        "priceOverride": "",
        "description": "Roughly cured furs and pelts, common among frontier trackers.",
        "name": "Hide Armor"
      },
      {
        "name": "Shield",
        "priceOverride": "",
        "description": "A wooden or metal shield strapped to the forearm.",
        "quantity": 2,
        "basePrice": 10,
        "rowId": "row-1783481068541-tp6j5"
      },
      {
        "priceOverride": "",
        "description": "Holds a fair amount of gear across the shoulders.",
        "quantity": 7,
        "basePrice": 2,
        "rowId": "row-1783481113112-fy8o0",
        "name": "Backpack"
      },
      {
        "name": "Ball Bearings (bag of 1,000)",
        "rowId": "row-1783481118303-6mtfj",
        "basePrice": 1,
        "quantity": 6,
        "priceOverride": "",
        "description": "Scattered underfoot to put anyone chasing off balance."
      },
      {
        "priceOverride": "",
        "description": "Wool, worn thin but warm enough.",
        "quantity": 4,
        "basePrice": 0.5,
        "rowId": "row-1783481123149-1vbwo",
        "name": "Blanket"
      },
      {
        "rowId": "row-1783481126865-l3z8k",
        "quantity": "infinite",
        "basePrice": 0.4,
        "description": "Woven reed or wicker, light and cheap.",
        "priceOverride": "",
        "name": "Basket"
      },
      {
        "name": "Bucket",
        "rowId": "row-1783481135595-pki1j",
        "quantity": "infinite",
        "basePrice": 0.05,
        "description": "Plain wood, banded in iron.",
        "priceOverride": ""
      },
      {
        "rowId": "row-1783481210370-uyfrl",
        "quantity": 6,
        "basePrice": 25,
        "priceOverride": "",
        "description": "Pitons, boot spikes, and rope loops for scaling rough terrain.",
        "name": "Climber's Kit"
      },
      {
        "priceOverride": "",
        "description": "A belt pouch designed to hold spellcasting materials.",
        "basePrice": 25,
        "quantity": 4,
        "rowId": "row-1783481251870-5ohib",
        "name": "Component Pouch"
      },
      {
        "description": "A sawtooth steel trap for catching game — or worse.",
        "priceOverride": "",
        "rowId": "row-1783481272890-f97yb",
        "basePrice": 5,
        "quantity": 5,
        "name": "Hunting Trap"
      },
      {
        "rowId": "row-1783481316461-1g1w0",
        "quantity": 4,
        "basePrice": 0.2,
        "description": "Holds about four pints.",
        "priceOverride": "",
        "name": "Waterskin"
      },
      {
        "priceOverride": "",
        "description": "Canvas and poles, enough to keep the rain off two people.",
        "basePrice": 2,
        "quantity": 3,
        "rowId": "row-1783481325011-sv4rq",
        "name": "Tent (two-person)"
      },
      {
        "name": "Spyglass",
        "description": "Rare and expensive; a prized find out here.",
        "priceOverride": "",
        "basePrice": 1000,
        "quantity": 2,
        "rowId": "row-1783481334786-338sm"
      },
      {
        "name": "Robe",
        "rowId": "row-1783481346807-0f2h6",
        "basePrice": 1,
        "quantity": 5,
        "description": "Loose ceremonial or vocational garment.",
        "priceOverride": ""
      },
      {
        "name": "Quiver",
        "priceOverride": "",
        "description": "Holds up to 20 arrows.",
        "rowId": "row-1783481362511-1lk7h",
        "basePrice": 1,
        "quantity": 3
      },
      {
        "name": "Pot, Iron",
        "basePrice": 2,
        "quantity": 4,
        "rowId": "row-1783481372349-64igl",
        "description": "For cooking over an open fire.",
        "priceOverride": ""
      },
      {
        "name": "Crowbar",
        "description": "Good for prying, occasionally good for worse.",
        "priceOverride": "",
        "rowId": "row-1783481395493-46q5q",
        "quantity": 10,
        "basePrice": 2
      },
      {
        "quantity": 10,
        "basePrice": 1,
        "rowId": "row-1783481419643-md6gq",
        "priceOverride": "3",
        "description": "A quiver's worth, fletched and ready.",
        "name": "Arrows (20)"
      },
      {
        "basePrice": 1,
        "quantity": 5,
        "rowId": "row-1783481422860-mlcjv",
        "description": "Crossbow bolts, bundled by the case.",
        "priceOverride": "",
        "name": "Bolts (20)"
      },
      {
        "quantity": 5,
        "basePrice": 10,
        "rowId": "row-1783483757381-gyymy",
        "description": "Fine pens and inks for careful lettering.",
        "priceOverride": "",
        "name": "Calligrapher's Supplies"
      },
      {
        "name": "Carpenter's Tools",
        "description": "Saw, hammer, and chisels for woodwork.",
        "priceOverride": "",
        "quantity": "infinite",
        "basePrice": 8,
        "rowId": "row-1783483757381-rm3ky"
      },
      {
        "priceOverride": "",
        "description": "Ink, straightedge, and fine papers for mapmaking.",
        "rowId": "row-1783483757381-r5po1",
        "quantity": "infinite",
        "basePrice": 15,
        "name": "Cartographer's Tools"
      },
      {
        "rowId": "row-1783483757381-8nfdw",
        "quantity": "infinite",
        "basePrice": 5,
        "priceOverride": "",
        "description": "For repairing or making boots and shoes.",
        "name": "Cobbler's Tools"
      },
      {
        "name": "Cook's Utensils",
        "priceOverride": "",
        "description": "Pots, knives, and stirring spoons.",
        "quantity": "infinite",
        "basePrice": 1,
        "rowId": "row-1783483757381-13wzb"
      },
      {
        "rowId": "row-1783483757381-86x16",
        "basePrice": 25,
        "quantity": "infinite",
        "description": "Fine picks and loupes for gem work.",
        "priceOverride": "",
        "name": "Jeweler's Tools"
      },
      {
        "priceOverride": "",
        "description": "Awls, needles, and a stretching frame.",
        "rowId": "row-1783483757381-grqel",
        "quantity": "infinite",
        "basePrice": 5,
        "name": "Leatherworker's Tools"
      },
      {
        "description": "Chisels and a hammer for stonework.",
        "priceOverride": "",
        "rowId": "row-1783483757381-v5drr",
        "basePrice": 10,
        "quantity": "infinite",
        "name": "Mason's Tools"
      },
      {
        "name": "Painter's Supplies",
        "rowId": "row-1783483757381-uy8mu",
        "quantity": 10,
        "basePrice": 10,
        "priceOverride": "",
        "description": "Brushes, pigments, and a palette."
      },
      {
        "description": "A wheel and shaping tools.",
        "priceOverride": "",
        "rowId": "row-1783483757381-4p80k",
        "quantity": "infinite",
        "basePrice": 10,
        "name": "Potter's Tools"
      },
      {
        "rowId": "row-1783483757381-x8go9",
        "quantity": "infinite",
        "basePrice": 20,
        "priceOverride": "",
        "description": "Tongs, hammer, and files for metalwork.",
        "name": "Smith's Tools"
      },
      {
        "name": "Tinker's Tools",
        "quantity": "infinite",
        "basePrice": 50,
        "rowId": "row-1783483757381-vkpai",
        "description": "Small tools for repairing mechanisms.",
        "priceOverride": ""
      },
      {
        "name": "Weaver's Tools",
        "description": "A simple hand loom and shuttle.",
        "priceOverride": "",
        "rowId": "row-1783483757381-o7c79",
        "basePrice": 1,
        "quantity": 1
      },
      {
        "rowId": "row-1783483757381-j14i8",
        "basePrice": 1,
        "quantity": "infinite",
        "priceOverride": "",
        "description": "Knives and gouges for detail work.",
        "name": "Woodcarver's Tools"
      },
      {
        "priceOverride": "",
        "description": "Charts and instruments for plotting a course.",
        "rowId": "row-1783483757381-h1gdd",
        "quantity": 1,
        "basePrice": 25,
        "name": "Navigator's Tools"
      },
      {
        "name": "Gaming Set, Dice",
        "basePrice": 0.1,
        "quantity": 6,
        "rowId": "row-1783483757381-do3g1",
        "priceOverride": "",
        "description": "Bone or carved wood."
      },
      {
        "description": "An elaborate strategy game, rarely seen in a town this small.",
        "priceOverride": "",
        "quantity": 1,
        "basePrice": 1,
        "rowId": "row-1783483757381-2bwcn",
        "name": "Gaming Set, Dragonchess"
      },
      {
        "rowId": "row-1783483757381-c3fuu",
        "basePrice": 0.5,
        "quantity": 5,
        "priceOverride": "",
        "description": "A worn deck, hand-painted.",
        "name": "Gaming Set, Playing Cards"
      },
      {
        "name": "Gaming Set, Three-Dragon Ante",
        "rowId": "row-1783483757381-ekavw",
        "quantity": 5,
        "basePrice": 1,
        "description": "A fast, betting-heavy card game.",
        "priceOverride": ""
      },
      {
        "name": "Musical Instrument, Drum",
        "basePrice": 6,
        "quantity": 1,
        "rowId": "row-1783483757381-amekg",
        "description": "A simple hand drum.",
        "priceOverride": ""
      },
      {
        "description": "Struck strings over a wooden frame.",
        "priceOverride": "",
        "quantity": 1,
        "basePrice": 25,
        "rowId": "row-1783483757381-6zrft",
        "name": "Musical Instrument, Dulcimer"
      },
      {
        "name": "Musical Instrument, Flute",
        "priceOverride": "",
        "description": "Carved from bone or wood.",
        "basePrice": 2,
        "quantity": 1,
        "rowId": "row-1783483757381-ajg82"
      },
      {
        "name": "Musical Instrument, Lute",
        "rowId": "row-1783483757381-5p984",
        "quantity": 1,
        "basePrice": 35,
        "description": "A well-worn but playable stringed instrument.",
        "priceOverride": ""
      },
      {
        "description": "Small, plucked, and portable.",
        "priceOverride": "",
        "basePrice": 30,
        "quantity": 1,
        "rowId": "row-1783483757381-ekbv8",
        "name": "Musical Instrument, Lyre"
      },
      {
        "rowId": "row-1783483757381-11it5",
        "quantity": 1,
        "basePrice": 12,
        "description": "A row of tuned pipes.",
        "priceOverride": "",
        "name": "Musical Instrument, Pan Flute"
      },
      {
        "name": "Musical Instrument, Shawm",
        "quantity": 1,
        "basePrice": 2,
        "rowId": "row-1783483757381-nda98",
        "priceOverride": "",
        "description": "A reedy, piercing woodwind."
      },
      {
        "name": "Musical Instrument, Viol",
        "description": "Bowed strings, favored by traveling performers.",
        "priceOverride": "",
        "rowId": "row-1783483757381-8isoa",
        "basePrice": 30,
        "quantity": 1
      }
    ],
    "coords": {
      "y": 41.5,
      "x": 25.1
    },
    "services": [],
    "subheader": "General Store ",
    "priceMultiplier": 1.7,
    "type": "Shop",
    "interiorLayoutImage": "",
    "description": "One of four stores in town, Northman, as its known to the locals, is a rather large general store that serves most of the needs of the town. Here you can buy everything from Calishian Honeydrop candies to lamp oil to the newest romantic penny serial from Silverymoon.",
    "residents": [
      "npc-wendel-fenner",
      "npc-marta-fenner",
      "npc-poppy-fenner"
    ],
    "quadrant": "inhabited"
  },
  {
    "id": "zXs3it1a46O7OErCyXZM",
    "priceMultiplier": 1.5,
    "type": "Shop",
    "interiorLayoutImage": "",
    "residents": [],
    "quadrant": "inhabited",
    "name": "Banks of Rauvin Livery",
    "wares": [
      {
        "rowId": "row-1783529784084-49ilr",
        "basePrice": 50,
        "quantity": 1,
        "description": "Strong-backed and built for pulling loads.",
        "priceOverride": "",
        "name": "Horse, Draft"
      },
      {
        "name": "Horse, Riding",
        "description": "Bred for travel rather than battle.",
        "priceOverride": "",
        "quantity": 3,
        "basePrice": 75,
        "rowId": "row-1783529784084-f1o6i"
      },
      {
        "name": "Mule",
        "basePrice": 8,
        "quantity": 1,
        "rowId": "row-1783529784084-jwmpk",
        "description": "Sturdy and stubborn, good for hauling.",
        "priceOverride": ""
      },
      {
        "name": "Pony",
        "rowId": "row-1783529784084-gsa4d",
        "basePrice": 30,
        "quantity": 1,
        "description": "Smaller and hardier than a full horse.",
        "priceOverride": ""
      },
      {
        "name": "Cart",
        "rowId": "row-1783529932627-o2ruu",
        "quantity": 1,
        "basePrice": 15,
        "priceOverride": "",
        "description": "A two-wheeled hauler."
      },
      {
        "rowId": "row-1783529932627-tlxnz",
        "basePrice": 0.05,
        "quantity": "infinite",
        "priceOverride": "",
        "description": "Enough grain and hay for one animal, one day.",
        "name": "Feed (per day)"
      },
      {
        "description": "Helps a rider stay mounted through chaos.",
        "priceOverride": "",
        "basePrice": 20,
        "quantity": 1,
        "rowId": "row-1783529932627-56nkg",
        "name": "Saddle, Military"
      },
      {
        "name": "Saddle, Riding",
        "rowId": "row-1783529932627-7idf8",
        "basePrice": 10,
        "quantity": 3,
        "priceOverride": "",
        "description": "A standard saddle for everyday travel."
      },
      {
        "name": "Stabling (per night)",
        "description": "A stall, feed, and a roof for a mount.",
        "priceOverride": "",
        "rowId": "row-1783529932627-4f5l1",
        "basePrice": 0.5,
        "quantity": "infinite"
      }
    ],
    "revealed": false,
    "coords": {
      "y": 85,
      "x": 56
    },
    "subheader": "A Small Stables and Livery",
    "description": "A small livery shop with an attached stable that can hold up to 12 mounts. The surprisingly neat shop is bisected by a long wooden counter covered in saddles, tacks and reeks of leather and hay. The horses can be seen from inside the shop.",
    "menu": [],
    "icon": "",
    "services": [
      {
        "quantity": 1,
        "basePrice": 0.02,
        "rowId": "row-1783530054922-9n0mk",
        "priceOverride": "",
        "description": "Carries word or small parcels at a price per distance — a rare service this deep in the Marches.",
        "name": "Messenger (per mile)"
      }
    ]
  },
  {
    "id": "bld-thistlebrook-warren",
    "name": "Thistlebrook Warren",
    "subheader": "Four Under One Roof",
    "type": "Residence",
    "coords": {
      "x": 50,
      "y": 50
    },
    "quadrant": "inhabited",
    "interiorLayoutImage": "",
    "description": "A halfling-scaled burrow-home built into a converted larger foundation — low doorways and close, warm rooms carved out of a building meant for a much taller household. Permanently smells of leather, woodsmoke, and drying herbs.",
    "residents": [
      "G06j5K3dTAFPEo24iFuZ",
      "npc-cobb-thistlebrook",
      "npc-oswin-thistlebrook",
      "npc-tobin-thistlebrook"
    ],
    "revealed": false,
    "priceMultiplier": 1.5,
    "wares": [],
    "menu": [],
    "services": []
  },
  {
    "id": "bld-rorics-trophy-room",
    "name": "Roric's Trophy Room",
    "subheader": "Every Kill, On Display",
    "type": "Residence",
    "coords": {
      "x": 50,
      "y": 50
    },
    "quadrant": "inhabited",
    "interiorLayoutImage": "",
    "description": "A small, single-room home almost entirely given over to mounted trophies — hides, claws, and one very large set of antlers he won't stop talking about.",
    "residents": [
      "npc-roric-thistlebrook"
    ],
    "revealed": false,
    "priceMultiplier": 1.5,
    "wares": [],
    "menu": [],
    "services": []
  },
  {
    "id": "bld-fens-cabin",
    "name": "Fen's Cabin",
    "subheader": "Quiet, By Design",
    "type": "Residence",
    "coords": {
      "x": 50,
      "y": 50
    },
    "quadrant": "inhabited",
    "interiorLayoutImage": "",
    "description": "A plain, well-maintained one-room cabin at the edge of town, chosen for its distance from neighbors as much as anything else. Snares and trap components are cleaned and organized along one wall.",
    "residents": [
      "npc-fen-thistlebrook"
    ],
    "revealed": false,
    "priceMultiplier": 1.5,
    "wares": [],
    "menu": [],
    "services": []
  }
]

export const mockFamilies = [
  {
    "id": "NRyAJyk9oUGOm8GSzCz5",
    "description": "",
    "treeLayout": {
      "bmQNyEeMkoFFFwbp1W4M": {
        "y": 88,
        "x": -180
      },
      "89lzexuOe7eJMOFcNBJJ": {
        "y": 270,
        "x": -6
      },
      "owz4e8Fwl4k6dpnAJrXi": {
        "y": 270,
        "x": -176
      },
      "junction-NRyAJyk9oUGOm8GSzCz5-7QQFmwsWLScKMhf6E6kJ|bmQNyEeMkoFFFwbp1W4M": {
        "y": 197,
        "x": -40
      },
      "7QQFmwsWLScKMhf6E6kJ": {
        "y": 88,
        "x": 0
      }
    },
    "genOverrides": {},
    "name": "The Boscoes"
  },
  {
    "id": "a77cNMTkUYyhrKEgf17q",
    "description": "",
    "genOverrides": {},
    "name": "The Thistlebrooks"
  },
  {
    "id": "fam-michael",
    "name": "The Michaels",
    "treeLayout": {
      "PIAl7avdltjDfYdQCmTa": {
        "y": 90,
        "x": 0
      }
    },
    "description": ""
  },
  {
    "id": "fam-pasho",
    "description": "A half-elf family of fading wealth and title, currently investing what remains of it in a new playhouse for the town.",
    "treeLayout": {
      "npc-lu-pasho": {
        "y": 242.79678130511468,
        "x": -152.08346560846576
      },
      "npc-nyra-pasho": {
        "y": 459.7613315696649,
        "x": -296.816798941799
      },
      "junction-fam-pasho-npc-lu-pasho|npc-tana-pasho": {
        "y": 369.7967813051147,
        "x": -233.74797561721448
      },
      "npc-cassian-pasho": {
        "y": 52.394989234567674,
        "x": -275.7055547654322
      },
      "npc-tana-pasho": {
        "y": 243.73773010588536,
        "x": -407.4124856259631
      },
      "npc-liora-pasho": {
        "y": 54.48655202821868,
        "x": 45.09854497354536
      },
      "npc-ven-pasho": {
        "y": 241.591049382716,
        "x": 256.7402998236332
      },
      "npc-met-pasho": {
        "y": 242.2208994708995,
        "x": 47.259700176367005
      },
      "junction-fam-pasho-npc-cassian-pasho|npc-liora-pasho": {
        "y": 168.38903685361552,
        "x": -60.34230560141077
      }
    },
    "name": "The Pashos"
  },
  {
    "id": "fam-rihlo",
    "edgeOverrides": {
      "e-cross-npc-krikas-rihlo|npc-tana-pasho": {
        "hidden": true
      },
      "e-cross-npc-olma-rihlo|npc-tana-pasho": {
        "hidden": true
      }
    },
    "name": "The Rihlos",
    "description": "An elven patriarch, roughly 800 years old, on his third known family line of half-elf descendants in Jalanthar.",
    "treeLayout": {
      "npc-maya-pasho": {
        "x": 1399.7192239858912,
        "y": 264.30855379188716
      },
      "npc-krikas-rihlo": {
        "y": 58,
        "x": -221
      },
      "npc-el-pasho": {
        "y": 338,
        "x": -61.20000000000255
      },
      "npc-olma-rihlo": {
        "y": 59.60881834215155,
        "x": 114.41706349206379
      },
      "junction-fam-rihlo-npc-krikas-rihlo|npc-olma-rihlo": {
        "y": 159,
        "x": 1.7085317460318947
      }
    }
  },
  {
    "id": "fam-thicket",
    "treeLayout": {
      "PIAl7avdltjDfYdQCmTa": {
        "y": 70,
        "x": 140
      },
      "npc-magistrate": {
        "y": 70,
        "x": -66
      },
      "08oteThmyEqNmQiTooc6": {
        "y": 72,
        "x": -295.2000000000007
      }
    },
    "description": "",
    "name": "The Thickets"
  },
  {
    "id": "fam-vod",
    "description": "Descendants of a well-known ranger who settled Jalanthar four generations ago. Currently modest hunters trading heavily on the family reputation.",
    "treeLayout": {
      "npc-branner-vod": {
        "y": 88,
        "x": 372
      },
      "npc-emeric-vod": {
        "y": 568,
        "x": -71
      },
      "npc-tomas-vod": {
        "y": 268,
        "x": 104
      },
      "junction-fam-vod-npc-ressa-vod|npc-tomas-vod": {
        "y": 445,
        "x": 189
      },
      "npc-wren-vod": {
        "y": 566,
        "x": 341
      },
      "junction-fam-vod-npc-aldous-vod|npc-senna-vod": {
        "y": 195,
        "x": -159
      },
      "npc-aldous-vod": {
        "y": 82,
        "x": -280
      },
      "npc-ressa-vod": {
        "y": 266,
        "x": 342
      },
      "npc-finn-vod": {
        "x": -314,
        "y": 404
      },
      "npc-garrick-vod": {
        "y": 268,
        "x": -314
      },
      "npc-senna-vod": {
        "y": -286,
        "x": 306
      }
    },
    "name": "The Vods",
    "genOverrides": {
      "npc-branner-vod": 1,
      "npc-aldous-vod": 1,
      "npc-senna-vod": 1
    }
  },
  {
    "id": "fam-fenner",
    "name": "The Fenners",
    "description": "A human couple running Wares for the Clever Northman, with a daughter the town can't agree on — some swear she's an awakened dog, others are just as sure she used to be a little girl. Wendel and Marta have never confirmed either story."
  }
]

export const mockNpcs = [
  {
    "id": "08oteThmyEqNmQiTooc6",
    "eyeColor": "Black",
    "famousQuote": "",
    "job": "Magistrate's Clerk",
    "visible": false,
    "clothing": "Stunning, elegant dresses, usually some kind of play on the town colors. ",
    "appearance": "Long black hair with silver streaks that reaches the floor when down and a dour expression, with lips always pursed and hands constantly clenched in judgement.",
    "species": "Halfling",
    "personality": "A beautiful girl in her youth and a stunning woman now, Belora has spent the last few decades playing the good politician's wife. She has a taste for the finer things, and considers herself the only elegant woman in Jalanthar. She has made her displeasure at winding up in the backwater Jalanthar quite known.",
    "age": "114",
    "hairColor": "Black",
    "distinguishingFeatures": "Astonishingly beautiful, with piercing purple eyes.",
    "homeBuildingId": "bld-magistrate-house",
    "gender": "Woman",
    "name": "Belora Thicket",
    "familyName": "The Thickets",
    "relationships": [
      {
        "type": "spouse",
        "targetId": "npc-magistrate"
      }
    ],
    "history": "",
    "weight": "25 lbs.",
    "height": "2' 8\""
  },
  {
    "id": "7QQFmwsWLScKMhf6E6kJ",
    "job": "Bartender & Bookkeeper, The Thrice Crowned Cockatrice",
    "visible": false,
    "eyeColor": "Brown",
    "famousQuote": "\"Frankie feeds you. I decide if you get a second round.\"",
    "species": "Human",
    "dndClass": "",
    "personality": "Warm to regulars, merciless to troublemakers. Actually runs the tavern day-to-day.",
    "clothing": "A stained apron over practical wool, sleeves always rolled.",
    "appearance": "Sturdy build, forearms strong from hauling casks.",
    "age": "",
    "hairColor": "Dark brown, silvering at the roots",
    "relationships": [
      {
        "targetId": "bmQNyEeMkoFFFwbp1W4M",
        "type": "spouse"
      },
      {
        "type": "child",
        "targetId": "owz4e8Fwl4k6dpnAJrXi"
      },
      {
        "targetId": "89lzexuOe7eJMOFcNBJJ",
        "type": "child"
      }
    ],
    "history": "Married Frankie young; built the Cockatrice up with him across the same lean rebuilding years the town went through.",
    "weight": "160 lbs",
    "height": "5' 6\"",
    "homeBuildingId": "bld-crowing-cockatrice",
    "distinguishingFeatures": "Tattoo of a small cockatrice with three crowns on her forearm — the tavern's sigil.",
    "gender": "Woman",
    "familyName": "The Boscoes",
    "name": "Colette \"Lettie\" Boscoe"
  },
  {
    "id": "89lzexuOe7eJMOFcNBJJ",
    "eyeColor": "Brown",
    "famousQuote": "I've broken up worse fights than this one in my mother's tavern.",
    "job": "Member of Town Guard",
    "visible": false,
    "clothing": "Garrison uniform, worn a little looser than regulation.",
    "appearance": "Built like her mother — broad-shouldered; nose and forearms perpetually sunburned from standing watch.",
    "species": "Human",
    "personality": "Blunt, physical, impatient with anyone who underestimates her.",
    "dndClass": "Fighter",
    "age": "23",
    "hairColor": "Auburn ringlets, cropped very short",
    "gender": "Woman",
    "distinguishingFeatures": "Missing a hand, replaced it with one made entirely of stone",
    "homeBuildingId": "bld-garrison-quarters",
    "familyName": "The Boscoes",
    "name": "Sabine Boscoe",
    "relationships": [
      {
        "targetId": "7QQFmwsWLScKMhf6E6kJ",
        "type": "parent"
      },
      {
        "type": "parent",
        "targetId": "bmQNyEeMkoFFFwbp1W4M"
      },
      {
        "type": "sibling",
        "targetId": "owz4e8Fwl4k6dpnAJrXi"
      }
    ],
    "height": "6'1\"",
    "history": "",
    "weight": "145 lbs"
  },
  {
    "id": "G06j5K3dTAFPEo24iFuZ",
    "age": "58",
    "hairColor": "Sandy brown, greying at the temples",
    "distinguishingFeatures": "A row of small tattooed dashes along his right forearm — one per confirmed kill, a tally he started keeping decades ago.",
    "homeBuildingId": "bld-thistlebrook-warren",
    "gender": "Man",
    "familyName": "The Thistlebrooks",
    "name": "Doran Thistlebrook",
    "relationships": [
      {
        "targetId": "npc-cobb-thistlebrook",
        "type": "spouse"
      },
      {
        "targetId": "npc-oswin-thistlebrook",
        "type": "spouse"
      },
      {
        "targetId": "npc-pell-thistlebrook",
        "type": "child"
      },
      {
        "targetId": "npc-roric-thistlebrook",
        "type": "child"
      },
      {
        "targetId": "npc-fen-thistlebrook",
        "type": "child"
      },
      {
        "targetId": "npc-tobin-thistlebrook",
        "type": "child"
      }
    ],
    "history": "Has hunted alongside Cobb for over two decades; their partnership is considered close to uncanny by the rest of the guild.",
    "weight": "42 lbs",
    "height": "3'2\"",
    "eyeColor": "Grey",
    "famousQuote": "",
    "job": "Hunter",
    "visible": false,
    "clothing": "Practical leathers, patched more than replaced.",
    "appearance": "Compact and wiry, permanently sun-weathered from decades in the field.",
    "species": "Halfling",
    "dndClass": "Hunter",
    "personality": "Steady and unshowy. Doesn't brag because he doesn't need to — everyone in town already knows what he and Cobb can do."
  },
  {
    "id": "PIAl7avdltjDfYdQCmTa",
    "distinguishingFeatures": "A very discernible limp and a cane",
    "homeBuildingId": "bld-magistrate-house",
    "gender": "Man",
    "name": "Ricton Thicket",
    "familyName": "The Thickets",
    "relationships": [
      {
        "targetId": "npc-magistrate",
        "type": "spouse"
      }
    ],
    "weight": "38 lbs",
    "history": "",
    "height": "3' 3\"",
    "age": "132",
    "hairColor": "Bald",
    "clothing": "A tight, burgundy vest with all the trappings of elegance, revealing bulging tattooed arms. He has an extensive cane collection, and it seems like he never uses the same cane twice.",
    "appearance": "A head shaved bald and a frame so packed with muscle he resembles a dwarf. He might even be confused for a dwarf if it weren't for his baby face, a dead give away he is a halfling.",
    "species": "Halfling",
    "personality": "He has a short temper that he has a good handle on. A voracious drinker, don't let him trap with you one of his stories of the good ol' days. ",
    "famousQuote": "",
    "eyeColor": "Green",
    "job": "Chamberlain",
    "visible": false
  },
  {
    "id": "bmQNyEeMkoFFFwbp1W4M",
    "visible": false,
    "job": "Owner and Head Chef, Thrice Crowned Cockatrice",
    "eyeColor": "53",
    "famousQuote": "",
    "personality": "A deeply kind man who loves feeding others, he will rarely leave the kitchen. If he does, it's too pick up his spice shipment from the Northman's or the newest cut from the butchershop. Only time you'll see him angry is over his two daughters.",
    "dndClass": "",
    "species": "Human",
    "appearance": "Very tight black ringlets that fall down to his shoulder and a tightly cropped beard. deep set crow's feet and smile lines from a lifetime of laughing",
    "clothing": "Dirty apron and a massive knife hiding commoner's clothes.",
    "hairColor": "Brown",
    "age": "54",
    "height": "5' 8\"",
    "weight": "200 lbs",
    "history": "",
    "relationships": [
      {
        "targetId": "7QQFmwsWLScKMhf6E6kJ",
        "type": "spouse"
      },
      {
        "type": "child",
        "targetId": "owz4e8Fwl4k6dpnAJrXi"
      },
      {
        "targetId": "89lzexuOe7eJMOFcNBJJ",
        "type": "child"
      }
    ],
    "name": "Franklin \"Frankie\" Boscoe",
    "familyName": "The Boscoes",
    "gender": "Man",
    "distinguishingFeatures": "Massive beer belly and a distinct waddle",
    "homeBuildingId": ""
  },
  {
    "id": "npc-aldous-vod",
    "hairColor": "Bald, grey at temples",
    "age": 70,
    "name": "Aldous Vod",
    "familyName": "The Vods",
    "distinguishingFeatures": "A faded burn scar on the back of his left hand.",
    "homeBuildingId": "bld-old-vod-house",
    "gender": "Man",
    "history": "Married Senna and took the Vod name. Maintains the town's rolls, warrants, and records for the magistrate.",
    "weight": "150 lb",
    "height": "5'7\"",
    "relationships": [
      {
        "type": "spouse",
        "targetId": "npc-senna-vod"
      },
      {
        "targetId": "npc-tomas-vod",
        "type": "child"
      },
      {
        "targetId": "npc-garrick-vod",
        "type": "child"
      }
    ],
    "famousQuote": "Somebody has to remember who owes what.",
    "eyeColor": "Blue",
    "visible": false,
    "job": "Ledgerhand to the Magistrate",
    "appearance": "Soft-bodied, round-shouldered, wire-rimmed glasses.",
    "clothing": "A neat clerk's coat.",
    "personality": "Even-tempered and methodical, unbothered by the family's reputation politics.",
    "species": "Human"
  },
  {
    "id": "npc-branner-vod",
    "hairColor": "Grey, thinning",
    "age": 65,
    "name": "Branner Vod",
    "familyName": "The Vods",
    "distinguishingFeatures": "Missing two fingers on his off hand.",
    "homeBuildingId": "bld-branners-cottage",
    "gender": "Man",
    "history": "Hunted alongside Senna for roughly two decades. Has not hunted anything larger than a hare in approximately ten years.",
    "weight": "165 lb",
    "height": "5'9\"",
    "relationships": [
      {
        "targetId": "npc-senna-vod",
        "type": "sibling"
      },
      {
        "targetId": "npc-finn-vod",
        "type": "friend"
      }
    ],
    "famousQuote": "Ask me about the bulette. No — ask me.",
    "eyeColor": "Brown",
    "visible": false,
    "job": "Retired hunter",
    "appearance": "Big-boned, stooped with age.",
    "clothing": "An old hunting coat he refuses to replace.",
    "personality": "Talkative, repeats the same handful of hunting stories often. Fond of the youngest Vod children.",
    "species": "Human"
  },
  {
    "id": "npc-cassian-pasho",
    "age": 62,
    "hairColor": "White (once blond)",
    "relationships": [
      {
        "type": "spouse",
        "targetId": "npc-liora-pasho"
      },
      {
        "targetId": "npc-lu-pasho",
        "type": "child"
      },
      {
        "type": "child",
        "targetId": "npc-met-pasho"
      },
      {
        "targetId": "npc-ven-pasho",
        "type": "child"
      }
    ],
    "weight": "155 lb",
    "history": "Head of the Pasho family. Presides over the family's ancestral manor, now largely emptied of its former wealth.",
    "height": "5'9\"",
    "distinguishingFeatures": "A signet ring, never removed.",
    "homeBuildingId": "bld-pasho-manor",
    "gender": "Man",
    "name": "Cassian Pasho",
    "familyName": "The Pashos",
    "job": "None (landed)",
    "visible": false,
    "famousQuote": "We are Pashos. That has always been enough.",
    "eyeColor": "Blue",
    "species": "Elf",
    "personality": "Formal and status-conscious, leans on family name and title.",
    "clothing": "Old, well-kept formal attire.",
    "appearance": "Tall, thin with age."
  },
  {
    "id": "npc-el-pasho",
    "gender": "Woman",
    "homeBuildingId": "bld-rihlo-house",
    "distinguishingFeatures": "",
    "familyName": "The Rihlos",
    "name": "El Rihlo",
    "relationships": [
      {
        "type": "parent",
        "targetId": "npc-krikas-rihlo"
      },
      {
        "type": "parent",
        "targetId": "npc-olma-rihlo"
      },
      {
        "targetId": "npc-tana-pasho",
        "type": "sibling"
      },
      {
        "targetId": "npc-maya-pasho",
        "type": "sibling"
      }
    ],
    "height": "~3'8\"",
    "history": "Youngest daughter of Krikas and Olma Rihlo.",
    "weight": "~45 lb",
    "age": 12,
    "hairColor": "Dark brown, loose",
    "clothing": "Simple children's clothing.",
    "appearance": "Small even for a half-elf her age, round-faced.",
    "species": "Half-Elf",
    "personality": "Behaves and understands the world at roughly the level of a six-year-old, consistent with half-elves maturing at half the human rate.",
    "famousQuote": "I'm not a baby. I'm twelve.",
    "eyeColor": "Brown",
    "job": "None (child)",
    "visible": false
  },
  {
    "id": "npc-emeric-vod",
    "gender": "Man",
    "distinguishingFeatures": "",
    "homeBuildingId": "bld-vod-homestead",
    "familyName": "The Vods",
    "name": "Emeric Vod",
    "relationships": [
      {
        "targetId": "npc-tomas-vod",
        "type": "parent"
      },
      {
        "type": "parent",
        "targetId": "npc-ressa-vod"
      },
      {
        "type": "sibling",
        "targetId": "npc-wren-vod"
      },
      {
        "type": "uncle",
        "targetId": "npc-garrick-vod"
      },
      {
        "targetId": "npc-senna-vod",
        "type": "grandparent"
      },
      {
        "targetId": "npc-aldous-vod",
        "type": "grandparent"
      },
      {
        "targetId": "npc-finn-vod",
        "type": "cousin"
      }
    ],
    "height": "5'2\"",
    "weight": "100 lb",
    "history": "Elder child of Tomas and Ressa. Being raised with strict expectations around hunting and survival skills.",
    "age": "17",
    "hairColor": "Black",
    "clothing": "Scaled-down hunting gear.",
    "appearance": "Takes after Ressa — narrow build.",
    "species": "Human",
    "personality": "Competitive, a little cruel toward his sister, eager to outdo his father's reputation.",
    "eyeColor": "Green",
    "famousQuote": "This is my family's town which means its my town.",
    "job": "Member of the Town Guard",
    "visible": false
  },
  {
    "id": "npc-finn-vod",
    "appearance": "Smaller and thinner than his cousins.",
    "clothing": "Hand-me-downs.",
    "personality": "Quiet and watchful; spends more time around adults than children his own age.",
    "species": "Human",
    "famousQuote": "I don't remember her. Everyone else does, though.",
    "eyeColor": "Brown",
    "visible": false,
    "job": "None (child)",
    "familyName": "The Vods",
    "name": "Finn Vod",
    "gender": "Man",
    "homeBuildingId": "bld-vod-homestead",
    "distinguishingFeatures": "",
    "height": "4'8\"",
    "weight": "85 lb",
    "history": "Son of Garrick and the late Mira Vod. Raised largely by the extended household.",
    "relationships": [
      {
        "targetId": "npc-garrick-vod",
        "type": "parent"
      },
      {
        "targetId": "npc-branner-vod",
        "type": "friend"
      },
      {
        "targetId": "npc-tomas-vod",
        "type": "uncle"
      },
      {
        "targetId": "npc-senna-vod",
        "type": "grandparent"
      },
      {
        "targetId": "npc-aldous-vod",
        "type": "grandparent"
      },
      {
        "targetId": "npc-emeric-vod",
        "type": "cousin"
      },
      {
        "type": "cousin",
        "targetId": "npc-wren-vod"
      }
    ],
    "hairColor": "Dark brown, self-cut",
    "age": 9
  },
  {
    "id": "npc-garrick-vod",
    "age": 37,
    "hairColor": "Dark brown, unkempt",
    "relationships": [
      {
        "targetId": "npc-tomas-vod",
        "type": "sibling"
      },
      {
        "type": "child",
        "targetId": "npc-finn-vod"
      },
      {
        "type": "parent",
        "targetId": "npc-senna-vod"
      },
      {
        "type": "parent",
        "targetId": "npc-aldous-vod"
      }
    ],
    "height": "5'11\"",
    "history": "Married Mira Vod young, before their son Finn was born. Mira died shortly after Finn's birth. Garrick has raised Finn since, with the household's help.",
    "weight": "180 lb",
    "gender": "Man",
    "distinguishingFeatures": "A chipped front tooth.",
    "homeBuildingId": "bld-vod-homestead",
    "name": "Garrick Vod",
    "familyName": "The Vods",
    "job": "Member of the Town Guard",
    "visible": false,
    "eyeColor": "Brown",
    "famousQuote": "Jalanthar has survived this long by only letting in the right people.",
    "species": "Human",
    "personality": "Withdrawn and quiet; rarely joins in the family's boasting.",
    "clothing": "Whatever's clean.",
    "appearance": "Similar build to his brother Tomas, but leaner, with a persistent stoop."
  },
  {
    "id": "npc-krikas-rihlo",
    "age": 800,
    "hairColor": "Black, untouched by age",
    "distinguishingFeatures": "A thin silver thread braided into his hair.",
    "homeBuildingId": "bld-rihlo-house",
    "gender": "Man",
    "familyName": "The Rihlos",
    "name": "Krikas Rihlo",
    "relationships": [
      {
        "targetId": "npc-olma-rihlo",
        "type": "spouse"
      },
      {
        "type": "child",
        "targetId": "npc-tana-pasho"
      },
      {
        "targetId": "npc-maya-pasho",
        "type": "child"
      },
      {
        "targetId": "npc-el-pasho",
        "type": "child"
      }
    ],
    "weight": "160 lb",
    "history": "An elf approximately 800 years old. Currently on his third known family line in Jalanthar. One of the town's three known casters.",
    "height": "6'0\"",
    "famousQuote": "You'll forgive me if I've heard that joke before.",
    "eyeColor": "Deep green, faintly luminous",
    "job": "Caster (plant magic)",
    "visible": false,
    "clothing": "Earth-toned robes, finer than they appear.",
    "appearance": "Tall, slender, sharp cheekbones, long pointed ears.",
    "species": "Half-Elf",
    "personality": "Patient and controlled, accustomed to outliving those around him."
  },
  {
    "id": "npc-liora-pasho",
    "famousQuote": "Appearances aren't vanity. They're all that's left to hold onto.",
    "eyeColor": "Green",
    "job": "None (landed)",
    "visible": false,
    "clothing": "The finest remaining family wardrobe pieces.",
    "appearance": "Slight build.",
    "species": "Half-Elf",
    "personality": "Image-conscious, particular about appearances and presentation.",
    "age": 58,
    "hairColor": "Silver-blond, elaborate",
    "homeBuildingId": "bld-pasho-manor",
    "distinguishingFeatures": "A faint scar above her left eyebrow.",
    "gender": "Man",
    "name": "Liora Pasho",
    "familyName": "The Pashos",
    "relationships": [
      {
        "type": "spouse",
        "targetId": "npc-cassian-pasho"
      },
      {
        "type": "child",
        "targetId": "npc-lu-pasho"
      },
      {
        "type": "child",
        "targetId": "npc-met-pasho"
      },
      {
        "type": "child",
        "targetId": "npc-ven-pasho"
      }
    ],
    "weight": "130 lb",
    "history": "Married into the Pasho family during a period of greater family wealth. Manages the household within the family manor.",
    "height": "5'6\""
  },
  {
    "id": "npc-lu-pasho",
    "appearance": "Slim build, faintly pointed ears.",
    "clothing": "Simple, ink-spotted.",
    "personality": "Earnest and soft-spoken, financially optimistic, well-liked around town.",
    "species": "Half-Elf",
    "famousQuote": "Every town needs somewhere to lie to itself for an hour.",
    "eyeColor": "Hazel",
    "visible": false,
    "job": "Writer; founder, Silverleaf Stage",
    "name": "Lu Pasho",
    "familyName": "The Pashos",
    "homeBuildingId": "bld-lu-tana-residence",
    "distinguishingFeatures": "Ink-stained fingers.",
    "gender": "Man",
    "history": "Married Tana Rihlo three years ago in an arranged match. Has spent the past two years funding and constructing the Silverleaf Stage, currently under construction.",
    "weight": "145 lb",
    "height": "5'8\"",
    "relationships": [
      {
        "type": "spouse",
        "targetId": "npc-tana-pasho"
      },
      {
        "type": "child",
        "targetId": "npc-nyra-pasho"
      },
      {
        "targetId": "npc-met-pasho",
        "type": "sibling"
      },
      {
        "type": "sibling",
        "targetId": "npc-ven-pasho"
      },
      {
        "type": "parent",
        "targetId": "npc-cassian-pasho"
      },
      {
        "type": "parent",
        "targetId": "npc-liora-pasho"
      }
    ],
    "hairColor": "Sandy brown, shoulder-length",
    "age": 28
  },
  {
    "id": "npc-magistrate",
    "famousQuote": "",
    "eyeColor": "Blue",
    "visible": true,
    "job": "Magistrate",
    "appearance": "A diminutive and feeble frame that comes from years behind a desk, tiny hands, and a perfectly manufactured appearance. His hair is slicked back with product.",
    "clothing": "A burgundy suit and vest, adorned with gold details. His gold pocket watch with the symbol of Sylvanus is always in his hand. ",
    "personality": "He is smart and reserved, and will always wait a few seconds to respond, leaving uncomfortable pauses. He has very little senses of humor and is very hard to read. He is known for his penchant for history. ",
    "species": "Halfling",
    "hairColor": "Blonde",
    "age": "122",
    "familyName": "The Thickets",
    "name": "Anpo Thicket",
    "homeBuildingId": "bld-magistrate-house",
    "distinguishingFeatures": "A wispy moustache and tiny spectacles",
    "gender": "Man",
    "history": "Anpo Thicket had a pretty eventful youth as a Springwarden in the Emerald Enclave, a time which he doesn't talk about much. Now, ever the bureaucrat, Anpo has settled in as mayor of Jalanthar. He is determined to bring the hamlet into the fray politically during his tenure as mayor.",
    "weight": "121",
    "height": "3' 2\"",
    "relationships": [
      {
        "type": "spouse",
        "targetId": "08oteThmyEqNmQiTooc6"
      },
      {
        "type": "spouse",
        "targetId": "PIAl7avdltjDfYdQCmTa"
      }
    ]
  },
  {
    "id": "npc-maya-pasho",
    "clothing": "",
    "appearance": "Resembles her sister Tana, slightly taller.",
    "species": "Half-Elf",
    "personality": "",
    "eyeColor": "Green",
    "famousQuote": "",
    "job": "Courtesan in Silverymoon",
    "visible": false,
    "homeBuildingId": "",
    "distinguishingFeatures": "",
    "gender": "Woman",
    "familyName": "The Rihlos",
    "name": "Maya Rihlo",
    "relationships": [
      {
        "targetId": "npc-krikas-rihlo",
        "type": "parent"
      },
      {
        "type": "parent",
        "targetId": "npc-olma-rihlo"
      },
      {
        "targetId": "npc-tana-pasho",
        "type": "sibling"
      },
      {
        "targetId": "npc-el-pasho",
        "type": "sibling"
      }
    ],
    "weight": "",
    "history": "Eldest Rihlo daughter. Left Jalanthar for Silverymoon. The family publicly states she works there as a courtesan; she has in fact joined the church of Helm.",
    "height": "",
    "age": 24,
    "hairColor": "Brown"
  },
  {
    "id": "npc-met-pasho",
    "personality": "Proud, prickly about references to his human blood, currently frustrated and resentful.",
    "species": "Half-Elf",
    "appearance": "Lean build, sharply pointed ears left visibly uncovered.",
    "clothing": "Green and brown, unofficial devotional colors.",
    "visible": false,
    "job": "Devoted student of Sylvanus (unofficial)",
    "famousQuote": "I gave that faith two years. It gave me a stranger instead.",
    "eyeColor": "Grey-green",
    "history": "Studied for several years under Jalanthar's previous priest of Sylvanus, expecting to succeed him. The magistrate instead selected an outside priest.",
    "weight": "150 lb",
    "height": "5'10\"",
    "relationships": [
      {
        "targetId": "npc-lu-pasho",
        "type": "sibling"
      },
      {
        "type": "sibling",
        "targetId": "npc-ven-pasho"
      },
      {
        "type": "parent",
        "targetId": "npc-cassian-pasho"
      },
      {
        "type": "parent",
        "targetId": "npc-liora-pasho"
      }
    ],
    "name": "Met Pasho",
    "familyName": "The Pashos",
    "distinguishingFeatures": "A silver chain with a leaf-shaped pendant, always worn.",
    "homeBuildingId": "bld-met-pasho-residence",
    "gender": "Man",
    "hairColor": "Black, long and unbound",
    "age": 32
  },
  {
    "id": "npc-nyra-pasho",
    "age": 1,
    "hairColor": "Fine, dark",
    "relationships": [
      {
        "type": "parent",
        "targetId": "npc-lu-pasho"
      },
      {
        "type": "parent",
        "targetId": "npc-tana-pasho"
      },
      {
        "type": "uncle",
        "targetId": "npc-met-pasho"
      },
      {
        "type": "aunt",
        "targetId": "npc-ven-pasho"
      },
      {
        "targetId": "npc-cassian-pasho",
        "type": "grandparent"
      },
      {
        "targetId": "npc-liora-pasho",
        "type": "grandparent"
      },
      {
        "type": "grandparent",
        "targetId": "npc-krikas-rihlo"
      },
      {
        "type": "grandparent",
        "targetId": "npc-olma-rihlo"
      }
    ],
    "weight": "Infant",
    "history": "Born with the birthmark already present. Its meaning is currently unknown to the family.",
    "height": "Infant",
    "homeBuildingId": "bld-lu-tana-residence",
    "distinguishingFeatures": "A dragon-shaped birthmark covering most of her left side.",
    "gender": "Woman",
    "familyName": "The Pashos",
    "name": "Nyra Pasho",
    "job": "",
    "visible": false,
    "famousQuote": "",
    "eyeColor": "Green",
    "species": "Half-Elf",
    "personality": "",
    "clothing": "Swaddling.",
    "appearance": "An infant."
  },
  {
    "id": "npc-olma-rihlo",
    "height": "5'4\"",
    "weight": "120 lb",
    "history": "Current wife of Krikas Rihlo.",
    "relationships": [
      {
        "targetId": "npc-krikas-rihlo",
        "type": "spouse"
      },
      {
        "targetId": "npc-tana-pasho",
        "type": "child"
      },
      {
        "targetId": "npc-maya-pasho",
        "type": "child"
      },
      {
        "targetId": "npc-el-pasho",
        "type": "child"
      }
    ],
    "familyName": "The Rihlos",
    "name": "Olma Rihlo",
    "gender": "Woman",
    "distinguishingFeatures": "A small mole beneath her left eye.",
    "homeBuildingId": "bld-rihlo-house",
    "hairColor": "Dark brown, bound or covered",
    "age": 35,
    "personality": "Silent unless given leave to speak; deferential to Krikas in all matters.",
    "species": "Half-Elf",
    "appearance": "Small build.",
    "clothing": "Plain, modest.",
    "visible": false,
    "job": "None (household)",
    "famousQuote": "",
    "eyeColor": "Brown"
  },
  {
    "id": "npc-ressa-vod",
    "history": "Married into the Vod family. Runs the household and oversees Emeric and Wren's upbringing directly.",
    "weight": "145 lb",
    "height": "5'6\"",
    "relationships": [
      {
        "targetId": "npc-tomas-vod",
        "type": "spouse"
      },
      {
        "type": "child",
        "targetId": "npc-emeric-vod"
      },
      {
        "targetId": "npc-wren-vod",
        "type": "child"
      }
    ],
    "name": "Ressa Vod",
    "familyName": "The Vods",
    "homeBuildingId": "bld-vod-homestead",
    "distinguishingFeatures": "A slightly crooked nose from an old, poorly-set break.",
    "gender": "Woman",
    "hairColor": "Black, tight braid",
    "age": 36,
    "personality": "Iron-willed and controlling. Sets strict, demanding expectations for her children.",
    "species": "Human",
    "appearance": "Lean, sharp-featured.",
    "clothing": "Practical and dark.",
    "visible": false,
    "job": "Runs the household",
    "famousQuote": "Soft children don't survive frontiers.",
    "eyeColor": "Green"
  },
  {
    "id": "npc-senna-vod",
    "job": "Retired hunter, occasional pelt trader",
    "visible": false,
    "famousQuote": "My grandmother didn't wait for a warband to organize itself before she did something about it.",
    "eyeColor": "Pale grey",
    "species": "Human",
    "personality": "Sharp-tongued and impatient with excuses. Openly critical of her children's hunting claims.",
    "clothing": "Practical wool, a fur-trimmed vest.",
    "appearance": "Small, wiry build from decades of outdoor work.",
    "age": 68,
    "hairColor": "White, cropped short",
    "relationships": [
      {
        "type": "sibling",
        "targetId": "npc-branner-vod"
      },
      {
        "type": "spouse",
        "targetId": "npc-aldous-vod"
      },
      {
        "targetId": "npc-tomas-vod",
        "type": "child"
      },
      {
        "type": "child",
        "targetId": "npc-garrick-vod"
      }
    ],
    "weight": "130 lb",
    "history": "Hunted alongside her brother Branner during a period of frequent monster activity near Jalanthar. Traded pelts in the quieter years since.",
    "height": "5'4\"",
    "homeBuildingId": "bld-old-vod-house",
    "distinguishingFeatures": "A long, puckered scar across her left forearm from an old claw strike.",
    "gender": "Woman",
    "familyName": "The Vods",
    "name": "Senna Vod"
  },
  {
    "id": "npc-tana-pasho",
    "personality": "Patient and orderly; the most even-keeled member of either the Pasho or Rihlo households.",
    "species": "Half-Elf",
    "appearance": "Slender, composed posture, ears more noticeably pointed than her husband's.",
    "clothing": "Practical schoolroom dress.",
    "visible": false,
    "job": "Town teacher",
    "famousQuote": "Letters first. Everything else is easier once you have letters.",
    "eyeColor": "Green",
    "height": "5'5\"",
    "weight": "125 lb",
    "history": "Youngest of the three Rihlo daughters. Married to Lu in an arranged match. Serves as Jalanthar's schoolteacher.",
    "relationships": [
      {
        "targetId": "npc-lu-pasho",
        "type": "spouse"
      },
      {
        "type": "child",
        "targetId": "npc-nyra-pasho"
      },
      {
        "targetId": "npc-krikas-rihlo",
        "type": "parent"
      },
      {
        "targetId": "npc-olma-rihlo",
        "type": "parent"
      },
      {
        "targetId": "npc-maya-pasho",
        "type": "sibling"
      },
      {
        "targetId": "npc-el-pasho",
        "type": "sibling"
      }
    ],
    "name": "Tana Pasho",
    "familyName": "The Pashos",
    "gender": "Woman",
    "homeBuildingId": "bld-lu-tana-residence",
    "distinguishingFeatures": "A small scar at the corner of her mouth.",
    "hairColor": "Dark brown, tied back",
    "age": 26
  },
  {
    "id": "npc-tomas-vod",
    "eyeColor": "Brown",
    "famousQuote": "Criminals look just like you and me. You have no to know how to find them.",
    "visible": false,
    "job": "Member of the Town Guard",
    "appearance": "Broad-shouldered, solid build.",
    "clothing": "Hunting leathers, oddly clean for daily use.",
    "personality": "Boastful, exaggerates his hunting exploits, easily led by his wife.",
    "species": "Human",
    "hairColor": "Dark brown, receding",
    "age": 40,
    "name": "Tomas Vod",
    "familyName": "The Vods",
    "gender": "Man",
    "distinguishingFeatures": "A visible bite scar on his left calf.",
    "homeBuildingId": "bld-vod-homestead",
    "height": "5'10\"",
    "history": "Proposed to Ressa with the words \"Yes, ma'am\" when she informed him they were marrying. Hunts occasional deer, rabbit, and the rare wolf.",
    "weight": "175 lb",
    "relationships": [
      {
        "targetId": "npc-ressa-vod",
        "type": "spouse"
      },
      {
        "type": "sibling",
        "targetId": "npc-garrick-vod"
      },
      {
        "targetId": "npc-emeric-vod",
        "type": "child"
      },
      {
        "type": "child",
        "targetId": "npc-wren-vod"
      },
      {
        "type": "parent",
        "targetId": "npc-senna-vod"
      },
      {
        "type": "parent",
        "targetId": "npc-aldous-vod"
      }
    ]
  },
  {
    "id": "npc-ven-pasho",
    "homeBuildingId": "bld-ven-pasho-residence",
    "distinguishingFeatures": "A small notch missing from her left ear.",
    "gender": "Woman",
    "familyName": "The Pashos",
    "name": "Ven Pasho",
    "relationships": [
      {
        "type": "sibling",
        "targetId": "npc-lu-pasho"
      },
      {
        "targetId": "npc-met-pasho",
        "type": "sibling"
      },
      {
        "targetId": "npc-cassian-pasho",
        "type": "parent"
      },
      {
        "type": "parent",
        "targetId": "npc-liora-pasho"
      }
    ],
    "history": "Writes the majority of the material intended for the Silverleaf Stage. Possesses magical ability not currently known to her family.",
    "weight": "120 lb",
    "height": "5'6\"",
    "age": 30,
    "hairColor": "Sandy brown, cropped",
    "clothing": "Practical, chalk and charcoal rather than ink.",
    "appearance": "Slight build.",
    "species": "Half-Elf",
    "personality": "Driven and secretive, the creative force behind the Silverleaf Stage's productions.",
    "famousQuote": "Lu builds the walls. I decide what happens inside them.",
    "eyeColor": "Hazel",
    "job": "Playwright, co-founder, Silverleaf Stage",
    "visible": false
  },
  {
    "id": "npc-wren-vod",
    "appearance": "Small and thin for her age.",
    "clothing": "Simple, durable.",
    "personality": "Notably calm for her age; rarely reacts visibly to fear, pain, or discipline.",
    "species": "Human",
    "eyeColor": "Green",
    "famousQuote": "See I'm happy now! Things go way better when I'm happy.",
    "visible": false,
    "job": "Member of the Town Guard",
    "familyName": "The Vods",
    "name": "Wren Vod",
    "gender": "Man",
    "homeBuildingId": "bld-vod-homestead",
    "distinguishingFeatures": "",
    "height": "4'6\"",
    "history": "Youngest child of Tomas and Ressa. Currently being trained by Ressa in basic survival and combat.",
    "weight": "80 lb",
    "relationships": [
      {
        "targetId": "npc-tomas-vod",
        "type": "parent"
      },
      {
        "targetId": "npc-ressa-vod",
        "type": "parent"
      },
      {
        "targetId": "npc-emeric-vod",
        "type": "sibling"
      },
      {
        "targetId": "npc-garrick-vod",
        "type": "uncle"
      },
      {
        "targetId": "npc-senna-vod",
        "type": "grandparent"
      },
      {
        "targetId": "npc-aldous-vod",
        "type": "grandparent"
      },
      {
        "targetId": "npc-finn-vod",
        "type": "cousin"
      }
    ],
    "hairColor": "Black, kept short",
    "age": "19"
  },
  {
    "id": "owz4e8Fwl4k6dpnAJrXi",
    "species": "Human",
    "personality": "Ambitious and meticulous to a fault; quietly resents being treated as help rather than staff.",
    "dndClass": "Laborer",
    "clothing": "Modest, tidy clerk's attire. practical, not fashionable.",
    "appearance": "Neat, unremarkable civil-servant look; fingers permanently smudged with graphite and ink.",
    "job": "Clerk's Assistant, Magistrate's House",
    "visible": false,
    "famousQuote": "\"Someone in that house has to actually finish the paperwork.\"",
    "eyeColor": "Hazel",
    "relationships": [
      {
        "targetId": "7QQFmwsWLScKMhf6E6kJ",
        "type": "parent"
      },
      {
        "targetId": "bmQNyEeMkoFFFwbp1W4M",
        "type": "parent"
      },
      {
        "targetId": "89lzexuOe7eJMOFcNBJJ",
        "type": "sibling"
      }
    ],
    "height": "5'5\"",
    "weight": "130 lb",
    "history": "Talked her way into the position by proving useful during a records crisis.",
    "gender": "Woman",
    "distinguishingFeatures": "A small grey streak of hair",
    "homeBuildingId": "bld-magistrate-house",
    "familyName": "The Boscoes",
    "name": "Marisol Boscoe",
    "age": "29",
    "hairColor": "Auburn, always pinned back"
  },
  {
    "id": "npc-cobb-thistlebrook",
    "name": "Cobb Thistlebrook",
    "familyName": "The Thistlebrooks",
    "homeBuildingId": "bld-thistlebrook-warren",
    "visible": false,
    "age": 54,
    "job": "Hunter",
    "species": "Halfling",
    "gender": "Man",
    "dndClass": "Hunter",
    "famousQuote": "I don't watch his hands. I already know what they're doing.",
    "eyeColor": "Brown",
    "hairColor": "Dark brown, kept short",
    "height": "3'1\"",
    "weight": "39 lb",
    "distinguishingFeatures": "The matching tally-mark tattoo, on his left forearm — his and Doran's counts are only ever compared side by side.",
    "appearance": "Broader through the shoulders than most halflings, built for hauling a kill home.",
    "personality": "Quiet in a way that reads as confidence, not shyness. Lets Doran do the talking in town; in the field, they barely need words at all.",
    "clothing": "Same practical leathers as Doran, deliberately outfitted to match.",
    "history": "Paired with Doran early in both their careers; the two have hunted as a single unit ever since, to the point the guild stopped assigning them separate routes.",
    "relationships": [
      {
        "targetId": "G06j5K3dTAFPEo24iFuZ",
        "type": "spouse"
      },
      {
        "targetId": "npc-oswin-thistlebrook",
        "type": "spouse"
      },
      {
        "targetId": "npc-pell-thistlebrook",
        "type": "child"
      },
      {
        "targetId": "npc-roric-thistlebrook",
        "type": "child"
      },
      {
        "targetId": "npc-fen-thistlebrook",
        "type": "child"
      },
      {
        "targetId": "npc-tobin-thistlebrook",
        "type": "child"
      }
    ]
  },
  {
    "id": "npc-oswin-thistlebrook",
    "name": "Oswin Thistlebrook",
    "familyName": "The Thistlebrooks",
    "homeBuildingId": "bld-thistlebrook-warren",
    "visible": false,
    "age": 50,
    "job": "Herbalist — supplies Lavender and Dragon Thistle Apothecary",
    "species": "Halfling",
    "gender": "Man",
    "dndClass": "Craftsman",
    "famousQuote": "Everyone assumes I'm the one who stays home. I'm out longer than either of them, usually.",
    "eyeColor": "Hazel",
    "hairColor": "Light brown, curly",
    "height": "2'11\"",
    "weight": "35 lb",
    "distinguishingFeatures": "Always has a sprig of dried herb tucked behind one ear, out of habit more than purpose at this point.",
    "appearance": "Soft-spoken and soft-bodied compared to his husbands — spends more time crouched over roots than chasing game.",
    "personality": "Patient and a little distracted, most at ease elbow-deep in a hedgerow. Genuinely happy in a marriage most of the town still gossips about.",
    "clothing": "A canvas gathering vest with dozens of small pouches sewn in.",
    "history": "Ranges the wilds around Jalanthar independently of Doran and Cobb's hunts, gathering herbs and roots to sell directly to the apothecary.",
    "relationships": [
      {
        "targetId": "G06j5K3dTAFPEo24iFuZ",
        "type": "spouse"
      },
      {
        "targetId": "npc-cobb-thistlebrook",
        "type": "spouse"
      },
      {
        "targetId": "npc-pell-thistlebrook",
        "type": "child"
      },
      {
        "targetId": "npc-roric-thistlebrook",
        "type": "child"
      },
      {
        "targetId": "npc-fen-thistlebrook",
        "type": "child"
      },
      {
        "targetId": "npc-tobin-thistlebrook",
        "type": "child"
      }
    ]
  },
  {
    "id": "npc-pell-thistlebrook",
    "name": "Pell Thistlebrook",
    "familyName": "The Thistlebrooks",
    "homeBuildingId": "KM5xfMaXQiPBESP3ZeXt",
    "visible": false,
    "age": 30,
    "job": "Runs the desk at Outrider's Scraps and Scabbards (the hunters' guild)",
    "species": "Halfling",
    "gender": "Man",
    "dndClass": "Misc",
    "famousQuote": "I don't hunt anything. I make sure the people who do get paid.",
    "eyeColor": "Grey",
    "hairColor": "Sandy brown, neatly kept",
    "height": "3'0\"",
    "weight": "38 lb",
    "distinguishingFeatures": "Keeps a short, precisely trimmed beard — a running joke in the family that he's \"the professional one.\"",
    "appearance": "The least weathered of the brothers by far — indoor hands, an unusually tidy, trimmed beard next to his shaggier siblings.",
    "personality": "Organized to a fault, mildly exasperated by his brothers' chaos, secretly proud of all of them.",
    "clothing": "Clean workwear, an ink-smudged ledger apron.",
    "history": "Took to the ledgers early and never left them — the guild would reportedly fall apart without him.",
    "relationships": [
      {
        "targetId": "G06j5K3dTAFPEo24iFuZ",
        "type": "parent"
      },
      {
        "targetId": "npc-cobb-thistlebrook",
        "type": "parent"
      },
      {
        "targetId": "npc-oswin-thistlebrook",
        "type": "parent"
      },
      {
        "targetId": "npc-roric-thistlebrook",
        "type": "sibling"
      },
      {
        "targetId": "npc-fen-thistlebrook",
        "type": "sibling"
      },
      {
        "targetId": "npc-tobin-thistlebrook",
        "type": "sibling"
      }
    ]
  },
  {
    "id": "npc-roric-thistlebrook",
    "name": "Roric Thistlebrook",
    "familyName": "The Thistlebrooks",
    "homeBuildingId": "bld-rorics-trophy-room",
    "visible": false,
    "age": 27,
    "job": "Trophy/bounty hunter",
    "species": "Halfling",
    "gender": "Man",
    "dndClass": "Hunter",
    "famousQuote": "Small game feeds a house. Big game feeds a legend.",
    "eyeColor": "Brown",
    "hairColor": "Dark brown, worn long and loose",
    "height": "3'2\"",
    "weight": "41 lb",
    "distinguishingFeatures": "A jagged scar along his jawline, from the kill that made his name. He tells the story often and well.",
    "appearance": "Broad and confident, moves like he knows people are watching — because in Jalanthar, they usually are.",
    "personality": "Charismatic, competitive, genuinely brave — not all bluster, unlike a certain other hunting family in town.",
    "clothing": "Trophy-trimmed hunting gear — a few too many pelts and claws worked into it for practicality.",
    "history": "Takes on the town's largest and most dangerous bounties; considered one of Jalanthar's local heroes.",
    "relationships": [
      {
        "targetId": "G06j5K3dTAFPEo24iFuZ",
        "type": "parent"
      },
      {
        "targetId": "npc-cobb-thistlebrook",
        "type": "parent"
      },
      {
        "targetId": "npc-oswin-thistlebrook",
        "type": "parent"
      },
      {
        "targetId": "npc-pell-thistlebrook",
        "type": "sibling"
      },
      {
        "targetId": "npc-fen-thistlebrook",
        "type": "sibling"
      },
      {
        "targetId": "npc-tobin-thistlebrook",
        "type": "sibling"
      }
    ]
  },
  {
    "id": "npc-fen-thistlebrook",
    "name": "Fenwick \"Fen\" Thistlebrook",
    "familyName": "The Thistlebrooks",
    "homeBuildingId": "bld-fens-cabin",
    "visible": false,
    "age": 24,
    "job": "Trapper",
    "species": "Halfling",
    "gender": "Man",
    "dndClass": "Hunter",
    "famousQuote": "You don't hear me bragging. The traps do the bragging.",
    "eyeColor": "Green",
    "hairColor": "Dark brown, cropped close",
    "height": "2'11\"",
    "weight": "37 lb",
    "distinguishingFeatures": "Missing the tip of his left pinky, caught in one of his own snares as an apprentice — a mistake he's never repeated.",
    "appearance": "Lean and still — Fen can sit motionless longer than anyone in town has the patience to watch.",
    "personality": "Meticulous, solitary, more comfortable resetting a trapline than making conversation.",
    "clothing": "Muted, scent-neutral cloth deliberately chosen not to spook game.",
    "history": "Runs and maintains trap lines across the surrounding woods almost entirely alone; personally responsible for roughly 60% of the town's small game.",
    "relationships": [
      {
        "targetId": "G06j5K3dTAFPEo24iFuZ",
        "type": "parent"
      },
      {
        "targetId": "npc-cobb-thistlebrook",
        "type": "parent"
      },
      {
        "targetId": "npc-oswin-thistlebrook",
        "type": "parent"
      },
      {
        "targetId": "npc-pell-thistlebrook",
        "type": "sibling"
      },
      {
        "targetId": "npc-roric-thistlebrook",
        "type": "sibling"
      },
      {
        "targetId": "npc-tobin-thistlebrook",
        "type": "sibling"
      }
    ]
  },
  {
    "id": "npc-tobin-thistlebrook",
    "name": "Tobin Thistlebrook",
    "familyName": "The Thistlebrooks",
    "homeBuildingId": "bld-thistlebrook-warren",
    "visible": false,
    "age": 17,
    "job": "Apprentice herbalist",
    "species": "Halfling",
    "gender": "Man",
    "dndClass": "Craftsman",
    "famousQuote": "Dad says the ones that itch are usually the interesting ones.",
    "eyeColor": "Hazel",
    "hairColor": "Light brown, curly like Oswin's",
    "height": "2'9\"",
    "weight": "32 lb",
    "distinguishingFeatures": "A faint rash scar on one hand from an early lesson in identifying poisonous plants the hard way.",
    "appearance": "Still growing into his frame, perpetually smudged green and brown at the fingertips.",
    "personality": "Curious and eager, trailing Oswin everywhere, occasionally testing plants he shouldn't.",
    "clothing": "A smaller version of Oswin's gathering vest.",
    "history": "Apprenticing directly under Oswin, learning to identify and gather what the apothecary needs.",
    "relationships": [
      {
        "targetId": "G06j5K3dTAFPEo24iFuZ",
        "type": "parent"
      },
      {
        "targetId": "npc-cobb-thistlebrook",
        "type": "parent"
      },
      {
        "targetId": "npc-oswin-thistlebrook",
        "type": "parent"
      },
      {
        "targetId": "npc-pell-thistlebrook",
        "type": "sibling"
      },
      {
        "targetId": "npc-roric-thistlebrook",
        "type": "sibling"
      },
      {
        "targetId": "npc-fen-thistlebrook",
        "type": "sibling"
      }
    ]
  },
  {
    "id": "npc-wendel-fenner",
    "name": "Wendel Fenner",
    "familyName": "The Fenners",
    "homeBuildingId": "xmZvRARmOG5P103hNS4J",
    "visible": false,
    "age": 44,
    "job": "Proprietor, Wares for the Clever Northman",
    "species": "Human",
    "gender": "Man",
    "dndClass": "Merchant",
    "famousQuote": "She's the family dog. That's all there is to it.",
    "eyeColor": "Brown",
    "hairColor": "Dark brown, thinning",
    "height": "5'10\"",
    "weight": "180 lb",
    "distinguishingFeatures": "Ink-stained fingers from constant inventory-keeping.",
    "appearance": "Solidly built, perpetually mid-task — sleeves rolled, apron never quite clean.",
    "personality": "Practical and a little gruff with customers, but visibly tenses and shuts the conversation down fast if anyone asks too many questions about Poppy.",
    "clothing": "A heavy canvas shop apron over plain clothes.",
    "history": "Runs the store his family has kept for two generations; adamant, whenever asked, that Poppy has \"always just been the dog.\"",
    "relationships": [
      {
        "targetId": "npc-marta-fenner",
        "type": "spouse"
      },
      {
        "targetId": "npc-poppy-fenner",
        "type": "child"
      }
    ]
  },
  {
    "id": "npc-marta-fenner",
    "name": "Marta Fenner",
    "familyName": "The Fenners",
    "homeBuildingId": "xmZvRARmOG5P103hNS4J",
    "visible": false,
    "age": 41,
    "job": "Co-runs Wares for the Clever Northman — orders and bookkeeping",
    "species": "Human",
    "gender": "Woman",
    "dndClass": "Merchant",
    "famousQuote": "People will believe whatever's more interesting than the truth. Doesn't make it true.",
    "eyeColor": "Green",
    "hairColor": "Auburn, usually braided back",
    "height": "5'6\"",
    "weight": "140 lb",
    "distinguishingFeatures": "A habit of absently reaching down to rest a hand on Poppy's head mid-conversation, without seeming to notice she's doing it.",
    "appearance": "Warmer and more approachable than Wendel at first, quick to smile with customers.",
    "personality": "Friendlier and more talkative than her husband, but just as immovable the moment the conversation turns to their daughter.",
    "clothing": "Practical dress with a coin-pouch apron, ledger always close at hand.",
    "history": "Handles the ordering and the books; the more visible, more approachable half of the shop.",
    "relationships": [
      {
        "targetId": "npc-wendel-fenner",
        "type": "spouse"
      },
      {
        "targetId": "npc-poppy-fenner",
        "type": "child"
      }
    ]
  },
  {
    "id": "npc-poppy-fenner",
    "name": "Poppy Fenner",
    "familyName": "The Fenners",
    "homeBuildingId": "xmZvRARmOG5P103hNS4J",
    "visible": false,
    "age": 8,
    "job": "Fixture of Wares for the Clever Northman",
    "species": "Dog — or a girl. Disputed.",
    "gender": "Girl",
    "dndClass": "Misc",
    "famousQuote": "(She has never spoken in front of a customer. Everyone has a cousin who swears they heard her, once.)",
    "eyeColor": "Amber",
    "hairColor": "Scruffy brown-and-white coat",
    "height": "~2' at the shoulder",
    "weight": "~45 lb",
    "distinguishingFeatures": "Wears a small, worn charm bracelet as a collar — plainly child-sized, never explained, never removed.",
    "appearance": "A scruffy, alert medium-sized mixed-breed dog. Sits at the counter like she's waiting for something, rather than lying down like a dog usually would.",
    "personality": "Attentive in a way that unsettles some customers — seems to follow entire conversations, fetches specific named items off the shelves on request, and has been seen \"counting\" coins with one paw.",
    "clothing": "The charm bracelet/collar; nothing else.",
    "history": "Has been at the store as long as anyone in town can clearly remember, which is itself part of the debate — either she's a very well-trained, unusually long-lived shop dog, or she hasn't aged because whatever happened to her stopped her from aging like a dog normally would. Wendel and Marta redirect every version of this question.",
    "relationships": [
      {
        "targetId": "npc-wendel-fenner",
        "type": "parent"
      },
      {
        "targetId": "npc-marta-fenner",
        "type": "parent"
      }
    ]
  }
]
