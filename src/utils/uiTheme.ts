export type UiTheme = "dark" | "light" | "system";

const STORAGE_KEY = "ui-theme";
const systemQuery = window.matchMedia("(prefers-color-scheme: light)");
let current: UiTheme = "dark";

const resolve = (theme: UiTheme): "dark" | "light" => {
  if (theme === "system") return systemQuery.matches ? "light" : "dark";
  return theme;
};

const render = (): void => {
  document.documentElement.dataset.uiTheme = resolve(current);
};

systemQuery.addEventListener("change", () => {
  if (current === "system") render();
});

/**
 * Apply the UI theme to the document. Also cached in localStorage so the
 * theme is applied before the settings store loads (no dark flash on start).
 */
export const applyUiTheme = (theme: UiTheme): void => {
  current = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage unavailable, the settings store still keeps the value
  }
  render();
};

export const getCachedUiTheme = (): UiTheme => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
  } catch {
    // Fall through to the default
  }
  return "dark";
};
