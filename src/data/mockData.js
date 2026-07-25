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
    "id": "src-hunters-trapper-guide-v2",
    "name": "Hunter's & Trapper's Price Guide",
    "wares": [
      {
        "rowId": "row-trapper-28",
        "name": "Owlbear Skull",
        "basePrice": 80,
        "description": "Bleached and enormous, unmistakably not from anything natural.",
        "category": "Trophy",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Monstrosity"
        ],
        "tags": [
          "display"
        ]
      },
      {
        "rowId": "row-trapper-29",
        "name": "Manticore Spike Cluster",
        "basePrice": 60,
        "description": "A cluster of barbed tail spikes, bound together with wire.",
        "category": "Trophy",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Monstrosity"
        ],
        "tags": [
          "display"
        ]
      },
      {
        "rowId": "row-trapper-30",
        "name": "Basilisk Skull (Eyes Removed)",
        "basePrice": 55,
        "description": "Mounted with the eye sockets deliberately, carefully emptied.",
        "category": "Trophy",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Monstrosity"
        ],
        "tags": [
          "display"
        ]
      },
      {
        "rowId": "row-trapper-31",
        "name": "Displacer Beast Pelt",
        "basePrice": 70,
        "description": "The fur seems to shift slightly out of place even now, mounted and still.",
        "category": "Trophy",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Monstrosity"
        ],
        "tags": [
          "display"
        ]
      },
      {
        "rowId": "row-trapper-32",
        "name": "Owlbear Hide",
        "basePrice": 45,
        "description": "Thick, matted fur over skin tougher than boiled leather.",
        "category": "Pelt",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Monstrosity"
        ],
        "tags": [
          "craft-material"
        ]
      },
      {
        "rowId": "row-trapper-33",
        "name": "Chimera Horn",
        "basePrice": 40,
        "description": "Taken from the goat-headed portion \u2014 still smells faintly of brimstone.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Monstrosity"
        ],
        "tags": [
          "craft-material"
        ]
      },
      {
        "rowId": "row-trapper-34",
        "name": "Griffon Wing Feather",
        "basePrice": 35,
        "description": "A single primary feather, longer than a man's arm.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Monstrosity"
        ],
        "tags": [
          "craft-material"
        ]
      },
      {
        "rowId": "row-trapper-35",
        "name": "Owlbear Heart",
        "basePrice": 90,
        "description": "Larger than a man's head, and still faintly warm when fresh.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Monstrosity"
        ],
        "tags": [
          "alchemical"
        ]
      },
      {
        "rowId": "row-trapper-36",
        "name": "Basilisk Fang",
        "basePrice": 45,
        "description": "Still faintly discolored. Handle with thick gloves.",
        "category": "Fang",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Monstrosity"
        ],
        "tags": [
          "craft-material"
        ]
      },
      {
        "rowId": "row-trapper-37",
        "name": "Chimera Fang",
        "basePrice": 45,
        "description": "Taken from the lion's head \u2014 long, curved, wickedly sharp.",
        "category": "Fang",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Monstrosity"
        ],
        "tags": [
          "craft-material"
        ]
      },
      {
        "rowId": "row-trapper-38",
        "name": "Manticore Claw",
        "basePrice": 40,
        "description": "Long enough to function like a dagger, if you don't mind the shape.",
        "category": "Claw",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Monstrosity"
        ],
        "tags": [
          "craft-material",
          "weapon-material"
        ]
      },
      {
        "rowId": "row-trapper-39",
        "name": "Griffon Talon",
        "basePrice": 42,
        "description": "Curved and razor-edged. Could serve as an improvised dagger.",
        "category": "Claw",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Monstrosity"
        ],
        "tags": [
          "craft-material",
          "weapon-material"
        ]
      },
      {
        "rowId": "row-trapper-40",
        "name": "Basilisk Scale",
        "basePrice": 30,
        "description": "Stony and cold, even freshly shed.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Monstrosity"
        ],
        "tags": [
          "craft-material"
        ]
      },
      {
        "rowId": "row-trapper-41",
        "name": "Chimera Scale",
        "basePrice": 35,
        "description": "Oddly warm, taken from the dragon-tailed portion.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Monstrosity"
        ],
        "tags": [
          "craft-material"
        ]
      },
      {
        "rowId": "row-trapper-42",
        "name": "Cockatrice Feather",
        "basePrice": 38,
        "description": "Faintly stiff, as though the bird half-forgot how to be alive.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Monstrosity"
        ],
        "tags": [
          "craft-material"
        ]
      },
      {
        "rowId": "row-beast-1",
        "name": "Weathered Skull Fragment",
        "basePrice": 6,
        "description": "Bleached by sun and time; impossible to say now what it once topped.",
        "category": "Trophy",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Trophy"
        },
        "tags": [
          "display"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-2",
        "name": "Braided Sinew Trophy Cord",
        "basePrice": 4,
        "description": "Tough as rope, twice as valuable to the right buyer.",
        "category": "Trophy",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Trophy"
        },
        "tags": [
          "display"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-3",
        "name": "Thick-Furred Skull Mount",
        "basePrice": 8,
        "description": "Still carries a faint musk no amount of cleaning fully lifts.",
        "category": "Trophy",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Trophy",
          "kingdom": [
            "Mammal"
          ]
        },
        "tags": [
          "display"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-4",
        "name": "Sun-Cured Reptile Skull",
        "basePrice": 9,
        "description": "The jaw still hinges smoothly; the teeth never dulled.",
        "category": "Trophy",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Trophy",
          "kingdom": [
            "Reptile"
          ]
        },
        "tags": [
          "display"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-5",
        "name": "Preserved Talon-and-Beak Mount",
        "basePrice": 10,
        "description": "Wired together into a single, unsettling display piece.",
        "category": "Trophy",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Trophy",
          "kingdom": [
            "Bird"
          ],
          "requiresFeature": "Beak"
        },
        "tags": [
          "display"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-6",
        "name": "Mounted Prize Catch",
        "basePrice": 7,
        "description": "Every angler swears theirs was bigger before the taxidermist got to it.",
        "category": "Trophy",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Trophy",
          "kingdom": [
            "Fish"
          ]
        },
        "tags": [
          "display"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-7",
        "name": "Preserved Carapace Display",
        "basePrice": 6,
        "description": "The chitin holds its shine remarkably well once cleaned and lacquered.",
        "category": "Trophy",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Trophy",
          "kingdom": [
            "Insect"
          ]
        },
        "tags": [
          "display"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-8",
        "name": "Jarred Amphibian Specimen",
        "basePrice": 5,
        "description": "Preserved in cloudy brine, label long since faded.",
        "category": "Trophy",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Trophy",
          "kingdom": [
            "Amphibian"
          ]
        },
        "tags": [
          "display"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-9",
        "name": "Fang-Studded Trophy Mount",
        "basePrice": 12,
        "description": "A full set of teeth, wired into a deliberately unsettling arrangement.",
        "category": "Trophy",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Trophy",
          "diet": [
            "Carnivore"
          ]
        },
        "tags": [
          "display"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-10",
        "name": "Full Antler Rack Mount",
        "basePrice": 14,
        "description": "Impressive enough that its owner will absolutely tell you the story behind it.",
        "category": "Trophy",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Trophy",
          "kingdom": [
            "Mammal"
          ],
          "diet": [
            "Herbivore"
          ],
          "requiresFeature": "Horns"
        },
        "tags": [
          "display"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-11",
        "name": "Tusked Skull Trophy",
        "basePrice": 16,
        "description": "The tusks alone are worth more than the rest of the mount combined.",
        "category": "Trophy",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Trophy",
          "requiresFeature": "Tusks"
        },
        "tags": [
          "display"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-12",
        "name": "Venom-Gland Display Case",
        "basePrice": 20,
        "description": "Sealed behind glass for good reason \u2014 the residue is still active.",
        "category": "Trophy",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Trophy",
          "requiresFeature": "Venom"
        },
        "tags": [
          "display"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-13",
        "name": "Segmented Shell Trophy",
        "basePrice": 11,
        "description": "A full shell, polished and mounted whole.",
        "category": "Trophy",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Trophy",
          "requiresFeature": "Shell"
        },
        "tags": [
          "display"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-14",
        "name": "Foraged-Diet Skull, Worn Teeth",
        "basePrice": 5,
        "description": "The flat, ground-down molars tell you exactly what this one ate.",
        "category": "Trophy",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Trophy",
          "diet": [
            "Herbivore"
          ]
        },
        "tags": [
          "display"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-15",
        "name": "Sturdy Long Bone",
        "basePrice": 2,
        "description": "Solid enough to carve into a tool handle, if the buyer's not particular. Left thick, it swings about like a proper Club.",
        "category": "Parts",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Parts"
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-16",
        "name": "Bundle of Small Bones",
        "basePrice": 1,
        "description": "Rattles pleasantly. Fletchers and charm-makers both want these. Threaded on a cord, they work about like a set of Ball Bearings underfoot.",
        "category": "Parts",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Parts"
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-17",
        "name": "Mammal Long Bone",
        "basePrice": 3,
        "description": "Dense and heavy for its size, good stock for carving. Left thick, it swings about like a proper Club.",
        "category": "Parts",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Parts",
          "kingdom": [
            "Mammal"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-18",
        "name": "Reptile Vertebra String",
        "basePrice": 3,
        "description": "Strung on a cord, the segments still articulate smoothly.",
        "category": "Parts",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Parts",
          "kingdom": [
            "Reptile"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-19",
        "name": "Hollow Avian Bone",
        "basePrice": 2,
        "description": "Surprisingly light \u2014 fletchers prize these for delicate work. Hollowed further and notched right, one makes a passable Signal Whistle.",
        "category": "Parts",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Parts",
          "kingdom": [
            "Bird"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-20",
        "name": "Fine Fish Bone Cluster",
        "basePrice": 1,
        "description": "Needle-thin and brittle, but useful in careful hands.",
        "category": "Parts",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Parts",
          "kingdom": [
            "Fish"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-21",
        "name": "Chitinous Limb Segment",
        "basePrice": 2,
        "description": "Light, rigid, and surprisingly strong for its size.",
        "category": "Parts",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Parts",
          "kingdom": [
            "Insect"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-22",
        "name": "Feathered Wing (Preserved)",
        "basePrice": 9,
        "description": "The flight feathers are still perfectly aligned.",
        "category": "Parts",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Parts",
          "kingdom": [
            "Bird"
          ],
          "requiresFeature": "Wings"
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-23",
        "name": "Membranous Wing (Preserved)",
        "basePrice": 8,
        "description": "Thin, veined, and surprisingly tough once dried.",
        "category": "Parts",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Parts",
          "kingdom": [
            "Insect"
          ],
          "requiresFeature": "Wings"
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-24",
        "name": "Iridescent Scale Bundle",
        "basePrice": 4,
        "description": "Catches the light strangely from certain angles.",
        "category": "Parts",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Parts",
          "kingdom": [
            "Reptile",
            "Fish"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-25",
        "name": "Curved Predator Fang",
        "basePrice": 5,
        "description": "This fang is sharp enough to function like a dagger in a pinch.",
        "category": "Parts",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Parts",
          "diet": [
            "Carnivore"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-26",
        "name": "Grinding Molar, Worn Flat",
        "basePrice": 2,
        "description": "Ground down from a lifetime of tough forage \u2014 not much use as a weapon, but strung together they work about like a set of Ball Bearings underfoot.",
        "category": "Parts",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Parts",
          "diet": [
            "Herbivore"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-27",
        "name": "Chitin-Piercing Mandible",
        "basePrice": 6,
        "description": "Sharp enough to function like a dagger, if an unusual-looking one.",
        "category": "Parts",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Parts",
          "diet": [
            "Insectivore"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-28",
        "name": "Curved Predator Claw",
        "basePrice": 5,
        "description": "Long and wickedly hooked \u2014 could pass for a crude blade. Reforged properly, it swings about like a Handaxe.",
        "category": "Parts",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Parts",
          "diet": [
            "Carnivore"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-29",
        "name": "Digging Claw, Blunt",
        "basePrice": 3,
        "description": "Worn down from years of digging rather than fighting. Fitted with a haft, it works about like a Shovel.",
        "category": "Parts",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Parts",
          "diet": [
            "Herbivore"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-30",
        "name": "Paired Tusks",
        "basePrice": 18,
        "description": "Heavy, curved, and worth a great deal to the right ivory carver. Reforged, a single tusk swings about like a Handaxe.",
        "category": "Parts",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Parts",
          "requiresFeature": "Tusks"
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-31",
        "name": "Set of Horns",
        "basePrice": 12,
        "description": "Solid at the base, hollow toward the tips. Hollowed further, one makes a passable Signal Whistle.",
        "category": "Parts",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Parts",
          "requiresFeature": "Horns"
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-32",
        "name": "Venom Sac (Drained)",
        "basePrice": 25,
        "description": "Handled carefully, this sac can be used like a vial of basic poison.",
        "category": "Parts",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Parts",
          "requiresFeature": "Venom"
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-33",
        "name": "Shell Fragment, Sharp-Edged",
        "basePrice": 5,
        "description": "The broken edge is sharp enough to serve as an improvised knife.",
        "category": "Parts",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Parts",
          "requiresFeature": "Shell"
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-34",
        "name": "Sharp-Edged Beak Fragment",
        "basePrice": 4,
        "description": "Surprisingly good for prying, in a pinch.",
        "category": "Parts",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Parts",
          "requiresFeature": "Beak"
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-35",
        "name": "Coarse Mammal Hide",
        "basePrice": 6,
        "description": "Thick and warm, good winter lining once properly cured. Worked into a coat, it wears about like Hide Armor.",
        "category": "Pelt",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Pelt",
          "kingdom": [
            "Mammal"
          ]
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-36",
        "name": "Supple Reptile Hide",
        "basePrice": 7,
        "description": "Scaled and surprisingly supple once tanned. Cut and stitched, it functions like a set of Studded Leather Armor.",
        "category": "Pelt",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Pelt",
          "kingdom": [
            "Reptile"
          ]
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-37",
        "name": "Downy Feather Bundle",
        "basePrice": 4,
        "description": "Soft enough for bedding or fine trim, once cleaned.",
        "category": "Pelt",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Pelt",
          "kingdom": [
            "Bird"
          ]
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-38",
        "name": "Oiled Fish Skin",
        "basePrice": 3,
        "description": "Never quite dries out, no matter how long it sits. Stretched over a pack seam, it holds water out about as well as a proper Waterproof Pack.",
        "category": "Pelt",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Pelt",
          "kingdom": [
            "Fish"
          ]
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-39",
        "name": "Segmented Exoskeleton Plate",
        "basePrice": 5,
        "description": "Jointed and surprisingly light for how tough it is. A few plates riveted together work about like a rough set of Leather Armor.",
        "category": "Pelt",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Pelt",
          "kingdom": [
            "Insect"
          ]
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-40",
        "name": "Slick Amphibian Skin",
        "basePrice": 4,
        "description": "Stays faintly damp no matter the weather. Rendered down, the mucus coating works about like a dose of Antitoxin.",
        "category": "Pelt",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Pelt",
          "kingdom": [
            "Amphibian"
          ]
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-41",
        "name": "Lean Predator Pelt",
        "basePrice": 9,
        "description": "Sleek and close-furred, built for stalking rather than warmth. Tanned properly, it moves about as quietly as a fresh set of Leather Armor.",
        "category": "Pelt",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Pelt",
          "kingdom": [
            "Mammal"
          ],
          "diet": [
            "Carnivore"
          ]
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-42",
        "name": "Thick Grazer's Hide",
        "basePrice": 8,
        "description": "Tougher and shaggier than a predator's coat -- built to shrug off brush and thorns.",
        "category": "Pelt",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Pelt",
          "kingdom": [
            "Mammal"
          ],
          "diet": [
            "Herbivore"
          ]
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-43",
        "name": "Rations, Preserved Kill",
        "basePrice": 1,
        "description": "Salted and dried from a fresh kill. A few days' worth, if rationed carefully.",
        "category": "Ration",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Ration",
          "diet": [
            "Carnivore",
            "Omnivore"
          ]
        },
        "tags": [
          "consumable",
          "ration"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-44",
        "name": "Rations, Foraged Cache",
        "basePrice": 0.7,
        "description": "Nuts, roots, and dried greens, gathered and stored before the kill. Packed right, it keeps about as well as a proper Rations (1 day) pack.",
        "category": "Ration",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Ration",
          "diet": [
            "Herbivore",
            "Omnivore"
          ]
        },
        "tags": [
          "consumable",
          "ration"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-45",
        "name": "Rendered Fat (jar)",
        "basePrice": 0.5,
        "description": "Useful for cooking, or for greasing a squeaky hinge.",
        "category": "Ration",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Ration"
        },
        "tags": [
          "consumable",
          "ration"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-46",
        "name": "Rations, Insect Cache",
        "basePrice": 0.5,
        "description": "Dried and packed tight. More nutritious than it looks, apparently.",
        "category": "Ration",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Ration",
          "diet": [
            "Insectivore"
          ]
        },
        "tags": [
          "consumable",
          "ration"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-47",
        "name": "Jungle-Vine Snare Remnant",
        "basePrice": 2,
        "description": "Someone else's failed trap, long since grown through with vine.",
        "category": "Setting",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Setting",
          "setting": [
            "Jungle"
          ]
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-48",
        "name": "Sun-Bleached Mountain Stone",
        "basePrice": 1,
        "description": "Polished smooth by wind and altitude alone.",
        "category": "Setting",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Setting",
          "setting": [
            "Mountain"
          ]
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-49",
        "name": "Town Refuse, Half-Buried",
        "basePrice": 1,
        "description": "Ordinary rubbish, notable only for where it was found.",
        "category": "Setting",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Setting",
          "setting": [
            "Town"
          ]
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-50",
        "name": "City Gutter Trinket",
        "basePrice": 2,
        "description": "Lost by someone, found by something else first.",
        "category": "Setting",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Setting",
          "setting": [
            "City"
          ]
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-51",
        "name": "Forest Moss Sample, Unusual Color",
        "basePrice": 1,
        "description": "A local herbalist might pay for a good specimen.",
        "category": "Setting",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Setting",
          "setting": [
            "Forest"
          ]
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-52",
        "name": "Swamp Root, Gnarled",
        "basePrice": 1,
        "description": "Twisted into a shape that's almost, but not quite, a face.",
        "category": "Setting",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Setting",
          "setting": [
            "Swamp"
          ]
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-53",
        "name": "Tide-Worn Shell Fragment",
        "basePrice": 1,
        "description": "Smoothed by the coast long before anything found it.",
        "category": "Setting",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Setting",
          "setting": [
            "Coast"
          ]
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-54",
        "name": "Sand-Polished Bone Shard",
        "basePrice": 1,
        "description": "Scoured featureless by wind-driven sand.",
        "category": "Setting",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Setting",
          "setting": [
            "Desert"
          ]
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-55",
        "name": "Cave-Pale Mineral Cluster",
        "basePrice": 3,
        "description": "Never having seen sunlight has left it strangely colorless.",
        "category": "Setting",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Setting",
          "setting": [
            "Underdark"
          ]
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-56",
        "name": "Ruin-Worn Carved Fragment",
        "basePrice": 4,
        "description": "Part of something built long before anyone currently living.",
        "category": "Setting",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Setting",
          "setting": [
            "Ruins"
          ]
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-57",
        "name": "Roadside Traveler's Lost Coin",
        "basePrice": 1,
        "description": "Dropped, kicked aside, and eventually forgotten.",
        "category": "Setting",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Setting",
          "setting": [
            "Road"
          ]
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-beast-58",
        "name": "River-Smoothed Pebble Cluster",
        "basePrice": 1,
        "description": "Nothing special, except that something bothered to swallow them.",
        "category": "Setting",
        "monsterTypeTags": [
          "Beast"
        ],
        "lootTags": {
          "kind": "Setting",
          "setting": [
            "Riverside"
          ]
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      }
    ],
    "menu": [],
    "services": [],
    "createdAt": 1753300000000
  },
  {
    "id": "src-xenobiological-ledger",
    "name": "Xenobiological Specimen Ledger",
    "wares": [
      {
        "rowId": "row-trapper-100",
        "name": "Warped Carapace Fragment",
        "basePrice": 8,
        "description": "A chunk of chitin that seems to shift color when you're not looking directly at it.",
        "category": "Trophy",
        "lootTags": {
          "kind": "Trophy"
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "display"
        ]
      },
      {
        "rowId": "row-trapper-101",
        "name": "Writhing Tendril (Preserved)",
        "basePrice": 6,
        "description": "Even pickled in brine, it twitches occasionally.",
        "category": "Trophy",
        "lootTags": {
          "kind": "Trophy"
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "display"
        ]
      },
      {
        "rowId": "row-trapper-102",
        "name": "Fractal Eye Cluster",
        "basePrice": 12,
        "description": "Too many pupils, all pointed in different directions, none of them blinking.",
        "category": "Trophy",
        "lootTags": {
          "kind": "Trophy"
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "display"
        ]
      },
      {
        "rowId": "row-trapper-103",
        "name": "Star-Flecked Hide Swatch",
        "basePrice": 20,
        "description": "The patterning resembles a night sky that doesn't match any known constellation.",
        "category": "Trophy",
        "lootTags": {
          "kind": "Trophy",
          "origin": [
            "Far Realm"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "display"
        ]
      },
      {
        "rowId": "row-trapper-104",
        "name": "Barnacle-Crusted Growth",
        "basePrice": 10,
        "description": "Something else was living on this before the creature died.",
        "category": "Trophy",
        "lootTags": {
          "kind": "Trophy",
          "origin": [
            "Aquatic Deep"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "display"
        ]
      },
      {
        "rowId": "row-trapper-105",
        "name": "Cave-Pale Husk Shell",
        "basePrice": 9,
        "description": "Bleached white from a life that never saw the sun.",
        "category": "Trophy",
        "lootTags": {
          "kind": "Trophy",
          "origin": [
            "Subterranean"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "display"
        ]
      },
      {
        "rowId": "row-trapper-106",
        "name": "Fused Bone Cluster",
        "basePrice": 11,
        "description": "Several bones grown together in ways no anatomy chart explains.",
        "category": "Trophy",
        "lootTags": {
          "kind": "Trophy",
          "origin": [
            "Mutated"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "display"
        ]
      },
      {
        "rowId": "row-trapper-107",
        "name": "Psionic Residue Crystal",
        "basePrice": 25,
        "description": "Hums faintly against your skull if you hold it too long.",
        "category": "Trophy",
        "lootTags": {
          "kind": "Trophy",
          "origin": [
            "Illithid-Touched"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "display"
        ]
      },
      {
        "rowId": "row-trapper-108",
        "name": "Reality-Fraying Shard",
        "basePrice": 30,
        "description": "The edges of this fragment don't quite agree on where they end.",
        "category": "Trophy",
        "lootTags": {
          "kind": "Trophy",
          "origin": [
            "Void-Touched"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "display"
        ]
      },
      {
        "rowId": "row-trapper-109",
        "name": "Twinned Growth Node",
        "basePrice": 15,
        "description": "Two small, identical nubs, grown fused at the base.",
        "category": "Trophy",
        "lootTags": {
          "kind": "Trophy",
          "origin": [
            "Symbiotic"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "display"
        ]
      },
      {
        "rowId": "row-trapper-110",
        "name": "Membranous Photophore Wing",
        "basePrice": 16,
        "description": "Glows faintly along the veins, even hours after death.",
        "category": "Trophy",
        "lootTags": {
          "kind": "Trophy",
          "xenotype": [
            "Squid",
            "Octopus",
            "Insectoid"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "display"
        ]
      },
      {
        "rowId": "row-trapper-111",
        "name": "Chitinous Flight-Frond",
        "basePrice": 14,
        "description": "A brittle, fan-like structure that clearly once caught air.",
        "category": "Trophy",
        "lootTags": {
          "kind": "Trophy",
          "xenotype": [
            "Insectoid"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "display"
        ]
      },
      {
        "rowId": "row-trapper-112",
        "name": "Pulsing Ichor Sac",
        "basePrice": 15,
        "description": "Still slightly warm. Best not to squeeze it.",
        "category": "Organ",
        "lootTags": {
          "kind": "Organ"
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "alchemical"
        ]
      },
      {
        "rowId": "row-trapper-113",
        "name": "Mucous-Secreting Organ",
        "basePrice": 60,
        "description": "This organ can be used like a Potion of Water Breathing if consumed fresh.",
        "category": "Organ",
        "lootTags": {
          "kind": "Organ",
          "origin": [
            "Aquatic Deep"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "alchemical",
          "consumable"
        ]
      },
      {
        "rowId": "row-trapper-114",
        "name": "Echoing Resonance Bladder",
        "basePrice": 18,
        "description": "Empty air trapped inside makes a low hum when tapped, the same pitch as deep cave water.",
        "category": "Organ",
        "lootTags": {
          "kind": "Organ",
          "origin": [
            "Subterranean"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "alchemical"
        ]
      },
      {
        "rowId": "row-trapper-115",
        "name": "Warped Secondary Heart",
        "basePrice": 22,
        "description": "Beats out of sync with wherever the first one is.",
        "category": "Organ",
        "lootTags": {
          "kind": "Organ",
          "origin": [
            "Mutated"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "alchemical"
        ]
      },
      {
        "rowId": "row-trapper-116",
        "name": "Thought-Filament Cluster",
        "basePrice": 70,
        "description": "This cluster can be used like a Potion of Comprehend Languages if consumed within an hour of harvesting.",
        "category": "Organ",
        "lootTags": {
          "kind": "Organ",
          "origin": [
            "Illithid-Touched"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "alchemical",
          "consumable"
        ]
      },
      {
        "rowId": "row-trapper-117",
        "name": "Null-Space Bladder",
        "basePrice": 28,
        "description": "Feels heavier than it looks, then lighter, then heavier again.",
        "category": "Organ",
        "lootTags": {
          "kind": "Organ",
          "origin": [
            "Void-Touched"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "alchemical"
        ]
      },
      {
        "rowId": "row-trapper-118",
        "name": "Bonded Twin-Organ",
        "basePrice": 20,
        "description": "Two smaller organs, still trying to function as one.",
        "category": "Organ",
        "lootTags": {
          "kind": "Organ",
          "origin": [
            "Symbiotic"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "alchemical"
        ]
      },
      {
        "rowId": "row-trapper-119",
        "name": "Adaptive Gland",
        "basePrice": 24,
        "description": "The tissue seems to still be deciding what it wants to be. Extracted and worn as a poultice, it works about like a dose of Antitoxin.",
        "category": "Organ",
        "lootTags": {
          "kind": "Organ",
          "origin": [
            "Far Realm"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "alchemical"
        ]
      },
      {
        "rowId": "row-trapper-120",
        "name": "Ink-Sac (Concentrated)",
        "basePrice": 19,
        "description": "This sac can be used like a Potion of Invisibility for a single, brief moment if burst directly on skin.",
        "category": "Organ",
        "lootTags": {
          "kind": "Organ",
          "xenotype": [
            "Squid",
            "Octopus"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "alchemical",
          "consumable"
        ]
      },
      {
        "rowId": "row-trapper-121",
        "name": "Chemical Bladder (Caustic)",
        "basePrice": 26,
        "description": "Handle with tongs. This bladder can be thrown like a flask of acid.",
        "category": "Organ",
        "lootTags": {
          "kind": "Organ",
          "xenotype": [
            "Insectoid",
            "Worm"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "alchemical",
          "consumable"
        ]
      },
      {
        "rowId": "row-trapper-122",
        "name": "Iridescent Membrane Swatch",
        "basePrice": 10,
        "description": "Shimmers faintly no matter the light.",
        "category": "Pelt",
        "lootTags": {
          "kind": "Pelt"
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "craft-material"
        ]
      },
      {
        "rowId": "row-trapper-123",
        "name": "Barbed Hide Strip",
        "basePrice": 7,
        "description": "Better to handle with gloves.",
        "category": "Pelt",
        "lootTags": {
          "kind": "Pelt"
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "craft-material"
        ]
      },
      {
        "rowId": "row-trapper-124",
        "name": "Kelp-Slick Skin Swatch",
        "basePrice": 12,
        "description": "Never quite dries out, no matter how long it sits.",
        "category": "Pelt",
        "lootTags": {
          "kind": "Pelt",
          "origin": [
            "Aquatic Deep"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "craft-material"
        ]
      },
      {
        "rowId": "row-trapper-125",
        "name": "Lightless Hide Patch",
        "basePrice": 14,
        "description": "Absorbs light rather than reflecting it \u2014 unsettling to look at directly.",
        "category": "Pelt",
        "lootTags": {
          "kind": "Pelt",
          "origin": [
            "Subterranean"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "craft-material"
        ]
      },
      {
        "rowId": "row-trapper-126",
        "name": "Chitin-Flesh Hybrid Plate",
        "basePrice": 13,
        "description": "Half shell, half skin, seamed together imperfectly. Worn as-is, it works about like a suit of Leather Armor.",
        "category": "Pelt",
        "lootTags": {
          "kind": "Pelt",
          "origin": [
            "Mutated"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "craft-material"
        ]
      },
      {
        "rowId": "row-trapper-127",
        "name": "Star-Static Membrane",
        "basePrice": 18,
        "description": "Faint crackling if you rub it the wrong way.",
        "category": "Pelt",
        "lootTags": {
          "kind": "Pelt",
          "origin": [
            "Far Realm"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "craft-material"
        ]
      },
      {
        "rowId": "row-trapper-128",
        "name": "Fused Symbiote Skin",
        "basePrice": 15,
        "description": "Two distinct textures, grown into one. Stretched and cured, it works about like a set of Padded Armor.",
        "category": "Pelt",
        "lootTags": {
          "kind": "Pelt",
          "origin": [
            "Symbiotic"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "craft-material"
        ]
      },
      {
        "rowId": "row-trapper-129",
        "name": "Segmented Exoskeleton Plate",
        "basePrice": 11,
        "description": "Jointed and surprisingly light for how tough it is. A few plates riveted together work about like a rough set of Leather Armor.",
        "category": "Pelt",
        "lootTags": {
          "kind": "Pelt",
          "xenotype": [
            "Insectoid",
            "Crustacean"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "craft-material"
        ]
      },
      {
        "rowId": "row-trapper-130",
        "name": "Translucent Gel-Skin",
        "basePrice": 9,
        "description": "Nearly see-through. Doesn't hold its shape once removed, and leaves a faint residue on anything it touches.",
        "category": "Pelt",
        "lootTags": {
          "kind": "Pelt",
          "xenotype": [
            "Jellyfish",
            "Amorphous"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "craft-material"
        ]
      },
      {
        "rowId": "row-trapper-131",
        "name": "Swallowed Coin Purse (Partially Digested)",
        "basePrice": 5,
        "description": "Whatever was in this creature's territory eventually ended up in here.",
        "category": "Stomach",
        "lootTags": {
          "kind": "Stomach"
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "junk"
        ]
      },
      {
        "rowId": "row-trapper-132",
        "name": "Undigested Trinket",
        "basePrice": 8,
        "description": "A small, unidentifiable bauble, worn smooth.",
        "category": "Stomach",
        "lootTags": {
          "kind": "Stomach"
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "junk"
        ]
      },
      {
        "rowId": "row-trapper-133",
        "name": "Half-Dissolved Ship Fragment",
        "basePrice": 15,
        "description": "Wood, somehow, still holding its shape after all this time inside.",
        "category": "Stomach",
        "lootTags": {
          "kind": "Stomach",
          "origin": [
            "Aquatic Deep"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "junk"
        ]
      },
      {
        "rowId": "row-trapper-134",
        "name": "Miner's Pickaxe Head (Corroded)",
        "basePrice": 6,
        "description": "All that's left of somebody's bad day. Still solid enough to function like a Crowbar in a pinch.",
        "category": "Stomach",
        "lootTags": {
          "kind": "Stomach",
          "origin": [
            "Subterranean"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "junk"
        ]
      },
      {
        "rowId": "row-trapper-135",
        "name": "Fused Adventuring Gear",
        "basePrice": 20,
        "description": "Melted together into something no longer recognizable as any one thing.",
        "category": "Stomach",
        "lootTags": {
          "kind": "Stomach",
          "origin": [
            "Mutated"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "junk"
        ]
      },
      {
        "rowId": "row-trapper-136",
        "name": "Impossible Geometry Fragment",
        "basePrice": 40,
        "description": "This object should not fit inside anything, and yet \u2014 it slides into any Pouch or Sack as if the container were somehow larger inside.",
        "category": "Stomach",
        "lootTags": {
          "kind": "Stomach",
          "origin": [
            "Void-Touched"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "junk"
        ]
      },
      {
        "rowId": "row-trapper-137",
        "name": "Bonded Pair of Rings",
        "basePrice": 25,
        "description": "Two rings, fused at the band, from two different hands.",
        "category": "Stomach",
        "lootTags": {
          "kind": "Stomach",
          "origin": [
            "Symbiotic"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "junk"
        ]
      },
      {
        "rowId": "row-trapper-138",
        "name": "Still-Warm Psionic Focus",
        "basePrice": 55,
        "description": "Whatever it belonged to, it was still using it recently.",
        "category": "Stomach",
        "lootTags": {
          "kind": "Stomach",
          "origin": [
            "Illithid-Touched"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "junk"
        ]
      },
      {
        "rowId": "row-trapper-139",
        "name": "Star-Metal Sliver",
        "basePrice": 45,
        "description": "Doesn't match any ore known to any smith in Jalanthar.",
        "category": "Stomach",
        "lootTags": {
          "kind": "Stomach",
          "origin": [
            "Far Realm"
          ]
        },
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Aberration"
        ],
        "tags": [
          "junk"
        ]
      }
    ],
    "menu": [],
    "services": [],
    "createdAt": 1753400000000
  },
  {
    "id": "sGUAccXFQOl3hwTl7OYP",
    "wares": [
      {
        "description": "A small vial on a thin leather rope worn as an amulet. Emits dim light up to 5 feet.",
        "basePrice": 15,
        "rowId": "row-1783553745889-i5up1",
        "quantity": 1,
        "name": "The Light of Pelor",
        "priceOverride": "",
        "tags": [
          "magic-item"
        ],
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Religious",
          "domain": [
            "Light"
          ],
          "minRank": 0
        }
      },
      {
        "priceOverride": "",
        "name": "Compass of Pelor",
        "quantity": 1,
        "rowId": "row-1783553745889-55yux",
        "description": "This compass, shaped liked a sun, will magically point to the nearest temple of Pelor or any of his allies if it is within 10 miles. ",
        "basePrice": 40,
        "tags": [
          "magic-item"
        ],
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Religious",
          "domain": [
            "Light"
          ],
          "minRank": 1
        }
      },
      {
        "name": "Signet Ring",
        "rowId": "row-1783553745889-ww25f",
        "quantity": 1,
        "priceOverride": "",
        "description": "Golden ring imparts a wax seal to parchment signed by its wearer when pressed.",
        "basePrice": 20,
        "tags": [
          "magic-item"
        ],
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "minRank": 0
        }
      },
      {
        "priceOverride": "",
        "quantity": 1,
        "name": "Chastity's Promise",
        "rowId": "row-1783553745889-g1rg1",
        "description": "Rolls involving seduction or flirting against the wearer have disadvantage.",
        "basePrice": 30,
        "tags": [
          "magic-item"
        ],
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Religious",
          "domain": [
            "Life"
          ],
          "minRank": 0
        }
      },
      {
        "description": "When writing with this quill, the writer can magically change the color of the ink.",
        "basePrice": 15,
        "priceOverride": "",
        "name": "Quill of Many Inks",
        "quantity": 1,
        "rowId": "row-1783553745889-3pwb8",
        "tags": [
          "magic-item"
        ],
        "monsterTypeTags": [],
        "lootTags": null
      },
      {
        "description": "This normal-looking gold piece teleports back to the owner after an hour of being more than 10 feet from them.",
        "basePrice": 50,
        "priceOverride": "",
        "rowId": "row-1783553745889-de4bu",
        "name": "Grifter's Gold",
        "quantity": 1,
        "tags": [
          "magic-item"
        ],
        "monsterTypeTags": [],
        "lootTags": null
      },
      {
        "description": "If any piece of jewelry is left in this case for at least one day, when it is pulled out it will look like a much more valuable version of itself. The illusion lasts for one hour.",
        "basePrice": 60,
        "priceOverride": "",
        "rowId": "row-1783553745889-r233o",
        "quantity": 1,
        "name": "Cyrician Jewelry Case",
        "tags": [
          "magic-item"
        ],
        "monsterTypeTags": [],
        "lootTags": null
      },
      {
        "priceOverride": "",
        "quantity": 1,
        "rowId": "row-1783553745889-olvi2",
        "name": "Ring Glove",
        "description": "This normal-looking ring, when activated, covers the wearer's hand in a black cloth glove.",
        "basePrice": 20,
        "tags": [
          "magic-item",
          "clothing"
        ],
        "monsterTypeTags": [],
        "lootTags": null
      },
      {
        "quantity": 1,
        "rowId": "row-1783553745889-znkch",
        "name": "Hood of Tongues",
        "priceOverride": "",
        "description": "When you put this hood up and activate it, its magic causes your lips to no longer match your words, preventing any lipreaders from spying on you.",
        "basePrice": 0,
        "tags": [
          "magic-item",
          "clothing"
        ],
        "monsterTypeTags": [],
        "lootTags": null
      },
      {
        "priceOverride": "",
        "rowId": "row-1783553745889-ulty9",
        "name": "Gibson's Lute",
        "quantity": 1,
        "description": "When a simple melody is played on this lute, the lute can magically play it back in a loop, even if another melody is being played on it.",
        "basePrice": 120,
        "tags": [
          "magic-item",
          "instrument"
        ],
        "monsterTypeTags": [],
        "lootTags": null
      },
      {
        "priceOverride": "",
        "name": "Showman's Swordsman",
        "rowId": "row-1783553745889-kagzy",
        "quantity": 1,
        "description": " When fighting with an ally who is \"in on it,\" this normal-looking sword allows the wielder to magically stab their ally without harming them. Do not dispel during a live play.",
        "basePrice": 40,
        "tags": [
          "magic-item",
          "martial",
          "melee"
        ],
        "monsterTypeTags": [],
        "lootTags": null
      },
      {
        "priceOverride": "",
        "name": "Symphonic Wand",
        "quantity": 1,
        "rowId": "row-1783553745889-adfrr",
        "description": "A wand that, when waved in the air, magically emits the sound of a concerto. The concerto plays relative to the vigor of the wave, so a slow, gentle wave of the wand creates a sad dirge while vigorous slashing of the wand will play a loud, upbeat symphony.",
        "basePrice": 45,
        "tags": [
          "magic-item"
        ],
        "monsterTypeTags": [],
        "lootTags": null
      },
      {
        "description": "This soft rubber ball with a bullseye painted on it can be thrown with uncanny accuracy up to 300 feet. Does not damage.",
        "basePrice": 35,
        "quantity": 1,
        "rowId": "row-1783553745889-zz2j0",
        "name": "Bullseye Ball",
        "priceOverride": "",
        "tags": [
          "magic-item"
        ],
        "monsterTypeTags": [],
        "lootTags": null
      },
      {
        "rowId": "row-1783553745889-6508q",
        "quantity": 1,
        "name": "Elminster's Earrings",
        "priceOverride": "",
        "description": "These earrings create the effect of tiny fireworks, dancing lights, and small fluttering butterflies around the head of the wearer. Supposedly created by Elminster himself.",
        "basePrice": 55,
        "tags": [
          "magic-item",
          "clothing"
        ],
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "domain": [
            "Light"
          ],
          "minRank": 2
        }
      },
      {
        "description": "When opened, the locket shows the user a memory deliberately stored in the contraption.",
        "basePrice": 10,
        "priceOverride": "",
        "rowId": "row-1783553745889-u6ahy",
        "quantity": 1,
        "name": "Locket of Memories",
        "tags": [
          "magic-item"
        ],
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "domain": [
            "Life"
          ],
          "minRank": 0
        }
      },
      {
        "description": "This hat or helmet does not disturb your signature haircut, even after many hours in a hot, damp dungeon.",
        "basePrice": 10,
        "priceOverride": "",
        "rowId": "row-1783553745889-qyyvz",
        "name": "Pompadour's Hat",
        "quantity": 1,
        "tags": [
          "magic-item",
          "clothing"
        ],
        "monsterTypeTags": [],
        "lootTags": null
      },
      {
        "description": "When children are within earshot, this ring magically replaces swear words with more appropriate equivalents.",
        "basePrice": 20,
        "priceOverride": "",
        "rowId": "row-1783553745889-ezuz0",
        "name": "The Ring of the Inebriated Uncle",
        "quantity": 1,
        "tags": [
          "magic-item"
        ],
        "monsterTypeTags": [],
        "lootTags": null
      },
      {
        "description": "This tool pouch is actually a pocket dimension that prevents any rust, dust, or normal wear from accruing to any artisan's tools while they are stored in it.",
        "basePrice": 45,
        "priceOverride": "",
        "rowId": "row-1783553745889-x3ec9",
        "name": "Tool Pouch of Maintenance",
        "quantity": 1,
        "tags": [
          "magic-item",
          "utility"
        ],
        "monsterTypeTags": [],
        "lootTags": null
      },
      {
        "name": "Helm's Scale of Truth",
        "quantity": 1,
        "rowId": "row-1783553745889-ntsj4",
        "priceOverride": "",
        "description": "When a currency is put upon the scales, the scales tip if any of the currency is fake.",
        "basePrice": 70,
        "tags": [
          "magic-item"
        ],
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Religious",
          "domain": [
            "Knowledge"
          ],
          "minRank": 2
        }
      },
      {
        "rowId": "row-1783553745889-whkxn",
        "name": "Helping Hand",
        "quantity": 1,
        "priceOverride": "",
        "description": "A normal-looking ring, but when activated, an invisible hand holds whatever object the wearer is holding in place, including in mid-air, freeing up one of their real hands. The hand cannot move, has the strength of a small child's hand, and must stay within one foot of the ring.",
        "basePrice": 130,
        "tags": [
          "magic-item"
        ],
        "monsterTypeTags": [],
        "lootTags": null
      },
      {
        "priceOverride": "",
        "name": "Waterproof Pack",
        "rowId": "row-1783553745889-2c3iy",
        "quantity": 1,
        "description": "This medium-sized pack is magically waterproof.",
        "basePrice": 30,
        "tags": [
          "magic-item",
          "utility"
        ],
        "monsterTypeTags": [],
        "lootTags": null
      },
      {
        "name": "Purifix Straw",
        "rowId": "row-1783553745889-37xh9",
        "quantity": 1,
        "priceOverride": "",
        "description": "This thick silver straw magically removes any contaminants that occurred naturally from a water source, up to half a gallon per day. It does not remove poisons or other contaminants that are in the water source from unnatural sources (such as being placed there by an assassin).",
        "basePrice": 0,
        "tags": [
          "magic-item"
        ],
        "monsterTypeTags": [],
        "lootTags": null
      },
      {
        "name": "Woven Lure",
        "rowId": "row-1783553745889-wb7pl",
        "quantity": 1,
        "priceOverride": "",
        "description": " A fishing lure blessed by a priest of Sylvanus. Add 1d4 to any fishing roll.",
        "basePrice": 0,
        "tags": [
          "magic-item"
        ],
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "domain": [
            "Nature"
          ],
          "minRank": 0
        }
      },
      {
        "priceOverride": "",
        "rowId": "row-1783553745889-5id8c",
        "name": "The Dictator",
        "quantity": 1,
        "description": "This magical quill automatically writes down the words that are spoken to it by its owner.",
        "basePrice": 85,
        "tags": [
          "magic-item"
        ],
        "monsterTypeTags": [],
        "lootTags": null
      },
      {
        "priceOverride": "",
        "quantity": 1,
        "rowId": "row-1783553745889-ou18e",
        "name": "Symbol of Talona",
        "description": "Small charm has a mild repelling effect on mosquitoes, bugs, and small gnats.",
        "basePrice": 45,
        "tags": [
          "magic-item"
        ],
        "monsterTypeTags": [],
        "lootTags": null
      },
      {
        "quantity": 1,
        "rowId": "row-1783553745889-ile0f",
        "name": "Long March Boots",
        "priceOverride": "",
        "description": "Prevent water and rocks from getting into boots, even when submerged.",
        "basePrice": 30,
        "tags": [
          "magic-item",
          "clothing"
        ],
        "monsterTypeTags": [],
        "lootTags": null
      },
      {
        "description": "Magical cloth removes non-magical dust, rust, grime, leaves polish. Never gets dirty. Cannot repair damage.",
        "basePrice": 10,
        "priceOverride": "",
        "rowId": "row-1783553745889-zo2w1",
        "name": "Dress Cloth",
        "quantity": 1,
        "tags": [
          "magic-item",
          "clothing"
        ],
        "monsterTypeTags": [],
        "lootTags": null
      },
      {
        "priceOverride": "",
        "rowId": "row-1783553745889-kvvbo",
        "quantity": 1,
        "name": "Feigned Loyalty Dagger",
        "description": "Magical dagger cannot harm its owner. Attacks with this dagger are not magical.",
        "basePrice": 30,
        "tags": [
          "magic-item",
          "simple",
          "melee"
        ],
        "monsterTypeTags": [],
        "lootTags": null
      },
      {
        "description": "Uncorking vial makes user smell indistinguishable from a homeless person.",
        "basePrice": 15,
        "rowId": "row-1783553745889-bdoqk",
        "name": "Odeur de la Rue",
        "quantity": 1,
        "priceOverride": "",
        "tags": [
          "magic-item"
        ],
        "monsterTypeTags": [],
        "lootTags": null
      }
    ],
    "services": [],
    "createdAt": 1752019200000,
    "category": "Magical Trinkets",
    "name": "The Magical Junk Drawer",
    "menu": []
  },
  {
    "id": "src-empyreal-reliquary",
    "name": "The Empyreal Reliquary",
    "wares": [
      {
        "rowId": "row-celestial-1",
        "name": "Radiant Feather (Preserved)",
        "basePrice": 20,
        "description": "Still glows faintly in true darkness.",
        "category": "Religious",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Religious",
          "domain": [
            "Light"
          ],
          "minRank": 0
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-2",
        "name": "Halo Fragment",
        "basePrice": 45,
        "description": "Warm to the touch, humming with residual light.",
        "category": "Religious",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Religious",
          "domain": [
            "Light"
          ],
          "minRank": 1
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-3",
        "name": "Vial of Living Light",
        "basePrice": 55,
        "description": "This vial can be used like a Potion of Light if uncorked.",
        "category": "Treasure",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "domain": [
            "Light"
          ],
          "minRank": 1
        },
        "tags": [
          "alchemical"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-4",
        "name": "Sprig of Undying Bloom",
        "basePrice": 25,
        "description": "Somehow still fresh, weeks after it should have wilted.",
        "category": "Treasure",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "domain": [
            "Life"
          ],
          "minRank": 1
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-5",
        "name": "Vial of Restorative Ichor",
        "basePrice": 65,
        "description": "This vial can be used like a Potion of Healing if consumed fresh.",
        "category": "Treasure",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "domain": [
            "Life"
          ],
          "minRank": 2
        },
        "tags": [
          "alchemical"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-6",
        "name": "Warm Heartstone",
        "basePrice": 50,
        "description": "Still beats faintly, like an echo.",
        "category": "Treasure",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "domain": [
            "Life"
          ],
          "minRank": 1
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-7",
        "name": "War-Scarred Feather",
        "basePrice": 22,
        "description": "Notched as if it once deflected a blade. Fletched onto a shaft, it flies about as true as a set of Arrows.",
        "category": "Treasure",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "domain": [
            "War"
          ],
          "minRank": 1
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-8",
        "name": "Battle Standard Fragment",
        "basePrice": 30,
        "description": "Torn from something much larger, still faintly stiff with old fervor.",
        "category": "Treasure",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "domain": [
            "War"
          ],
          "minRank": 2
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-9",
        "name": "Psychopomp's Lantern Shard",
        "basePrice": 40,
        "description": "Cold to the touch, no matter how long you hold it. Held aloft, it burns about as steady as a Torch, though it gives no warmth.",
        "category": "Religious",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Religious",
          "domain": [
            "Death"
          ],
          "minRank": 2
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-10",
        "name": "Ashen Wing Membrane",
        "basePrice": 28,
        "description": "Crumbles slightly at the edges, no matter how carefully it's handled.",
        "category": "Treasure",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "domain": [
            "Death"
          ],
          "minRank": 1
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-11",
        "name": "Scroll-Bound Feather Quill",
        "basePrice": 60,
        "description": "This quill can be used like a Potion of Comprehend Languages the first time it writes in a new tongue.",
        "category": "Religious",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Religious",
          "domain": [
            "Knowledge"
          ],
          "minRank": 1
        },
        "tags": [
          "alchemical"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-12",
        "name": "Sigil-Etched Bone Fragment",
        "basePrice": 35,
        "description": "Covered in tiny sigils in a language no living scholar recognizes.",
        "category": "Religious",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Religious",
          "domain": [
            "Knowledge"
          ],
          "minRank": 0
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-13",
        "name": "Verdant Down (Preserved)",
        "basePrice": 18,
        "description": "Smells faintly of growing things, even pressed flat.",
        "category": "Treasure",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "domain": [
            "Nature"
          ],
          "minRank": 0
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-14",
        "name": "Root-Bound Talon",
        "basePrice": 24,
        "description": "Wrapped in living vine that never seems to wilt. Cut free and dried, the vine cordage holds about as well as 50 feet of Hempen Rope.",
        "category": "Treasure",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "domain": [
            "Nature"
          ],
          "minRank": 1
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-15",
        "name": "Bleached Celestial Bone",
        "basePrice": 12,
        "description": "Lighter than it should be for its size. Carved down, it works about like a Quarterstaff, though rather less durable.",
        "category": "Treasure",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "minRank": 0
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-16",
        "name": "Faint Radiance Dust (vial)",
        "basePrice": 15,
        "description": "A pinch, carefully preserved in a stoppered vial. Glimmers faintly when disturbed, fading again within moments.",
        "category": "Treasure",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "minRank": 0
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-17",
        "name": "Warding Sigil Charm",
        "basePrice": 20,
        "description": "A small charm etched with a warding sigil, faintly warm to the touch. No two priests who've examined it agree on which ward it was meant to invoke.",
        "category": "Religious",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Religious",
          "minRank": 0
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-18",
        "name": "Celestial Seal (Broken)",
        "basePrice": 35,
        "description": "Once bound something significant. Now just a keepsake.",
        "category": "Treasure",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "minRank": 1
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-19",
        "name": "Bestial Fang (Radiant)",
        "basePrice": 30,
        "description": "Glows faintly along a hairline crack.",
        "category": "Weapon",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Weapon",
          "requiresFeature": "Bestial",
          "minRank": 1
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-20",
        "name": "Preserved Wing (Feathered)",
        "basePrice": 40,
        "description": "The feathers never quite stop moving in ambient air.",
        "category": "Armor",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Armor",
          "requiresFeature": "Wings",
          "minRank": 1
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-21",
        "name": "Sentient Whisper-Shard",
        "basePrice": 50,
        "description": "You can almost hear something speaking, just at the edge of hearing.",
        "category": "Religious",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Religious",
          "requiresFeature": "Sentient",
          "minRank": 2
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-hi-1",
        "name": "Shard of the Aegis",
        "basePrice": 350,
        "description": "A fragment of a celestial's protective ward, still faintly humming.",
        "category": "Armor",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Armor",
          "domain": [
            "Light"
          ],
          "minRank": 5
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-hi-2",
        "name": "Vial of Concentrated Radiance",
        "basePrice": 400,
        "description": "This vial can be used like a Potion of Superior Healing if consumed.",
        "category": "Treasure",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "domain": [
            "Light"
          ],
          "minRank": 5
        },
        "tags": [
          "alchemical"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-hi-3",
        "name": "Heartwood of the World Tree (Splinter)",
        "basePrice": 300,
        "description": "Warm and alive despite being cut free.",
        "category": "Treasure",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "domain": [
            "Nature"
          ],
          "minRank": 5
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-hi-4",
        "name": "Everlife Bloom (Preserved)",
        "basePrice": 380,
        "description": "This bloom can be used like a Potion of Greater Healing if crushed and consumed fresh.",
        "category": "Treasure",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "domain": [
            "Life"
          ],
          "minRank": 5
        },
        "tags": [
          "alchemical"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-hi-5",
        "name": "Warlord's Signet (Celestial)",
        "basePrice": 320,
        "description": "Once commanded armies. Still carries an air of authority.",
        "category": "Treasure",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "domain": [
            "War"
          ],
          "minRank": 4
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-hi-6",
        "name": "Death's Ledger Page",
        "basePrice": 280,
        "description": "A single page, listing names in a hand that never wavers.",
        "category": "Religious",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Religious",
          "domain": [
            "Death"
          ],
          "minRank": 4
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-hi-7",
        "name": "Archon's Battle Standard",
        "basePrice": 450,
        "description": "Torn from something vast, still humming with old purpose.",
        "category": "Treasure",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "domain": [
            "War"
          ],
          "minRank": 5
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-hi-8",
        "name": "Tome of Sealed Knowledge",
        "basePrice": 350,
        "description": "Locked shut by magic even its former owner couldn't undo.",
        "category": "Religious",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Religious",
          "domain": [
            "Knowledge"
          ],
          "minRank": 4
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-hi-9",
        "name": "Crown Fragment of the Empyreal Court",
        "basePrice": 550,
        "description": "A single jagged piece, but unmistakably regal even broken.",
        "category": "Treasure",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "minRank": 6
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-hi-10",
        "name": "Wing of Pure Radiance (Preserved)",
        "basePrice": 420,
        "description": "Doesn't fade, doesn't wilt, doesn't stop glowing.",
        "category": "Armor",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Armor",
          "domain": [
            "Light"
          ],
          "requiresFeature": "Wings",
          "minRank": 5
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-hi-11",
        "name": "Guardian's Unbroken Shield Fragment",
        "basePrice": 180,
        "description": "Dented once, and only once, in a way that clearly ended badly for something else. Still solid enough to function like a proper Shield.",
        "category": "Armor",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Armor",
          "domain": [
            "War"
          ],
          "minRank": 3
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-hi-12",
        "name": "Chalice of the Undying Vine",
        "basePrice": 220,
        "description": "Never runs dry when filled with water. Refuses to explain why.",
        "category": "Treasure",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Treasure",
          "domain": [
            "Nature"
          ],
          "minRank": 4
        },
        "tags": [],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-weapon-1",
        "name": "Common Blessed Shortsword",
        "basePrice": 8,
        "description": "Unremarkable but for a faint, persistent warmth in the blade.",
        "category": "Weapon",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Weapon",
          "minRank": 0
        },
        "tags": [
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-weapon-2",
        "name": "Life-Warded Dagger",
        "basePrice": 12,
        "description": "The edge never seems to dull, no matter how it's used.",
        "category": "Weapon",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Weapon",
          "minRank": 1,
          "domain": [
            "Life"
          ]
        },
        "tags": [
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-weapon-3",
        "name": "Verdant-Grown Spear",
        "basePrice": 15,
        "description": "The haft is still faintly alive, and doesn't dry out no matter the season.",
        "category": "Weapon",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Weapon",
          "minRank": 2,
          "domain": [
            "Nature"
          ]
        },
        "tags": [
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-weapon-4",
        "name": "Radiant-Edged Blade",
        "basePrice": 25,
        "description": "A short blade, its edge permanently warm to the touch.",
        "category": "Weapon",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Weapon",
          "minRank": 2,
          "domain": [
            "Light"
          ]
        },
        "tags": [
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-weapon-5",
        "name": "Sigil-Wrought Mace",
        "basePrice": 30,
        "description": "Etched head, plain haft \u2014 the sigils do the talking.",
        "category": "Weapon",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Weapon",
          "minRank": 2,
          "domain": [
            "Knowledge"
          ]
        },
        "tags": [
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-weapon-6",
        "name": "War-Blessed Warhammer",
        "basePrice": 60,
        "description": "Weighted for a mortal hand, blessed for something considerably more.",
        "category": "Weapon",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Weapon",
          "minRank": 3,
          "domain": [
            "War"
          ]
        },
        "tags": [
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-weapon-7",
        "name": "Death's Reaping Scythe (Ceremonial)",
        "basePrice": 70,
        "description": "Too ornate for real harvest work. Entirely too practical for anything else.",
        "category": "Weapon",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Weapon",
          "minRank": 3,
          "domain": [
            "Death"
          ]
        },
        "tags": [
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-weapon-8",
        "name": "Archon's Twinblade",
        "basePrice": 150,
        "description": "A matched pair, meant to be wielded together or not at all.",
        "category": "Weapon",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Weapon",
          "minRank": 5,
          "domain": [
            "War"
          ]
        },
        "tags": [
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-celestial-weapon-9",
        "name": "Empyreal War-Blade",
        "basePrice": 400,
        "description": "Forged for a hand far larger than any mortal's, and somehow still balanced.",
        "category": "Weapon",
        "monsterTypeTags": [
          "Celestial"
        ],
        "lootTags": {
          "kind": "Weapon",
          "minRank": 6
        },
        "tags": [
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      }
    ],
    "menu": [],
    "services": [],
    "createdAt": 1753500000000
  },
  {
    "id": "src-animus-salvage-registry",
    "name": "The Animus Salvage Registry",
    "wares": [
      {
        "rowId": "row-trapper-43",
        "name": "Warped Gearwork",
        "basePrice": 8,
        "description": "A tangle of bent brass gears, still worth something to a tinker.",
        "category": "Component",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Construct"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Mechanical"
          ]
        }
      },
      {
        "rowId": "row-trapper-44",
        "name": "Animated Plating (Scrap)",
        "basePrice": 25,
        "description": "A sheet of enchanted armor plating, the magic long faded.",
        "category": "Component",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Construct"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Magical"
          ]
        }
      },
      {
        "rowId": "row-trapper-45",
        "name": "Construct Core Fragment",
        "basePrice": 60,
        "description": "A cracked shard of whatever powered the thing. Still faintly warm.",
        "category": "Core",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Construct"
        ],
        "tags": [
          "craft-material",
          "arcane"
        ],
        "lootTags": {
          "kind": "Core",
          "mechanism": [
            "Magical"
          ],
          "purpose": [
            "Guardian"
          ]
        }
      },
      {
        "rowId": "row-trapper-46",
        "name": "Cracked Rune Stone",
        "basePrice": 45,
        "description": "Etched with a sigil no one currently living can read.",
        "category": "Component",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Construct"
        ],
        "tags": [
          "craft-material",
          "arcane"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Magical"
          ]
        }
      },
      {
        "rowId": "row-trapper-47",
        "name": "Salvaged Joint Mechanism",
        "basePrice": 15,
        "description": "A ball-and-socket joint, oddly well-preserved.",
        "category": "Component",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Construct"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Mechanical"
          ]
        }
      },
      {
        "rowId": "row-trapper-48",
        "name": "Animated Armor Fragment",
        "basePrice": 12,
        "description": "A dented piece of what used to move on its own.",
        "category": "Component",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Construct"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Magical"
          ]
        }
      },
      {
        "rowId": "row-trapper-49",
        "name": "Golem Clay (Sample)",
        "basePrice": 30,
        "description": "A lump of enchanted clay, inert now but still faintly warm.",
        "category": "Core",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Construct"
        ],
        "tags": [
          "craft-material",
          "arcane"
        ],
        "lootTags": {
          "kind": "Core",
          "mechanism": [
            "Magical"
          ]
        }
      },
      {
        "rowId": "row-trapper-50",
        "name": "Construct Wiring (Arcane)",
        "basePrice": 20,
        "description": "Thin filaments of something between wire and sinew.",
        "category": "Component",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Construct"
        ],
        "tags": [
          "craft-material",
          "arcane"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Arcane-Mechanical"
          ]
        }
      },
      {
        "rowId": "row-trapper-51",
        "name": "Flying Sword Fragment",
        "basePrice": 22,
        "description": "A broken length of blade, still humming faintly if you hold it just right.",
        "category": "Core",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Construct"
        ],
        "tags": [
          "craft-material",
          "arcane"
        ],
        "lootTags": {
          "kind": "Core",
          "mechanism": [
            "Magical"
          ],
          "purpose": [
            "Infiltrator"
          ]
        }
      },
      {
        "rowId": "row-trapper-52",
        "name": "Stone Golem Chip",
        "basePrice": 18,
        "description": "A chipped fragment, heavier than stone this size should be.",
        "category": "Component",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Construct"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Magical"
          ]
        }
      },
      {
        "rowId": "row-construct-1",
        "name": "Rune-Etched Core Fragment",
        "basePrice": 55,
        "description": "A shard of stone, still humming with the command-word that once bound it.",
        "category": "Core",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Core",
          "mechanism": [
            "Magical"
          ],
          "purpose": [
            "Guardian"
          ]
        },
        "tags": [
          "craft-material",
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-2",
        "name": "Animating Sigil Plate",
        "basePrice": 15,
        "description": "A thin metal plate covered in a single, repeating sigil.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Magical"
          ]
        },
        "tags": [
          "craft-material",
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-3",
        "name": "Bound Elemental Residue (vial)",
        "basePrice": 60,
        "description": "Captured essence, faintly warm, from whatever force once drove the construct.",
        "category": "Core",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Core",
          "mechanism": [
            "Magical"
          ]
        },
        "tags": [
          "craft-material",
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-4",
        "name": "Warded Clay Fragment",
        "basePrice": 10,
        "description": "Fired clay, still bearing the fingerprints of whoever shaped it \u2014 and the wardmarks of whoever bound it.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Magical"
          ]
        },
        "tags": [
          "craft-material",
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-5",
        "name": "Golem Heartstone",
        "basePrice": 70,
        "description": "The single stone that, by all accounts, should not have been able to think.",
        "category": "Core",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Core",
          "mechanism": [
            "Magical"
          ],
          "purpose": [
            "Guardian"
          ]
        },
        "tags": [
          "craft-material",
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-6",
        "name": "Enchanted Binding Chain",
        "basePrice": 20,
        "description": "Links of dull metal, each etched with a different restraining glyph.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Magical"
          ],
          "purpose": [
            "Sentinel"
          ]
        },
        "tags": [
          "craft-material",
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-7",
        "name": "Command Word Tablet",
        "basePrice": 12,
        "description": "A stone tablet with a single word carved deep. Speaking it does nothing anymore.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Magical"
          ]
        },
        "tags": [
          "craft-material",
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-8",
        "name": "Spellbound Dust (vial)",
        "basePrice": 45,
        "description": "Fine powder, swept from the construct's core chamber. Still faintly warm.",
        "category": "Core",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Core",
          "mechanism": [
            "Magical"
          ]
        },
        "tags": [
          "craft-material",
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-9",
        "name": "Brass Gearwork Cluster",
        "basePrice": 8,
        "description": "A tangle of interlocking gears, still turning slowly on their own.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Mechanical"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-10",
        "name": "Clockwork Spring, Coiled",
        "basePrice": 6,
        "description": "Wound tight and dangerous to handle carelessly.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Mechanical"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-11",
        "name": "Piston Assembly, Bent",
        "basePrice": 10,
        "description": "Once drove a limb. Now just drives a tinker's curiosity.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Mechanical"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-12",
        "name": "Precision Cog Set",
        "basePrice": 40,
        "description": "Matched gears, cut with a precision no local smith could replicate.",
        "category": "Core",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Core",
          "mechanism": [
            "Mechanical"
          ],
          "purpose": [
            "Archivist"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-13",
        "name": "Steam Valve, Corroded",
        "basePrice": 7,
        "description": "Rusted shut, but the mechanism inside still turns freely.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Mechanical"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-14",
        "name": "Clockwork Escapement",
        "basePrice": 50,
        "description": "The ticking heart of the thing \u2014 remove it, and everything stops.",
        "category": "Core",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Core",
          "mechanism": [
            "Mechanical"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-15",
        "name": "Riveted Plating, Scorched",
        "basePrice": 9,
        "description": "Dented and blackened, but still holds its shape.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Mechanical"
          ],
          "purpose": [
            "Siege Engine"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-16",
        "name": "Wind-Key, Oversized",
        "basePrice": 14,
        "description": "Far too large for any pocket watch. Clearly made for something else entirely.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Mechanical"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-17",
        "name": "Vat-Grown Tissue Sample",
        "basePrice": 12,
        "description": "Grown, not born. The texture is almost right.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Biological"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-18",
        "name": "Engineered Sinew Cord",
        "basePrice": 15,
        "description": "Stronger than it should be for its thickness. Doesn't behave quite like natural muscle.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Biological"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-19",
        "name": "Artificial Nerve Cluster",
        "basePrice": 55,
        "description": "A tangle of fibers that conduct something other than blood.",
        "category": "Core",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Core",
          "mechanism": [
            "Biological"
          ],
          "purpose": [
            "Infiltrator"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-20",
        "name": "Grown-Bone Lattice",
        "basePrice": 10,
        "description": "Bone-like in structure, but grown in a mold, not a body.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Biological"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-21",
        "name": "Homunculus Ichor (vial)",
        "basePrice": 65,
        "description": "Thick, faintly luminous fluid. Doesn't behave like normal blood under any test.",
        "category": "Core",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Core",
          "mechanism": [
            "Biological"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-22",
        "name": "Synthetic Membrane Sheet",
        "basePrice": 11,
        "description": "Skin-like, but seamless \u2014 no pores, no hair, no history.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Biological"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-23",
        "name": "Grafted Organ Cluster",
        "basePrice": 60,
        "description": "Several small organs, fused together, clearly built rather than grown naturally.",
        "category": "Core",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Core",
          "mechanism": [
            "Biological"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-24",
        "name": "Cultured Growth Medium (jar)",
        "basePrice": 8,
        "description": "Whatever this thing was raised in, there's still a little left.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Biological"
          ],
          "purpose": [
            "Servant"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-25",
        "name": "Rune-Inscribed Gear",
        "basePrice": 18,
        "description": "A gear etched with sigils instead of teeth marks \u2014 somehow it still turns.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Arcane-Mechanical"
          ]
        },
        "tags": [
          "craft-material",
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-26",
        "name": "Arcane Capacitor Coil",
        "basePrice": 65,
        "description": "Wound copper wire around a crystal core, humming faintly even now.",
        "category": "Core",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Core",
          "mechanism": [
            "Arcane-Mechanical"
          ]
        },
        "tags": [
          "craft-material",
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-27",
        "name": "Enchanted Piston Assembly",
        "basePrice": 22,
        "description": "Moves smoother than mechanics alone should allow.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Arcane-Mechanical"
          ]
        },
        "tags": [
          "craft-material",
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-28",
        "name": "Spellwrought Clockspring",
        "basePrice": 70,
        "description": "A spring that seems to store more tension than metal alone could hold.",
        "category": "Core",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Core",
          "mechanism": [
            "Arcane-Mechanical"
          ],
          "purpose": [
            "Siege Engine"
          ]
        },
        "tags": [
          "craft-material",
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-29",
        "name": "Glyph-Etched Plating",
        "basePrice": 20,
        "description": "Metal plating with a single repeating glyph stamped into every inch.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Arcane-Mechanical"
          ],
          "purpose": [
            "Sentinel"
          ]
        },
        "tags": [
          "craft-material",
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-30",
        "name": "Runic Pressure Valve",
        "basePrice": 16,
        "description": "Vents something that isn't quite steam when triggered.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Arcane-Mechanical"
          ]
        },
        "tags": [
          "craft-material",
          "arcane"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-31",
        "name": "Grafted Metal Joint",
        "basePrice": 20,
        "description": "Flesh fused seamlessly to metal, healed over as if it always belonged there.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Bio-Mechanical"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-32",
        "name": "Cybernetic Nerve Bundle",
        "basePrice": 75,
        "description": "Living tissue wound through wire, both somehow still functioning.",
        "category": "Core",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Core",
          "mechanism": [
            "Bio-Mechanical"
          ],
          "purpose": [
            "Infiltrator"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-33",
        "name": "Plated Muscle Fiber",
        "basePrice": 18,
        "description": "Muscle tissue reinforced with embedded metal filaments.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Bio-Mechanical"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-34",
        "name": "Bio-Mechanical Pump Valve",
        "basePrice": 70,
        "description": "Part heart, part machine, entirely unsettling to look at closely.",
        "category": "Core",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Core",
          "mechanism": [
            "Bio-Mechanical"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-35",
        "name": "Fused Chassis Fragment",
        "basePrice": 17,
        "description": "Bone and metal grown together at the seam \u2014 deliberately, not by accident.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Bio-Mechanical"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-construct-36",
        "name": "Synthetic Vein Coil",
        "basePrice": 15,
        "description": "Tubing that pulses faintly, carrying something that isn't quite blood.",
        "category": "Component",
        "monsterTypeTags": [
          "Construct"
        ],
        "lootTags": {
          "kind": "Component",
          "mechanism": [
            "Bio-Mechanical"
          ],
          "purpose": [
            "Excavator"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      }
    ],
    "menu": [],
    "services": [],
    "createdAt": 1753600000000
  },
  {
    "id": "src-dragonslayers-ledger",
    "name": "The Dragonslayer's Ledger",
    "wares": [
      {
        "rowId": "row-trapper-53",
        "name": "Black Dragon Horn",
        "basePrice": 170,
        "description": "Pitted and etched by the acid that once ran down it.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Color-Specific",
          "lineage": [
            "Black"
          ]
        }
      },
      {
        "rowId": "row-trapper-54",
        "name": "Blue Dragon Horn",
        "basePrice": 180,
        "description": "Crackles faintly with residual static when touched.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Color-Specific",
          "lineage": [
            "Blue"
          ]
        }
      },
      {
        "rowId": "row-trapper-55",
        "name": "Green Dragon Horn",
        "basePrice": 170,
        "description": "Faintly slick, and best handled with gloves.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Color-Specific",
          "lineage": [
            "Green"
          ]
        }
      },
      {
        "rowId": "row-trapper-56",
        "name": "Red Dragon Horn",
        "basePrice": 190,
        "description": "Warm to the touch no matter the season.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Color-Specific",
          "lineage": [
            "Red"
          ]
        }
      },
      {
        "rowId": "row-trapper-57",
        "name": "White Dragon Horn",
        "basePrice": 160,
        "description": "Cold enough to numb bare skin on contact.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Color-Specific",
          "lineage": [
            "White"
          ]
        }
      },
      {
        "rowId": "row-trapper-58",
        "name": "Brass Dragon Horn",
        "basePrice": 175,
        "description": "Sun-warmed and gritty with desert sand.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Color-Specific",
          "lineage": [
            "Brass"
          ]
        }
      },
      {
        "rowId": "row-trapper-59",
        "name": "Bronze Dragon Horn",
        "basePrice": 190,
        "description": "Carries a faint ozone smell, like the air after a storm.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Color-Specific",
          "lineage": [
            "Bronze"
          ]
        }
      },
      {
        "rowId": "row-trapper-60",
        "name": "Copper Dragon Horn",
        "basePrice": 180,
        "description": "Etched with what might be the dragon's own claw-marks.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Color-Specific",
          "lineage": [
            "Copper"
          ]
        }
      },
      {
        "rowId": "row-trapper-61",
        "name": "Gold Dragon Horn",
        "basePrice": 220,
        "description": "Gleams like polished metal, untarnished by time.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Color-Specific",
          "lineage": [
            "Gold"
          ]
        }
      },
      {
        "rowId": "row-trapper-62",
        "name": "Silver Dragon Horn",
        "basePrice": 200,
        "description": "Cool and smooth, prized by jewelers.",
        "category": "Horn",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Color-Specific",
          "lineage": [
            "Silver"
          ]
        }
      },
      {
        "rowId": "row-trapper-63",
        "name": "Black Dragon Wing (Membrane)",
        "basePrice": 190,
        "description": "Pockmarked with old acid scarring.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Wing",
          "lineage": [
            "Black"
          ]
        }
      },
      {
        "rowId": "row-trapper-64",
        "name": "Blue Dragon Wing (Membrane)",
        "basePrice": 200,
        "description": "Thin enough to see light through, but tougher than steel plate.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Wing",
          "lineage": [
            "Blue"
          ]
        }
      },
      {
        "rowId": "row-trapper-65",
        "name": "Green Dragon Wing (Membrane)",
        "basePrice": 190,
        "description": "Faintly mottled, and best not breathed in too closely.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Wing",
          "lineage": [
            "Green"
          ]
        }
      },
      {
        "rowId": "row-trapper-66",
        "name": "Red Dragon Wing (Membrane)",
        "basePrice": 210,
        "description": "Leathery, near-indestructible, and still smells faintly of smoke.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Wing",
          "lineage": [
            "Red"
          ]
        }
      },
      {
        "rowId": "row-trapper-67",
        "name": "White Dragon Wing (Membrane)",
        "basePrice": 180,
        "description": "Stiff with a permanent frost that never quite melts.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Wing",
          "lineage": [
            "White"
          ]
        }
      },
      {
        "rowId": "row-trapper-68",
        "name": "Brass Dragon Wing (Membrane)",
        "basePrice": 195,
        "description": "Dry and papery, like old parchment.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Wing",
          "lineage": [
            "Brass"
          ]
        }
      },
      {
        "rowId": "row-trapper-69",
        "name": "Bronze Dragon Wing (Membrane)",
        "basePrice": 210,
        "description": "Crackles faintly with stored static.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Wing",
          "lineage": [
            "Bronze"
          ]
        }
      },
      {
        "rowId": "row-trapper-70",
        "name": "Copper Dragon Wing (Membrane)",
        "basePrice": 200,
        "description": "Surprisingly ticklish, or so the legends claim.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Wing",
          "lineage": [
            "Copper"
          ]
        }
      },
      {
        "rowId": "row-trapper-71",
        "name": "Gold Dragon Wing (Membrane)",
        "basePrice": 240,
        "description": "Edged with what looks like actual gold leaf.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Wing",
          "lineage": [
            "Gold"
          ]
        }
      },
      {
        "rowId": "row-trapper-72",
        "name": "Silver Dragon Wing (Membrane)",
        "basePrice": 220,
        "description": "Cool, pale, and untouched by time.",
        "category": "Wing",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Wing",
          "lineage": [
            "Silver"
          ]
        }
      },
      {
        "rowId": "row-trapper-73",
        "name": "Black Dragon Heart",
        "basePrice": 300,
        "description": "Still faintly warm, and said to hold the last ember of the dragon's fury.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "alchemical"
        ],
        "lootTags": {
          "kind": "Heart",
          "lineage": [
            "Black"
          ]
        }
      },
      {
        "rowId": "row-trapper-74",
        "name": "Blue Dragon Heart",
        "basePrice": 310,
        "description": "Crackles faintly if you listen closely.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "alchemical"
        ],
        "lootTags": {
          "kind": "Heart",
          "lineage": [
            "Blue"
          ]
        }
      },
      {
        "rowId": "row-trapper-75",
        "name": "Green Dragon Heart",
        "basePrice": 300,
        "description": "Best handled with gloves and a very good reason.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "alchemical"
        ],
        "lootTags": {
          "kind": "Heart",
          "lineage": [
            "Green"
          ]
        }
      },
      {
        "rowId": "row-trapper-76",
        "name": "Red Dragon Heart",
        "basePrice": 320,
        "description": "Radiates heat long after the rest of the body has gone cold.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "alchemical"
        ],
        "lootTags": {
          "kind": "Heart",
          "lineage": [
            "Red"
          ]
        }
      },
      {
        "rowId": "row-trapper-77",
        "name": "White Dragon Heart",
        "basePrice": 290,
        "description": "Cold as the day the dragon died.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "alchemical"
        ],
        "lootTags": {
          "kind": "Heart",
          "lineage": [
            "White"
          ]
        }
      },
      {
        "rowId": "row-trapper-78",
        "name": "Brass Dragon Heart",
        "basePrice": 300,
        "description": "Radiates a dry, desert heat.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "alchemical"
        ],
        "lootTags": {
          "kind": "Heart",
          "lineage": [
            "Brass"
          ]
        }
      },
      {
        "rowId": "row-trapper-79",
        "name": "Bronze Dragon Heart",
        "basePrice": 330,
        "description": "Hums faintly, like distant thunder.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "alchemical"
        ],
        "lootTags": {
          "kind": "Heart",
          "lineage": [
            "Bronze"
          ]
        }
      },
      {
        "rowId": "row-trapper-80",
        "name": "Copper Dragon Heart",
        "basePrice": 310,
        "description": "Surprisingly light for its size.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "alchemical"
        ],
        "lootTags": {
          "kind": "Heart",
          "lineage": [
            "Copper"
          ]
        }
      },
      {
        "rowId": "row-trapper-81",
        "name": "Gold Dragon Heart",
        "basePrice": 380,
        "description": "Said to never stop glowing faintly, even removed.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "alchemical"
        ],
        "lootTags": {
          "kind": "Heart",
          "lineage": [
            "Gold"
          ]
        }
      },
      {
        "rowId": "row-trapper-82",
        "name": "Silver Dragon Heart",
        "basePrice": 360,
        "description": "Untouched by decay, centuries after the kill.",
        "category": "Heart",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "alchemical"
        ],
        "lootTags": {
          "kind": "Heart",
          "lineage": [
            "Silver"
          ]
        }
      },
      {
        "rowId": "row-trapper-83",
        "name": "Black Dragon Fang",
        "basePrice": 135,
        "description": "Long enough to be re-hafted into a genuine dagger, and sharp enough to matter.",
        "category": "Fang",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material",
          "weapon-material"
        ],
        "lootTags": {
          "kind": "Fang",
          "lineage": [
            "Black"
          ]
        }
      },
      {
        "rowId": "row-trapper-84",
        "name": "Red Dragon Fang",
        "basePrice": 140,
        "description": "Long enough to be re-hafted into a genuine dagger, and sharp enough to matter.",
        "category": "Fang",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material",
          "weapon-material"
        ],
        "lootTags": {
          "kind": "Fang",
          "lineage": [
            "Red"
          ]
        }
      },
      {
        "rowId": "row-trapper-85",
        "name": "Blue Dragon Fang",
        "basePrice": 138,
        "description": "Faintly warm and crackling, even long after the kill.",
        "category": "Fang",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material",
          "weapon-material"
        ],
        "lootTags": {
          "kind": "Fang",
          "lineage": [
            "Blue"
          ]
        }
      },
      {
        "rowId": "row-trapper-86",
        "name": "Gold Dragon Fang",
        "basePrice": 175,
        "description": "Gleaming and near-untarnished, worth a small fortune to the right buyer.",
        "category": "Fang",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material",
          "weapon-material"
        ],
        "lootTags": {
          "kind": "Fang",
          "lineage": [
            "Gold"
          ]
        }
      },
      {
        "rowId": "row-trapper-87",
        "name": "Black Dragon Claw",
        "basePrice": 130,
        "description": "Etched with old acid scarring; still holds an edge.",
        "category": "Claw",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material",
          "weapon-material"
        ],
        "lootTags": {
          "kind": "Talon",
          "lineage": [
            "Black"
          ]
        }
      },
      {
        "rowId": "row-trapper-88",
        "name": "Red Dragon Claw",
        "basePrice": 135,
        "description": "Warm to the touch, sharp enough to serve as a wicked dagger.",
        "category": "Claw",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material",
          "weapon-material"
        ],
        "lootTags": {
          "kind": "Talon",
          "lineage": [
            "Red"
          ]
        }
      },
      {
        "rowId": "row-trapper-89",
        "name": "Silver Dragon Claw",
        "basePrice": 145,
        "description": "Cool and pale, prized by silversmiths for the metal it's set into.",
        "category": "Claw",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material",
          "weapon-material"
        ],
        "lootTags": {
          "kind": "Talon",
          "lineage": [
            "Silver"
          ]
        }
      },
      {
        "rowId": "row-trapper-90",
        "name": "Black Dragon Scale",
        "basePrice": 90,
        "description": "Pitted with old acid scarring, tougher than plate armor.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Color-Specific",
          "lineage": [
            "Black"
          ]
        }
      },
      {
        "rowId": "row-trapper-91",
        "name": "Blue Dragon Scale",
        "basePrice": 95,
        "description": "A single scale, still crackling faintly with static.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Color-Specific",
          "lineage": [
            "Blue"
          ]
        }
      },
      {
        "rowId": "row-trapper-92",
        "name": "Green Dragon Scale",
        "basePrice": 90,
        "description": "Faintly slick to the touch.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Color-Specific",
          "lineage": [
            "Green"
          ]
        }
      },
      {
        "rowId": "row-trapper-93",
        "name": "Red Dragon Scale",
        "basePrice": 100,
        "description": "Warm to the touch, prized by armorers.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Color-Specific",
          "lineage": [
            "Red"
          ]
        }
      },
      {
        "rowId": "row-trapper-94",
        "name": "White Dragon Scale",
        "basePrice": 85,
        "description": "Cold enough to frost over in a warm room.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Color-Specific",
          "lineage": [
            "White"
          ]
        }
      },
      {
        "rowId": "row-trapper-95",
        "name": "Brass Dragon Scale",
        "basePrice": 92,
        "description": "Warm and gritty, like sun-baked sand.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Color-Specific",
          "lineage": [
            "Brass"
          ]
        }
      },
      {
        "rowId": "row-trapper-96",
        "name": "Bronze Dragon Scale",
        "basePrice": 100,
        "description": "Smells faintly of ozone.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Color-Specific",
          "lineage": [
            "Bronze"
          ]
        }
      },
      {
        "rowId": "row-trapper-97",
        "name": "Copper Dragon Scale",
        "basePrice": 95,
        "description": "Etched with faint claw-mark patterns.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Color-Specific",
          "lineage": [
            "Copper"
          ]
        }
      },
      {
        "rowId": "row-trapper-98",
        "name": "Gold Dragon Scale",
        "basePrice": 130,
        "description": "Gleams like real gold, and is worth nearly as much.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Color-Specific",
          "lineage": [
            "Gold"
          ]
        }
      },
      {
        "rowId": "row-trapper-99",
        "name": "Silver Dragon Scale",
        "basePrice": 115,
        "description": "Cool and untarnished, prized by silversmiths.",
        "category": "Scale",
        "priceOverride": "",
        "quantity": 1,
        "monsterTypeTags": [
          "Dragon"
        ],
        "tags": [
          "craft-material"
        ],
        "lootTags": {
          "kind": "Color-Specific",
          "lineage": [
            "Silver"
          ]
        }
      },
      {
        "rowId": "row-dragon-anatomy-1",
        "name": "Green Dragon Fang",
        "basePrice": 138,
        "description": "Long enough to function like a dagger, faintly sticky even when clean.",
        "category": "Fang",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Fang",
          "lineage": [
            "Green"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-2",
        "name": "White Dragon Fang",
        "basePrice": 130,
        "description": "Cold enough to sting bare skin, even sheathed.",
        "category": "Fang",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Fang",
          "lineage": [
            "White"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-3",
        "name": "Brass Dragon Fang",
        "basePrice": 132,
        "description": "Warm and slightly porous, unlike most dragons' teeth.",
        "category": "Fang",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Fang",
          "lineage": [
            "Brass"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-4",
        "name": "Bronze Dragon Fang",
        "basePrice": 140,
        "description": "A faint static charge lingers on the enamel.",
        "category": "Fang",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Fang",
          "lineage": [
            "Bronze"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-5",
        "name": "Copper Dragon Fang",
        "basePrice": 136,
        "description": "Faintly corroded at the tip, despite being otherwise intact.",
        "category": "Fang",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Fang",
          "lineage": [
            "Copper"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-6",
        "name": "Silver Dragon Fang",
        "basePrice": 148,
        "description": "Cold to the touch, no matter how long it's held.",
        "category": "Fang",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Fang",
          "lineage": [
            "Silver"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-7",
        "name": "Blue Dragon Talon",
        "basePrice": 140,
        "description": "Curved and sand-scoured smooth at the tip.",
        "category": "Talon",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Talon",
          "lineage": [
            "Blue"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-8",
        "name": "Green Dragon Talon",
        "basePrice": 130,
        "description": "Long and slightly hooked, stained faintly green at the base.",
        "category": "Talon",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Talon",
          "lineage": [
            "Green"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-9",
        "name": "White Dragon Talon",
        "basePrice": 125,
        "description": "Frost-rimed even well after removal.",
        "category": "Talon",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Talon",
          "lineage": [
            "White"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-10",
        "name": "Brass Dragon Talon",
        "basePrice": 128,
        "description": "Blunter than most dragon talons \u2014 brass dragons dig more than they fight.",
        "category": "Talon",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Talon",
          "lineage": [
            "Brass"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-11",
        "name": "Bronze Dragon Talon",
        "basePrice": 142,
        "description": "Salt-crusted, pitted from long exposure to sea air.",
        "category": "Talon",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Talon",
          "lineage": [
            "Bronze"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-12",
        "name": "Copper Dragon Talon",
        "basePrice": 132,
        "description": "The tip has a faint greenish patina, like aged metal.",
        "category": "Talon",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Talon",
          "lineage": [
            "Copper"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-13",
        "name": "Gold Dragon Talon",
        "basePrice": 165,
        "description": "Polished smooth, almost ornamental despite the obvious edge.",
        "category": "Talon",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Talon",
          "lineage": [
            "Gold"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-14",
        "name": "Black Dragon Breath Organ (Acid)",
        "basePrice": 220,
        "description": "A sac of corrosive fluid, sealed tight against its own bite.",
        "category": "Breath Organ",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Breath Organ",
          "lineage": [
            "Black"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-15",
        "name": "Blue Dragon Breath Organ (Lightning)",
        "basePrice": 230,
        "description": "Crackles faintly if handled with bare, damp hands.",
        "category": "Breath Organ",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Breath Organ",
          "lineage": [
            "Blue"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-16",
        "name": "Green Dragon Breath Organ (Poison)",
        "basePrice": 215,
        "description": "Handle with tongs. The vapor alone stings the eyes.",
        "category": "Breath Organ",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Breath Organ",
          "lineage": [
            "Green"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-17",
        "name": "Red Dragon Breath Organ (Fire)",
        "basePrice": 240,
        "description": "Warm long after removal, and slow to cool further.",
        "category": "Breath Organ",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Breath Organ",
          "lineage": [
            "Red"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-18",
        "name": "White Dragon Breath Organ (Cold)",
        "basePrice": 210,
        "description": "Frost forms on anything left touching it too long.",
        "category": "Breath Organ",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Breath Organ",
          "lineage": [
            "White"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-19",
        "name": "Brass Dragon Breath Organ (Fire)",
        "basePrice": 215,
        "description": "Warm and dry, smells faintly of embers.",
        "category": "Breath Organ",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Breath Organ",
          "lineage": [
            "Brass"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-20",
        "name": "Bronze Dragon Breath Organ (Lightning)",
        "basePrice": 235,
        "description": "A faint charge lingers, enough to raise the hair on your arm.",
        "category": "Breath Organ",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Breath Organ",
          "lineage": [
            "Bronze"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-21",
        "name": "Copper Dragon Breath Organ (Acid)",
        "basePrice": 225,
        "description": "Corrosive residue has etched the inside of its own housing.",
        "category": "Breath Organ",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Breath Organ",
          "lineage": [
            "Copper"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-22",
        "name": "Gold Dragon Breath Organ (Fire)",
        "basePrice": 280,
        "description": "Radiates heat evenly, never quite cooling to ambient.",
        "category": "Breath Organ",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Breath Organ",
          "lineage": [
            "Gold"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-23",
        "name": "Silver Dragon Breath Organ (Cold)",
        "basePrice": 260,
        "description": "Frost-rimed no matter the surrounding temperature.",
        "category": "Breath Organ",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Breath Organ",
          "lineage": [
            "Silver"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-24",
        "name": "Black Dragon Stomach Contents",
        "basePrice": 60,
        "description": "Bones, coin, and things better left unidentified, dissolving slowly.",
        "category": "Stomach",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Stomach",
          "lineage": [
            "Black"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-25",
        "name": "Blue Dragon Stomach Contents",
        "basePrice": 65,
        "description": "Sand-scoured bones and a few desert coins, fused together.",
        "category": "Stomach",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Stomach",
          "lineage": [
            "Blue"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-26",
        "name": "Green Dragon Stomach Contents",
        "basePrice": 55,
        "description": "Mostly plant matter and bone, and one very old dagger.",
        "category": "Stomach",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Stomach",
          "lineage": [
            "Green"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-27",
        "name": "Red Dragon Stomach Contents",
        "basePrice": 60,
        "description": "Ash, bone, and slag \u2014 whatever was here didn't survive the heat.",
        "category": "Stomach",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Stomach",
          "lineage": [
            "Red"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-28",
        "name": "White Dragon Stomach Contents",
        "basePrice": 50,
        "description": "Frozen solid. Whatever's inside will have to wait to be identified.",
        "category": "Stomach",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Stomach",
          "lineage": [
            "White"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-29",
        "name": "Brass Dragon Stomach Contents",
        "basePrice": 55,
        "description": "Mostly sand and bone \u2014 brass dragons prefer to talk before they eat.",
        "category": "Stomach",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Stomach",
          "lineage": [
            "Brass"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-30",
        "name": "Bronze Dragon Stomach Contents",
        "basePrice": 65,
        "description": "Storm-tossed debris, driftwood, and a few waterlogged coins.",
        "category": "Stomach",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Stomach",
          "lineage": [
            "Bronze"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-31",
        "name": "Copper Dragon Stomach Contents",
        "basePrice": 58,
        "description": "A joke, half-digested, along with the usual bone and coin.",
        "category": "Stomach",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Stomach",
          "lineage": [
            "Copper"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-32",
        "name": "Gold Dragon Stomach Contents",
        "basePrice": 90,
        "description": "Remarkably orderly for a stomach. Coin sorted almost by size.",
        "category": "Stomach",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Stomach",
          "lineage": [
            "Gold"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-dragon-anatomy-33",
        "name": "Silver Dragon Stomach Contents",
        "basePrice": 75,
        "description": "Mountain-worn stone and bone, packed tight with old frost.",
        "category": "Stomach",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Stomach",
          "lineage": [
            "Silver"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-drake-1",
        "name": "Tamed Drake Collar (Worn)",
        "basePrice": 15,
        "description": "Leather and brass, clearly made for a creature that answered to a name.",
        "category": "Trophy",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Trophy"
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-drake-2",
        "name": "Feral Claw Bundle",
        "basePrice": 20,
        "description": "Uneven and chipped \u2014 whatever wore these fought for everything it had.",
        "category": "Trophy",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Trophy"
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-drake-3",
        "name": "Mountain Drake Horn Fragment",
        "basePrice": 25,
        "description": "Worn smooth by wind and altitude.",
        "category": "Trophy",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Trophy"
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-drake-4",
        "name": "Coastal Drake Fin-Spine",
        "basePrice": 18,
        "description": "Salt-crusted and still faintly damp.",
        "category": "Trophy",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Trophy"
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-drake-5",
        "name": "Swamp Drake Jawbone",
        "basePrice": 20,
        "description": "Half-sunk in muck for who knows how long before it was found.",
        "category": "Trophy",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Trophy"
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-drake-6",
        "name": "Wild Drake Skull, Small",
        "basePrice": 22,
        "description": "Small enough to have belonged to something young \u2014 or something that simply never grew large.",
        "category": "Trophy",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Trophy"
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-drake-7",
        "name": "Drake Hide Scrap",
        "basePrice": 8,
        "description": "Tougher than it looks for how thin it is.",
        "category": "Parts",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Parts"
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-drake-8",
        "name": "Small Wing Membrane (Drake)",
        "basePrice": 10,
        "description": "A fraction the size of a true dragon's, but the same basic structure.",
        "category": "Parts",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Parts"
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-drake-9",
        "name": "Draconid Talon, Blunt",
        "basePrice": 6,
        "description": "Worn down from digging or scrambling more than fighting.",
        "category": "Parts",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Parts"
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-drake-10",
        "name": "Domesticated Drake Scale",
        "basePrice": 5,
        "description": "Duller than a wild drake's \u2014 years of handling wear the shine off.",
        "category": "Parts",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Parts"
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-drake-11",
        "name": "Fire-Warmed Scale",
        "basePrice": 12,
        "description": "Stays faintly warm no matter the ambient temperature.",
        "category": "Parts",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Parts",
          "lineage": [
            "Fire"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-drake-12",
        "name": "Frost-Rimed Scale",
        "basePrice": 12,
        "description": "A thin layer of frost reforms within minutes of being wiped clean.",
        "category": "Parts",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Parts",
          "lineage": [
            "Frost"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-drake-13",
        "name": "Storm-Charged Scale",
        "basePrice": 14,
        "description": "A faint static charge builds on it during any approaching storm.",
        "category": "Parts",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Parts",
          "lineage": [
            "Storm"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-drake-14",
        "name": "Bog-Slick Scale",
        "basePrice": 9,
        "description": "Never quite dries out, no matter how long it's stored.",
        "category": "Parts",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Parts",
          "lineage": [
            "Swamp"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      },
      {
        "rowId": "row-drake-15",
        "name": "Bark-Textured Scale",
        "basePrice": 9,
        "description": "Rough and mottled, easy to mistake for actual bark at a glance.",
        "category": "Parts",
        "monsterTypeTags": [
          "Dragon"
        ],
        "lootTags": {
          "kind": "Parts",
          "lineage": [
            "Forest"
          ]
        },
        "tags": [
          "craft-material"
        ],
        "priceOverride": "",
        "quantity": 1
      }
    ],
    "menu": [],
    "services": [],
    "createdAt": 1753700000000
  }
]
