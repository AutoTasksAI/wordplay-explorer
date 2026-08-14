import type { ModuleConfig, ModuleId } from "./game-core";
import { NUMBERS_MODULE } from "./numbers";
import { PATTERNS_MODULE } from "./patterns";
import { WORDS_MODULE } from "./words";

export const MODULE_IDS: ModuleId[] = ["words", "numbers", "patterns"];

export const MODULES: Record<ModuleId, ModuleConfig> = {
  words: WORDS_MODULE,
  numbers: NUMBERS_MODULE,
  patterns: PATTERNS_MODULE,
};

export function isModuleId(value: string | undefined): value is ModuleId {
  return value === "words" || value === "numbers" || value === "patterns";
}
