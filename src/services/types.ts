export type Hero = {
  id: string;
  slackHandle: string;
  isSelected: boolean;
  isAvailable: boolean;
  lastSelected: string;
}

export type HeroConfiguration = {
  numberOfHeroes: number;
  lastModified: string;
}
