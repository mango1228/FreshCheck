export interface StorageInfo {
  refrigerator: string;
  freezer: string;
  roomTemp: string;
}

export interface ShelfLifeEntry {
  days: number;
  label: string;
}

export interface ShelfLifeInfo {
  refrigerator: ShelfLifeEntry;
  freezer: ShelfLifeEntry;
  roomTemp: ShelfLifeEntry;
}

export interface SeasonalInfo {
  isInSeason: boolean;
  seasonMonths: number[];
  seasonLabel: string;
  description: string;
}

export interface IngredientData {
  isValid: boolean;
  correctedName: string;
  suggestion?: string;
  storage: StorageInfo;
  shelfLife: ShelfLifeInfo;
  seasonal: SeasonalInfo;
}

export interface SearchApiResponse {
  success: boolean;
  data?: IngredientData;
  query?: string;
  cached?: boolean;
  error?: string;
}
