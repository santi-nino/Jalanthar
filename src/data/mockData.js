// Demo-mode content. This is what the site shows when Firebase isn't configured
// yet, and doubles as the source pushed into Firestore by scripts/seed.js.
//
// scripts/seed.js skips any document whose ID already exists in Firestore —
// it only ever CREATES documents that are missing, never overwrites
// live-edited content. ONE exception: for a building that already exists,
// it will union any new residents listed here into that building's live
// `residents` array (never removing anyone, never touching any other
// field on that building) — this is what actually gets new family members
// added as staff/residents of a pre-existing building like the guild hall
// or a shop, since that document already exists and would otherwise be
// skipped entirely. Running `npm run seed` is safe any time you need to
// push new content added to this file, without risk to existing map
// positions, tree layouts, or anything else already live.
//
// Reconciled 2026-07-09T20:39:29.373Z against a full export of the live
// Firestore project — existing content below matches those documents
// exactly, including known-pending fixes (Doran Thistlebrook's job,
// homeBuildingId, and relationships still need a manual fix through the
// DM panel — his document already exists live, so the safe seed will
// never touch it). New content that isn't live yet keeps descriptive
// kebab-case IDs (e.g. 'bld-halden-hearth') until it's seeded, at which
// point that becomes its real, permanent Firestore ID too.
//
// NPCs use `homeBuildingIds` (array) — a resident can be found at more
// than one building. Older entries still carry the legacy singular
// `homeBuildingId`; the edit form reads either.

export const mockBuildings = [
  {
    "id": "2K2EkC5QyMPtCppGeiFo",
    "wares": [],
    "priceMultiplier": 1.5,
    "description": "",
    "quadrant": "inhabited",
    "icon": "",
    "residents": [
      "npc-alder-greenhollow",
      "npc-fennel-greenhollow",
      "npc-puck"
    ],
    "interiorLayoutImage": "",
    "services": [],
    "coords": {
      "y": 72.8,
      "x": 20.8
    },
    "type": "Shrine",
    "name": "The Oakenhall",
    "menu": [],
    "subheader": "Temple to Sylvanus"
  },
  {
    "id": "8tyssIjcNiecXRFTgsn2",
    "description": "",
    "wares": [],
    "priceMultiplier": 1.5,
    "interiorLayoutImage": "",
    "residents": [
      "npc-hollis-marrow",
      "npc-billie-marrow"
    ],
    "quadrant": "inhabited",
    "icon": "",
    "name": "The Sharp Cleaver",
    "type": "Shop",
    "coords": {
      "x": 85.4,
      "y": 62.4
    },
    "services": [],
    "subheader": "Butcher's Shop",
    "revealed": false,
    "menu": []
  },
  {
    "id": "9DVdbDyeq4AHI0F7lzNW",
    "menu": [],
    "subheader": "Herbs, Potions, and Salves",
    "services": [],
    "coords": {
      "x": 75.7,
      "y": 41.3
    },
    "type": "Shop",
    "name": "Lavender and Dragon Thistle Apothecary",
    "quadrant": "inhabited",
    "icon": "",
    "residents": [
      "JnESzQaEASu9sclo2HoC"
    ],
    "interiorLayoutImage": "",
    "wares": [
      {
        "basePrice": 50,
        "quantity": 1,
        "name": "Alchemist's Fire (flask)",
        "priceOverride": "",
        "rowId": "row-1783489956465-s0iei",
        "description": "Ignites on impact and keeps burning."
      },
      {
        "name": "Antitoxin (vial)",
        "quantity": 1,
        "rowId": "row-1783489961736-y612y",
        "priceOverride": "",
        "description": "A bitter draught said to fight off poison.",
        "basePrice": 50
      },
      {
        "basePrice": 25,
        "description": "Sealed and corrosive; handle it carefully.",
        "name": "Acid (vial)",
        "quantity": 1,
        "rowId": "row-1783489971862-ojgkm",
        "priceOverride": ""
      },
      {
        "description": "A small luxury, imported at a markup.",
        "rowId": "row-1783489995020-aldh0",
        "priceOverride": "",
        "name": "Perfume (vial)",
        "quantity": 1,
        "basePrice": 5
      },
      {
        "description": "A ruby-red draught that knits wounds quickly.",
        "quantity": 1,
        "name": "Potion of Healing",
        "priceOverride": "",
        "rowId": "row-1783490000882-xyy08",
        "basePrice": 50
      },
      {
        "priceOverride": "",
        "rowId": "row-1783490025349-q7ou2",
        "quantity": 1,
        "name": "Oil (flask)",
        "description": "Burns well in a lamp, or thrown at something worse.",
        "basePrice": 0.1
      },
      {
        "basePrice": 5,
        "priceOverride": "",
        "rowId": "row-1783490030370-qz7nb",
        "quantity": 1,
        "name": "Healer's Kit",
        "description": "Bandages, salves, and splints for field treatment."
      },
      {
        "basePrice": 5,
        "rowId": "row-1783490033415-9vexc",
        "priceOverride": "",
        "name": "Herbalism Kit",
        "quantity": 1,
        "description": "Pouches and tools for gathering and treating herbs."
      },
      {
        "quantity": 1,
        "name": "Poisoner's Kit",
        "priceOverride": "",
        "rowId": "row-1783490037320-lqpeo",
        "description": "Vials and tools for handling toxins safely — or not.",
        "basePrice": 50
      },
      {
        "basePrice": 50,
        "description": "Vials, burners, and reagents for basic alchemy.",
        "quantity": 1,
        "name": "Alchemist's Supplies",
        "priceOverride": "",
        "rowId": "row-1783490054516-g4348"
      },
      {
        "basePrice": 20,
        "name": "Brewer's Supplies",
        "quantity": 1,
        "rowId": "row-1783490058499-01r8m",
        "priceOverride": "",
        "description": "Everything needed to ferment a decent batch."
      }
    ],
    "priceMultiplier": 1.5,
    "description": ""
  },
  {
    "id": "KM5xfMaXQiPBESP3ZeXt",
    "coords": {
      "y": 53.7,
      "x": 86.2
    },
    "services": [],
    "name": "Outrider's Scraps and Scabbards",
    "type": "Shop",
    "revealed": false,
    "menu": [],
    "subheader": "The local leatherworking shop and a make-shift Hunter's Guild",
    "wares": [
      {
        "description": "A standard saddle for everyday travel.",
        "rowId": "row-1783530868804-lat0x",
        "priceOverride": "",
        "name": "Saddle, Riding",
        "quantity": 6,
        "basePrice": 10
      },
      {
        "basePrice": 10,
        "quantity": 1,
        "name": "Leather Armor",
        "priceOverride": "",
        "rowId": "row-1783530876096-68emg",
        "description": "Boiled and shaped hide, light enough to move freely in."
      },
      {
        "basePrice": 45,
        "description": "Leather reinforced with rivets and small plates.",
        "quantity": 1,
        "name": "Studded Leather Armor",
        "priceOverride": "",
        "rowId": "row-1783530879225-xyvoc"
      },
      {
        "basePrice": 5,
        "priceOverride": "",
        "rowId": "row-1783530882900-dzc57",
        "quantity": 1,
        "name": "Leatherworker's Tools",
        "description": "Awls, needles, and a stretching frame."
      }
    ],
    "priceMultiplier": 1.5,
    "description": "A working tannery and leatherworking shop where the local hunters come to sell their kills, post local bounties, and pick up jobs. The walls are all adorned with hunting trophies of all sizes, mostly stuffed heads on plaques. The back houses a large yard with several overturned logs split in half where  a few hunters skin their kills.",
    "icon": "",
    "quadrant": "inhabited",
    "interiorLayoutImage": "",
    "residents": [
      "G06j5K3dTAFPEo24iFuZ"
    ]
  },
  {
    "id": "LgpXEydOUyVOhMGhbl1m",
    "quadrant": "inhabited",
    "menu": [],
    "residents": [
      "npc-maren-sparrow",
      "npc-tobias-sparrow"
    ],
    "interiorLayoutImage": "",
    "subheader": "Temple to Helm",
    "services": [],
    "wares": [],
    "priceMultiplier": 1.5,
    "coords": {
      "x": 57.2,
      "y": 39.1
    },
    "type": "Shrine",
    "description": "",
    "name": "House of the Unsleeping Watcher"
  },
  {
    "id": "bld-branners-cottage",
    "quadrant": "inhabited",
    "menu": [],
    "residents": [
      "npc-branner-vod"
    ],
    "interiorLayoutImage": "",
    "subheader": "A Hunter's Retirement",
    "priceMultiplier": 1.5,
    "wares": [],
    "services": [],
    "coords": {
      "x": 12.1,
      "y": 31.5
    },
    "type": "Residence",
    "description": "A small, cluttered cottage near the Vod Homestead, packed with old hunting gear its owner refuses to part with.",
    "name": "Branner's Cottage"
  },
  {
    "id": "bld-crowing-cockatrice",
    "menu": [
      {
        "basePrice": 0.04,
        "quantity": "infinite",
        "name": "Ale (mug)",
        "priceOverride": "",
        "rowId": "row-1783490206448-qcjm6",
        "description": "The standard pour, brewed in-house."
      },
      {
        "priceOverride": "",
        "rowId": "row-1783490208907-0cd2z",
        "quantity": "infinite",
        "name": "Bread (loaf)",
        "description": "Baked fresh most mornings.",
        "basePrice": 0.02
      },
      {
        "priceOverride": "",
        "rowId": "row-1783490322628-z3bh7",
        "quantity": "infinite",
        "name": "Jalanthar Ale (mug)",
        "description": "One of the only Jalanthar is famous for, other than burning down of course.",
        "basePrice": 0.06
      }
    ],
    "quadrant": "inhabited",
    "interiorLayoutImage": "",
    "residents": [
      "7QQFmwsWLScKMhf6E6kJ"
    ],
    "subheader": "Tavern & Inn",
    "services": [
      {
        "basePrice": 0.5,
        "name": "Inn Stay, Modest (per night)",
        "quantity": 3,
        "rowId": "row-1783490215799-19x7g",
        "priceOverride": "",
        "description": "A decent bed and a locked door."
      },
      {
        "rowId": "row-1783490219277-0ou3d",
        "priceOverride": "",
        "name": "Inn Stay, Poor (per night)",
        "quantity": 5,
        "description": "A shared bunk in a room with several others.",
        "basePrice": 0.1
      },
      {
        "basePrice": 0.02,
        "description": "Carries word or small parcels at a price per distance — a rare service this deep in the Marches.",
        "rowId": "row-1783490231644-7rkv3",
        "priceOverride": "",
        "name": "Messenger (per mile)",
        "quantity": "infinite"
      }
    ],
    "wares": [],
    "priceMultiplier": 1.5,
    "coords": {
      "x": 32,
      "y": 71
    },
    "description": "A tavern built to serve a much larger town, now warmly overfull with the handful of regulars who keep its hearth lit. Most of its guest rooms are shuttered, but the common room still fills most nights.",
    "type": "Tavern",
    "name": "The Thrice Crowned Cockatrice"
  },
  {
    "id": "bld-fens-cabin",
    "description": "A plain, well-maintained one-room cabin at the center of town, chosen for its defensibility from neighbors as much as anything else. Snares and trap components are cleaned and organized along one wall.",
    "priceMultiplier": 1.5,
    "wares": [],
    "residents": [
      "npc-fen-thistlebrook"
    ],
    "interiorLayoutImage": "",
    "quadrant": "inhabited",
    "type": "Residence",
    "name": "Fen's Cabin",
    "services": [],
    "coords": {
      "y": 31.9,
      "x": 66.9
    },
    "subheader": "Quiet, By Design",
    "menu": [],
    "revealed": false
  },
  {
    "id": "bld-garrison-quarters",
    "quadrant": "inhabited",
    "menu": [],
    "residents": [
      "89lzexuOe7eJMOFcNBJJ",
      "npc-bertrand-halden",
      "npc-dashel-halden",
      "npc-wystan-halden",
      "npc-bren-harlen"
    ],
    "interiorLayoutImage": "",
    "subheader": "Town Guard Barracks and Offices",
    "priceMultiplier": 1.5,
    "services": [],
    "wares": [],
    "coords": {
      "x": 18.7,
      "y": 54.1
    },
    "type": "Garrison",
    "description": "Repurposed from what was once a militia hall, this building now houses the permanent protective garrison assigned to Jalanthar.",
    "name": "Garrison Quarters"
  },
  {
    "id": "bld-jalanthar-schoolhouse",
    "type": "Civic",
    "description": "A single-room schoolhouse where Tana Pasho teaches the town's children their letters and numbers.",
    "name": "Jalanthar Schoolhouse",
    "services": [],
    "wares": [],
    "priceMultiplier": 1.5,
    "coords": {
      "x": 31.7,
      "y": 55.7
    },
    "interiorLayoutImage": "",
    "residents": [],
    "subheader": "The Town Classroom",
    "quadrant": "inhabited",
    "menu": []
  },
  {
    "id": "bld-lu-tana-residence",
    "quadrant": "inhabited",
    "menu": [],
    "residents": [
      "npc-lu-pasho",
      "npc-tana-pasho",
      "npc-nyra-pasho"
    ],
    "interiorLayoutImage": "",
    "subheader": "A Home Half Full of Books",
    "priceMultiplier": 1.5,
    "services": [],
    "wares": [],
    "coords": {
      "y": 68.3,
      "x": 10.3
    },
    "type": "Residence",
    "description": "A modest home shared by the Pasho couple and their infant daughter, books stacked in every room.",
    "name": "Willowmere Cottage"
  },
  {
    "id": "bld-magistrate-house",
    "coords": {
      "x": 24,
      "y": 22
    },
    "priceMultiplier": 1.5,
    "services": [],
    "wares": [],
    "name": "Magistrate's House",
    "type": "Civic",
    "description": "Originally built as a guildhall for a town three times Jalanthar's current size, this squared timber building now serves as both home and office for the magistrate. Its outer rooms sit empty and dust-sheeted; only the study and a single bedroom see regular use.",
    "quadrant": "inhabited",
    "menu": [],
    "subheader": "Seat of Governance",
    "interiorLayoutImage": "",
    "residents": [
      "npc-magistrate",
      "08oteThmyEqNmQiTooc6",
      "PIAl7avdltjDfYdQCmTa",
      "owz4e8Fwl4k6dpnAJrXi"
    ]
  },
  {
    "id": "bld-met-pasho-residence",
    "description": "A small, quiet home kept by Met Pasho alone, sparsely decorated apart from a few devotional items.",
    "type": "Residence",
    "name": "The Hollow Bough",
    "priceMultiplier": 1.5,
    "wares": [],
    "services": [],
    "coords": {
      "y": 70.6,
      "x": 8.4
    },
    "interiorLayoutImage": "",
    "residents": [
      "npc-met-pasho"
    ],
    "subheader": "A Quiet Devotion",
    "menu": [],
    "quadrant": "inhabited"
  },
  {
    "id": "bld-old-vod-house",
    "quadrant": "inhabited",
    "menu": [],
    "subheader": "Where the Ledgers Are Kept",
    "interiorLayoutImage": "",
    "residents": [
      "npc-senna-vod",
      "npc-aldous-vod"
    ],
    "coords": {
      "x": 80,
      "y": 85.5
    },
    "services": [],
    "wares": [],
    "priceMultiplier": 1.5,
    "name": "The Old Vod House",
    "type": "Residence",
    "description": "Smaller and tidier than the main homestead, stacked with the ledgers and records its owner keeps for the magistrate."
  },
  {
    "id": "bld-pasho-manor",
    "name": "Pasho Manor",
    "description": "A large manor house that once held a household of servants and fine furnishings, now mostly empty rooms kept as presentable as its owners can manage.",
    "type": "Residence",
    "coords": {
      "y": 85,
      "x": 34.4
    },
    "services": [],
    "wares": [],
    "priceMultiplier": 1.5,
    "subheader": "Ancestral Home",
    "interiorLayoutImage": "",
    "residents": [
      "npc-cassian-pasho",
      "npc-liora-pasho"
    ],
    "menu": [],
    "quadrant": "inhabited"
  },
  {
    "id": "bld-rihlo-house",
    "coords": {
      "x": 21.8,
      "y": 84.1
    },
    "services": [],
    "wares": [],
    "priceMultiplier": 1.5,
    "name": "Rihlo House",
    "description": "An old, well-kept house at the edge of town, its garden unusually lush for the region — tended personally by its elven owner.",
    "type": "Residence",
    "menu": [],
    "quadrant": "inhabited",
    "subheader": "Where the Garden Never Wilts",
    "interiorLayoutImage": "",
    "residents": [
      "npc-krikas-rihlo",
      "npc-olma-rihlo",
      "npc-el-pasho"
    ]
  },
  {
    "id": "bld-rorics-trophy-room",
    "type": "Residence",
    "name": "The Trophy Cottage",
    "services": [],
    "coords": {
      "y": 28.3,
      "x": 67.1
    },
    "subheader": "A home on the Thistlebrook stretch of town",
    "menu": [],
    "revealed": false,
    "description": "A small, single-room home almost entirely given over to mounted trophies — hides, claws, and one very large set of antlers he won't stop talking about.",
    "priceMultiplier": 1.5,
    "wares": [],
    "residents": [
      "npc-roric-thistlebrook"
    ],
    "interiorLayoutImage": "",
    "quadrant": "inhabited"
  },
  {
    "id": "bld-silverleaf-stage",
    "name": "The Silverleaf Stage",
    "description": "Jalanthar's first playhouse, funded and overseen by Lu Pasho and written for by his sister Ven. Construction is underway but not yet complete.",
    "type": "Civic",
    "coords": {
      "y": 94.6,
      "x": 62.6
    },
    "priceMultiplier": 1.5,
    "wares": [],
    "services": [],
    "subheader": "Playhouse (Under Construction)",
    "residents": [],
    "interiorLayoutImage": "",
    "menu": [],
    "quadrant": "inhabited"
  },
  {
    "id": "bld-thistlebrook-warren",
    "name": "Thistlebrook Warren",
    "type": "Residence",
    "coords": {
      "x": 56.8,
      "y": 26.1
    },
    "services": [],
    "subheader": "Four Under One Roof",
    "revealed": false,
    "menu": [],
    "description": "A halfling-scaled burrow-home built into a converted larger foundation — low doorways and close, warm rooms carved out of a building meant for a much taller household. Permanently smells of leather, woodsmoke, and drying herbs.",
    "wares": [],
    "priceMultiplier": 1.5,
    "interiorLayoutImage": "",
    "residents": [
      "G06j5K3dTAFPEo24iFuZ",
      "npc-cobb-thistlebrook",
      "npc-oswin-thistlebrook",
      "npc-tobin-thistlebrook"
    ],
    "quadrant": "inhabited"
  },
  {
    "id": "bld-triad-shrine",
    "interiorLayoutImage": "",
    "residents": [],
    "subheader": "Helm, Ilmater, Torm",
    "quadrant": "inhabited",
    "menu": [],
    "type": "Shrine",
    "description": "A modest shrine at the edge of the central plaza, tended without a proper cleric — the town relies on a lay caretaker and traveling priests passing the Moon Pass road.",
    "name": "Shrine of the Triad",
    "services": [
      {
        "rowId": "seed-svc-1",
        "priceOverride": "",
        "name": "Minor spellcasting service",
        "description": "A simple spell cast on your behalf, if someone capable is willing.",
        "basePrice": 10
      }
    ],
    "wares": [],
    "priceMultiplier": 1.5,
    "coords": {
      "x": 50,
      "y": 40
    }
  },
  {
    "id": "bld-ven-pasho-residence",
    "interiorLayoutImage": "",
    "residents": [
      "npc-ven-pasho"
    ],
    "subheader": "Drafts and Ambition",
    "quadrant": "inhabited",
    "menu": [],
    "type": "Residence",
    "description": "A cluttered single-room home, more workspace than living space — drafts of plays cover most surfaces.",
    "name": "The Inkwell",
    "priceMultiplier": 1.5,
    "wares": [],
    "services": [],
    "coords": {
      "y": 63.1,
      "x": 9.3
    }
  },
  {
    "id": "bld-vod-homestead",
    "interiorLayoutImage": "",
    "residents": [
      "npc-tomas-vod",
      "npc-ressa-vod",
      "npc-garrick-vod",
      "npc-finn-vod",
      "npc-emeric-vod",
      "npc-wren-vod"
    ],
    "subheader": "Family Seat",
    "quadrant": "inhabited",
    "menu": [],
    "type": "Residence",
    "description": "A sprawling, patched-together house at the edge of town, expanded haphazardly across four generations. Loud most nights.",
    "name": "Vod Homestead",
    "priceMultiplier": 1.5,
    "wares": [],
    "services": [],
    "coords": {
      "y": 70.8,
      "x": 76.1
    }
  },
  {
    "id": "xmZvRARmOG5P103hNS4J",
    "coords": {
      "x": 25.1,
      "y": 41.5
    },
    "priceMultiplier": 1.7,
    "wares": [
      {
        "basePrice": 0.1,
        "rowId": "row-1783481011796-bdbb0",
        "priceOverride": "",
        "name": "Club",
        "quantity": 13,
        "description": "A stout length of wood, favored by those who can't afford better."
      },
      {
        "rowId": "row-1783481014591-g809k",
        "priceOverride": "",
        "quantity": 35,
        "name": "Dagger",
        "description": "Light and easily concealed; a favorite backup blade.",
        "basePrice": 2
      },
      {
        "basePrice": 0.2,
        "description": "A heavy, roughly shaped bludgeon swung with both hands.",
        "priceOverride": "",
        "rowId": "row-1783481017261-j12mo",
        "name": "Greatclub",
        "quantity": 15
      },
      {
        "basePrice": 5,
        "description": "Small enough to throw, sharp enough to matter.",
        "quantity": 8,
        "name": "Handaxe",
        "rowId": "row-1783481021137-kpur6",
        "priceOverride": ""
      },
      {
        "description": "A simple thrown spear, cheap enough to lose in a fight.",
        "name": "Javelin",
        "quantity": 3,
        "priceOverride": "",
        "rowId": "row-1783481024237-5n51p",
        "basePrice": 0.5
      },
      {
        "basePrice": 1,
        "rowId": "row-1783481035654-8ngby",
        "priceOverride": "",
        "quantity": 5,
        "name": "Spear",
        "description": "Reaches further than most blades and can be thrown in a pinch."
      },
      {
        "description": "Boiled and shaped hide, light enough to move freely in.",
        "rowId": "row-1783481048120-7dgt5",
        "priceOverride": "",
        "quantity": 2,
        "name": "Leather Armor",
        "basePrice": 10
      },
      {
        "basePrice": 45,
        "priceOverride": "",
        "rowId": "row-1783481055359-aewcw",
        "name": "Studded Leather Armor",
        "quantity": 3,
        "description": "Leather reinforced with rivets and small plates."
      },
      {
        "basePrice": 10,
        "rowId": "row-1783481060291-nn0rq",
        "priceOverride": "",
        "name": "Hide Armor",
        "quantity": 5,
        "description": "Roughly cured furs and pelts, common among frontier trackers."
      },
      {
        "basePrice": 10,
        "description": "A wooden or metal shield strapped to the forearm.",
        "name": "Shield",
        "quantity": 2,
        "priceOverride": "",
        "rowId": "row-1783481068541-tp6j5"
      },
      {
        "priceOverride": "",
        "rowId": "row-1783481113112-fy8o0",
        "quantity": 7,
        "name": "Backpack",
        "description": "Holds a fair amount of gear across the shoulders.",
        "basePrice": 2
      },
      {
        "basePrice": 1,
        "quantity": 6,
        "name": "Ball Bearings (bag of 1,000)",
        "priceOverride": "",
        "rowId": "row-1783481118303-6mtfj",
        "description": "Scattered underfoot to put anyone chasing off balance."
      },
      {
        "description": "Wool, worn thin but warm enough.",
        "quantity": 4,
        "name": "Blanket",
        "rowId": "row-1783481123149-1vbwo",
        "priceOverride": "",
        "basePrice": 0.5
      },
      {
        "name": "Basket",
        "quantity": "infinite",
        "rowId": "row-1783481126865-l3z8k",
        "priceOverride": "",
        "description": "Woven reed or wicker, light and cheap.",
        "basePrice": 0.4
      },
      {
        "basePrice": 0.05,
        "description": "Plain wood, banded in iron.",
        "name": "Bucket",
        "quantity": "infinite",
        "rowId": "row-1783481135595-pki1j",
        "priceOverride": ""
      },
      {
        "basePrice": 25,
        "rowId": "row-1783481210370-uyfrl",
        "priceOverride": "",
        "quantity": 6,
        "name": "Climber's Kit",
        "description": "Pitons, boot spikes, and rope loops for scaling rough terrain."
      },
      {
        "basePrice": 25,
        "priceOverride": "",
        "rowId": "row-1783481251870-5ohib",
        "quantity": 4,
        "name": "Component Pouch",
        "description": "A belt pouch designed to hold spellcasting materials."
      },
      {
        "description": "A sawtooth steel trap for catching game — or worse.",
        "priceOverride": "",
        "rowId": "row-1783481272890-f97yb",
        "name": "Hunting Trap",
        "quantity": 5,
        "basePrice": 5
      },
      {
        "name": "Waterskin",
        "quantity": 4,
        "rowId": "row-1783481316461-1g1w0",
        "priceOverride": "",
        "description": "Holds about four pints.",
        "basePrice": 0.2
      },
      {
        "description": "Canvas and poles, enough to keep the rain off two people.",
        "rowId": "row-1783481325011-sv4rq",
        "priceOverride": "",
        "name": "Tent (two-person)",
        "quantity": 3,
        "basePrice": 2
      },
      {
        "description": "Rare and expensive; a prized find out here.",
        "quantity": 2,
        "name": "Spyglass",
        "priceOverride": "",
        "rowId": "row-1783481334786-338sm",
        "basePrice": 1000
      },
      {
        "basePrice": 1,
        "rowId": "row-1783481346807-0f2h6",
        "priceOverride": "",
        "name": "Robe",
        "quantity": 5,
        "description": "Loose ceremonial or vocational garment."
      },
      {
        "basePrice": 1,
        "priceOverride": "",
        "rowId": "row-1783481362511-1lk7h",
        "name": "Quiver",
        "quantity": 3,
        "description": "Holds up to 20 arrows."
      },
      {
        "basePrice": 2,
        "rowId": "row-1783481372349-64igl",
        "priceOverride": "",
        "name": "Pot, Iron",
        "quantity": 4,
        "description": "For cooking over an open fire."
      },
      {
        "rowId": "row-1783481395493-46q5q",
        "priceOverride": "",
        "name": "Crowbar",
        "quantity": 10,
        "description": "Good for prying, occasionally good for worse.",
        "basePrice": 2
      },
      {
        "description": "A quiver's worth, fletched and ready.",
        "priceOverride": "3",
        "rowId": "row-1783481419643-md6gq",
        "name": "Arrows (20)",
        "quantity": 10,
        "basePrice": 1
      },
      {
        "basePrice": 1,
        "description": "Crossbow bolts, bundled by the case.",
        "quantity": 5,
        "name": "Bolts (20)",
        "rowId": "row-1783481422860-mlcjv",
        "priceOverride": ""
      },
      {
        "description": "Fine pens and inks for careful lettering.",
        "name": "Calligrapher's Supplies",
        "quantity": 5,
        "priceOverride": "",
        "rowId": "row-1783483757381-gyymy",
        "basePrice": 10
      },
      {
        "description": "Saw, hammer, and chisels for woodwork.",
        "quantity": "infinite",
        "name": "Carpenter's Tools",
        "priceOverride": "",
        "rowId": "row-1783483757381-rm3ky",
        "basePrice": 8
      },
      {
        "rowId": "row-1783483757381-r5po1",
        "priceOverride": "",
        "name": "Cartographer's Tools",
        "quantity": "infinite",
        "description": "Ink, straightedge, and fine papers for mapmaking.",
        "basePrice": 15
      },
      {
        "description": "For repairing or making boots and shoes.",
        "quantity": "infinite",
        "name": "Cobbler's Tools",
        "rowId": "row-1783483757381-8nfdw",
        "priceOverride": "",
        "basePrice": 5
      },
      {
        "description": "Pots, knives, and stirring spoons.",
        "priceOverride": "",
        "rowId": "row-1783483757381-13wzb",
        "quantity": "infinite",
        "name": "Cook's Utensils",
        "basePrice": 1
      },
      {
        "basePrice": 25,
        "description": "Fine picks and loupes for gem work.",
        "priceOverride": "",
        "rowId": "row-1783483757381-86x16",
        "quantity": "infinite",
        "name": "Jeweler's Tools"
      },
      {
        "description": "Awls, needles, and a stretching frame.",
        "name": "Leatherworker's Tools",
        "quantity": "infinite",
        "priceOverride": "",
        "rowId": "row-1783483757381-grqel",
        "basePrice": 5
      },
      {
        "description": "Chisels and a hammer for stonework.",
        "quantity": "infinite",
        "name": "Mason's Tools",
        "priceOverride": "",
        "rowId": "row-1783483757381-v5drr",
        "basePrice": 10
      },
      {
        "description": "Brushes, pigments, and a palette.",
        "priceOverride": "",
        "rowId": "row-1783483757381-uy8mu",
        "name": "Painter's Supplies",
        "quantity": 10,
        "basePrice": 10
      },
      {
        "description": "A wheel and shaping tools.",
        "quantity": "infinite",
        "name": "Potter's Tools",
        "priceOverride": "",
        "rowId": "row-1783483757381-4p80k",
        "basePrice": 10
      },
      {
        "name": "Smith's Tools",
        "quantity": "infinite",
        "rowId": "row-1783483757381-x8go9",
        "priceOverride": "",
        "description": "Tongs, hammer, and files for metalwork.",
        "basePrice": 20
      },
      {
        "description": "Small tools for repairing mechanisms.",
        "quantity": "infinite",
        "name": "Tinker's Tools",
        "priceOverride": "",
        "rowId": "row-1783483757381-vkpai",
        "basePrice": 50
      },
      {
        "basePrice": 1,
        "description": "A simple hand loom and shuttle.",
        "quantity": 1,
        "name": "Weaver's Tools",
        "priceOverride": "",
        "rowId": "row-1783483757381-o7c79"
      },
      {
        "description": "Knives and gouges for detail work.",
        "rowId": "row-1783483757381-j14i8",
        "priceOverride": "",
        "quantity": "infinite",
        "name": "Woodcarver's Tools",
        "basePrice": 1
      },
      {
        "description": "Charts and instruments for plotting a course.",
        "name": "Navigator's Tools",
        "quantity": 1,
        "priceOverride": "",
        "rowId": "row-1783483757381-h1gdd",
        "basePrice": 25
      },
      {
        "basePrice": 0.1,
        "name": "Gaming Set, Dice",
        "quantity": 6,
        "priceOverride": "",
        "rowId": "row-1783483757381-do3g1",
        "description": "Bone or carved wood."
      },
      {
        "rowId": "row-1783483757381-2bwcn",
        "priceOverride": "",
        "quantity": 1,
        "name": "Gaming Set, Dragonchess",
        "description": "An elaborate strategy game, rarely seen in a town this small.",
        "basePrice": 1
      },
      {
        "basePrice": 0.5,
        "description": "A worn deck, hand-painted.",
        "rowId": "row-1783483757381-c3fuu",
        "priceOverride": "",
        "name": "Gaming Set, Playing Cards",
        "quantity": 5
      },
      {
        "basePrice": 1,
        "description": "A fast, betting-heavy card game.",
        "quantity": 5,
        "name": "Gaming Set, Three-Dragon Ante",
        "rowId": "row-1783483757381-ekavw",
        "priceOverride": ""
      },
      {
        "basePrice": 6,
        "rowId": "row-1783483757381-amekg",
        "priceOverride": "",
        "quantity": 1,
        "name": "Musical Instrument, Drum",
        "description": "A simple hand drum."
      },
      {
        "basePrice": 25,
        "description": "Struck strings over a wooden frame.",
        "rowId": "row-1783483757381-6zrft",
        "priceOverride": "",
        "name": "Musical Instrument, Dulcimer",
        "quantity": 1
      },
      {
        "description": "Carved from bone or wood.",
        "name": "Musical Instrument, Flute",
        "quantity": 1,
        "rowId": "row-1783483757381-ajg82",
        "priceOverride": "",
        "basePrice": 2
      },
      {
        "basePrice": 35,
        "description": "A well-worn but playable stringed instrument.",
        "rowId": "row-1783483757381-5p984",
        "priceOverride": "",
        "name": "Musical Instrument, Lute",
        "quantity": 1
      },
      {
        "basePrice": 30,
        "name": "Musical Instrument, Lyre",
        "quantity": 1,
        "rowId": "row-1783483757381-ekbv8",
        "priceOverride": "",
        "description": "Small, plucked, and portable."
      },
      {
        "basePrice": 12,
        "priceOverride": "",
        "rowId": "row-1783483757381-11it5",
        "name": "Musical Instrument, Pan Flute",
        "quantity": 1,
        "description": "A row of tuned pipes."
      },
      {
        "name": "Musical Instrument, Shawm",
        "quantity": 1,
        "priceOverride": "",
        "rowId": "row-1783483757381-nda98",
        "description": "A reedy, piercing woodwind.",
        "basePrice": 2
      },
      {
        "quantity": 1,
        "name": "Musical Instrument, Viol",
        "rowId": "row-1783483757381-8isoa",
        "priceOverride": "",
        "description": "Bowed strings, favored by traveling performers.",
        "basePrice": 30
      }
    ],
    "services": [],
    "name": "Wares for the Clever Northman",
    "description": "One of four stores in town, Northman, as its known to the locals, is a rather large general store that serves most of the needs of the town. Here you can buy everything from Calishian Honeydrop candies to lamp oil to the newest romantic penny serial from Silverymoon.",
    "type": "Shop",
    "menu": [],
    "quadrant": "inhabited",
    "subheader": "General Store ",
    "interiorLayoutImage": "",
    "residents": []
  },
  {
    "id": "zXs3it1a46O7OErCyXZM",
    "name": "Banks of Rauvin Livery",
    "type": "Shop",
    "coords": {
      "y": 85,
      "x": 56
    },
    "services": [
      {
        "basePrice": 0.02,
        "description": "Carries word or small parcels at a price per distance — a rare service this deep in the Marches.",
        "priceOverride": "",
        "rowId": "row-1783530054922-9n0mk",
        "quantity": 1,
        "name": "Messenger (per mile)"
      }
    ],
    "subheader": "A Small Stables and Livery",
    "revealed": false,
    "menu": [],
    "description": "A small livery shop with an attached stable that can hold up to 12 mounts. The surprisingly neat shop is bisected by a long wooden counter covered in saddles, tacks and reeks of leather and hay. The horses can be seen from inside the shop.",
    "priceMultiplier": 1.5,
    "wares": [
      {
        "basePrice": 50,
        "description": "Strong-backed and built for pulling loads.",
        "name": "Horse, Draft",
        "quantity": 1,
        "rowId": "row-1783529784084-49ilr",
        "priceOverride": ""
      },
      {
        "basePrice": 75,
        "description": "Bred for travel rather than battle.",
        "name": "Horse, Riding",
        "quantity": 3,
        "rowId": "row-1783529784084-f1o6i",
        "priceOverride": ""
      },
      {
        "basePrice": 8,
        "priceOverride": "",
        "rowId": "row-1783529784084-jwmpk",
        "quantity": 1,
        "name": "Mule",
        "description": "Sturdy and stubborn, good for hauling."
      },
      {
        "basePrice": 30,
        "description": "Smaller and hardier than a full horse.",
        "quantity": 1,
        "name": "Pony",
        "priceOverride": "",
        "rowId": "row-1783529784084-gsa4d"
      },
      {
        "description": "A two-wheeled hauler.",
        "name": "Cart",
        "quantity": 1,
        "rowId": "row-1783529932627-o2ruu",
        "priceOverride": "",
        "basePrice": 15
      },
      {
        "quantity": "infinite",
        "name": "Feed (per day)",
        "priceOverride": "",
        "rowId": "row-1783529932627-tlxnz",
        "description": "Enough grain and hay for one animal, one day.",
        "basePrice": 0.05
      },
      {
        "description": "Helps a rider stay mounted through chaos.",
        "rowId": "row-1783529932627-56nkg",
        "priceOverride": "",
        "name": "Saddle, Military",
        "quantity": 1,
        "basePrice": 20
      },
      {
        "description": "A standard saddle for everyday travel.",
        "priceOverride": "",
        "rowId": "row-1783529932627-7idf8",
        "quantity": 3,
        "name": "Saddle, Riding",
        "basePrice": 10
      },
      {
        "rowId": "row-1783529932627-4f5l1",
        "priceOverride": "",
        "name": "Stabling (per night)",
        "quantity": "infinite",
        "description": "A stall, feed, and a roof for a mount.",
        "basePrice": 0.5
      }
    ],
    "interiorLayoutImage": "",
    "residents": [
      "npc-osric-colby",
      "npc-nan-colby"
    ],
    "icon": "",
    "quadrant": "inhabited"
  },
  {
    "id": "bld-halden-hearth",
    "name": "Halden Hearth",
    "subheader": "Where the Guard Comes Home",
    "type": "Residence",
    "coords": {
      "x": 50,
      "y": 50
    },
    "quadrant": "inhabited",
    "interiorLayoutImage": "",
    "description": "A modest guardsman's cottage kept spotless by Elsbeth, with a wooden practice sword permanently underfoot and a mending basket that never quite empties.",
    "residents": [
      "npc-corwin-halden",
      "npc-elsbeth-halden",
      "npc-talia-halden",
      "npc-perrin-halden"
    ],
    "revealed": false,
    "priceMultiplier": 1.5,
    "wares": [],
    "menu": [],
    "services": []
  },
  {
    "id": "bld-marrow-house",
    "name": "Marrow House",
    "subheader": "The Baker's Backyard",
    "type": "Residence",
    "coords": {
      "x": 50,
      "y": 50
    },
    "quadrant": "inhabited",
    "interiorLayoutImage": "",
    "description": "Hollis and Billie's home, permanently smelling of woodsmoke and fresh bread — Billie sells treats and goods straight out of the backyard most afternoons.",
    "residents": [
      "npc-hollis-marrow",
      "npc-billie-marrow"
    ],
    "revealed": false,
    "priceMultiplier": 1.5,
    "wares": [],
    "menu": [],
    "services": []
  },
  {
    "id": "bld-frosted-larder",
    "name": "The Frosted Larder",
    "subheader": "Cold Year-Round, Regardless of Season",
    "type": "Residence",
    "coords": {
      "x": 50,
      "y": 50
    },
    "quadrant": "inhabited",
    "interiorLayoutImage": "",
    "description": "Ember and Callan's shared home — the larder never spoils and the doorstep never ices over in winter, courtesy of the household's resident cryomancer.",
    "residents": [
      "npc-ember-marrow",
      "npc-callan-marrow"
    ],
    "revealed": false,
    "priceMultiplier": 1.5,
    "wares": [],
    "menu": [],
    "services": []
  },
  {
    "id": "bld-sparrow-house",
    "name": "Sparrow House",
    "subheader": "Small, Warm, and a Little Cluttered With Toys",
    "type": "Residence",
    "coords": {
      "x": 50,
      "y": 50
    },
    "quadrant": "inhabited",
    "interiorLayoutImage": "",
    "description": "A modest home a short walk from the temple, unremarkable from the outside except for the wooden charms — sparrows, mostly, a few mismatched others — that Tobias has carved and hung by the door over the years, one for every child in the congregation he's worried about at some point.",
    "residents": [
      "npc-maren-sparrow",
      "npc-tobias-sparrow",
      "npc-lark-sparrow",
      "npc-pip-sparrow"
    ],
    "revealed": false,
    "priceMultiplier": 1.5,
    "wares": [],
    "menu": [],
    "services": []
  },
  {
    "id": "bld-greenhollow-cottage",
    "name": "Greenhollow Cottage",
    "subheader": "Where the Roots Follow You Home",
    "type": "Residence",
    "coords": {
      "x": 50,
      "y": 50
    },
    "quadrant": "inhabited",
    "interiorLayoutImage": "",
    "description": "A halfling-scaled cottage a short walk from the Oakenhall, its window boxes overflowing with the same plantings Fennel tends at the shrine — hard to tell where his personal garden ends and the temple's grounds begin.",
    "residents": [
      "npc-alder-greenhollow",
      "npc-fennel-greenhollow"
    ],
    "revealed": false,
    "priceMultiplier": 1.5,
    "wares": [],
    "menu": [],
    "services": []
  },
  {
    "id": "bld-bramble-nook",
    "name": "The Bramble Nook",
    "subheader": "Not Quite a House",
    "type": "Residence",
    "coords": {
      "x": 50,
      "y": 50
    },
    "quadrant": "inhabited",
    "interiorLayoutImage": "",
    "description": "Not really a house so much as a lean-to woven directly into a hedgerow at the wood's edge, a short walk from the Oakenhall — reed pipes hung from a branch, a fire pit that's more scorched earth than hearth. Exactly as much home as a satyr seems to need.",
    "residents": [
      "npc-puck"
    ],
    "revealed": false,
    "priceMultiplier": 1.5,
    "wares": [],
    "menu": [],
    "services": []
  },
  {
    "id": "bld-rusken-house",
    "name": "Rusken House",
    "subheader": "Hides, Smoke, and Bowstrings",
    "type": "Residence",
    "coords": {
      "x": 50,
      "y": 50
    },
    "quadrant": "inhabited",
    "interiorLayoutImage": "",
    "description": "A weathered hunting household thick with the smell of smoke, leather, and tanning salts — cured hides stretched along one wall, snares and knives never far from reach.",
    "residents": [
      "npc-mara-rusken",
      "npc-osric-rusken",
      "npc-dain-rusken",
      "npc-corren-rusken"
    ],
    "revealed": false,
    "priceMultiplier": 1.5,
    "wares": [],
    "menu": [],
    "services": []
  },
  {
    "id": "bld-harlen-farmstead",
    "name": "Harlen Farmstead",
    "subheader": "Turned Fields and Goat Pens",
    "type": "Residence",
    "coords": {
      "x": 50,
      "y": 50
    },
    "quadrant": "inhabited",
    "interiorLayoutImage": "",
    "description": "A working farmhouse clawed back from a decade of weeds and bad seasons — fenced goat pens, a well-worn plow, and a household that runs on discipline more than comfort.",
    "residents": [
      "npc-bera-harlen",
      "npc-joric-harlen",
      "npc-tellen-harlen",
      "npc-pip-harlen"
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
    "genOverrides": {},
    "description": "",
    "treeLayout": {
      "7QQFmwsWLScKMhf6E6kJ": {
        "y": 88,
        "x": 100
      },
      "bmQNyEeMkoFFFwbp1W4M": {
        "x": -130,
        "y": 90
      },
      "owz4e8Fwl4k6dpnAJrXi": {
        "x": -82,
        "y": 272
      },
      "junction-NRyAJyk9oUGOm8GSzCz5-7QQFmwsWLScKMhf6E6kJ|bmQNyEeMkoFFFwbp1W4M": {
        "y": 199,
        "x": 68
      },
      "89lzexuOe7eJMOFcNBJJ": {
        "y": 268,
        "x": 134
      }
    },
    "name": "The Boscoes"
  },
  {
    "id": "a77cNMTkUYyhrKEgf17q",
    "description": "",
    "genOverrides": {},
    "name": "The Thistlebrooks",
    "treeLayout": {
      "G06j5K3dTAFPEo24iFuZ": {
        "x": -37,
        "y": 62
      },
      "npc-pell-thistlebrook": {
        "x": -176,
        "y": 362
      },
      "npc-fen-thistlebrook": {
        "y": 360,
        "x": -398
      },
      "npc-cobb-thistlebrook": {
        "x": -451,
        "y": 162
      },
      "npc-oswin-thistlebrook": {
        "y": 166,
        "x": 521
      },
      "npc-tobin-thistlebrook": {
        "x": 136,
        "y": 364
      },
      "npc-roric-thistlebrook": {
        "x": 312,
        "y": 358
      }
    }
  },
  {
    "id": "fam-fenner",
    "treeLayout": {
      "junction-fam-fenner-npc-marta-fenner|npc-wendel-fenner": {
        "y": 181,
        "x": 38
      },
      "npc-poppy-fenner": {
        "y": 258,
        "x": -26
      },
      "npc-wendel-fenner": {
        "y": 80,
        "x": 58
      },
      "npc-marta-fenner": {
        "x": -178,
        "y": 80
      }
    },
    "name": "The Fenners",
    "description": "A human couple running Wares for the Clever Northman, with a daughter the town can't agree on — some swear she's an awakened dog, others are just as sure she used to be a little girl. Wendel and Marta have never confirmed either story."
  },
  {
    "id": "fam-michael",
    "treeLayout": {
      "PIAl7avdltjDfYdQCmTa": {
        "x": 0,
        "y": 90
      }
    },
    "name": "The Michaels",
    "description": ""
  },
  {
    "id": "fam-pasho",
    "name": "The Pashos",
    "treeLayout": {
      "junction-fam-pasho-npc-lu-pasho|npc-tana-pasho": {
        "y": 369.7967813051147,
        "x": -233.74797561721448
      },
      "junction-fam-pasho-npc-cassian-pasho|npc-liora-pasho": {
        "y": 168.38903685361552,
        "x": -60.34230560141077
      },
      "npc-met-pasho": {
        "y": 242.2208994708995,
        "x": 47.259700176367005
      },
      "npc-lu-pasho": {
        "y": 242.79678130511468,
        "x": -152.08346560846576
      },
      "npc-liora-pasho": {
        "y": 54.48655202821868,
        "x": 45.09854497354536
      },
      "npc-cassian-pasho": {
        "y": 52.394989234567674,
        "x": -275.7055547654322
      },
      "npc-ven-pasho": {
        "x": 256.7402998236332,
        "y": 241.591049382716
      },
      "npc-tana-pasho": {
        "x": -407.4124856259631,
        "y": 243.73773010588536
      },
      "npc-nyra-pasho": {
        "y": 459.7613315696649,
        "x": -296.816798941799
      }
    },
    "description": "A half-elf family of fading wealth and title, currently investing what remains of it in a new playhouse for the town."
  },
  {
    "id": "fam-rihlo",
    "description": "An elven patriarch, roughly 800 years old, on his third known family line of half-elf descendants in Jalanthar.",
    "name": "The Rihlos",
    "treeLayout": {
      "junction-fam-rihlo-npc-krikas-rihlo|npc-olma-rihlo": {
        "x": 1.7085317460318947,
        "y": 159
      },
      "npc-olma-rihlo": {
        "x": 114.41706349206379,
        "y": 59.60881834215155
      },
      "npc-maya-pasho": {
        "y": 264.30855379188716,
        "x": 1399.7192239858912
      },
      "npc-el-pasho": {
        "y": 338,
        "x": -61.20000000000255
      },
      "npc-krikas-rihlo": {
        "x": -221,
        "y": 58
      }
    },
    "edgeOverrides": {
      "e-cross-npc-olma-rihlo|npc-tana-pasho": {
        "hidden": true
      },
      "e-cross-npc-krikas-rihlo|npc-tana-pasho": {
        "hidden": true
      }
    }
  },
  {
    "id": "fam-thicket",
    "name": "The Thickets",
    "treeLayout": {
      "PIAl7avdltjDfYdQCmTa": {
        "y": 70,
        "x": 140
      },
      "08oteThmyEqNmQiTooc6": {
        "y": 72,
        "x": -295.2000000000007
      },
      "npc-magistrate": {
        "y": 70,
        "x": -66
      }
    },
    "description": ""
  },
  {
    "id": "fam-vod",
    "genOverrides": {
      "npc-senna-vod": 1,
      "npc-aldous-vod": 1,
      "npc-branner-vod": 1
    },
    "description": "Descendants of a well-known ranger who settled Jalanthar four generations ago. Currently modest hunters trading heavily on the family reputation.",
    "name": "The Vods",
    "treeLayout": {
      "npc-tomas-vod": {
        "x": 104,
        "y": 268
      },
      "junction-fam-vod-npc-ressa-vod|npc-tomas-vod": {
        "x": 189,
        "y": 445
      },
      "npc-garrick-vod": {
        "y": 268,
        "x": -314
      },
      "npc-emeric-vod": {
        "x": -71,
        "y": 568
      },
      "npc-finn-vod": {
        "y": 404,
        "x": -314
      },
      "junction-fam-vod-npc-aldous-vod|npc-senna-vod": {
        "x": -159,
        "y": 195
      },
      "npc-branner-vod": {
        "x": 372,
        "y": 88
      },
      "npc-wren-vod": {
        "y": 566,
        "x": 341
      },
      "npc-ressa-vod": {
        "y": 266,
        "x": 342
      },
      "npc-senna-vod": {
        "y": -286,
        "x": 306
      },
      "npc-aldous-vod": {
        "y": 82,
        "x": -280
      }
    }
  },
  {
    "id": "fam-halden",
    "name": "The Haldens",
    "description": "A guard family — Captain Bertrand Halden and his three sons, one married with children and content, the other two restless guardsmen who dream of more than Jalanthar has to offer."
  },
  {
    "id": "fam-marrow",
    "name": "The Marrows",
    "description": "The town's butcher-and-baker family. Their daughter Ember is one of Jalanthar's few known casters, keeping the town's food cold in summer and its roofs clear in winter; their son Callan hunts in the long shadow of the Thistlebrooks."
  },
  {
    "id": "fam-sparrow",
    "name": "The Sparrows",
    "description": "Clergy of the House of the Unsleeping Watcher, following the Cradlewatch — a small, widely-considered-heretical Helmite sect that reads Helm as a perpetual, innocent child rather than a grim eternal sentinel. Matriarch Maren leads; her husband Tobias tends the congregation's hearts as much as their souls."
  },
  {
    "id": "fam-greenhollow",
    "name": "The Greenhollows",
    "description": "Two halfling brothers who have run the Oakenhall, Jalanthar's shrine to Sylvanus, together for years — one tending the congregation, the other tending the grove the shrine is built around."
  },
  {
    "id": "fam-colby",
    "name": "The Colbys",
    "description": "An old, deeply settled married couple who have run Banks of Rauvin Livery for longer than most of the town has been alive."
  },
  {
    "id": "fam-rusken",
    "name": "The Ruskens",
    "description": "A hunting household that kept Jalanthar fed through its leanest years. Mara and Osric are steady, unshowy trackers; their sons Dain and Corren are capable in the field but spend too many evenings — and too much coin — at the Thrice Crowned Cockatrice."
  },
  {
    "id": "fam-harlen",
    "name": "The Harlens",
    "description": "A farming family that stayed after Jalanthar's abandonment rather than lose the only land they'd ever owned. Bera and Joric have spent a decade dragging the farm back from ruin; their eldest son Bren left for the town guard, leaving the heavier work to Tellen and youngest Pip."
  }
]

export const mockNpcs = [
  {
    "id": "08oteThmyEqNmQiTooc6",
    "job": "Magistrate's Clerk",
    "history": "",
    "distinguishingFeatures": "Astonishingly beautiful, with piercing purple eyes.",
    "familyName": "The Thickets",
    "eyeColor": "Black",
    "age": "114",
    "appearance": "Long black hair with silver streaks that reaches the floor when down and a dour expression, with lips always pursed and hands constantly clenched in judgement.",
    "personality": "A beautiful girl in her youth and a stunning woman now, Belora has spent the last few decades playing the good politician's wife. She has a taste for the finer things, and considers herself the only elegant woman in Jalanthar. She has made her displeasure at winding up in the backwater Jalanthar quite known.",
    "gender": "Woman",
    "relationships": [
      {
        "type": "spouse",
        "targetId": "npc-magistrate"
      }
    ],
    "clothing": "Stunning, elegant dresses, usually some kind of play on the town colors. ",
    "homeBuildingId": "bld-magistrate-house",
    "visible": false,
    "famousQuote": "",
    "weight": "25 lbs.",
    "name": "Belora Thicket",
    "height": "2' 8\"",
    "species": "Halfling",
    "hairColor": "Black"
  },
  {
    "id": "7QQFmwsWLScKMhf6E6kJ",
    "job": "Bartender & Bookkeeper, The Thrice Crowned Cockatrice",
    "history": "Married Frankie young; built the Cockatrice up with him across the same lean rebuilding years the town went through.",
    "distinguishingFeatures": "Tattoo of a small cockatrice with three crowns on her forearm — the tavern's sigil.",
    "familyName": "The Boscoes",
    "dndClass": "",
    "eyeColor": "Brown",
    "age": "",
    "gender": "Woman",
    "personality": "Warm to regulars, merciless to troublemakers. Actually runs the tavern day-to-day.",
    "appearance": "Sturdy build, forearms strong from hauling casks.",
    "relationships": [
      {
        "targetId": "bmQNyEeMkoFFFwbp1W4M",
        "type": "spouse"
      },
      {
        "targetId": "owz4e8Fwl4k6dpnAJrXi",
        "type": "child"
      },
      {
        "type": "child",
        "targetId": "89lzexuOe7eJMOFcNBJJ"
      }
    ],
    "clothing": "A stained apron over practical wool, sleeves always rolled.",
    "homeBuildingId": "bld-crowing-cockatrice",
    "visible": true,
    "weight": "160 lbs",
    "famousQuote": "\"Frankie feeds you. I decide if you get a second round.\"",
    "height": "5' 6\"",
    "name": "Colette \"Lettie\" Boscoe",
    "species": "Human",
    "hairColor": "Dark brown, silvering at the roots"
  },
  {
    "id": "89lzexuOe7eJMOFcNBJJ",
    "name": "Sabine Boscoe",
    "height": "6'1\"",
    "species": "Human",
    "hairColor": "Auburn ringlets, cropped very short",
    "famousQuote": "I've broken up worse fights than this one in my mother's tavern.",
    "weight": "145 lbs",
    "visible": true,
    "relationships": [
      {
        "type": "parent",
        "targetId": "7QQFmwsWLScKMhf6E6kJ"
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
    "homeBuildingId": "bld-garrison-quarters",
    "clothing": "Garrison uniform, worn a little looser than regulation.",
    "appearance": "Built like her mother — broad-shouldered; nose and forearms perpetually sunburned from standing watch.",
    "personality": "Blunt, physical, impatient with anyone who underestimates her.",
    "gender": "Woman",
    "dndClass": "Fighter",
    "history": "",
    "familyName": "The Boscoes",
    "distinguishingFeatures": "Missing a hand, replaced it with one made entirely of stone",
    "eyeColor": "Brown",
    "age": "23",
    "job": "Member of Town Guard"
  },
  {
    "id": "G06j5K3dTAFPEo24iFuZ",
    "job": "",
    "eyeColor": "Grey",
    "age": "58",
    "dndClass": "Hunter",
    "history": "Has hunted alongside Cobb for over two decades; their partnership is considered close to uncanny by the rest of the guild.",
    "distinguishingFeatures": "A row of small tattooed dashes along his right forearm — one per confirmed kill, a tally he started keeping decades ago.",
    "familyName": "The Thistlebrooks",
    "appearance": "Compact and wiry, permanently sun-weathered from decades in the field.",
    "personality": "Steady and unshowy. Doesn't brag because he doesn't need to — everyone in town already knows what he and Cobb can do.",
    "gender": "Man",
    "homeBuildingId": "KM5xfMaXQiPBESP3ZeXt",
    "clothing": "Practical leathers, patched more than replaced.",
    "relationships": [],
    "visible": false,
    "famousQuote": "",
    "weight": "42 lbs",
    "species": "Halfling",
    "hairColor": "Sandy brown, greying at the temples",
    "name": "Doran Thistlebrook",
    "height": "3'2\""
  },
  {
    "id": "JnESzQaEASu9sclo2HoC",
    "job": "Apothecary",
    "dndClass": "Misc",
    "history": "",
    "familyName": "",
    "distinguishingFeatures": "Normal man, but has visible black stumps where his horns were.",
    "eyeColor": "Black",
    "age": "43",
    "appearance": "A slender man with a soft, sun kissed face",
    "gender": "Man",
    "personality": "Voice will often go muffled when giving any private detail, including name",
    "relationships": [],
    "clothing": "Wears an old modified Harper uniform, modified and dyed purple, with a unique version of the Harper insignia.",
    "homeBuildingId": "9DVdbDyeq4AHI0F7lzNW",
    "visible": false,
    "famousQuote": "\"I miss the warmth of someone knowing you for who you really are\"",
    "weight": "120 lbs",
    "name": "Friend",
    "height": "5' 8\"",
    "species": "Human",
    "hairColor": "Black",
    "treePos": {
      "x": 1335.5230350827333,
      "y": 1063.069800172234
    }
  },
  {
    "id": "PIAl7avdltjDfYdQCmTa",
    "relationships": [
      {
        "targetId": "npc-magistrate",
        "type": "spouse"
      }
    ],
    "homeBuildingId": "bld-magistrate-house",
    "clothing": "A tight, burgundy vest with all the trappings of elegance, revealing bulging tattooed arms. He has an extensive cane collection, and it seems like he never uses the same cane twice.",
    "visible": false,
    "weight": "38 lbs",
    "famousQuote": "",
    "height": "3' 3\"",
    "name": "Ricton Thicket",
    "hairColor": "Bald",
    "species": "Halfling",
    "job": "Chamberlain",
    "history": "",
    "distinguishingFeatures": "A very discernible limp and a cane",
    "familyName": "The Thickets",
    "eyeColor": "Green",
    "age": "132",
    "personality": "He has a short temper that he has a good handle on. A voracious drinker, don't let him trap with you one of his stories of the good ol' days. ",
    "gender": "Man",
    "appearance": "A head shaved bald and a frame so packed with muscle he resembles a dwarf. He might even be confused for a dwarf if it weren't for his baby face, a dead give away he is a halfling."
  },
  {
    "id": "bmQNyEeMkoFFFwbp1W4M",
    "gender": "Man",
    "personality": "A deeply kind man who loves feeding others, he will rarely leave the kitchen. If he does, it's too pick up his spice shipment from the Northman's or the newest cut from the butchershop. Only time you'll see him angry is over his two daughters.",
    "appearance": "Very tight black ringlets that fall down to his shoulder and a tightly cropped beard. deep set crow's feet and smile lines from a lifetime of laughing",
    "age": "54",
    "eyeColor": "53",
    "history": "",
    "distinguishingFeatures": "Massive beer belly and a distinct waddle",
    "familyName": "The Boscoes",
    "dndClass": "",
    "job": "Owner and Head Chef, Thrice Crowned Cockatrice",
    "species": "Human",
    "hairColor": "Brown",
    "height": "5' 8\"",
    "name": "Franklin \"Frankie\" Boscoe",
    "weight": "200 lbs",
    "famousQuote": "",
    "visible": true,
    "homeBuildingId": "",
    "clothing": "Dirty apron and a massive knife hiding commoner's clothes.",
    "relationships": [
      {
        "targetId": "7QQFmwsWLScKMhf6E6kJ",
        "type": "spouse"
      },
      {
        "targetId": "owz4e8Fwl4k6dpnAJrXi",
        "type": "child"
      },
      {
        "type": "child",
        "targetId": "89lzexuOe7eJMOFcNBJJ"
      }
    ]
  },
  {
    "id": "npc-aldous-vod",
    "job": "Ledgerhand to the Magistrate",
    "familyName": "The Vods",
    "distinguishingFeatures": "A faded burn scar on the back of his left hand.",
    "history": "Married Senna and took the Vod name. Maintains the town's rolls, warrants, and records for the magistrate.",
    "age": 70,
    "eyeColor": "Blue",
    "personality": "Even-tempered and methodical, unbothered by the family's reputation politics.",
    "gender": "Man",
    "appearance": "Soft-bodied, round-shouldered, wire-rimmed glasses.",
    "relationships": [
      {
        "targetId": "npc-senna-vod",
        "type": "spouse"
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
    "homeBuildingId": "bld-old-vod-house",
    "clothing": "A neat clerk's coat.",
    "visible": false,
    "weight": "150 lb",
    "famousQuote": "Somebody has to remember who owes what.",
    "height": "5'7\"",
    "name": "Aldous Vod",
    "hairColor": "Bald, grey at temples",
    "species": "Human"
  },
  {
    "id": "npc-branner-vod",
    "job": "Retired hunter",
    "familyName": "The Vods",
    "distinguishingFeatures": "Missing two fingers on his off hand.",
    "history": "Hunted alongside Senna for roughly two decades. Has not hunted anything larger than a hare in approximately ten years.",
    "eyeColor": "Brown",
    "age": 65,
    "gender": "Man",
    "personality": "Talkative, repeats the same handful of hunting stories often. Fond of the youngest Vod children.",
    "appearance": "Big-boned, stooped with age.",
    "relationships": [
      {
        "type": "sibling",
        "targetId": "npc-senna-vod"
      },
      {
        "targetId": "npc-finn-vod",
        "type": "friend"
      }
    ],
    "clothing": "An old hunting coat he refuses to replace.",
    "homeBuildingId": "bld-branners-cottage",
    "visible": false,
    "weight": "165 lb",
    "famousQuote": "Ask me about the bulette. No — ask me.",
    "height": "5'9\"",
    "name": "Branner Vod",
    "hairColor": "Grey, thinning",
    "species": "Human"
  },
  {
    "id": "npc-cassian-pasho",
    "homeBuildingId": "bld-pasho-manor",
    "clothing": "Old, well-kept formal attire.",
    "relationships": [
      {
        "targetId": "npc-liora-pasho",
        "type": "spouse"
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
    "visible": false,
    "weight": "155 lb",
    "famousQuote": "We are Pashos. That has always been enough.",
    "species": "Elf",
    "hairColor": "White (once blond)",
    "height": "5'9\"",
    "name": "Cassian Pasho",
    "job": "None (landed)",
    "age": 62,
    "eyeColor": "Blue",
    "familyName": "The Pashos",
    "distinguishingFeatures": "A signet ring, never removed.",
    "history": "Head of the Pasho family. Presides over the family's ancestral manor, now largely emptied of its former wealth.",
    "personality": "Formal and status-conscious, leans on family name and title.",
    "gender": "Man",
    "appearance": "Tall, thin with age."
  },
  {
    "id": "npc-cobb-thistlebrook",
    "weight": "39 lb",
    "famousQuote": "I don't watch his hands. I already know what they're doing.",
    "species": "Halfling",
    "hairColor": "Dark brown, kept short",
    "height": "3'1\"",
    "name": "Cobb Thistlebrook",
    "homeBuildingId": "bld-thistlebrook-warren",
    "clothing": "Same practical leathers as Doran, deliberately outfitted to match.",
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
        "type": "child",
        "targetId": "npc-fen-thistlebrook"
      },
      {
        "targetId": "npc-tobin-thistlebrook",
        "type": "child"
      }
    ],
    "visible": false,
    "personality": "Quiet in a way that reads as confidence, not shyness. Lets Doran do the talking in town; in the field, they barely need words at all.",
    "gender": "Man",
    "appearance": "Broader through the shoulders than most halflings, built for hauling a kill home.",
    "job": "Hunter",
    "eyeColor": "Brown",
    "age": 54,
    "familyName": "The Thistlebrooks",
    "distinguishingFeatures": "The matching tally-mark tattoo, on his left forearm — his and Doran's counts are only ever compared side by side.",
    "history": "Paired with Doran early in both their careers; the two have hunted as a single unit ever since, to the point the guild stopped assigning them separate routes.",
    "dndClass": "Hunter"
  },
  {
    "id": "npc-el-pasho",
    "familyName": "The Rihlos",
    "distinguishingFeatures": "",
    "history": "Youngest daughter of Krikas and Olma Rihlo.",
    "eyeColor": "Brown",
    "age": 12,
    "job": "None (child)",
    "gender": "Woman",
    "personality": "Behaves and understands the world at roughly the level of a six-year-old, consistent with half-elves maturing at half the human rate.",
    "appearance": "Small even for a half-elf her age, round-faced.",
    "visible": false,
    "relationships": [
      {
        "targetId": "npc-krikas-rihlo",
        "type": "parent"
      },
      {
        "targetId": "npc-olma-rihlo",
        "type": "parent"
      },
      {
        "targetId": "npc-tana-pasho",
        "type": "sibling"
      },
      {
        "type": "sibling",
        "targetId": "npc-maya-pasho"
      }
    ],
    "homeBuildingId": "bld-rihlo-house",
    "clothing": "Simple children's clothing.",
    "height": "~3'8\"",
    "name": "El Rihlo",
    "hairColor": "Dark brown, loose",
    "species": "Half-Elf",
    "weight": "~45 lb",
    "famousQuote": "I'm not a baby. I'm twelve."
  },
  {
    "id": "npc-emeric-vod",
    "appearance": "Takes after Ressa — narrow build.",
    "personality": "Competitive, a little cruel toward his sister, eager to outdo his father's reputation.",
    "gender": "Man",
    "familyName": "The Vods",
    "distinguishingFeatures": "",
    "history": "Elder child of Tomas and Ressa. Being raised with strict expectations around hunting and survival skills.",
    "eyeColor": "Green",
    "age": "17",
    "job": "Member of the Town Guard",
    "name": "Emeric Vod",
    "height": "5'2\"",
    "hairColor": "Black",
    "species": "Human",
    "famousQuote": "This is my family's town which means its my town.",
    "weight": "100 lb",
    "visible": false,
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
        "targetId": "npc-wren-vod",
        "type": "sibling"
      },
      {
        "targetId": "npc-garrick-vod",
        "type": "uncle"
      },
      {
        "type": "grandparent",
        "targetId": "npc-senna-vod"
      },
      {
        "type": "grandparent",
        "targetId": "npc-aldous-vod"
      },
      {
        "targetId": "npc-finn-vod",
        "type": "cousin"
      }
    ],
    "homeBuildingId": "bld-vod-homestead",
    "clothing": "Scaled-down hunting gear."
  },
  {
    "id": "npc-fen-thistlebrook",
    "appearance": "Lean and still — Fen can sit motionless longer than anyone in town has the patience to watch.",
    "gender": "Man",
    "personality": "Meticulous, solitary, more comfortable resetting a trapline than making conversation.",
    "job": "Trapper",
    "dndClass": "Hunter",
    "familyName": "The Thistlebrooks",
    "distinguishingFeatures": "Missing the tip of his left pinky, caught in one of his own snares as an apprentice — a mistake he's never repeated.",
    "history": "Runs and maintains trap lines across the surrounding woods almost entirely alone; personally responsible for roughly 60% of the town's small game.",
    "age": 24,
    "eyeColor": "Green",
    "famousQuote": "You don't hear me bragging. The traps do the bragging.",
    "weight": "37 lb",
    "name": "Fenwick \"Fen\" Thistlebrook",
    "height": "2'11\"",
    "hairColor": "Dark brown, cropped close",
    "species": "Halfling",
    "relationships": [
      {
        "type": "parent",
        "targetId": "G06j5K3dTAFPEo24iFuZ"
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
        "type": "sibling",
        "targetId": "npc-pell-thistlebrook"
      },
      {
        "targetId": "npc-roric-thistlebrook",
        "type": "sibling"
      },
      {
        "targetId": "npc-tobin-thistlebrook",
        "type": "sibling"
      }
    ],
    "clothing": "Muted, scent-neutral cloth deliberately chosen not to spook game.",
    "homeBuildingId": "bld-fens-cabin",
    "visible": false
  },
  {
    "id": "npc-finn-vod",
    "homeBuildingId": "bld-vod-homestead",
    "clothing": "Hand-me-downs.",
    "relationships": [
      {
        "type": "parent",
        "targetId": "npc-garrick-vod"
      },
      {
        "type": "friend",
        "targetId": "npc-branner-vod"
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
        "type": "grandparent",
        "targetId": "npc-aldous-vod"
      },
      {
        "targetId": "npc-emeric-vod",
        "type": "cousin"
      },
      {
        "targetId": "npc-wren-vod",
        "type": "cousin"
      }
    ],
    "visible": false,
    "weight": "85 lb",
    "famousQuote": "I don't remember her. Everyone else does, though.",
    "hairColor": "Dark brown, self-cut",
    "species": "Human",
    "height": "4'8\"",
    "name": "Finn Vod",
    "job": "None (child)",
    "age": 9,
    "eyeColor": "Brown",
    "familyName": "The Vods",
    "distinguishingFeatures": "",
    "history": "Son of Garrick and the late Mira Vod. Raised largely by the extended household.",
    "gender": "Man",
    "personality": "Quiet and watchful; spends more time around adults than children his own age.",
    "appearance": "Smaller and thinner than his cousins."
  },
  {
    "id": "npc-garrick-vod",
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
    "homeBuildingId": "bld-vod-homestead",
    "clothing": "Whatever's clean.",
    "visible": false,
    "weight": "180 lb",
    "famousQuote": "Jalanthar has survived this long by only letting in the right people.",
    "height": "5'11\"",
    "name": "Garrick Vod",
    "hairColor": "Dark brown, unkempt",
    "species": "Human",
    "job": "Member of the Town Guard",
    "familyName": "The Vods",
    "distinguishingFeatures": "A chipped front tooth.",
    "history": "Married Mira Vod young, before their son Finn was born. Mira died shortly after Finn's birth. Garrick has raised Finn since, with the household's help.",
    "age": 37,
    "eyeColor": "Brown",
    "personality": "Withdrawn and quiet; rarely joins in the family's boasting.",
    "gender": "Man",
    "appearance": "Similar build to his brother Tomas, but leaner, with a persistent stoop."
  },
  {
    "id": "npc-krikas-rihlo",
    "famousQuote": "You'll forgive me if I've heard that joke before.",
    "weight": "160 lb",
    "hairColor": "Black, untouched by age",
    "species": "Half-Elf",
    "name": "Krikas Rihlo",
    "height": "6'0\"",
    "clothing": "Earth-toned robes, finer than they appear.",
    "homeBuildingId": "bld-rihlo-house",
    "relationships": [
      {
        "targetId": "npc-olma-rihlo",
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
    "visible": false,
    "appearance": "Tall, slender, sharp cheekbones, long pointed ears.",
    "personality": "Patient and controlled, accustomed to outliving those around him.",
    "gender": "Man",
    "job": "Caster (plant magic)",
    "age": 800,
    "eyeColor": "Deep green, faintly luminous",
    "familyName": "The Rihlos",
    "distinguishingFeatures": "A thin silver thread braided into his hair.",
    "history": "An elf approximately 800 years old. Currently on his third known family line in Jalanthar. One of the town's three known casters."
  },
  {
    "id": "npc-liora-pasho",
    "gender": "Man",
    "personality": "Image-conscious, particular about appearances and presentation.",
    "appearance": "Slight build.",
    "familyName": "The Pashos",
    "history": "Married into the Pasho family during a period of greater family wealth. Manages the household within the family manor.",
    "distinguishingFeatures": "A faint scar above her left eyebrow.",
    "age": 58,
    "eyeColor": "Green",
    "job": "None (landed)",
    "height": "5'6\"",
    "name": "Liora Pasho",
    "hairColor": "Silver-blond, elaborate",
    "species": "Half-Elf",
    "weight": "130 lb",
    "famousQuote": "Appearances aren't vanity. They're all that's left to hold onto.",
    "visible": false,
    "relationships": [
      {
        "targetId": "npc-cassian-pasho",
        "type": "spouse"
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
    "clothing": "The finest remaining family wardrobe pieces.",
    "homeBuildingId": "bld-pasho-manor"
  },
  {
    "id": "npc-lu-pasho",
    "homeBuildingId": "bld-lu-tana-residence",
    "clothing": "Simple, ink-spotted.",
    "relationships": [
      {
        "targetId": "npc-tana-pasho",
        "type": "spouse"
      },
      {
        "type": "child",
        "targetId": "npc-nyra-pasho"
      },
      {
        "type": "sibling",
        "targetId": "npc-met-pasho"
      },
      {
        "targetId": "npc-ven-pasho",
        "type": "sibling"
      },
      {
        "targetId": "npc-cassian-pasho",
        "type": "parent"
      },
      {
        "targetId": "npc-liora-pasho",
        "type": "parent"
      }
    ],
    "visible": false,
    "famousQuote": "Every town needs somewhere to lie to itself for an hour.",
    "weight": "145 lb",
    "hairColor": "Sandy brown, shoulder-length",
    "species": "Half-Elf",
    "name": "Lu Pasho",
    "height": "5'8\"",
    "job": "Writer; founder, Silverleaf Stage",
    "age": 28,
    "eyeColor": "Hazel",
    "distinguishingFeatures": "Ink-stained fingers.",
    "history": "Married Tana Rihlo three years ago in an arranged match. Has spent the past two years funding and constructing the Silverleaf Stage, currently under construction.",
    "familyName": "The Pashos",
    "appearance": "Slim build, faintly pointed ears.",
    "personality": "Earnest and soft-spoken, financially optimistic, well-liked around town.",
    "gender": "Man"
  },
  {
    "id": "npc-magistrate",
    "appearance": "A diminutive and feeble frame that comes from years behind a desk, tiny hands, and a perfectly manufactured appearance. His hair is slicked back with product.",
    "personality": "He is smart and reserved, and will always wait a few seconds to respond, leaving uncomfortable pauses. He has very little senses of humor and is very hard to read. He is known for his penchant for history. ",
    "gender": "Man",
    "history": "Anpo Thicket had a pretty eventful youth as a Springwarden in the Emerald Enclave, a time which he doesn't talk about much. Now, ever the bureaucrat, Anpo has settled in as mayor of Jalanthar. He is determined to bring the hamlet into the fray politically during his tenure as mayor.",
    "distinguishingFeatures": "A wispy moustache and tiny spectacles",
    "familyName": "The Thickets",
    "eyeColor": "Blue",
    "age": "122",
    "job": "Magistrate",
    "name": "Anpo Thicket",
    "height": "3' 2\"",
    "hairColor": "Blonde",
    "species": "Halfling",
    "famousQuote": "",
    "weight": "121",
    "visible": true,
    "relationships": [
      {
        "targetId": "08oteThmyEqNmQiTooc6",
        "type": "spouse"
      },
      {
        "targetId": "PIAl7avdltjDfYdQCmTa",
        "type": "spouse"
      }
    ],
    "homeBuildingId": "bld-magistrate-house",
    "clothing": "A burgundy suit and vest, adorned with gold details. His gold pocket watch with the symbol of Sylvanus is always in his hand. "
  },
  {
    "id": "npc-marta-fenner",
    "weight": "140 lb",
    "famousQuote": "People will believe whatever's more interesting than the truth. Doesn't make it true.",
    "height": "5'6\"",
    "name": "Marta Fenner",
    "species": "Human",
    "hairColor": "Auburn, usually braided back",
    "relationships": [
      {
        "type": "spouse",
        "targetId": "npc-wendel-fenner"
      },
      {
        "type": "child",
        "targetId": "npc-poppy-fenner"
      }
    ],
    "clothing": "Practical dress with a coin-pouch apron, ledger always close at hand.",
    "homeBuildingId": "xmZvRARmOG5P103hNS4J",
    "visible": false,
    "personality": "Friendlier and more talkative than her husband, but just as immovable the moment the conversation turns to their daughter.",
    "gender": "Woman",
    "appearance": "Warmer and more approachable than Wendel at first, quick to smile with customers.",
    "job": "Co-runs Wares for the Clever Northman — orders and bookkeeping",
    "familyName": "The Fenners",
    "distinguishingFeatures": "A habit of absently reaching down to rest a hand on Poppy's head mid-conversation, without seeming to notice she's doing it.",
    "history": "Handles the ordering and the books; the more visible, more approachable half of the shop.",
    "dndClass": "Merchant",
    "age": 41,
    "eyeColor": "Green"
  },
  {
    "id": "npc-maya-pasho",
    "gender": "Woman",
    "personality": "",
    "appearance": "Resembles her sister Tana, slightly taller.",
    "job": "Courtesan in Silverymoon",
    "age": 24,
    "eyeColor": "Green",
    "familyName": "The Rihlos",
    "distinguishingFeatures": "",
    "history": "Eldest Rihlo daughter. Left Jalanthar for Silverymoon. The family publicly states she works there as a courtesan; she has in fact joined the church of Helm.",
    "weight": "",
    "famousQuote": "",
    "hairColor": "Brown",
    "species": "Half-Elf",
    "height": "",
    "name": "Maya Rihlo",
    "homeBuildingId": "",
    "clothing": "",
    "relationships": [
      {
        "targetId": "npc-krikas-rihlo",
        "type": "parent"
      },
      {
        "targetId": "npc-olma-rihlo",
        "type": "parent"
      },
      {
        "type": "sibling",
        "targetId": "npc-tana-pasho"
      },
      {
        "targetId": "npc-el-pasho",
        "type": "sibling"
      }
    ],
    "visible": false
  },
  {
    "id": "npc-met-pasho",
    "relationships": [
      {
        "type": "sibling",
        "targetId": "npc-lu-pasho"
      },
      {
        "targetId": "npc-ven-pasho",
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
    "homeBuildingId": "bld-met-pasho-residence",
    "clothing": "Green and brown, unofficial devotional colors.",
    "visible": false,
    "famousQuote": "I gave that faith two years. It gave me a stranger instead.",
    "weight": "150 lb",
    "name": "Met Pasho",
    "height": "5'10\"",
    "hairColor": "Black, long and unbound",
    "species": "Half-Elf",
    "job": "Devoted student of Sylvanus (unofficial)",
    "familyName": "The Pashos",
    "distinguishingFeatures": "A silver chain with a leaf-shaped pendant, always worn.",
    "history": "Studied for several years under Jalanthar's previous priest of Sylvanus, expecting to succeed him. The magistrate instead selected an outside priest.",
    "age": 32,
    "eyeColor": "Grey-green",
    "appearance": "Lean build, sharply pointed ears left visibly uncovered.",
    "personality": "Proud, prickly about references to his human blood, currently frustrated and resentful.",
    "gender": "Man"
  },
  {
    "id": "npc-nyra-pasho",
    "appearance": "An infant.",
    "personality": "",
    "gender": "Woman",
    "job": "",
    "familyName": "The Pashos",
    "distinguishingFeatures": "A dragon-shaped birthmark covering most of her left side.",
    "history": "Born with the birthmark already present. Its meaning is currently unknown to the family.",
    "age": 1,
    "eyeColor": "Green",
    "famousQuote": "",
    "weight": "Infant",
    "name": "Nyra Pasho",
    "height": "Infant",
    "species": "Half-Elf",
    "hairColor": "Fine, dark",
    "relationships": [
      {
        "type": "parent",
        "targetId": "npc-lu-pasho"
      },
      {
        "targetId": "npc-tana-pasho",
        "type": "parent"
      },
      {
        "targetId": "npc-met-pasho",
        "type": "uncle"
      },
      {
        "targetId": "npc-ven-pasho",
        "type": "aunt"
      },
      {
        "targetId": "npc-cassian-pasho",
        "type": "grandparent"
      },
      {
        "type": "grandparent",
        "targetId": "npc-liora-pasho"
      },
      {
        "targetId": "npc-krikas-rihlo",
        "type": "grandparent"
      },
      {
        "targetId": "npc-olma-rihlo",
        "type": "grandparent"
      }
    ],
    "clothing": "Swaddling.",
    "homeBuildingId": "bld-lu-tana-residence",
    "visible": false
  },
  {
    "id": "npc-olma-rihlo",
    "homeBuildingId": "bld-rihlo-house",
    "clothing": "Plain, modest.",
    "relationships": [
      {
        "targetId": "npc-krikas-rihlo",
        "type": "spouse"
      },
      {
        "type": "child",
        "targetId": "npc-tana-pasho"
      },
      {
        "type": "child",
        "targetId": "npc-maya-pasho"
      },
      {
        "type": "child",
        "targetId": "npc-el-pasho"
      }
    ],
    "visible": false,
    "weight": "120 lb",
    "famousQuote": "",
    "species": "Half-Elf",
    "hairColor": "Dark brown, bound or covered",
    "height": "5'4\"",
    "name": "Olma Rihlo",
    "job": "None (household)",
    "age": 35,
    "eyeColor": "Brown",
    "familyName": "The Rihlos",
    "distinguishingFeatures": "A small mole beneath her left eye.",
    "history": "Current wife of Krikas Rihlo.",
    "gender": "Woman",
    "personality": "Silent unless given leave to speak; deferential to Krikas in all matters.",
    "appearance": "Small build."
  },
  {
    "id": "npc-oswin-thistlebrook",
    "personality": "Patient and a little distracted, most at ease elbow-deep in a hedgerow. Genuinely happy in a marriage most of the town still gossips about.",
    "gender": "Man",
    "appearance": "Soft-spoken and soft-bodied compared to his husbands — spends more time crouched over roots than chasing game.",
    "job": "Herbalist — supplies Lavender and Dragon Thistle Apothecary",
    "age": 50,
    "eyeColor": "Hazel",
    "history": "Ranges the wilds around Jalanthar independently of Doran and Cobb's hunts, gathering herbs and roots to sell directly to the apothecary.",
    "distinguishingFeatures": "Always has a sprig of dried herb tucked behind one ear, out of habit more than purpose at this point.",
    "familyName": "The Thistlebrooks",
    "dndClass": "Craftsman",
    "weight": "35 lb",
    "famousQuote": "Everyone assumes I'm the one who stays home. I'm out longer than either of them, usually.",
    "species": "Halfling",
    "hairColor": "Light brown, curly",
    "height": "2'11\"",
    "name": "Oswin Thistlebrook",
    "homeBuildingId": "bld-thistlebrook-warren",
    "clothing": "A canvas gathering vest with dozens of small pouches sewn in.",
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
        "type": "child",
        "targetId": "npc-pell-thistlebrook"
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
    "visible": false
  },
  {
    "id": "npc-pell-thistlebrook",
    "familyName": "The Thistlebrooks",
    "distinguishingFeatures": "Keeps a short, precisely trimmed beard — a running joke in the family that he's \"the professional one.\"",
    "history": "Took to the ledgers early and never left them — the guild would reportedly fall apart without him.",
    "dndClass": "Misc",
    "eyeColor": "Grey",
    "age": 30,
    "job": "Runs the desk at Outrider's Scraps and Scabbards (the hunters' guild)",
    "personality": "Organized to a fault, mildly exasperated by his brothers' chaos, secretly proud of all of them.",
    "gender": "Man",
    "appearance": "The least weathered of the brothers by far — indoor hands, an unusually tidy, trimmed beard next to his shaggier siblings.",
    "visible": false,
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
        "type": "parent",
        "targetId": "npc-oswin-thistlebrook"
      },
      {
        "type": "sibling",
        "targetId": "npc-roric-thistlebrook"
      },
      {
        "type": "sibling",
        "targetId": "npc-fen-thistlebrook"
      },
      {
        "type": "sibling",
        "targetId": "npc-tobin-thistlebrook"
      }
    ],
    "homeBuildingId": "KM5xfMaXQiPBESP3ZeXt",
    "clothing": "Clean workwear, an ink-smudged ledger apron.",
    "height": "3'0\"",
    "name": "Pell Thistlebrook",
    "species": "Halfling",
    "hairColor": "Sandy brown, neatly kept",
    "weight": "38 lb",
    "famousQuote": "I don't hunt anything. I make sure the people who do get paid."
  },
  {
    "id": "npc-poppy-fenner",
    "name": "Poppy Fenner",
    "height": "~2' at the shoulder",
    "hairColor": "Scruffy brown-and-white coat",
    "species": "Human",
    "famousQuote": "(She has never spoken in front of a customer. Everyone has a cousin who swears they heard her, once.)",
    "weight": "~45 lb",
    "visible": false,
    "relationships": [
      {
        "targetId": "npc-wendel-fenner",
        "type": "parent"
      },
      {
        "targetId": "npc-marta-fenner",
        "type": "parent"
      }
    ],
    "homeBuildingId": "xmZvRARmOG5P103hNS4J",
    "clothing": "The charm bracelet/collar; nothing else.",
    "appearance": "A scruffy, alert medium-sized mixed-breed dog. Sits at the counter like she's waiting for something, rather than lying down like a dog usually would.",
    "gender": "Girl",
    "personality": "Attentive in a way that unsettles some customers — seems to follow entire conversations, fetches specific named items off the shelves on request, and has been seen \"counting\" coins with one paw.",
    "dndClass": "Misc",
    "familyName": "The Fenners",
    "distinguishingFeatures": "Wears a small, worn charm bracelet as a collar — plainly child-sized, never explained, never removed.",
    "history": "Has been at the store as long as anyone in town can clearly remember, which is itself part of the debate — either she's a very well-trained, unusually long-lived shop dog, or she hasn't aged because whatever happened to her stopped her from aging like a dog normally would. Wendel and Marta redirect every version of this question.",
    "age": 8,
    "eyeColor": "Amber",
    "job": "Fixture of Wares for the Clever Northman"
  },
  {
    "id": "npc-ressa-vod",
    "appearance": "Lean, sharp-featured.",
    "gender": "Woman",
    "personality": "Iron-willed and controlling. Sets strict, demanding expectations for her children.",
    "age": 36,
    "eyeColor": "Green",
    "familyName": "The Vods",
    "distinguishingFeatures": "A slightly crooked nose from an old, poorly-set break.",
    "history": "Married into the Vod family. Runs the household and oversees Emeric and Wren's upbringing directly.",
    "job": "Runs the household",
    "hairColor": "Black, tight braid",
    "species": "Human",
    "name": "Ressa Vod",
    "height": "5'6\"",
    "famousQuote": "Soft children don't survive frontiers.",
    "weight": "145 lb",
    "visible": false,
    "clothing": "Practical and dark.",
    "homeBuildingId": "bld-vod-homestead",
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
    ]
  },
  {
    "id": "npc-roric-thistlebrook",
    "appearance": "Broad and confident, moves like he knows people are watching — because in Jalanthar, they usually are.",
    "gender": "Man",
    "personality": "Charismatic, competitive, genuinely brave — not all bluster, unlike a certain other hunting family in town.",
    "dndClass": "Hunter",
    "familyName": "The Thistlebrooks",
    "distinguishingFeatures": "A jagged scar along his jawline, from the kill that made his name. He tells the story often and well.",
    "history": "Takes on the town's largest and most dangerous bounties; considered one of Jalanthar's local heroes.",
    "age": 27,
    "eyeColor": "Brown",
    "job": "Trophy/bounty hunter",
    "name": "Roric Thistlebrook",
    "height": "3'2\"",
    "hairColor": "Dark brown, worn long and loose",
    "species": "Halfling",
    "famousQuote": "Small game feeds a house. Big game feeds a legend.",
    "weight": "41 lb",
    "visible": false,
    "relationships": [
      {
        "targetId": "G06j5K3dTAFPEo24iFuZ",
        "type": "parent"
      },
      {
        "type": "parent",
        "targetId": "npc-cobb-thistlebrook"
      },
      {
        "type": "parent",
        "targetId": "npc-oswin-thistlebrook"
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
    ],
    "homeBuildingId": "bld-rorics-trophy-room",
    "clothing": "Trophy-trimmed hunting gear — a few too many pelts and claws worked into it for practicality."
  },
  {
    "id": "npc-senna-vod",
    "clothing": "Practical wool, a fur-trimmed vest.",
    "homeBuildingId": "bld-old-vod-house",
    "relationships": [
      {
        "type": "sibling",
        "targetId": "npc-branner-vod"
      },
      {
        "targetId": "npc-aldous-vod",
        "type": "spouse"
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
    "visible": false,
    "famousQuote": "My grandmother didn't wait for a warband to organize itself before she did something about it.",
    "weight": "130 lb",
    "hairColor": "White, cropped short",
    "species": "Human",
    "name": "Senna Vod",
    "height": "5'4\"",
    "job": "Retired hunter, occasional pelt trader",
    "eyeColor": "Pale grey",
    "age": 68,
    "familyName": "The Vods",
    "distinguishingFeatures": "A long, puckered scar across her left forearm from an old claw strike.",
    "history": "Hunted alongside her brother Branner during a period of frequent monster activity near Jalanthar. Traded pelts in the quieter years since.",
    "appearance": "Small, wiry build from decades of outdoor work.",
    "gender": "Woman",
    "personality": "Sharp-tongued and impatient with excuses. Openly critical of her children's hunting claims."
  },
  {
    "id": "npc-tana-pasho",
    "appearance": "Slender, composed posture, ears more noticeably pointed than her husband's.",
    "personality": "Patient and orderly; the most even-keeled member of either the Pasho or Rihlo households.",
    "gender": "Woman",
    "familyName": "The Pashos",
    "distinguishingFeatures": "A small scar at the corner of her mouth.",
    "history": "Youngest of the three Rihlo daughters. Married to Lu in an arranged match. Serves as Jalanthar's schoolteacher.",
    "age": 26,
    "eyeColor": "Green",
    "job": "Town teacher",
    "name": "Tana Pasho",
    "height": "5'5\"",
    "species": "Half-Elf",
    "hairColor": "Dark brown, tied back",
    "famousQuote": "Letters first. Everything else is easier once you have letters.",
    "weight": "125 lb",
    "visible": false,
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
        "type": "parent",
        "targetId": "npc-krikas-rihlo"
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
        "type": "sibling",
        "targetId": "npc-el-pasho"
      }
    ],
    "clothing": "Practical schoolroom dress.",
    "homeBuildingId": "bld-lu-tana-residence"
  },
  {
    "id": "npc-tobin-thistlebrook",
    "job": "Apprentice herbalist",
    "age": 17,
    "eyeColor": "Hazel",
    "dndClass": "Craftsman",
    "familyName": "The Thistlebrooks",
    "history": "Apprenticing directly under Oswin, learning to identify and gather what the apothecary needs.",
    "distinguishingFeatures": "A faint rash scar on one hand from an early lesson in identifying poisonous plants the hard way.",
    "appearance": "Still growing into his frame, perpetually smudged green and brown at the fingertips.",
    "gender": "Man",
    "personality": "Curious and eager, trailing Oswin everywhere, occasionally testing plants he shouldn't.",
    "clothing": "A smaller version of Oswin's gathering vest.",
    "homeBuildingId": "bld-thistlebrook-warren",
    "relationships": [
      {
        "type": "parent",
        "targetId": "G06j5K3dTAFPEo24iFuZ"
      },
      {
        "type": "parent",
        "targetId": "npc-cobb-thistlebrook"
      },
      {
        "targetId": "npc-oswin-thistlebrook",
        "type": "parent"
      },
      {
        "type": "sibling",
        "targetId": "npc-pell-thistlebrook"
      },
      {
        "targetId": "npc-roric-thistlebrook",
        "type": "sibling"
      },
      {
        "targetId": "npc-fen-thistlebrook",
        "type": "sibling"
      }
    ],
    "visible": false,
    "famousQuote": "Dad says the ones that itch are usually the interesting ones.",
    "weight": "32 lb",
    "species": "Halfling",
    "hairColor": "Light brown, curly like Oswin's",
    "name": "Tobin Thistlebrook",
    "height": "2'9\""
  },
  {
    "id": "npc-tomas-vod",
    "homeBuildingId": "bld-vod-homestead",
    "clothing": "Hunting leathers, oddly clean for daily use.",
    "relationships": [
      {
        "targetId": "npc-ressa-vod",
        "type": "spouse"
      },
      {
        "targetId": "npc-garrick-vod",
        "type": "sibling"
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
        "targetId": "npc-aldous-vod",
        "type": "parent"
      }
    ],
    "visible": false,
    "famousQuote": "Criminals look just like you and me. You have no to know how to find them.",
    "weight": "175 lb",
    "hairColor": "Dark brown, receding",
    "species": "Human",
    "name": "Tomas Vod",
    "height": "5'10\"",
    "job": "Member of the Town Guard",
    "age": 40,
    "eyeColor": "Brown",
    "familyName": "The Vods",
    "distinguishingFeatures": "A visible bite scar on his left calf.",
    "history": "Proposed to Ressa with the words \"Yes, ma'am\" when she informed him they were marrying. Hunts occasional deer, rabbit, and the rare wolf.",
    "appearance": "Broad-shouldered, solid build.",
    "personality": "Boastful, exaggerates his hunting exploits, easily led by his wife.",
    "gender": "Man"
  },
  {
    "id": "npc-ven-pasho",
    "visible": false,
    "relationships": [
      {
        "type": "sibling",
        "targetId": "npc-lu-pasho"
      },
      {
        "type": "sibling",
        "targetId": "npc-met-pasho"
      },
      {
        "targetId": "npc-cassian-pasho",
        "type": "parent"
      },
      {
        "targetId": "npc-liora-pasho",
        "type": "parent"
      }
    ],
    "clothing": "Practical, chalk and charcoal rather than ink.",
    "homeBuildingId": "bld-ven-pasho-residence",
    "height": "5'6\"",
    "name": "Ven Pasho",
    "hairColor": "Sandy brown, cropped",
    "species": "Half-Elf",
    "weight": "120 lb",
    "famousQuote": "Lu builds the walls. I decide what happens inside them.",
    "familyName": "The Pashos",
    "distinguishingFeatures": "A small notch missing from her left ear.",
    "history": "Writes the majority of the material intended for the Silverleaf Stage. Possesses magical ability not currently known to her family.",
    "eyeColor": "Hazel",
    "age": 30,
    "job": "Playwright, co-founder, Silverleaf Stage",
    "personality": "Driven and secretive, the creative force behind the Silverleaf Stage's productions.",
    "gender": "Woman",
    "appearance": "Slight build."
  },
  {
    "id": "npc-wendel-fenner",
    "job": "Proprietor, Wares for the Clever Northman",
    "age": 44,
    "eyeColor": "Brown",
    "dndClass": "Merchant",
    "familyName": "The Fenners",
    "history": "Runs the store his family has kept for two generations; adamant, whenever asked, that Poppy has \"always just been the dog.\"",
    "distinguishingFeatures": "Surprisingly muscular for a merchant.",
    "appearance": "Solidly built, perpetually mid-task — sleeves rolled, apron never quite clean.",
    "gender": "Man",
    "personality": "Practical and a little gruff with customers, but visibly tenses and shuts the conversation down fast if anyone asks too many questions about Poppy.",
    "clothing": "A heavy canvas shop apron over plain clothes.",
    "homeBuildingId": "xmZvRARmOG5P103hNS4J",
    "relationships": [
      {
        "targetId": "npc-marta-fenner",
        "type": "spouse"
      },
      {
        "targetId": "npc-poppy-fenner",
        "type": "child"
      }
    ],
    "visible": false,
    "famousQuote": "She's the family dog. That's all there is to it.",
    "weight": "180 lb",
    "species": "Human",
    "hairColor": "Dark brown, thinning",
    "name": "Wendel Fenner",
    "height": "5'10\""
  },
  {
    "id": "npc-wren-vod",
    "appearance": "Small and thin for her age.",
    "personality": "Notably calm for her age; rarely reacts visibly to fear, pain, or discipline.",
    "gender": "Man",
    "history": "Youngest child of Tomas and Ressa. Currently being trained by Ressa in basic survival and combat.",
    "distinguishingFeatures": "",
    "familyName": "The Vods",
    "eyeColor": "Green",
    "age": "19",
    "job": "Member of the Town Guard",
    "name": "Wren Vod",
    "height": "4'6\"",
    "hairColor": "Black, kept short",
    "species": "Human",
    "famousQuote": "See I'm happy now! Things go way better when I'm happy.",
    "weight": "80 lb",
    "visible": false,
    "relationships": [
      {
        "type": "parent",
        "targetId": "npc-tomas-vod"
      },
      {
        "type": "parent",
        "targetId": "npc-ressa-vod"
      },
      {
        "type": "sibling",
        "targetId": "npc-emeric-vod"
      },
      {
        "targetId": "npc-garrick-vod",
        "type": "uncle"
      },
      {
        "type": "grandparent",
        "targetId": "npc-senna-vod"
      },
      {
        "type": "grandparent",
        "targetId": "npc-aldous-vod"
      },
      {
        "type": "cousin",
        "targetId": "npc-finn-vod"
      }
    ],
    "clothing": "Simple, durable.",
    "homeBuildingId": "bld-vod-homestead"
  },
  {
    "id": "owz4e8Fwl4k6dpnAJrXi",
    "clothing": "Modest, tidy clerk's attire. practical, not fashionable.",
    "homeBuildingId": "bld-magistrate-house",
    "relationships": [
      {
        "type": "parent",
        "targetId": "7QQFmwsWLScKMhf6E6kJ"
      },
      {
        "type": "parent",
        "targetId": "bmQNyEeMkoFFFwbp1W4M"
      },
      {
        "targetId": "89lzexuOe7eJMOFcNBJJ",
        "type": "sibling"
      }
    ],
    "visible": true,
    "weight": "130 lb",
    "famousQuote": "\"Someone in that house has to actually finish the paperwork.\"",
    "species": "Human",
    "hairColor": "Auburn, always pinned back",
    "height": "5'5\"",
    "name": "Marisol Boscoe",
    "job": "Clerk's Assistant, Magistrate's House",
    "age": "29",
    "eyeColor": "Hazel",
    "history": "Talked her way into the position by proving useful during a records crisis.",
    "distinguishingFeatures": "A small grey streak of hair",
    "familyName": "The Boscoes",
    "dndClass": "Laborer",
    "personality": "Ambitious and meticulous to a fault; quietly resents being treated as help rather than staff.",
    "gender": "Woman",
    "appearance": "Neat, unremarkable civil-servant look; fingers permanently smudged with graphite and ink."
  },
  {
    "id": "npc-bertrand-halden",
    "name": "Bertrand Halden",
    "familyName": "The Haldens",
    "homeBuildingIds": [
      "bld-garrison-quarters"
    ],
    "visible": false,
    "age": 54,
    "job": "Captain of the Town Guard",
    "species": "Human",
    "gender": "Man",
    "dndClass": "Fighter",
    "famousQuote": "The town's still standing. That's the only review of my work that matters.",
    "eyeColor": "Flat grey",
    "hairColor": "Grey, cropped to the scalp",
    "height": "6'1\"",
    "weight": "210 lb",
    "distinguishingFeatures": "A puckered scar running from his collarbone up into his hairline — from the last time Jalanthar burned. He doesn't explain it and nobody who was here asks.",
    "appearance": "Built like something that used to be intimidating and has settled into merely solid. Stands like he's still in formation even when he isn't.",
    "personality": "Rigid and duty-first to a fault. Goes out of his way to be harder on his own sons than on anyone else in the garrison, precisely so no one can say he plays favorites — which all three of them privately resent for different reasons.",
    "clothing": "Guard captain's coat, always correctly buttoned, boots polished past regulation.",
    "history": "Took command in the aftermath of Jalanthar's last destruction. Everything about how he runs the garrison — over-drilled, over-prepared, no patience for shortcuts — traces back to having been there for that.",
    "relationships": [
      {
        "targetId": "npc-corwin-halden",
        "type": "child"
      },
      {
        "targetId": "npc-dashel-halden",
        "type": "child"
      },
      {
        "targetId": "npc-wystan-halden",
        "type": "child"
      }
    ]
  },
  {
    "id": "npc-corwin-halden",
    "name": "Corwin Halden",
    "familyName": "The Haldens",
    "homeBuildingIds": [
      "bld-halden-hearth"
    ],
    "visible": false,
    "age": 29,
    "job": "Sergeant, Town Guard",
    "species": "Human",
    "gender": "Man",
    "dndClass": "Fighter",
    "famousQuote": "I've got a wife, two kids, and a job that matters. I don't know what else Dashel thinks he's owed.",
    "eyeColor": "Brown",
    "hairColor": "Dark brown, same crop as his father's",
    "height": "5'11\"",
    "weight": "180 lb",
    "distinguishingFeatures": "Calluses across both palms from drilling with a spear since he was twelve; otherwise unremarkable, which he's fine with.",
    "appearance": "The most obviously his father's son of the three — same build, same posture, ten years earlier.",
    "personality": "Steady, content, genuinely fine with the life his father and brothers find so small. Doesn't posture about it — just quietly a foil to both his brothers' restlessness.",
    "clothing": "Guard uniform, slightly softened at the edges by a wife who mends it properly.",
    "history": "Married Elsbeth young, settled into the garrison's second-in-command role without any apparent ambition beyond it.",
    "relationships": [
      {
        "targetId": "npc-bertrand-halden",
        "type": "parent"
      },
      {
        "targetId": "npc-dashel-halden",
        "type": "sibling"
      },
      {
        "targetId": "npc-wystan-halden",
        "type": "sibling"
      },
      {
        "targetId": "npc-elsbeth-halden",
        "type": "spouse"
      },
      {
        "targetId": "npc-talia-halden",
        "type": "child"
      },
      {
        "targetId": "npc-perrin-halden",
        "type": "child"
      }
    ]
  },
  {
    "id": "npc-elsbeth-halden",
    "name": "Elsbeth Halden",
    "familyName": "The Haldens",
    "homeBuildingIds": [
      "bld-halden-hearth"
    ],
    "visible": false,
    "age": 27,
    "job": "Takes in mending, mostly for the garrison",
    "species": "Human",
    "gender": "Woman",
    "dndClass": "Craftsman",
    "famousQuote": "Bertrand runs the guard. I run this house. We stay out of each other's way.",
    "eyeColor": "Hazel",
    "hairColor": "Light brown, usually braided out of the way",
    "height": "5'5\"",
    "weight": "135 lb",
    "distinguishingFeatures": "A thin needle-scar across one thumb from years of mending guard uniforms for extra coin before she married into the family officially.",
    "appearance": "Perpetually mid-task — flour on her sleeve, a child on her hip, or both.",
    "personality": "Warm, unbothered by garrison politics, the actual center of gravity of this branch of the family.",
    "clothing": "Practical homespun, a mending kit never far away.",
    "history": "Married Corwin five years ago; the marriage the rest of the Haldens agree is the one thing Bertrand did right by not interfering with.",
    "relationships": [
      {
        "targetId": "npc-corwin-halden",
        "type": "spouse"
      },
      {
        "targetId": "npc-talia-halden",
        "type": "child"
      },
      {
        "targetId": "npc-perrin-halden",
        "type": "child"
      }
    ]
  },
  {
    "id": "npc-talia-halden",
    "name": "Talia Halden",
    "familyName": "The Haldens",
    "homeBuildingIds": [
      "bld-halden-hearth"
    ],
    "visible": false,
    "age": 6,
    "job": "None (child)",
    "species": "Human",
    "gender": "Girl",
    "dndClass": "Misc",
    "famousQuote": "When I'm big I'm gonna be Captain AND go on adventures.",
    "eyeColor": "Brown",
    "hairColor": "Light brown, like her mother's",
    "height": "3'6\"",
    "weight": "42 lb",
    "distinguishingFeatures": "Insists on wearing a toy wooden sword everywhere, carved for her by an uncle who won't admit which one.",
    "appearance": "Small, quick, permanently scraped at one knee or the other.",
    "personality": "Fearless in the specific way small children are before anything's taught them otherwise. Adores her uncles, especially whichever one is currently in trouble with Grandpa Bertrand.",
    "clothing": "A child's dress, thoroughly not made for the things she does in it.",
    "history": "Born into a house with three off-duty guardsmen constantly in and out of it; has strong opinions about sword-fighting for a six-year-old.",
    "relationships": [
      {
        "targetId": "npc-corwin-halden",
        "type": "parent"
      },
      {
        "targetId": "npc-elsbeth-halden",
        "type": "parent"
      },
      {
        "targetId": "npc-perrin-halden",
        "type": "sibling"
      }
    ]
  },
  {
    "id": "npc-perrin-halden",
    "name": "Perrin Halden",
    "familyName": "The Haldens",
    "homeBuildingIds": [
      "bld-halden-hearth"
    ],
    "visible": false,
    "age": 1,
    "job": "None (infant)",
    "species": "Human",
    "gender": "Boy",
    "dndClass": "Misc",
    "famousQuote": "",
    "eyeColor": "",
    "hairColor": "",
    "height": "Infant",
    "weight": "Infant",
    "distinguishingFeatures": "",
    "appearance": "An infant.",
    "personality": "",
    "clothing": "Swaddling.",
    "history": "Too young for any of this yet.",
    "relationships": [
      {
        "targetId": "npc-corwin-halden",
        "type": "parent"
      },
      {
        "targetId": "npc-elsbeth-halden",
        "type": "parent"
      },
      {
        "targetId": "npc-talia-halden",
        "type": "sibling"
      }
    ]
  },
  {
    "id": "npc-dashel-halden",
    "name": "Dashel Halden",
    "familyName": "The Haldens",
    "homeBuildingIds": [
      "bld-garrison-quarters"
    ],
    "visible": false,
    "age": 22,
    "job": "Guardsman, Town Guard",
    "species": "Human",
    "gender": "Man",
    "dndClass": "Fighter",
    "famousQuote": "I can hold a line. I've just never had to hold one against anything that mattered.",
    "eyeColor": "Grey, like his father's",
    "hairColor": "Dark brown, kept a little too long for regulation",
    "height": "6'0\"",
    "weight": "175 lb",
    "distinguishingFeatures": "Keeps a whetstone on him at all times, less for maintenance and more as something to do with his hands.",
    "appearance": "Good at the job and visibly bored by it — the kind of restlessness that shows in how someone stands at a post.",
    "personality": "Capable and frustrated in equal measure. Doesn't dislike the work so much as resent that it's all there is. Watches anyone who's actually been somewhere with undisguised envy.",
    "clothing": "Guard uniform worn slightly wrong on purpose — collar looser than regulation, a small daily rebellion.",
    "history": "Old enough to remember wanting something else before he understood you don't get to want things out loud in this house.",
    "relationships": [
      {
        "targetId": "npc-bertrand-halden",
        "type": "parent"
      },
      {
        "targetId": "npc-corwin-halden",
        "type": "sibling"
      },
      {
        "targetId": "npc-wystan-halden",
        "type": "sibling"
      }
    ]
  },
  {
    "id": "npc-wystan-halden",
    "name": "Wystan Halden",
    "familyName": "The Haldens",
    "homeBuildingIds": [
      "bld-garrison-quarters"
    ],
    "visible": false,
    "age": 18,
    "job": "Guardsman, Town Guard (newest recruit)",
    "species": "Human",
    "gender": "Man",
    "dndClass": "Fighter",
    "famousQuote": "Dashel says wanting more just gets you disappointed. I don't believe that yet.",
    "eyeColor": "Brown",
    "hairColor": "Dark brown, unruly",
    "height": "5'9\"",
    "weight": "150 lb",
    "distinguishingFeatures": "Carries a dog-eared, much-reread copy of some cheap adventurer's memoir tucked in his coat, which he thinks nobody's noticed.",
    "appearance": "Still a little too thin for the uniform, hasn't finished growing into either his frame or his confidence.",
    "personality": "Earnest, a little naive, openly starstruck by the idea of adventurers doing something that matters. The one most likely to idolize an actual adventuring party on sight.",
    "clothing": "The newest, most correctly-worn uniform of the three brothers — still trying to prove something.",
    "history": "The only one of the three who joined the guard by choice rather than inevitability — and is starting to suspect that was naive.",
    "relationships": [
      {
        "targetId": "npc-bertrand-halden",
        "type": "parent"
      },
      {
        "targetId": "npc-corwin-halden",
        "type": "sibling"
      },
      {
        "targetId": "npc-dashel-halden",
        "type": "sibling"
      }
    ]
  },
  {
    "id": "npc-hollis-marrow",
    "name": "Hollis Marrow",
    "familyName": "The Marrows",
    "homeBuildingIds": [
      "bld-marrow-house",
      "8tyssIjcNiecXRFTgsn2"
    ],
    "visible": false,
    "age": 52,
    "job": "Butcher, The Sharp Cleaver",
    "species": "Human",
    "gender": "Man",
    "dndClass": "Craftsman",
    "famousQuote": "Meat doesn't care how your day's going. Neither do I, until the cutting's done.",
    "eyeColor": "Brown",
    "hairColor": "Grey-brown, kept short under a working cap",
    "height": "5'11\"",
    "weight": "220 lb",
    "distinguishingFeatures": "Missing the top joint of his left ring finger — an old blade slip he'll tell you about if you ask, and sometimes if you don't.",
    "appearance": "Thick through the forearms in the specific way of someone who's broken down carcasses for thirty years. Permanently faint smell of blood and sawdust no amount of washing fully clears.",
    "personality": "Blunt, practical, affectionate in a gruff way he'd never call affectionate. Proud of both his kids in ways he shows badly.",
    "clothing": "A heavy, stained work apron over plain clothes, always.",
    "history": "Runs the town's only proper butcher shop, a trade passed down from his own father.",
    "relationships": [
      {
        "targetId": "npc-billie-marrow",
        "type": "spouse"
      },
      {
        "targetId": "npc-ember-marrow",
        "type": "child"
      },
      {
        "targetId": "npc-callan-marrow",
        "type": "child"
      }
    ]
  },
  {
    "id": "npc-billie-marrow",
    "name": "Wilhelmina \"Billie\" Marrow",
    "familyName": "The Marrows",
    "homeBuildingIds": [
      "bld-marrow-house",
      "8tyssIjcNiecXRFTgsn2"
    ],
    "visible": false,
    "age": 49,
    "job": "Bakes and sells treats out of the family's backyard",
    "species": "Human",
    "gender": "Woman",
    "dndClass": "Craftsman",
    "famousQuote": "Come back Thursday, I'll have something worth the walk.",
    "eyeColor": "Blue",
    "hairColor": "Greying blonde, always slightly flour-dusted",
    "height": "5'4\"",
    "weight": "175 lb",
    "distinguishingFeatures": "A faded burn scar along one forearm, worn like a badge rather than hidden.",
    "appearance": "Round and warm in every sense — the kind of person a kitchen seems to organize itself around.",
    "personality": "Generous to a fault, the town's unofficial second bakery and first source of gossip. Everyone's favorite reason to walk past the Marrow house.",
    "clothing": "A flour-dusted apron over a housedress, sleeves always pushed up.",
    "history": "Started baking to sell alongside Hollis's trade; it's since become as much a fixture of the household as the butcher shop itself.",
    "relationships": [
      {
        "targetId": "npc-hollis-marrow",
        "type": "spouse"
      },
      {
        "targetId": "npc-ember-marrow",
        "type": "child"
      },
      {
        "targetId": "npc-callan-marrow",
        "type": "child"
      }
    ]
  },
  {
    "id": "npc-ember-marrow",
    "name": "Ember Marrow",
    "familyName": "The Marrows",
    "homeBuildingIds": [
      "bld-frosted-larder"
    ],
    "visible": false,
    "age": 21,
    "job": "Caster (frost magic) — informal town cold-storage and de-icing",
    "species": "Human",
    "gender": "Woman",
    "dndClass": "Caster",
    "famousQuote": "I keep the meat cold in July and the roofs clear in January. Jalanthar would notice if I stopped.",
    "eyeColor": "Ice blue",
    "hairColor": "Pale blonde",
    "height": "5'6\"",
    "weight": "130 lb",
    "distinguishingFeatures": "Frost feathers her hairline in cold weather and never fully melts, even indoors by a fire.",
    "appearance": "Faint visible breath even in warm rooms. People who shake her hand don't forget how cold it is.",
    "personality": "Quietly proud of her one developed spell, more comfortable being useful than being impressive. Doesn't dream of adventure the way Callan's restless — she's found her purpose already, right here.",
    "clothing": "Layered, oddly light clothing for someone who runs perpetually cold.",
    "history": "One of the town's known casters, alongside Krikas Rihlo. Self-taught, and has developed exactly one spell of her own so far — a significant thing in a world where real spellcraft is rare and mostly inherited, traded, or stolen. Her spell, Ember's Frost: she can settle a hand against any object or small contained space and hold its temperature wherever she wills — driven sharply down to preserve food through a Jalanthar summer, or gently up just enough to break a dangerous ice buildup without flooding a roof or road. Not flashy, not a weapon; climate management on a household scale, which is exactly why the town depends on it.",
    "relationships": [
      {
        "targetId": "npc-hollis-marrow",
        "type": "parent"
      },
      {
        "targetId": "npc-billie-marrow",
        "type": "parent"
      },
      {
        "targetId": "npc-callan-marrow",
        "type": "sibling"
      }
    ]
  },
  {
    "id": "npc-callan-marrow",
    "name": "Callan Marrow",
    "familyName": "The Marrows",
    "homeBuildingIds": [
      "bld-frosted-larder"
    ],
    "visible": false,
    "age": 23,
    "job": "Hunter",
    "species": "Human",
    "gender": "Man",
    "dndClass": "Hunter",
    "famousQuote": "Roric gets the trophies. I get what's actually left when he's done bragging about them.",
    "eyeColor": "Brown",
    "hairColor": "Dark blonde",
    "height": "5'10\"",
    "weight": "165 lb",
    "distinguishingFeatures": "A bowstring callus worn so deep into two fingers it doesn't fade even in the off-season.",
    "appearance": "Lean and weathered for his age, permanently a little windburned.",
    "personality": "Driven, quietly competitive, restless in a way his sister isn't. Measures himself constantly against the Thistlebrooks and doesn't love what he sees.",
    "clothing": "Practical hunting leathers, a quiver rarely off his back.",
    "history": "A genuinely skilled archer trying to carve out a reputation in a town where the Thistlebrooks already have hunting sewn up.",
    "relationships": [
      {
        "targetId": "npc-hollis-marrow",
        "type": "parent"
      },
      {
        "targetId": "npc-billie-marrow",
        "type": "parent"
      },
      {
        "targetId": "npc-ember-marrow",
        "type": "sibling"
      }
    ]
  },
  {
    "id": "npc-maren-sparrow",
    "name": "Maren Sparrow",
    "familyName": "The Sparrows",
    "homeBuildingIds": [
      "bld-sparrow-house"
    ],
    "visible": false,
    "age": 45,
    "job": "High Priestess, House of the Unsleeping Watcher",
    "species": "Human",
    "gender": "Woman",
    "dndClass": "Clergy",
    "famousQuote": "Helm doesn't watch over us like a soldier standing guard. He watches over us like a child who won't let go of your hand in a crowd.",
    "eyeColor": "Warm brown",
    "hairColor": "Chestnut, threaded with grey, always plainly braided",
    "height": "5'7\"",
    "weight": "150 lb",
    "distinguishingFeatures": "Calluses across both palms in equal measure from prayer and from actual temple upkeep — she scrubs the floors herself.",
    "appearance": "Weathered in a settled, steady way — the face of someone who's spent decades being the calm center of a room.",
    "personality": "Firm without being harsh, endlessly patient, treats her whole congregation the way she treats her own children — which is, doctrinally, the entire point.",
    "clothing": "Unadorned grey-and-white vestments, deliberately plainer than most Helmite clergy elsewhere wear.",
    "history": "Leads Jalanthar's Helm shrine under the Cradlewatch interpretation — considered heretical by most orthodox Helmites, who hold Helm as an eternal, grim, dutiful sentinel. Maren's temple instead reads his myths as the perpetual innocence and fierce, uncomplicated loyalty of a child who has never once looked away — softer, warmer, and matriarchal in structure, which draws its own separate raised eyebrows.",
    "relationships": [
      {
        "targetId": "npc-tobias-sparrow",
        "type": "spouse"
      },
      {
        "targetId": "npc-lark-sparrow",
        "type": "child"
      },
      {
        "targetId": "npc-pip-sparrow",
        "type": "child"
      }
    ]
  },
  {
    "id": "npc-tobias-sparrow",
    "name": "Tobias Sparrow",
    "familyName": "The Sparrows",
    "homeBuildingIds": [
      "bld-sparrow-house"
    ],
    "visible": false,
    "age": 43,
    "job": "Temple caregiver and counselor, House of the Unsleeping Watcher",
    "species": "Human",
    "gender": "Man",
    "dndClass": "Clergy",
    "famousQuote": "My wife tends the faith. I tend the people in it. Neither job works without the other.",
    "eyeColor": "Green",
    "hairColor": "Sandy brown, going grey at the temples",
    "height": "5'9\"",
    "weight": "160 lb",
    "distinguishingFeatures": "Always has a small carved wooden toy — a different one, most weeks — tucked in a coat pocket for whichever child in the congregation needs a distraction that day.",
    "appearance": "Soft-spoken and soft-featured, the kind of presence that makes people exhale when he sits down next to them.",
    "personality": "Gentle, genuinely nurturing, the one congregants actually go to when something's wrong. Defers to Maren entirely on doctrine and leadership, and seems completely at peace with that arrangement.",
    "clothing": "Simpler vestments than Maren's, sleeves usually pushed up from actual work.",
    "history": "Married into temple life alongside Maren rather than having been raised in it himself, and became the congregation's emotional backbone in a way that surprised no one who's met him.",
    "relationships": [
      {
        "targetId": "npc-maren-sparrow",
        "type": "spouse"
      },
      {
        "targetId": "npc-lark-sparrow",
        "type": "child"
      },
      {
        "targetId": "npc-pip-sparrow",
        "type": "child"
      }
    ]
  },
  {
    "id": "npc-lark-sparrow",
    "name": "Lark Sparrow",
    "familyName": "The Sparrows",
    "homeBuildingIds": [
      "bld-sparrow-house"
    ],
    "visible": false,
    "age": 7,
    "job": "None (child)",
    "species": "Human",
    "gender": "Girl",
    "dndClass": "Misc",
    "famousQuote": "If Helm's a grown-up, why does everyone say he never sleeps? Grown-ups sleep. Kids stay up because they're scared.",
    "eyeColor": "Brown",
    "hairColor": "Chestnut, like her mother's",
    "height": "3'9\"",
    "weight": "48 lb",
    "distinguishingFeatures": "Wears a small wooden sparrow charm, carved by her father, on a cord she's not allowed to take off \"until she loses it honestly.\"",
    "appearance": "Solemn-faced for a seven-year-old, until she isn't — then unmistakably a child.",
    "personality": "Precocious and a little too serious for her age, already asking pointed theological questions that mostly amuse Maren and mildly alarm visiting orthodox Helmites.",
    "clothing": "A miniature version of temple vestments, made for a child who insisted on matching her mother.",
    "history": "Growing up genuinely inside the theology her mother built — to Lark, \"Helm the perpetual child\" isn't a heresy, it's just what Helm is.",
    "relationships": [
      {
        "targetId": "npc-maren-sparrow",
        "type": "parent"
      },
      {
        "targetId": "npc-tobias-sparrow",
        "type": "parent"
      },
      {
        "targetId": "npc-pip-sparrow",
        "type": "sibling"
      }
    ]
  },
  {
    "id": "npc-pip-sparrow",
    "name": "Pip Sparrow",
    "familyName": "The Sparrows",
    "homeBuildingIds": [
      "bld-sparrow-house"
    ],
    "visible": false,
    "age": 4,
    "job": "None (child)",
    "species": "Human",
    "gender": "Boy",
    "dndClass": "Misc",
    "famousQuote": "Helm's my friend. He's little like me.",
    "eyeColor": "Green, like his father's",
    "hairColor": "Sandy brown, perpetually messy",
    "height": "3'2\"",
    "weight": "36 lb",
    "distinguishingFeatures": "Refuses to go anywhere without one specific chipped wooden toy soldier that's technically a Torm figure someone gave him by mistake.",
    "appearance": "Round-faced, still mostly toddler, permanently underfoot somewhere in the temple.",
    "personality": "Cheerful, easily distracted, the temple's unofficial mascot — congregants have started leaving small offerings of sweets for him alongside Helm's.",
    "clothing": "Whatever Lark grew out of most recently.",
    "history": "Too young to understand any of the theology; simply grew up being told a kind, watchful god is a bit like him, and believes it completely.",
    "relationships": [
      {
        "targetId": "npc-maren-sparrow",
        "type": "parent"
      },
      {
        "targetId": "npc-tobias-sparrow",
        "type": "parent"
      },
      {
        "targetId": "npc-lark-sparrow",
        "type": "sibling"
      }
    ]
  },
  {
    "id": "npc-alder-greenhollow",
    "name": "Alder Greenhollow",
    "familyName": "The Greenhollows",
    "homeBuildingIds": [
      "bld-greenhollow-cottage"
    ],
    "visible": false,
    "age": 48,
    "job": "Head priest, The Oakenhall",
    "species": "Halfling",
    "gender": "Man",
    "dndClass": "Clergy",
    "famousQuote": "Sylvanus doesn't rush the seasons. I don't see why I should rush you.",
    "eyeColor": "Hazel",
    "hairColor": "Brown, greying, kept neatly combed",
    "height": "3'1\"",
    "weight": "40 lb",
    "distinguishingFeatures": "A small acorn pendant worn since his own coming-of-age rite, replaced twice as the old ones finally rotted through.",
    "appearance": "Round-faced and unhurried, moves through the temple grounds like he has nowhere else to be, ever.",
    "personality": "Warm, unhurried, genuinely at peace — the kind of priest who counsels with silence as often as words.",
    "clothing": "Simple green-and-brown vestments, a leaf motif stitched at the hem.",
    "history": "Took over stewardship of the shrine from an aging predecessor years ago, alongside his younger brother, and never saw a reason to change how it was run.",
    "relationships": [
      {
        "targetId": "npc-fennel-greenhollow",
        "type": "sibling"
      }
    ]
  },
  {
    "id": "npc-fennel-greenhollow",
    "name": "Fennel Greenhollow",
    "familyName": "The Greenhollows",
    "homeBuildingIds": [
      "bld-greenhollow-cottage"
    ],
    "visible": false,
    "age": 43,
    "job": "Groundskeeper-priest, The Oakenhall",
    "species": "Halfling",
    "gender": "Man",
    "dndClass": "Clergy",
    "famousQuote": "My brother talks to the congregation. I talk to the roots. Sylvanus hears both.",
    "eyeColor": "Green",
    "hairColor": "Sandy brown, perpetually leaf-flecked",
    "height": "3'0\"",
    "weight": "38 lb",
    "distinguishingFeatures": "Green-stained fingertips that never fully scrub clean.",
    "appearance": "Perpetually dirt-kneed and sun-browned — spends more time in the shrine's garden than in it proper.",
    "personality": "Quieter and more physical in his devotion than Alder — tends the actual living grove the shrine is built around, and considers that just as much worship as any liturgy.",
    "clothing": "Plain work clothes over a half-donned vestment, more gardener than priest at first glance.",
    "history": "Co-runs the shrine with Alder, though \"runs\" undersells how much of his actual work happens with his hands in the dirt rather than at the altar.",
    "relationships": [
      {
        "targetId": "npc-alder-greenhollow",
        "type": "sibling"
      }
    ]
  },
  {
    "id": "npc-puck",
    "name": "Puck",
    "familyName": "",
    "homeBuildingIds": [
      "bld-bramble-nook"
    ],
    "visible": false,
    "age": "",
    "job": "Groundskeeper's help and unofficial greeter, The Oakenhall",
    "species": "Satyr",
    "gender": "Man",
    "dndClass": "Misc",
    "famousQuote": "Never met a stranger I couldn't fix by the end of a conversation. Working on you next.",
    "eyeColor": "Amber, goat-slitted",
    "hairColor": "Dark curls, small horns visible through them",
    "height": "4'6\"",
    "weight": "120 lb",
    "distinguishingFeatures": "Carries a battered set of reed pipes everywhere, though he plays them badly and knows it.",
    "appearance": "Cloven-hooved, faintly goatish through the legs, otherwise disarmingly personable — the kind of face that makes strangers relax without knowing why.",
    "personality": "Instantly, disarmingly friendly — the sort of presence that turns a stranger into a friend within one conversation, no ulterior motive required. Genuinely delighted by nearly everyone he meets.",
    "clothing": "Loose, practical clothes that seem to shed twigs and grove-leaves no matter how often he brushes off.",
    "history": "Wandered into Jalanthar some years back and simply never left — the Greenhollow brothers took to him immediately and he's been informally part of the Oakenhall ever since, belonging to no family in town but welcome everywhere.",
    "relationships": []
  },
  {
    "id": "npc-osric-colby",
    "name": "Osric Colby",
    "familyName": "The Colbys",
    "homeBuildingIds": [
      "zXs3it1a46O7OErCyXZM"
    ],
    "visible": false,
    "age": 79,
    "job": "Stablemaster, Banks of Rauvin Livery",
    "species": "Human",
    "gender": "Man",
    "dndClass": "Laborer",
    "famousQuote": "Talked to horses longer than I've talked to most people. Horses listen better.",
    "eyeColor": "Pale blue, clouded slightly with age",
    "hairColor": "White, thinning",
    "height": "5'8\" (stooped from 5'11\")",
    "weight": "150 lb",
    "distinguishingFeatures": "A lifetime's collection of small scars across both forearms — kicks, bites, and rope burns, none of them regretted.",
    "appearance": "Bent by decades of hauling tack and feed, hands permanently curled to the shape of a lead rope even empty. Moves slow and sure, never wasted.",
    "personality": "Gruffly gentle — sharper with people than he's ever once been with a horse. Says less every year, means every word of it.",
    "clothing": "The same style of weathered work coat he's presumably worn for fifty years, patched more than original at this point.",
    "history": "Has run the livery for so long that most of the town can't actually remember a version of it without him in it.",
    "relationships": [
      {
        "targetId": "npc-nan-colby",
        "type": "spouse"
      }
    ]
  },
  {
    "id": "npc-nan-colby",
    "name": "Nan Colby",
    "familyName": "The Colbys",
    "homeBuildingIds": [
      "zXs3it1a46O7OErCyXZM"
    ],
    "visible": false,
    "age": 76,
    "job": "Runs the books and tack repair, Banks of Rauvin Livery",
    "species": "Human",
    "gender": "Woman",
    "dndClass": "Merchant",
    "famousQuote": "I've been finishing that man's sentences since before some of you were born. Don't expect me to stop now.",
    "eyeColor": "Brown, sharp despite everything else slowing down",
    "hairColor": "White, kept in a tight knot",
    "height": "5'2\"",
    "weight": "115 lb",
    "distinguishingFeatures": "Reading glasses on a cord, perpetually pushed up on her head instead of on her face.",
    "appearance": "Small and spry in a way that makes people underestimate her right up until she out-works them.",
    "personality": "Sharper-tongued than Osric and visibly enjoys being so, the one who actually keeps the business running while he tends the animals. Fifty-plus years of marriage compressed into a shorthand only the two of them fully understand.",
    "clothing": "A heavy shawl regardless of season, sleeves rolled for work underneath it.",
    "history": "Married Osric young; the two have run the livery together for longer than most residents of Jalanthar have been alive.",
    "relationships": [
      {
        "targetId": "npc-osric-colby",
        "type": "spouse"
      }
    ]
  },
  {
    "id": "npc-mara-rusken",
    "name": "Mara Rusken",
    "familyName": "The Ruskens",
    "homeBuildingIds": [
      "bld-rusken-house"
    ],
    "visible": false,
    "age": 48,
    "job": "Hunter, trapper, hide-curer",
    "species": "Human",
    "gender": "Woman",
    "dndClass": "Hunter",
    "famousQuote": "If the woods wanted you dead, you wouldn't have heard a thing.",
    "eyeColor": "",
    "hairColor": "Close-cropped brown-gray",
    "height": "",
    "weight": "",
    "distinguishingFeatures": "A missing left pinky from an old snare accident; keeps a strip of cured foxhide tied around the haft of her skinning knife.",
    "appearance": "Broad-shouldered and weather-darkened, with a square jaw and heavy forearms. Her hands are nicked and callused from years of bowstrings, knives, and winter work.",
    "personality": "Practical, blunt, and allergic to boasting. She respects competence more than rank and has little patience for anyone who romanticizes hunting, the wilds, or frontier hardship.",
    "clothing": "A patched hide coat, wool trousers tucked into mud-stiff boots, and a belt hung with small knives, cord, and bone toggles. Smells faintly of smoke, leather, and bitter tanning salts.",
    "history": "Kept the Rusken household fed during Jalanthar's leanest years, when the town was too empty to rely on steady trade. Knows the nearby game trails, winter dens, and dangerous gullies better than almost anyone, but refuses to call herself a ranger.",
    "relationships": [
      {
        "targetId": "npc-osric-rusken",
        "type": "spouse"
      },
      {
        "targetId": "npc-dain-rusken",
        "type": "child"
      },
      {
        "targetId": "npc-corren-rusken",
        "type": "child"
      }
    ]
  },
  {
    "id": "npc-osric-rusken",
    "name": "Osric Rusken",
    "familyName": "The Ruskens",
    "homeBuildingIds": [
      "bld-rusken-house"
    ],
    "visible": false,
    "age": 52,
    "job": "Hunter, tracker, trap-line keeper",
    "species": "Human",
    "gender": "Man",
    "dndClass": "Hunter",
    "famousQuote": "Tracks don't lie. People do.",
    "eyeColor": "Narrow-eyed",
    "hairColor": "Graying beard, trimmed close",
    "height": "",
    "weight": "",
    "distinguishingFeatures": "A bent nose from an elk kick; always carries a little brass whistle used to call hunting dogs that no longer exist.",
    "appearance": "Lean and long-limbed, with a permanent squint from watching distant tree lines. Moves quietly even on tavern floorboards.",
    "personality": "Quiet, exacting, and hard to impress. Notices small details before large ones and tends to answer questions only after deciding whether the person deserves the truth.",
    "clothing": "Layered wool under a faded green hunting cloak, patched gloves, and a soft leather cap darkened by rain and smoke. Plain but obsessively repaired.",
    "history": "Married into the Rusken name and became one of the town's more reliable hunters through patience rather than bravado. Has killed dangerous things outside the walls, but unlike the Vods, rarely tells the stories unless the lesson matters.",
    "relationships": [
      {
        "targetId": "npc-mara-rusken",
        "type": "spouse"
      },
      {
        "targetId": "npc-dain-rusken",
        "type": "child"
      },
      {
        "targetId": "npc-corren-rusken",
        "type": "child"
      }
    ]
  },
  {
    "id": "npc-dain-rusken",
    "name": "Dain Rusken",
    "familyName": "The Ruskens",
    "homeBuildingIds": [
      "bld-rusken-house"
    ],
    "visible": false,
    "age": 25,
    "job": "Hunter, occasional tavern guide, drinker",
    "species": "Human",
    "gender": "Man",
    "dndClass": "Hunter",
    "famousQuote": "First round's mine. Second round's somebody richer.",
    "eyeColor": "",
    "hairColor": "",
    "height": "",
    "weight": "",
    "distinguishingFeatures": "A wolf-tooth cord tied around his wrist; his cheeks flush red quickly from cold, embarrassment, or ale.",
    "appearance": "Thick-necked and sturdy, with a round face and a grin that shows up before good judgment does. Built for hauling carcasses and firewood but does not always sleep enough.",
    "personality": "Funny, warm, loud, and too eager to turn discomfort into a joke. Helpful and generous sober; sentimental, overfamiliar, and loose with information drunk.",
    "clothing": "A fur-lined vest over a homespun shirt, scuffed boots, and a belt with too many pouches. His cloak is better than his coin purse should allow.",
    "history": "A capable hunter who spends too many evenings at the Thrice Crowned Cockatrice, buying rounds he cannot afford. Drinks because the tavern makes Jalanthar feel full again, louder than it is, and less haunted by all the empty buildings.",
    "relationships": [
      {
        "targetId": "npc-mara-rusken",
        "type": "parent"
      },
      {
        "targetId": "npc-osric-rusken",
        "type": "parent"
      },
      {
        "targetId": "npc-corren-rusken",
        "type": "sibling"
      }
    ]
  },
  {
    "id": "npc-corren-rusken",
    "name": "Corren Rusken",
    "familyName": "The Ruskens",
    "homeBuildingIds": [
      "bld-rusken-house"
    ],
    "visible": false,
    "age": 21,
    "job": "Trapper, snare-maker, drinker",
    "species": "Human",
    "gender": "Man",
    "dndClass": "Hunter",
    "famousQuote": "I could hit it with a bow. I just don't need to.",
    "eyeColor": "",
    "hairColor": "",
    "height": "",
    "weight": "",
    "distinguishingFeatures": "One missing front tooth from a fall outside the Cockatrice; keeps a lucky copper coin tucked into his right boot.",
    "appearance": "Wiry and restless, with quick hands and a sharp, defensive stare. Looks younger than he wants to and tries to compensate by taking up too much space.",
    "personality": "Competitive, easily slighted, and desperate not to be treated as the little brother. Likes drinking because it makes him feel older, louder, and harder to ignore.",
    "clothing": "A badly mended leather coat, fingerless gloves, and trousers stained with mud from setting snares. Boots always damp at the seams.",
    "history": "Better with snares than with a bow, though he hates when anyone says so. Follows Dain to the Cockatrice most nights and usually escalates whatever Dain starts, especially if outsiders are watching.",
    "relationships": [
      {
        "targetId": "npc-mara-rusken",
        "type": "parent"
      },
      {
        "targetId": "npc-osric-rusken",
        "type": "parent"
      },
      {
        "targetId": "npc-dain-rusken",
        "type": "sibling"
      }
    ]
  },
  {
    "id": "npc-bera-harlen",
    "name": "Bera Harlen",
    "familyName": "The Harlens",
    "homeBuildingIds": [
      "bld-harlen-farmstead"
    ],
    "visible": false,
    "age": 47,
    "job": "Farmer, household matriarch, goat-keeper",
    "species": "Human",
    "gender": "Woman",
    "dndClass": "Laborer",
    "famousQuote": "You can complain after the field is turned.",
    "eyeColor": "",
    "hairColor": "Thick black hair, braided tight",
    "height": "",
    "weight": "",
    "distinguishingFeatures": "A deep sun-line across her brow from years of squinting over the fields; wears a small iron key on a cord around her neck.",
    "appearance": "Sturdy and compact, with sun-browned arms and a face that looks gentler when she forgets to be tired.",
    "personality": "Warm in public, iron-willed at home. Believes kindness is a duty, but so is discipline, and has little patience for self-pity when there is work waiting.",
    "clothing": "A heavy work dress under a patched apron, wool stockings, and boots with repaired heels. Adds a brown shawl pinned with a plain wooden brooch in colder weather.",
    "history": "Stayed after Jalanthar's abandonment because leaving meant losing the only land the family had ever owned. Has spent the last decade dragging the farm back from weeds, rot, deer, and bad seasons.",
    "relationships": [
      {
        "targetId": "npc-joric-harlen",
        "type": "spouse"
      },
      {
        "targetId": "npc-bren-harlen",
        "type": "child"
      },
      {
        "targetId": "npc-tellen-harlen",
        "type": "child"
      },
      {
        "targetId": "npc-pip-harlen",
        "type": "child"
      }
    ]
  },
  {
    "id": "npc-joric-harlen",
    "name": "Joric Harlen",
    "familyName": "The Harlens",
    "homeBuildingIds": [
      "bld-harlen-farmstead"
    ],
    "visible": false,
    "age": 53,
    "job": "Farmer, plowman, seed-keeper",
    "species": "Human",
    "gender": "Man",
    "dndClass": "Laborer",
    "famousQuote": "A field remembers every lazy hand.",
    "eyeColor": "Tired eyes",
    "hairColor": "Graying beard",
    "height": "",
    "weight": "",
    "distinguishingFeatures": "Uneven shoulders from an old plow injury; carries a carved measuring stick for spacing rows and checking fence gaps.",
    "appearance": "Tall, stooped, and narrow through the chest, with large hands that have begun to stiffen with age. Moves carefully, especially in cold weather.",
    "personality": "Patient, dry-humored, and quietly stubborn. Rarely raises his voice, but when he stops speaking entirely, everyone in the family knows they have gone too far.",
    "clothing": "Plain linen shirts, patched brown trousers, a faded work coat, and a wide-brimmed hat with a split in the brim. Clean at dawn, dirty by noon.",
    "history": "Used to carry the heaviest share of farm labor, but injury and age have shifted more work onto his sons. Proud that Bren joined the guard, though privately resents losing a strong pair of hands.",
    "relationships": [
      {
        "targetId": "npc-bera-harlen",
        "type": "spouse"
      },
      {
        "targetId": "npc-bren-harlen",
        "type": "child"
      },
      {
        "targetId": "npc-tellen-harlen",
        "type": "child"
      },
      {
        "targetId": "npc-pip-harlen",
        "type": "child"
      }
    ]
  },
  {
    "id": "npc-bren-harlen",
    "name": "Bren Harlen",
    "familyName": "The Harlens",
    "homeBuildingIds": [
      "bld-garrison-quarters"
    ],
    "visible": false,
    "age": 26,
    "job": "Town guard, former farmhand, drinker",
    "species": "Human",
    "gender": "Man",
    "dndClass": "Fighter",
    "famousQuote": "I'm not hiding behind a plow while others bleed.",
    "eyeColor": "Tired eyes",
    "hairColor": "",
    "height": "",
    "weight": "",
    "distinguishingFeatures": "Bruised knuckles from training-yard drills and tavern arguments; keeps his guard badge polished even when the rest of him is a mess.",
    "appearance": "Broad-backed and clean-shaven, with strong farmer's shoulders and a jaw he clenches whenever someone calls him \"Joric's boy.\" Looks steadier than he feels.",
    "personality": "Dutiful in daylight and reckless after drinking. Wants to be brave, respected, and necessary, but is deeply afraid he is only pretending at all three.",
    "clothing": "Guard-issue mail over a padded coat, though his boots and belt still look like farm gear. Keeps the uniform cloak on longer than necessary off duty.",
    "history": "Joined the town guard when the raiding pattern changed. Tells people it was duty, and that is partly true — he also wanted distance from the farm and from the feeling that his life had already been decided. At the Cockatrice, ale makes him feel like the man he hopes the town thinks he is.",
    "relationships": [
      {
        "targetId": "npc-bera-harlen",
        "type": "parent"
      },
      {
        "targetId": "npc-joric-harlen",
        "type": "parent"
      },
      {
        "targetId": "npc-tellen-harlen",
        "type": "sibling"
      },
      {
        "targetId": "npc-pip-harlen",
        "type": "sibling"
      }
    ]
  },
  {
    "id": "npc-tellen-harlen",
    "name": "Tellen Harlen",
    "familyName": "The Harlens",
    "homeBuildingIds": [
      "bld-harlen-farmstead"
    ],
    "visible": false,
    "age": 19,
    "job": "Farmhand, field worker, fence-mender",
    "species": "Human",
    "gender": "Man",
    "dndClass": "Laborer",
    "famousQuote": "Somebody still has to feed the brave men.",
    "eyeColor": "",
    "hairColor": "Straw-colored, cut unevenly",
    "height": "",
    "weight": "",
    "distinguishingFeatures": "A pale birthmark shaped like a thumbprint under his right eye; always has dirt under his nails no matter how often he scrubs.",
    "appearance": "Long-limbed, rawboned, and still growing into himself. Stands with the slouched caution of someone used to swallowing complaints.",
    "personality": "Responsible, resentful, and more perceptive than people give him credit for. Thinks Bren abandoned the family, but is ashamed of how much he still admires him.",
    "clothing": "Rolled sleeves, patched trousers, a roughspun vest, and rope-tied boots. Shirt cuffs usually stained with soil, goat milk, or fence tar.",
    "history": "Now does much of the heavy work Bren used to do. Becoming genuinely good at running the farm, which scares him because it may mean everyone else was right about where he belongs.",
    "relationships": [
      {
        "targetId": "npc-bera-harlen",
        "type": "parent"
      },
      {
        "targetId": "npc-joric-harlen",
        "type": "parent"
      },
      {
        "targetId": "npc-bren-harlen",
        "type": "sibling"
      },
      {
        "targetId": "npc-pip-harlen",
        "type": "sibling"
      }
    ]
  },
  {
    "id": "npc-pip-harlen",
    "name": "Pip Harlen",
    "familyName": "The Harlens",
    "homeBuildingIds": [
      "bld-harlen-farmstead"
    ],
    "visible": false,
    "age": 15,
    "job": "Farmhand, goat-tender, errand boy",
    "species": "Human",
    "gender": "Boy",
    "dndClass": "Laborer",
    "famousQuote": "I didn't spy. I was already there.",
    "eyeColor": "Sharp-eyed",
    "hairColor": "",
    "height": "",
    "weight": "",
    "distinguishingFeatures": "A chipped left ear from a goat bite; keeps bits of string, buttons, and stolen-looking nails in his pockets.",
    "appearance": "Small for his age, sharp-eyed, and quick-footed, with a narrow face and a habit of looking at exits before adults notice he entered. All elbows, knees, and nervous curiosity.",
    "personality": "Curious, quick, and much less innocent than adults assume. Listens from haylofts, under tavern windows, and behind half-closed doors because adults say the interesting things only when they think children are gone.",
    "clothing": "Oversized hand-me-down shirts, a patched green scarf, short boots, and trousers held up with a cord. Often goes without a coat until Bera catches him.",
    "history": "Still handles the smaller farm work: goats, chickens, water, errands, and whatever Tellen tells him to do twice. Idolizes Bren's guard status, but has also seen him drunk enough to be frightened by it.",
    "relationships": [
      {
        "targetId": "npc-bera-harlen",
        "type": "parent"
      },
      {
        "targetId": "npc-joric-harlen",
        "type": "parent"
      },
      {
        "targetId": "npc-bren-harlen",
        "type": "sibling"
      },
      {
        "targetId": "npc-tellen-harlen",
        "type": "sibling"
      }
    ]
  }
]


export const mockSources = [
  {
    "id": "src-hunters-trapper-guide",
    "name": "Hunter's & Trapper's Price Guide",
    "wares": [
      {
        "rowId": "row-trapper-1",
        "name": "Mounted Antlers",
        "basePrice": 15,
        "description": "A proud rack of antlers, cleaned and mounted. The kind of thing a hunter hangs over a hearth.",
        "category": "Trophy",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-2",
        "name": "Boar Tusks, Mounted",
        "basePrice": 8,
        "description": "A pair of yellowed tusks, still faintly stained.",
        "category": "Trophy",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-3",
        "name": "Owlbear Skull",
        "basePrice": 80,
        "description": "Bleached and enormous, unmistakably not from anything natural.",
        "category": "Trophy",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-4",
        "name": "Manticore Spike Cluster",
        "basePrice": 60,
        "description": "A cluster of barbed tail spikes, bound together with wire.",
        "category": "Trophy",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-5",
        "name": "Basilisk Skull (Eyes Removed)",
        "basePrice": 55,
        "description": "Mounted with the eye sockets deliberately, carefully emptied.",
        "category": "Trophy",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-6",
        "name": "Wolf Pelt",
        "basePrice": 5,
        "description": "Thick, grey, good winter lining.",
        "category": "Pelt",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-7",
        "name": "Bear Pelt",
        "basePrice": 20,
        "description": "Heavy and warm, worth more to a furrier than a fighter.",
        "category": "Pelt",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-8",
        "name": "Panther Pelt",
        "basePrice": 25,
        "description": "Sleek black fur, prized by tailors in the city.",
        "category": "Pelt",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-9",
        "name": "Lizard Pelt",
        "basePrice": 6,
        "description": "Scaled and surprisingly supple once tanned.",
        "category": "Pelt",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-10",
        "name": "Owlbear Hide",
        "basePrice": 45,
        "description": "Thick, matted fur over skin tougher than boiled leather.",
        "category": "Pelt",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-11",
        "name": "Ram Horn",
        "basePrice": 3,
        "description": "Spiraled and dense, good for carving.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-12",
        "name": "Goat Horn",
        "basePrice": 2,
        "description": "Small and unremarkable, but always sellable.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-13",
        "name": "Chimera Horn",
        "basePrice": 40,
        "description": "Taken from the goat-headed portion \u2014 still smells faintly of brimstone.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-14",
        "name": "Black Dragon Horn",
        "basePrice": 170,
        "description": "Pitted and etched by the acid that once ran down it.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-15",
        "name": "Blue Dragon Horn",
        "basePrice": 180,
        "description": "Crackles faintly with residual static when touched.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-16",
        "name": "Green Dragon Horn",
        "basePrice": 170,
        "description": "Faintly slick, and best handled with gloves.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-17",
        "name": "Red Dragon Horn",
        "basePrice": 190,
        "description": "Warm to the touch no matter the season.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-18",
        "name": "White Dragon Horn",
        "basePrice": 160,
        "description": "Cold enough to numb bare skin on contact.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-19",
        "name": "Brass Dragon Horn",
        "basePrice": 175,
        "description": "Sun-warmed and gritty with desert sand.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-20",
        "name": "Bronze Dragon Horn",
        "basePrice": 190,
        "description": "Carries a faint ozone smell, like the air after a storm.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-21",
        "name": "Copper Dragon Horn",
        "basePrice": 180,
        "description": "Etched with what might be the dragon's own claw-marks.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-22",
        "name": "Gold Dragon Horn",
        "basePrice": 220,
        "description": "Gleams like polished metal, untarnished by time.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-23",
        "name": "Silver Dragon Horn",
        "basePrice": 200,
        "description": "Cool and smooth, prized by jewelers.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-24",
        "name": "Giant Bat Wing",
        "basePrice": 4,
        "description": "Leathery and surprisingly light.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-25",
        "name": "Griffon Wing Feather",
        "basePrice": 35,
        "description": "A single primary feather, longer than a man's arm.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-26",
        "name": "Black Dragon Wing (Membrane)",
        "basePrice": 190,
        "description": "Pockmarked with old acid scarring.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-27",
        "name": "Blue Dragon Wing (Membrane)",
        "basePrice": 200,
        "description": "Thin enough to see light through, but tougher than steel plate.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-28",
        "name": "Green Dragon Wing (Membrane)",
        "basePrice": 190,
        "description": "Faintly mottled, and best not breathed in too closely.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-29",
        "name": "Red Dragon Wing (Membrane)",
        "basePrice": 210,
        "description": "Leathery, near-indestructible, and still smells faintly of smoke.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-30",
        "name": "White Dragon Wing (Membrane)",
        "basePrice": 180,
        "description": "Stiff with a permanent frost that never quite melts.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-31",
        "name": "Brass Dragon Wing (Membrane)",
        "basePrice": 195,
        "description": "Dry and papery, like old parchment.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-32",
        "name": "Bronze Dragon Wing (Membrane)",
        "basePrice": 210,
        "description": "Crackles faintly with stored static.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-33",
        "name": "Copper Dragon Wing (Membrane)",
        "basePrice": 200,
        "description": "Surprisingly ticklish, or so the legends claim.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-34",
        "name": "Gold Dragon Wing (Membrane)",
        "basePrice": 240,
        "description": "Edged with what looks like actual gold leaf.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-35",
        "name": "Silver Dragon Wing (Membrane)",
        "basePrice": 220,
        "description": "Cool, pale, and untouched by time.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-36",
        "name": "Owlbear Heart",
        "basePrice": 90,
        "description": "Larger than a man's head, and still faintly warm when fresh.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-37",
        "name": "Black Dragon Heart",
        "basePrice": 300,
        "description": "Still faintly warm, and said to hold the last ember of the dragon's fury.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-38",
        "name": "Blue Dragon Heart",
        "basePrice": 310,
        "description": "Crackles faintly if you listen closely.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-39",
        "name": "Green Dragon Heart",
        "basePrice": 300,
        "description": "Best handled with gloves and a very good reason.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-40",
        "name": "Red Dragon Heart",
        "basePrice": 320,
        "description": "Radiates heat long after the rest of the body has gone cold.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-41",
        "name": "White Dragon Heart",
        "basePrice": 290,
        "description": "Cold as the day the dragon died.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-42",
        "name": "Brass Dragon Heart",
        "basePrice": 300,
        "description": "Radiates a dry, desert heat.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-43",
        "name": "Bronze Dragon Heart",
        "basePrice": 330,
        "description": "Hums faintly, like distant thunder.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-44",
        "name": "Copper Dragon Heart",
        "basePrice": 310,
        "description": "Surprisingly light for its size.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-45",
        "name": "Gold Dragon Heart",
        "basePrice": 380,
        "description": "Said to never stop glowing faintly, even removed.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-46",
        "name": "Silver Dragon Heart",
        "basePrice": 360,
        "description": "Untouched by decay, centuries after the kill.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-47",
        "name": "Lizard Fang",
        "basePrice": 4,
        "description": "This lizard fang is sharp enough to function like a dagger in a pinch.",
        "category": "Fang",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-48",
        "name": "Wolf Fang",
        "basePrice": 3,
        "description": "Sharp, curved, and small enough to set into a ring or a hilt.",
        "category": "Fang",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-49",
        "name": "Basilisk Fang",
        "basePrice": 45,
        "description": "Still faintly discolored. Handle with thick gloves.",
        "category": "Fang",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-50",
        "name": "Chimera Fang",
        "basePrice": 45,
        "description": "Taken from the lion's head \u2014 long, curved, wickedly sharp.",
        "category": "Fang",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-51",
        "name": "Black Dragon Fang",
        "basePrice": 135,
        "description": "Long enough to be re-hafted into a genuine dagger, and sharp enough to matter.",
        "category": "Fang",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-52",
        "name": "Red Dragon Fang",
        "basePrice": 140,
        "description": "Long enough to be re-hafted into a genuine dagger, and sharp enough to matter.",
        "category": "Fang",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-53",
        "name": "Bear Claw",
        "basePrice": 6,
        "description": "Long and wickedly curved \u2014 could pass for a crude blade.",
        "category": "Claw",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-54",
        "name": "Panther Claw",
        "basePrice": 5,
        "description": "Small, sharp, and easy to conceal.",
        "category": "Claw",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-55",
        "name": "Manticore Claw",
        "basePrice": 40,
        "description": "Long enough to function like a dagger, if you don't mind the shape.",
        "category": "Claw",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-56",
        "name": "Griffon Talon",
        "basePrice": 42,
        "description": "Curved and razor-edged. Could serve as an improvised dagger.",
        "category": "Claw",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-57",
        "name": "Black Dragon Claw",
        "basePrice": 130,
        "description": "Etched with old acid scarring; still holds an edge.",
        "category": "Claw",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-58",
        "name": "Lizard Scale (bundle)",
        "basePrice": 2,
        "description": "A handful of scales, useful for fletching or fine crafting.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-59",
        "name": "Basilisk Scale",
        "basePrice": 30,
        "description": "Stony and cold, even freshly shed.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-60",
        "name": "Chimera Scale",
        "basePrice": 35,
        "description": "Oddly warm, taken from the dragon-tailed portion.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-61",
        "name": "Black Dragon Scale",
        "basePrice": 90,
        "description": "Pitted with old acid scarring, tougher than plate armor.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-62",
        "name": "Blue Dragon Scale",
        "basePrice": 95,
        "description": "A single scale, still crackling faintly with static.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-63",
        "name": "Green Dragon Scale",
        "basePrice": 90,
        "description": "Faintly slick to the touch.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-64",
        "name": "Red Dragon Scale",
        "basePrice": 100,
        "description": "Warm to the touch, prized by armorers.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-65",
        "name": "White Dragon Scale",
        "basePrice": 85,
        "description": "Cold enough to frost over in a warm room.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-66",
        "name": "Brass Dragon Scale",
        "basePrice": 92,
        "description": "Warm and gritty, like sun-baked sand.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-67",
        "name": "Bronze Dragon Scale",
        "basePrice": 100,
        "description": "Smells faintly of ozone.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-68",
        "name": "Copper Dragon Scale",
        "basePrice": 95,
        "description": "Etched with faint claw-mark patterns.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-69",
        "name": "Gold Dragon Scale",
        "basePrice": 130,
        "description": "Gleams like real gold, and is worth nearly as much.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-70",
        "name": "Silver Dragon Scale",
        "basePrice": 115,
        "description": "Cool and untarnished, prized by silversmiths.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-71",
        "name": "Rations, Preserved Game Meat",
        "basePrice": 1,
        "description": "Salted and dried from a fresh kill. A few days' worth, if rationed carefully.",
        "category": "Ration",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-72",
        "name": "Rations, Smoked Meat",
        "basePrice": 1.5,
        "description": "Smoked over an open fire, keeps well.",
        "category": "Ration",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-73",
        "name": "Warped Gearwork",
        "basePrice": 8,
        "description": "A tangle of bent brass gears, still worth something to a tinker.",
        "category": "Salvage",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-74",
        "name": "Animated Plating (Scrap)",
        "basePrice": 25,
        "description": "A sheet of enchanted armor plating, the magic long faded.",
        "category": "Salvage",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-75",
        "name": "Construct Core Fragment",
        "basePrice": 60,
        "description": "A cracked shard of whatever powered the thing. Still faintly warm.",
        "category": "Salvage",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-76",
        "name": "Cracked Rune Stone",
        "basePrice": 45,
        "description": "Etched with a sigil no one currently living can read.",
        "category": "Salvage",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-77",
        "name": "Salvaged Joint Mechanism",
        "basePrice": 15,
        "description": "A ball-and-socket joint, oddly well-preserved.",
        "category": "Salvage",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-78",
        "name": "Animated Armor Fragment",
        "basePrice": 12,
        "description": "A dented piece of what used to move on its own.",
        "category": "Salvage",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-79",
        "name": "Golem Clay (Sample)",
        "basePrice": 30,
        "description": "A lump of enchanted clay, inert now but still faintly warm.",
        "category": "Salvage",
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-trapper-80",
        "name": "Construct Wiring (Arcane)",
        "basePrice": 20,
        "description": "Thin filaments of something between wire and sinew.",
        "category": "Salvage",
        "priceOverride": "",
        "quantity": 1
      }
    ],
    "menu": [],
    "services": [],
    "createdAt": 1753300000000
  }
]
