export interface UserPreferences {
  favoriteBook: string;
  preferredGenres: string[];
  readingSpeed: 'Slow' | 'Moderate' | 'Fast';
  currentMood: string;
  ageGroup?: string;
}

export interface BookRecommendation {
  title: string;
  author: string;
  summary: string;
  matchReason: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  formatSuggestion: 'Audiobook' | 'Novel' | 'E-Book';
}

export interface OracleResult {
  recommendations: BookRecommendation[];
  motivationalMessage: string;
}

export interface User {
  name: string;
  email: string;
}

export interface LibraryLocation {
  name: string;
  uri: string;
}

export enum AppState {
  LOGIN = 'LOGIN',
  QUESTIONNAIRE = 'QUESTIONNAIRE',
  LOADING = 'LOADING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}