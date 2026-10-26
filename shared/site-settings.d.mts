export type GameId = 'crossplatform' | 'tower' | 'shark';
export type ModuleId = 'html' | 'css' | 'js';
export interface SiteSettings {
  siteName: string; description: string; announcement: string; maintenance: boolean;
  games: Record<GameId, boolean>; modules: Record<ModuleId, boolean>;
}
export const GAME_IDS: GameId[];
export const MODULE_IDS: ModuleId[];
export function defaultSettings(): SiteSettings;
export function validateSettings(value: unknown): SiteSettings;
export const RETIRED_GAME_IDS: string[];
export function migrateSettings(value: unknown): unknown;
