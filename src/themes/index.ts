import type { Theme } from "../types";
import { paper } from "./paper";
import { neoBrutalist } from "./neo-brutalist";
import { swiss } from "./swiss";
import { nordDark } from "./nord-dark";
import { solarized } from "./solarized";
import { magazine } from "./magazine";
import { github } from "./github";
import { terminal } from "./terminal";

export { BASE_CSS } from "./base.css";
export { paper, neoBrutalist, swiss, nordDark, solarized, magazine, github, terminal };

/**
 * Every selectable theme, in picker order. The first entry is the default and
 * doubles as the fallback for unknown ids.
 */
export const THEMES: Theme[] = [
  paper,
  neoBrutalist,
  swiss,
  nordDark,
  solarized,
  magazine,
  github,
  terminal,
];

/** Id of the theme used when the caller has no preference. */
export const DEFAULT_THEME_ID = "paper";

/**
 * Look up a theme by id. Never throws and never returns undefined: unknown,
 * empty or missing ids fall back to the default theme so callers can pass
 * persisted settings straight through.
 */
export function getTheme(id: string | null | undefined): Theme {
  if (typeof id === "string" && id.length > 0) {
    const found = THEMES.find((theme) => theme.id === id);
    if (found) {
      return found;
    }
  }
  const fallback = THEMES.find((theme) => theme.id === DEFAULT_THEME_ID);
  return fallback ?? THEMES[0];
}
