import { useEffect, useRef } from "react";

type OverflowOffender = {
  el: HTMLElement;
  tag: string;
  className: string;
  scrollWidth: number;
  clientWidth: number;
  delta: number;
};

type UseOverflowDebugOptions = {
  /** Defaults to true in DEV. */
  enabled?: boolean;
  /** If true, outlines offenders in red. Recommended to keep false by default to reduce noise. */
  outline?: boolean;
  /** Max offenders printed in the summary list. */
  maxOffenders?: number;
  /** Optional label to identify where the scan ran. */
  label?: string;
};

function shouldOutline(): boolean {
  // Only enable outlines when explicitly requested.
  // Examples:
  // - add ?overflowDebug=1 in the URL
  // - or run: localStorage.setItem('overflowDebug', '1')
  try {
    const qs = new URLSearchParams(window.location.search);
    if (qs.get("overflowDebug") === "1") return true;
    return window.localStorage.getItem("overflowDebug") === "1";
  } catch {
    return false;
  }
}

/**
 * DEV-only helper to detect horizontal overflow offenders.
 * It scans `body *` and logs any element where scrollWidth > clientWidth.
 */
export function useOverflowDebug(options: UseOverflowDebugOptions = {}) {
  const prevOutlineRef = useRef<Map<HTMLElement, string>>(new Map());

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const enabled = options.enabled ?? true;
    if (!enabled) return;

    const outline = options.outline ?? shouldOutline();
    const maxOffenders = options.maxOffenders ?? 10;
    const label = options.label ?? "landing";

    const run = () => {
      const viewportWidth = document.documentElement.clientWidth;
      const offenders: OverflowOffender[] = [];
      const rectOffenders: Array<{
        el: HTMLElement;
        tag: string;
        className: string;
        right: number;
        left: number;
        width: number;
        overflowPx: number;
      }> = [];
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("body *"));

      for (const el of nodes) {
        const clientWidth = el.clientWidth;
        if (clientWidth <= 0) continue;
        const scrollWidth = el.scrollWidth;
        const delta = scrollWidth - clientWidth;
        const rect = el.getBoundingClientRect();
        const overflowRight = rect.right - viewportWidth;
        const overflowLeft = -rect.left;
        const overflowPx = Math.max(overflowRight, overflowLeft);
        const className = (el.getAttribute("class") ?? "").trim();

        if (delta > 1) {
          offenders.push({
            el,
            tag: el.tagName.toLowerCase(),
            className,
            scrollWidth,
            clientWidth,
            delta,
          });

          // Per-element log (required)
          // eslint-disable-next-line no-console
          console.log(
            `[overflow-debug:${label}]`,
            el.tagName,
            className ? `.${className.split(/\s+/).join(".")}` : "(no-classes)",
            { scrollWidth, clientWidth, delta },
          );

          if (outline) {
            if (!prevOutlineRef.current.has(el)) {
              prevOutlineRef.current.set(el, el.style.outline ?? "");
            }
            el.style.outline = "2px solid rgba(255,0,0,.7)";
          }
        }

        // Layout overflow: element is positioned/sized outside the viewport even if it doesn't overflow internally.
        // This catches cases where clientWidth === scrollWidth but the element itself is wider than the viewport.
        if (overflowPx > 1) {
          rectOffenders.push({
            el,
            tag: el.tagName.toLowerCase(),
            className,
            right: rect.right,
            left: rect.left,
            width: rect.width,
            overflowPx,
          });

          // eslint-disable-next-line no-console
          console.log(
            `[overflow-debug:${label}][rect]`,
            el.tagName,
            className ? `.${className.split(/\s+/).join(".")}` : "(no-classes)",
            { viewportWidth, left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width), overflowPx: Math.round(overflowPx) },
          );

          if (outline) {
            if (!prevOutlineRef.current.has(el)) {
              prevOutlineRef.current.set(el, el.style.outline ?? "");
            }
            el.style.outline = "2px solid rgba(255,0,0,.7)";
          }
        }
      }

      offenders.sort((a, b) => b.delta - a.delta);
      const top = offenders.slice(0, maxOffenders);

      // eslint-disable-next-line no-console
      console.groupCollapsed(
        `[overflow-debug:${label}] Top ${top.length}/${offenders.length} offenders (sorted by scrollWidth-clientWidth)`,
      );
      for (const o of top) {
        // eslint-disable-next-line no-console
        console.log(
          `${o.tag}${o.className ? `.${o.className.split(/\s+/).join(".")}` : ""}`,
          { delta: o.delta, scrollWidth: o.scrollWidth, clientWidth: o.clientWidth },
        );
      }
      // eslint-disable-next-line no-console
      console.groupEnd();

      rectOffenders.sort((a, b) => b.overflowPx - a.overflowPx);
      const topRect = rectOffenders.slice(0, maxOffenders);
      // eslint-disable-next-line no-console
      console.groupCollapsed(
        `[overflow-debug:${label}] Top ${topRect.length}/${rectOffenders.length} layout offenders (sorted by px outside viewport)`,
      );
      for (const o of topRect) {
        // eslint-disable-next-line no-console
        console.log(
          `${o.tag}${o.className ? `.${o.className.split(/\s+/).join(".")}` : ""}`,
          { overflowPx: Math.round(o.overflowPx), left: Math.round(o.left), right: Math.round(o.right), width: Math.round(o.width), viewportWidth },
        );
      }
      // eslint-disable-next-line no-console
      console.groupEnd();
    };

    // Wait a tick for layout to settle
    const raf = window.requestAnimationFrame(() => {
      setTimeout(run, 0);
    });

    return () => {
      window.cancelAnimationFrame(raf);
      // Cleanup outlines on unmount
      for (const [el, prev] of prevOutlineRef.current.entries()) {
        el.style.outline = prev;
      }
      prevOutlineRef.current.clear();
    };
  }, [options.enabled, options.label, options.maxOffenders, options.outline]);
}
