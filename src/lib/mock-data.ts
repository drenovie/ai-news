import { Club, Article } from "./types";

export const clubs: Club[] = [
  // Serie A 2025-26
  { id: "atalanta", name: "Atalanta", shortName: "ATA", logo: "", league: "serie_a", city: "Bergamo", color: "210 100% 30%" },
  { id: "bologna", name: "Bologna", shortName: "BOL", logo: "", league: "serie_a", city: "Bologna", color: "210 80% 35%" },
  { id: "cagliari", name: "Cagliari", shortName: "CAG", logo: "", league: "serie_a", city: "Cagliari", color: "0 70% 40%" },
  { id: "como", name: "Como 1907", shortName: "COM", logo: "", league: "serie_a", city: "Como", color: "210 90% 45%" },
  { id: "cremonese", name: "Cremonese", shortName: "CRE", logo: "", league: "serie_a", city: "Cremona", color: "0 70% 38%" },
  { id: "fiorentina", name: "Fiorentina", shortName: "FIO", logo: "", league: "serie_a", city: "Firenze", color: "270 60% 45%" },
  { id: "genoa", name: "Genoa", shortName: "GEN", logo: "", league: "serie_a", city: "Genova", color: "0 80% 35%" },
  { id: "inter", name: "Inter", shortName: "INT", logo: "", league: "serie_a", city: "Milano", color: "220 80% 40%" },
  { id: "juventus", name: "Juventus", shortName: "JUV", logo: "", league: "serie_a", city: "Torino", color: "0 0% 15%" },
  { id: "lazio", name: "Lazio", shortName: "LAZ", logo: "", league: "serie_a", city: "Roma", color: "200 70% 55%" },
  { id: "lecce", name: "Lecce", shortName: "LEC", logo: "", league: "serie_a", city: "Lecce", color: "45 90% 50%" },
  { id: "milan", name: "AC Milan", shortName: "MIL", logo: "", league: "serie_a", city: "Milano", color: "0 85% 45%" },
  { id: "napoli", name: "Napoli", shortName: "NAP", logo: "", league: "serie_a", city: "Napoli", color: "200 100% 40%" },
  { id: "parma", name: "Parma", shortName: "PAR", logo: "", league: "serie_a", city: "Parma", color: "50 80% 45%" },
  { id: "pisa", name: "Pisa", shortName: "PIS", logo: "", league: "serie_a", city: "Pisa", color: "220 60% 30%" },
  { id: "roma", name: "AS Roma", shortName: "ROM", logo: "", league: "serie_a", city: "Roma", color: "25 85% 45%" },
  { id: "sassuolo", name: "Sassuolo", shortName: "SAS", logo: "", league: "serie_a", city: "Sassuolo", color: "145 70% 35%" },
  { id: "torino", name: "Torino", shortName: "TOR", logo: "", league: "serie_a", city: "Torino", color: "0 60% 30%" },
  { id: "udinese", name: "Udinese", shortName: "UDI", logo: "", league: "serie_a", city: "Udine", color: "0 0% 25%" },
  { id: "verona", name: "Hellas Verona", shortName: "VER", logo: "", league: "serie_a", city: "Verona", color: "55 70% 40%" },
  // Serie B 2025-26
  { id: "avellino", name: "Avellino", shortName: "AVE", logo: "", league: "serie_b", city: "Avellino", color: "120 60% 35%" },
  { id: "bari", name: "Bari", shortName: "BAR", logo: "", league: "serie_b", city: "Bari", color: "0 80% 48%" },
  { id: "brescia", name: "Brescia", shortName: "BRE", logo: "", league: "serie_b", city: "Brescia", color: "215 70% 45%" },
  { id: "carrarese", name: "Carrarese", shortName: "CAR", logo: "", league: "serie_b", city: "Carrara", color: "210 55% 42%" },
  { id: "cesena", name: "Cesena", shortName: "CES", logo: "", league: "serie_b", city: "Cesena", color: "0 0% 20%" },
  { id: "cittadella", name: "Cittadella", shortName: "CIT", logo: "", league: "serie_b", city: "Cittadella", color: "0 65% 42%" },
  { id: "cosenza", name: "Cosenza", shortName: "COS", logo: "", league: "serie_b", city: "Cosenza", color: "0 75% 40%" },
  { id: "empoli", name: "Empoli", shortName: "EMP", logo: "", league: "serie_b", city: "Empoli", color: "215 85% 50%" },
  { id: "frosinone", name: "Frosinone", shortName: "FRO", logo: "", league: "serie_b", city: "Frosinone", color: "55 85% 50%" },
  { id: "mantova", name: "Mantova", shortName: "MAN", logo: "", league: "serie_b", city: "Mantova", color: "0 0% 30%" },
  { id: "modena", name: "Modena", shortName: "MOD", logo: "", league: "serie_b", city: "Modena", color: "50 90% 45%" },
  { id: "monza", name: "Monza", shortName: "MON", logo: "", league: "serie_b", city: "Monza", color: "0 75% 50%" },
  { id: "palermo", name: "Palermo", shortName: "PAL", logo: "", league: "serie_b", city: "Palermo", color: "330 65% 50%" },
  { id: "pescara", name: "Pescara", shortName: "PES", logo: "", league: "serie_b", city: "Pescara", color: "200 60% 45%" },
  { id: "reggiana", name: "Reggiana", shortName: "REG", logo: "", league: "serie_b", city: "Reggio Emilia", color: "0 60% 35%" },
  { id: "sampdoria", name: "Sampdoria", shortName: "SAM", logo: "", league: "serie_b", city: "Genova", color: "220 75% 50%" },
  { id: "spezia", name: "Spezia", shortName: "SPE", logo: "", league: "serie_b", city: "La Spezia", color: "0 0% 18%" },
  { id: "sudtirol", name: "Südtirol", shortName: "SUD", logo: "", league: "serie_b", city: "Bolzano", color: "0 50% 38%" },
  { id: "venezia", name: "Venezia", shortName: "VEN", logo: "", league: "serie_b", city: "Venezia", color: "30 80% 40%" },
  { id: "virtus-entella", name: "Virtus Entella", shortName: "VIR", logo: "", league: "serie_b", city: "Chiavari", color: "210 40% 35%" },
];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const mockArticles: Article[] = [
  {
    id: "1",
    slug: slugify("Lautaro Martinez extends Inter contract until 2029"),
    title: "Lautaro Martinez extends Inter contract until 2029",
    snippet: "The Argentine striker has signed a contract extension with the Nerazzurri. A strong signal from the club for the future.",
    content: "Lautaro Martinez has officially renewed his contract with Inter until 2029. The Argentine striker, captain of the Nerazzurri, signed the extension at the club's headquarters. 'I'm very happy to continue here, Inter is my home,' declared El Toro after the signing. The new deal includes a salary adjustment that will make him the highest-paid player in the squad.",
    source: "Football Italia",
    sourceUrl: "https://www.football-italia.net",
    imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
    publishedAt: "2026-02-28T14:30:00Z",
    clubIds: ["inter"],
  },
  {
    id: "2",
    slug: slugify("Napoli sign new centre-back in defensive boost"),
    title: "Napoli sign new centre-back in defensive boost",
    snippet: "The Partenopei close the deal to reinforce their backline. The player is expected tomorrow for medical tests.",
    content: "Napoli have closed the deal for a new centre-back. The operation was concluded in the final hours with the club reaching an agreement based on a loan with obligation to buy. The player is expected in Naples tomorrow to undergo medical tests and sign the contract.",
    source: "Goal.com",
    sourceUrl: "https://www.goal.com",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    publishedAt: "2026-02-28T11:00:00Z",
    clubIds: ["napoli"],
  },
  {
    id: "3",
    slug: slugify("Derby della Madonnina: Milan vs Inter — predicted lineups"),
    title: "Derby della Madonnina: Milan vs Inter — predicted lineups",
    snippet: "All set for the Milan derby. Here's how the two managers could line up their teams on Saturday evening at San Siro.",
    content: "The Derby della Madonnina is approaching and anticipation grows for one of Italian football's most heated rivalries. Milan and Inter will face each other Saturday evening at San Siro in a match that could prove decisive in the title race. Both managers have worked intensively during the week to prepare for the fixture.",
    source: "Football Italia",
    sourceUrl: "https://www.football-italia.net",
    imageUrl: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&q=80",
    publishedAt: "2026-02-27T18:45:00Z",
    clubIds: ["milan", "inter"],
  },
  {
    id: "4",
    slug: slugify("Juventus midfielder injury: recovery timeline revealed"),
    title: "Juventus midfielder injury: recovery timeline revealed",
    snippet: "Bad news for the Bianconeri: the midfielder pulled up in training. Tests revealed a muscular injury.",
    content: "Juventus lose an important piece for the coming weeks. The midfielder pulled up during this morning's training session at Continassa, complaining of a muscular problem in his right thigh. Tests revealed a first-degree biceps femoris injury. Recovery time is estimated at approximately three weeks.",
    source: "Goal.com",
    sourceUrl: "https://www.goal.com",
    imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80",
    publishedAt: "2026-02-27T10:15:00Z",
    clubIds: ["juventus"],
  },
  {
    id: "5",
    slug: slugify("Roma new signing unveiled: 'I want to win here'"),
    title: "Roma new signing unveiled: 'I want to win here'",
    snippet: "The new Giallorossi player's press conference. Great enthusiasm and ambitious goals for the second half of the season.",
    content: "Roma's new signing was unveiled today in a press conference at the Trigoria training ground. 'I'm thrilled to be here, Roma is a great club with an incredible fan base. I want to give everything for this shirt and help the team achieve its objectives,' declared the visibly excited player.",
    source: "Football Italia",
    sourceUrl: "https://www.football-italia.net",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80",
    publishedAt: "2026-02-26T16:00:00Z",
    clubIds: ["roma"],
  },
  {
    id: "6",
    slug: slugify("Serie B: Palermo dream of automatic promotion"),
    title: "Serie B: Palermo dream of automatic promotion",
    snippet: "The Rosanero continue their march towards Serie A. Yesterday's win puts them just two points off the top of the table.",
    content: "Palermo are unstoppable in their push for Serie A. Yesterday evening's victory allowed the team to move within just two points of the top of the Serie B table. Fans are dreaming of a return to the top flight after years of absence. The squad is in extraordinary form.",
    source: "Goal.com",
    sourceUrl: "https://www.goal.com",
    imageUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80",
    publishedAt: "2026-02-26T09:30:00Z",
    clubIds: ["palermo"],
  },
];

export function getClubById(id: string): Club | undefined {
  return clubs.find((c) => c.id === id);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return mockArticles.find((a) => a.slug === slug);
}

export function getClubsByLeague(league: "serie_a" | "serie_b"): Club[] {
  return clubs.filter((c) => c.league === league);
}
