export type RankedCountry = {
  code: string;
  name_en: string;
  name_es: string;
  flag_emoji: string;
  slug: string;
  votes: number;
  members: number;
};

export type RankingStats = {
  countries: number;
  votes: number;
  members: number;
  leader: RankedCountry | null;
};