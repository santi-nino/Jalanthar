// Demo-mode content. This is what the site shows when Firebase isn't configured
// yet, and doubles as a reference for the shape of documents to seed into
// Firestore (see scripts/seed.js).

export const mockBuildings = [
  {
    id: 'bld-magistrate-house',
    name: "Magistrate's House",
    subheader: 'Seat of Governance',
    type: 'civic',
    coords: { x: 34, y: 22 },
    quadrant: 'inhabited',
    description:
      "Originally built as a guildhall for a town three times Jalanthar's current size, this squared timber building now serves as both home and office for the magistrate. Its outer rooms sit empty and dust-sheeted; only the study and a single bedroom see regular use.",
    interiorLayout: '',
    residents: ['npc-magistrate'],
    wares: [],
    menu: [],
    services: [],
  },
  {
    id: 'bld-crowing-cockatrice',
    name: 'The Crowing Cockatrice',
    subheader: 'Tavern & Inn',
    type: 'tavern',
    coords: { x: 62, y: 55 },
    quadrant: 'inhabited',
    description:
      "A tavern built to serve a much larger town, now warmly overfull with the handful of regulars who keep its hearth lit. Most of its guest rooms are shuttered, but the common room still fills most nights.",
    interiorLayout: '',
    residents: [],
    wares: [],
    menu: [
      { item: 'Trail stew', price: '3 cp', notes: 'Whatever the hunters brought in that week' },
      { item: 'Small beer', price: '2 cp' },
      { item: "Guide's room (per night)", price: '5 sp' },
    ],
    services: [],
  },
  {
    id: 'bld-triad-shrine',
    name: 'Shrine of the Triad',
    subheader: 'Helm, Ilmater, Torm',
    type: 'shrine',
    coords: { x: 47, y: 33 },
    quadrant: 'inhabited',
    description:
      'A modest shrine at the edge of the central plaza, tended without a proper cleric — the town relies on a lay caretaker and traveling priests passing the Moon Pass road.',
    interiorLayout: '',
    residents: [],
    wares: [],
    menu: [],
    services: [
      { service: 'Blessing before travel', notes: 'Free, donation welcomed' },
      { service: 'Tending the dead', notes: 'Traditional rites for the fallen' },
    ],
  },
  {
    id: 'bld-garrison-quarters',
    name: 'Garrison Quarters',
    subheader: "The Party's Posting",
    type: 'garrison',
    coords: { x: 58, y: 38 },
    quadrant: 'inhabited',
    description:
      'Repurposed from what was once a militia hall, this building now houses the permanent protective garrison assigned to Jalanthar.',
    interiorLayout: '',
    residents: [],
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
    appearance: '',
    personality: '',
    clothing: '',
    history: '',
    relationships: [],
  },
]
