/**
 * Core types for the Azkar Reminder Extension
 */

export enum ContentType {
  RANDOM = 'random',
  DUAA_100 = 'duaa-100',
  AZKAR_MORNING_EVENING = 'azkar-morning-evening',
}

export enum SourceType {
  UNKNOWN = 'UNKNOWN',
  QURAN = 'QURAN',
  HADITH = 'HADITH',
  MIXED = 'MIXED',
}

export interface BaseContentItem {
  id: number;
  category: string;
  content: string[];
  type: ContentType;
  source: SourceInfo;
  additionalInfo?: Record<string, any> | null;
}

export interface SourceInfo {
  text?: string;
  type: SourceType;
  quran?: QuranSource[] | null;
  hadith?: HadithSource[][] | null;
}

export interface QuranSource {
  surah: {
    name: string;
  };
  ayah: {
    from: number;
    to: number;
  };
}

export interface HadithSource {
  rawi: string;
  mohdith: string;
  book: string;
  numberOrPage: string;
  grade: string;
  takhrij?: string;
}

export interface DuaaItem {
  id: number;
  category: string;
  duaa: string[];
  source: {
    quran: QuranSource[] | null;
    hadith: HadithSource[][] | null;
  };
}

export interface AzkarItem {
  order: number;
  content: string;
  count: number;
  count_description: string;
  fadl: string;
  source: string;
  type: number;
  audio: string;
  hadith_text: string;
  explanation_of_hadith_vocabulary: string;
}

export interface RandomContentResult {
  item: BaseContentItem;
  content: string;
  contentIndex: number;
  itemIndex: number;
  contextMessage: string | null;
}

export interface UnifiedContentResponse {
  id: string;
  title: string;
  message: string;
  contextMessage: string | null;
  type: string;
  additionalInfo?: Record<string, any> | null;
}

export interface NotificationContent {
  id: string;
  title: string;
  message: string;
  contextMessage?: string | null;
}

export interface ExtensionSettings {
  notificationsEnabled: boolean;
  timerInterval: number;
  contentType: ContentType;
}
