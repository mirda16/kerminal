<template>
  <div
    v-if="visible"
    class="fixed top-1 left-1 z-[100000] bg-black/90 text-green-400 font-mono text-xs p-2 rounded border border-green-600 whitespace-pre select-text"
  >{{ text }}</div>
</template>

<script setup lang="ts">
/**
 * Diagnostics for HiDPI / multi-monitor scaling issues.
 * Toggle with Ctrl+Alt+Shift+D.
 */
import { ref, onMounted, onUnmounted } from "vue";
import { getCurrentWindow } from "@tauri-apps/api/window";

const visible = ref(false);
const text = ref("");
let timer: ReturnType<typeof setInterval> | null = null;

const update = async (): Promise<void> => {
  const win = getCurrentWindow();
  const [inner, outer, scale] = await Promise.all([
    win.innerSize(),
    win.outerSize(),
    win.scaleFactor(),
  ]);
  const root = document.getElementById("app")?.firstElementChild;
  const rootWidth = root?.getBoundingClientRect().width ?? 0;
  const vv = window.visualViewport;
  const dpr = window.devicePixelRatio;

  text.value = [
    `tauri innerSize (phys): ${inner.width} x ${inner.height}`,
    `tauri outerSize (phys): ${outer.width} x ${outer.height}`,
    `tauri scaleFactor:      ${scale}`,
    `-> expected CSS width:  ${(inner.width / scale).toFixed(1)}`,
    `window.innerWidth:      ${window.innerWidth} x ${window.innerHeight}`,
    `devicePixelRatio:       ${dpr}`,
    `innerWidth * dpr:       ${(window.innerWidth * dpr).toFixed(1)}`,
    `html clientWidth:       ${document.documentElement.clientWidth}`,
    `html scrollWidth:       ${document.documentElement.scrollWidth}`,
    `app root width:         ${rootWidth.toFixed(1)}`,
    `visualViewport:         ${vv ? `${vv.width.toFixed(1)} x ${vv.height.toFixed(1)} scale ${vv.scale}` : "n/a"}`,
    `screen:                 ${screen.width} x ${screen.height}`,
  ].join("\n");
};

const onKeydown = (event: KeyboardEvent): void => {
  if (
    event.ctrlKey &&
    event.altKey &&
    event.shiftKey &&
    event.key.toLowerCase() === "d"
  ) {
    event.preventDefault();
    visible.value = !visible.value;
    if (visible.value) {
      update();
      timer = setInterval(update, 500);
    } else if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
};

onMounted(() => window.addEventListener("keydown", onKeydown, true));
onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown, true);
  if (timer) clearInterval(timer);
});
</script>
