
export type DemoCountry = {
  id: string;
  name: string;
  slug: string;
  flag: string;
  votes: number;
  members: number;
};

export const demoCountries: DemoCountry[] = [
  { id: "1", name: "South Korea", slug: "south-korea", flag: "🇰🇷", votes: 28450, members: 5200 },
  { id: "2", name: "Philippines", slug: "philippines", flag: "🇵🇭", votes: 24180, members: 4600 },
  { id: "3", name: "Brazil", slug: "brazil", flag: "🇧🇷", votes: 19820, members: 3900 },
  { id: "4", name: "Mexico", slug: "mexico", flag: "🇲🇽", votes: 17360, members: 3400 },
  { id: "5", name: "United States", slug: "united-states", flag: "🇺🇸", votes: 15240, members: 3100 },
  { id: "6", name: "Indonesia", slug: "indonesia", flag: "🇮🇩", votes: 13890, members: 2800 },
  { id: "7", name: "Thailand", slug: "thailand", flag: "🇹🇭", votes: 11650, members: 2400 },
  { id: "8", name: "Peru", slug: "peru", flag: "🇵🇪", votes: 9850, members: 1900 },
  { id: "9", name: "Japan", slug: "japan", flag: "🇯🇵", votes: 8720, members: 1700 },
  { id: "10", name: "India", slug: "india", flag: "🇮🇳", votes: 7940, members: 1500 },
];

export const formatVotes = (votes: number) =>
  new Intl.NumberFormat("en-US").format(votes);

export const totalDemoVotes = demoCountries.reduce(
  (total, country) => total + country.votes,
  0,
);
