// Demo-mode content. This is what the site shows when Firebase isn't configured
// yet, and doubles as a reference for the shape of documents to seed into
// Firestore (see scripts/seed.js).

export const mockBuildings = [
  {
    id: 'bld-magistrate-house',
    name: "Magistrate's House",
    subheader: 'Seat of Governance',
    type: 'Civic',
    coords: { x: 24, y: 22 },
    quadrant: 'inhabited',
    interiorLayoutImage: '',
    description:
      "Originally built as a guildhall for a town three times Jalanthar's current size, this squared timber building now serves as both home and office for the magistrate. Its outer rooms sit empty and dust-sheeted; only the study and a single bedroom see regular use.",
    residents: ['npc-magistrate'],
    priceMultiplier: 1.5,
    wares: [],
    menu: [],
    services: [],
  },
  {
    id: 'bld-crowing-cockatrice',
    name: 'The Crowing Cockatrice',
    subheader: 'Tavern & Inn',
    type: 'Tavern',
    coords: { x: 32, y: 71 },
    quadrant: 'inhabited',
    interiorLayoutImage: '',
    description:
      "A tavern built to serve a much larger town, now warmly overfull with the handful of regulars who keep its hearth lit. Most of its guest rooms are shuttered, but the common room still fills most nights.",
    residents: [],
    priceMultiplier: 1.5,
    wares: [],
    menu: [
      {
        rowId: 'seed-menu-1',
        name: 'Meal, modest',
        basePrice: 0.3,
        description: "Stew, bread, and whatever's in season.",
        priceOverride: '',
      },
      {
        rowId: 'seed-menu-2',
        name: 'Ale (mug)',
        basePrice: 0.04,
        description: 'The standard pour, brewed in-house.',
        priceOverride: '',
      },
      {
        rowId: 'seed-menu-3',
        name: 'Room, private (per night)',
        basePrice: 0.5,
        description: 'A locked door and a bed to yourself.',
        priceOverride: '',
      },
    ],
    services: [],
  },
  {
    id: 'bld-triad-shrine',
    name: 'Shrine of the Triad',
    subheader: 'Helm, Ilmater, Torm',
    type: 'Shrine',
    coords: { x: 50, y: 40 },
    quadrant: 'inhabited',
    interiorLayoutImage: '',
    description:
      'A modest shrine at the edge of the central plaza, tended without a proper cleric — the town relies on a lay caretaker and traveling priests passing the Moon Pass road.',
    residents: [],
    priceMultiplier: 1.5,
    wares: [],
    menu: [],
    services: [
      {
        rowId: 'seed-svc-1',
        name: 'Minor spellcasting service',
        basePrice: 10,
        description:
          'A simple spell cast on your behalf, if someone capable is willing.',
        priceOverride: '',
      },
    ],
  },
  {
    id: 'bld-garrison-quarters',
    name: 'Garrison Quarters',
    subheader: "The Party's Posting",
    type: 'Garrison',
    coords: { x: 75, y: 38 },
    quadrant: 'inhabited',
    interiorLayoutImage: '',
    description:
      'Repurposed from what was once a militia hall, this building now houses the permanent protective garrison assigned to Jalanthar.',
    residents: [],
    priceMultiplier: 1.5,
    wares: [],
    menu: [],
    services: [],
  },
]

export const mockFamilies = [
  { id: 'fam-thicket', name: 'The Thickets', description: '' },
  { id: 'fam-michael', name: 'The Michaels', description: '' },
]

export const mockNpcs = [
  {
    id: 'npc-magistrate',
    name: 'Unnamed Magistrate',
    familyName: 'The Thickets',
    homeBuildingId: 'bld-magistrate-house',
    visible: false,
    job: 'Magistrate',
    famousQuote: '',
    eyeColor: '',
    hairColor: '',
    height: '',
    weight: '',
    distinguishingFeatures: '',
    appearance: '',
    personality: '',
    clothing: '',
    history: '',
    relationships: [],
  },
]
