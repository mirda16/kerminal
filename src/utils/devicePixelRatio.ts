/**
 * Call `callback` whenever window.devicePixelRatio changes, e.g. when the
 * window moves to a monitor with a different scale factor. Such a move does
 * not fire a window "resize" event, so terminals would keep a stale fit.
 *
 * Returns a function that stops watching.
 */
export const onDevicePixelRatioChange = (callback: () => void): (() => void) => {
  let query: MediaQueryList | null = null;

  const listen = (): void => {
    query = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    query.addEventListener("change", handleChange, { once: true });
  };

  // The query only matches the old ratio, so re-arm it for the new one
  const handleChange = (): void => {
    listen();
    callback();
  };

  listen();

  return () => {
    query?.removeEventListener("change", handleChange);
  };
};
