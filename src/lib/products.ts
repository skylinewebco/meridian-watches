// ============================================================
// MERIDIAN — product catalogue (fictional demo data)
// Unofficial portfolio concept. Not affiliated with Rolex.
// All prices are fictional demo prices.
// ============================================================

export type ThreeMaterial = {
  case: string;
  bezel: string;
  dial: string;
  hands: string; // markers + hands accent
  metalness: number;
  roughness: number;
  bezelStyle?: "smooth" | "fluted" | "coin" | "tachy";
};

export type Variant = {
  id: string;
  name: string; // e.g. "Oystersteel · Black"
  material: string; // case metal label
  swatch: string; // selector dot color
  swatch2?: string; // for two-tone dots
  price: number; // fictional demo price (USD)
  three: ThreeMaterial;
};

/** Complication layout — drives model-accurate dial rendering (no branding). */
export type DialType =
  | "chrono" // Daytona: 3 sub-dials + tachymeter
  | "diver" // Submariner: 60-min diver bezel + date
  | "gmt" // GMT: 24h bezel + GMT hand + date
  | "date" // Datejust: fluted bezel + cyclops date
  | "daydate" // Day-Date: day arc + date
  | "skydweller" // Sky-Dweller: off-centre 24h disc + month ring
  | "explorer" // Explorer: 3/6/9 numerals
  | "yachtmaster" // Yacht-Master: 60-unit numbered bezel
  | "dress"; // 1908: small-seconds sub-dial

export type Watch = {
  slug: string;
  name: string;
  collection: string; // marketing line
  descriptor: string; // short one-liner for cards
  tagline: string; // hero-ish line
  description: string; // luxury paragraph
  caseSize: string;
  movement: string;
  waterResistance: string;
  powerReserve: string;
  crystal: string;
  straps: string[];
  sizes: string[];
  variants: Variant[];
  dialType: DialType;
  featured?: boolean;
  icon?: boolean;
  order: number;
};

const M = {
  steel: "#c7cace",
  yellowGold: "#d8b24c",
  roseGold: "#d29a76",
  whiteGold: "#dde1e6",
  platinum: "#e3e6ea",
};

export const watches: Watch[] = [
  {
    slug: "cosmograph-daytona",
    name: "Cosmograph Daytona",
    collection: "The Racing Chronograph",
    descriptor: "Chronograph · Tachymetric bezel",
    tagline: "Born to race, built to endure.",
    description:
      "Conceived for endurance racing, the Cosmograph reads speed at a glance. A tachymetric scale rings the bezel; three counters measure the moment with unflinching precision. Function distilled into pure intent.",
    caseSize: "40mm",
    movement: "Self-winding chronograph",
    waterResistance: "100m",
    powerReserve: "72 hours",
    crystal: "Scratch-resistant sapphire",
    straps: ["Oyster bracelet", "Oysterflex", "Leather"],
    sizes: ["40mm"],
    icon: true,
    featured: true,
    order: 1,
    dialType: "chrono",
    variants: [
      {
        id: "gold-green",
        name: "Yellow Gold · Green",
        material: "18ct Yellow Gold",
        swatch: M.yellowGold,
        swatch2: "#12633a",
        price: 41500,
        three: { case: M.yellowGold, bezel: M.yellowGold, dial: "#125236", hands: "#e6cf9c", metalness: 1, roughness: 0.22, bezelStyle: "tachy" },
      },
      {
        id: "steel-white",
        name: "Oystersteel · White",
        material: "Oystersteel",
        swatch: M.steel,
        price: 18450,
        three: { case: M.steel, bezel: "#1b1b1f", dial: "#ecebe6", hands: "#111114", metalness: 1, roughness: 0.2, bezelStyle: "tachy" },
      },
      {
        id: "steel-black",
        name: "Oystersteel · Black",
        material: "Oystersteel",
        swatch: "#101012",
        price: 18450,
        three: { case: M.steel, bezel: "#e9e7e1", dial: "#0c0c0e", hands: "#e9e7e1", metalness: 1, roughness: 0.2, bezelStyle: "tachy" },
      },
      {
        id: "gold-champagne",
        name: "Yellow Gold · Champagne",
        material: "18ct Yellow Gold",
        swatch: M.yellowGold,
        price: 39200,
        three: { case: M.yellowGold, bezel: M.yellowGold, dial: "#d8c48f", hands: "#2a230f", metalness: 1, roughness: 0.22, bezelStyle: "tachy" },
      },
    ],
  },
  {
    slug: "submariner",
    name: "Submariner",
    collection: "The Reference Among Divers",
    descriptor: "Diver · Unidirectional bezel",
    tagline: "Engineered for the deep.",
    description:
      "The archetype of the diver's watch. A unidirectional bezel tracks elapsed time beneath the surface; a case sealed against the ocean guards the movement within. Legibility without compromise, at any depth.",
    caseSize: "41mm",
    movement: "Self-winding, perpetual",
    waterResistance: "300m",
    powerReserve: "70 hours",
    crystal: "Scratch-resistant sapphire",
    straps: ["Oyster bracelet", "Rubber"],
    sizes: ["41mm"],
    featured: true,
    order: 2,
    dialType: "diver",
    variants: [
      {
        id: "steel-black",
        name: "Oystersteel · Black",
        material: "Oystersteel",
        swatch: "#0c0c0e",
        price: 10900,
        three: { case: M.steel, bezel: "#0b0b0d", dial: "#08090b", hands: "#e9e7e1", metalness: 1, roughness: 0.2, bezelStyle: "coin" },
      },
      {
        id: "steel-green",
        name: "Oystersteel · Starboard Green",
        material: "Oystersteel",
        swatch: "#0f4d34",
        price: 11250,
        three: { case: M.steel, bezel: "#0d3f2b", dial: "#0b3a28", hands: "#e9e7e1", metalness: 1, roughness: 0.2, bezelStyle: "coin" },
      },
      {
        id: "gold-blue",
        name: "Yellow Gold · Blue",
        material: "18ct Yellow Gold",
        swatch: M.yellowGold,
        swatch2: "#173a6b",
        price: 41800,
        three: { case: M.yellowGold, bezel: "#173a6b", dial: "#14335f", hands: "#e9e7e1", metalness: 1, roughness: 0.22, bezelStyle: "coin" },
      },
    ],
  },
  {
    slug: "gmt-master-ii",
    name: "GMT-Master II",
    collection: "The Traveller's Instrument",
    descriptor: "Dual time · 24-hour bezel",
    tagline: "Two time zones. One horizon.",
    description:
      "Born for pilots crossing meridians, the GMT-Master II reads a second time zone on a rotatable 24-hour bezel. A companion for those who measure life in departures and arrivals.",
    caseSize: "40mm",
    movement: "Self-winding, dual-time",
    waterResistance: "100m",
    powerReserve: "70 hours",
    crystal: "Scratch-resistant sapphire",
    straps: ["Oyster bracelet", "Jubilee bracelet"],
    sizes: ["40mm"],
    featured: true,
    order: 3,
    dialType: "gmt",
    variants: [
      {
        id: "steel-pepsi",
        name: "Oystersteel · Blue / Red",
        material: "Oystersteel",
        swatch: "#1c3f79",
        swatch2: "#a02033",
        price: 12550,
        three: { case: M.steel, bezel: "#1c3f79", dial: "#08090b", hands: "#e9e7e1", metalness: 1, roughness: 0.2, bezelStyle: "coin" },
      },
      {
        id: "steel-batman",
        name: "Oystersteel · Blue / Black",
        material: "Oystersteel",
        swatch: "#1c3f79",
        swatch2: "#0c0c0e",
        price: 12550,
        three: { case: M.steel, bezel: "#16305c", dial: "#08090b", hands: "#e9e7e1", metalness: 1, roughness: 0.2, bezelStyle: "coin" },
      },
      {
        id: "twotone-root",
        name: "Two-Tone · Grey",
        material: "Everose / Oystersteel",
        swatch: M.steel,
        swatch2: M.roseGold,
        price: 21400,
        three: { case: M.roseGold, bezel: "#2c2f34", dial: "#33363b", hands: "#f0e6dc", metalness: 1, roughness: 0.24, bezelStyle: "coin" },
      },
    ],
  },
  {
    slug: "datejust",
    name: "Datejust",
    collection: "The Timeless Classic",
    descriptor: "Date display · Fluted bezel",
    tagline: "The watch that defined the wristwatch.",
    description:
      "The Datejust is the very archetype of the classic watch. Balanced proportions, a fluted bezel and the date framed at three o'clock. Understatement, perfected over generations.",
    caseSize: "36mm",
    movement: "Self-winding, perpetual",
    waterResistance: "100m",
    powerReserve: "70 hours",
    crystal: "Scratch-resistant sapphire, Cyclops",
    straps: ["Jubilee bracelet", "Oyster bracelet", "Leather"],
    sizes: ["31mm", "36mm", "41mm"],
    order: 4,
    dialType: "date",
    variants: [
      {
        id: "steel-silver",
        name: "Oystersteel · Silver",
        material: "Oystersteel",
        swatch: M.steel,
        price: 8600,
        three: { case: M.steel, bezel: M.steel, dial: "#cfd2d4", hands: "#111114", metalness: 1, roughness: 0.22, bezelStyle: "fluted" },
      },
      {
        id: "steel-blue",
        name: "Oystersteel · Blue",
        material: "Oystersteel",
        swatch: "#1b4a86",
        price: 8900,
        three: { case: M.steel, bezel: M.whiteGold, dial: "#194a86", hands: "#e9e7e1", metalness: 1, roughness: 0.22, bezelStyle: "fluted" },
      },
      {
        id: "twotone-champagne",
        name: "Two-Tone · Champagne",
        material: "Yellow Rolesor",
        swatch: M.steel,
        swatch2: M.yellowGold,
        price: 14300,
        three: { case: M.yellowGold, bezel: M.yellowGold, dial: "#d8c48f", hands: "#2a230f", metalness: 1, roughness: 0.24, bezelStyle: "fluted" },
      },
    ],
  },
  {
    slug: "day-date",
    name: "Day-Date 40",
    collection: "The Presidential",
    descriptor: "Day & date · Precious metals only",
    tagline: "Worn by those who shape the day.",
    description:
      "Struck only in gold or platinum, the Day-Date spells the day in full across the dial. A watch of quiet authority, it has adorned the wrists of statesmen and visionaries since 1956.",
    caseSize: "40mm",
    movement: "Self-winding, perpetual",
    waterResistance: "100m",
    powerReserve: "70 hours",
    crystal: "Scratch-resistant sapphire, Cyclops",
    straps: ["President bracelet", "Leather"],
    sizes: ["40mm"],
    featured: true,
    order: 5,
    dialType: "daydate",
    variants: [
      {
        id: "gold-champagne",
        name: "Yellow Gold · Champagne",
        material: "18ct Yellow Gold",
        swatch: M.yellowGold,
        price: 42600,
        three: { case: M.yellowGold, bezel: M.yellowGold, dial: "#d8c48f", hands: "#2a230f", metalness: 1, roughness: 0.22, bezelStyle: "fluted" },
      },
      {
        id: "platinum-ice",
        name: "Platinum · Ice Blue",
        material: "950 Platinum",
        swatch: "#bcd3dd",
        price: 71900,
        three: { case: M.platinum, bezel: M.platinum, dial: "#bcd3dd", hands: "#12303a", metalness: 1, roughness: 0.3, bezelStyle: "fluted" },
      },
      {
        id: "everose-choco",
        name: "Everose Gold · Chocolate",
        material: "18ct Everose Gold",
        swatch: M.roseGold,
        swatch2: "#3a2417",
        price: 46200,
        three: { case: M.roseGold, bezel: M.roseGold, dial: "#3a2417", hands: "#f0e6dc", metalness: 1, roughness: 0.24, bezelStyle: "fluted" },
      },
    ],
  },
  {
    slug: "sky-dweller",
    name: "Sky-Dweller",
    collection: "The Annual Calendar",
    descriptor: "Dual time · Annual calendar",
    tagline: "Master of months and meridians.",
    description:
      "A watch of remarkable ingenuity: an annual calendar that distinguishes 30 and 31-day months, paired with a second time zone read from an off-centre disc. Complexity, made intuitive.",
    caseSize: "42mm",
    movement: "Self-winding, annual calendar",
    waterResistance: "100m",
    powerReserve: "72 hours",
    crystal: "Scratch-resistant sapphire",
    straps: ["Oyster bracelet", "Leather"],
    sizes: ["42mm"],
    order: 6,
    dialType: "skydweller",
    variants: [
      {
        id: "steel-blue",
        name: "Oystersteel · Bright Blue",
        material: "Oystersteel",
        swatch: "#1f5fa8",
        price: 15800,
        three: { case: M.steel, bezel: M.whiteGold, dial: "#1f5fa8", hands: "#e9e7e1", metalness: 1, roughness: 0.22, bezelStyle: "fluted" },
      },
      {
        id: "twotone-white",
        name: "Two-Tone · White",
        material: "Yellow Rolesor",
        swatch: M.steel,
        swatch2: M.yellowGold,
        price: 20100,
        three: { case: M.yellowGold, bezel: M.yellowGold, dial: "#eceae4", hands: "#2a230f", metalness: 1, roughness: 0.24, bezelStyle: "fluted" },
      },
    ],
  },
  {
    slug: "explorer",
    name: "Explorer",
    collection: "The Original Tool Watch",
    descriptor: "Purist · Highly legible",
    tagline: "Made for the extremes of the earth.",
    description:
      "Forged in the spirit of exploration, the Explorer strips a watch to its essence: robust, luminous, endlessly legible. A quiet companion for altitude, distance and the unknown.",
    caseSize: "36mm",
    movement: "Self-winding, perpetual",
    waterResistance: "100m",
    powerReserve: "70 hours",
    crystal: "Scratch-resistant sapphire",
    straps: ["Oyster bracelet"],
    sizes: ["36mm", "40mm"],
    order: 7,
    dialType: "explorer",
    variants: [
      {
        id: "steel-black",
        name: "Oystersteel · Black",
        material: "Oystersteel",
        swatch: "#0c0c0e",
        price: 7550,
        three: { case: M.steel, bezel: M.steel, dial: "#08090b", hands: "#e9e7e1", metalness: 1, roughness: 0.22, bezelStyle: "smooth" },
      },
      {
        id: "twotone-black",
        name: "Two-Tone · Black",
        material: "Yellow Rolesor",
        swatch: M.steel,
        swatch2: M.yellowGold,
        price: 11700,
        three: { case: M.yellowGold, bezel: M.yellowGold, dial: "#0c0c0e", hands: "#d8b24c", metalness: 1, roughness: 0.24, bezelStyle: "smooth" },
      },
    ],
  },
  {
    slug: "yacht-master",
    name: "Yacht-Master 42",
    collection: "The Nautical Companion",
    descriptor: "Regatta · Bidirectional bezel",
    tagline: "The spirit of the open sea.",
    description:
      "A nod to the world of sailing, the Yacht-Master pairs a raised bidirectional bezel with maritime elegance. Sporting yet refined — equally at home on deck or off it.",
    caseSize: "42mm",
    movement: "Self-winding, perpetual",
    waterResistance: "100m",
    powerReserve: "70 hours",
    crystal: "Scratch-resistant sapphire",
    straps: ["Oysterflex", "Oyster bracelet"],
    sizes: ["40mm", "42mm"],
    order: 8,
    dialType: "yachtmaster",
    variants: [
      {
        id: "whitegold-black",
        name: "White Gold · Black",
        material: "18ct White Gold",
        swatch: M.whiteGold,
        swatch2: "#0c0c0e",
        price: 29800,
        three: { case: M.whiteGold, bezel: "#101114", dial: "#08090b", hands: "#e9e7e1", metalness: 1, roughness: 0.24, bezelStyle: "coin" },
      },
      {
        id: "everose-black",
        name: "Everose Gold · Black",
        material: "18ct Everose Gold",
        swatch: M.roseGold,
        price: 32400,
        three: { case: M.roseGold, bezel: "#1a1c1f", dial: "#0c0c0e", hands: "#f0e6dc", metalness: 1, roughness: 0.24, bezelStyle: "coin" },
      },
    ],
  },
  {
    slug: "perpetual-1908",
    name: "1908",
    collection: "The Dress Watch, Reimagined",
    descriptor: "Dress · Openwork caseback",
    tagline: "Heritage worn on the wrist.",
    description:
      "A tribute to the year the name was registered, the 1908 revives classical watchmaking: a slim case, a guilloché dial and an exhibition caseback revealing the calibre in motion. Pure horology.",
    caseSize: "39mm",
    movement: "Self-winding, perpetual",
    waterResistance: "50m",
    powerReserve: "66 hours",
    crystal: "Domed sapphire, exhibition back",
    straps: ["Alligator leather"],
    sizes: ["39mm"],
    order: 9,
    dialType: "dress",
    variants: [
      {
        id: "yellowgold-white",
        name: "Yellow Gold · Intense White",
        material: "18ct Yellow Gold",
        swatch: M.yellowGold,
        swatch2: "#eceae4",
        price: 22600,
        three: { case: M.yellowGold, bezel: M.yellowGold, dial: "#eceae4", hands: "#2a230f", metalness: 1, roughness: 0.24, bezelStyle: "smooth" },
      },
      {
        id: "whitegold-black",
        name: "White Gold · Black",
        material: "18ct White Gold",
        swatch: M.whiteGold,
        swatch2: "#0c0c0e",
        price: 23900,
        three: { case: M.whiteGold, bezel: M.whiteGold, dial: "#0c0c0e", hands: "#e9e7e1", metalness: 1, roughness: 0.26, bezelStyle: "smooth" },
      },
    ],
  },
];

export const getWatch = (slug: string) => watches.find((w) => w.slug === slug);
export const iconWatch = watches.find((w) => w.icon) ?? watches[0];
export const featuredWatches = watches.filter((w) => w.featured);

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export const priceRange = (w: Watch) => {
  const prices = w.variants.map((v) => v.price);
  return Math.min(...prices);
};
