type OverflowOffender = {
  el: HTMLElement;
  tag: string;
  className: string;
  left: number;
  right: number;
  width: number;
  viewportWidth: number;
  overflowPx: number;
};

declare global {
  interface Window {
    __overflowDebugCleanup?: () => void;
  }
}

function isOverflowDebugEnabled(): boolean {
  try {
    const qs = new URLSearchParams(window.location.search);
    if (qs.get("overflowDebug") === "1") return true;
    return window.localStorage.getItem("overflowDebug") === "1";
  } catch {
    return false;
  }
}

/**
 * DEV-only helper to detect elements whose layout exceeds the viewport.
 * 
 * Enable it with:
 * - ?overflowDebug=1
 * - or localStorage.setItem('overflowDebug','1')
 */
export function runOverflowDebug(): void {
  if (!import.meta.env.DEV) return;
  if (!isOverflowDebugEnabled()) return;

  // cleanup previous outlines
  window.__overflowDebugCleanup?.();

  const prevOutline = new Map<HTMLElement, string>();
  const viewportWidth = window.innerWidth;
  const offenders: OverflowOffender[] = [];

  const nodes = Array.from(document.querySelectorAll<HTMLElement>("body *"));
  for (const el of nodes) {
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) continue;

    const overflowRight = rect.right - viewportWidth;
    const overflowLeft = -rect.left;
    const overflowPx = Math.max(overflowRight, overflowLeft);

    if (overflowPx <= 1) continue;

    const className = (el.getAttribute("class") ?? "").trim();
    prevOutline.set(el, el.style.outline ?? "");
    el.style.outline = "2px solid rgba(255,0,0,.7)";

    // eslint-disable-next-line no-console
    console.log("[overflow-debug]", el.tagName, className ? `.${className.split(/\s+/).join(".")}` : "(no-classes)", {
      right: Math.round(rect.right),
      left: Math.round(rect.left),
      width: Math.round(rect.width),
      innerWidth: viewportWidth,
      overflowPx: Math.round(overflowPx),
    });

    offenders.push({
      el,
      tag: el.tagName.toLowerCase(),
      className,
      left: rect.left,
      right: rect.right,
      width: rect.width,
      viewportWidth,
      overflowPx,
    });
  }

  offenders.sort((a, b) => b.overflowPx - a.overflowPx);
  const top = offenders.slice(0, 10);

  // eslint-disable-next-line no-console
  console.groupCollapsed(`[overflow-debug] Top ${top.length}/${offenders.length} offenders (sorted by px outside viewport)`);
  for (const o of top) {
    // eslint-disable-next-line no-console
    console.log(`${o.tag}${o.className ? `.${o.className.split(/\s+/).join(".")}` : ""}`, {
      overflowPx: Math.round(o.overflowPx),
      left: Math.round(o.left),
      right: Math.round(o.right),
      width: Math.round(o.width),
      innerWidth: o.viewportWidth,
    });
  }
  // eslint-disable-next-line no-console
  console.groupEnd();

  window.__overflowDebugCleanup = () => {
    for (const [el, prev] of prevOutline.entries()) {
      el.style.outline = prev;
    }
    prevOutline.clear();
  };
}
