import { useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { getSavedScrollPosition, saveScrollPosition } from "@/lib/scrollRestoration";

const RESTORE_TIMEOUT = 2200;
const RESTORE_SETTLE_TIME = 800;

const ScrollRestoration = () => {
  const { key, pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  const activeKeyRef = useRef(key);
  const activePathRef = useRef(pathname);
  const lastPositionRef = useRef(typeof window === "undefined" ? 0 : window.scrollY);
  const restoringRef = useRef(false);

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    let scrollFrame = 0;
    const rememberCurrentPosition = () => {
      if (restoringRef.current) return;
      window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(() => {
        if (restoringRef.current) return;
        lastPositionRef.current = window.scrollY;
        saveScrollPosition(activeKeyRef.current, lastPositionRef.current);
      });
    };
    const rememberImmediately = () => {
      window.cancelAnimationFrame(scrollFrame);
      lastPositionRef.current = window.scrollY;
      saveScrollPosition(activeKeyRef.current, lastPositionRef.current);
    };

    window.addEventListener("scroll", rememberCurrentPosition, { passive: true });
    window.addEventListener("popstate", rememberImmediately);
    window.addEventListener("pagehide", rememberImmediately);
    document.addEventListener("click", rememberImmediately, true);

    return () => {
      rememberImmediately();
      window.cancelAnimationFrame(scrollFrame);
      window.removeEventListener("scroll", rememberCurrentPosition);
      window.removeEventListener("popstate", rememberImmediately);
      window.removeEventListener("pagehide", rememberImmediately);
      document.removeEventListener("click", rememberImmediately, true);
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    const previousKey = activeKeyRef.current;
    const previousPath = activePathRef.current;
    if (previousKey !== key) saveScrollPosition(previousKey, lastPositionRef.current);

    activeKeyRef.current = key;
    activePathRef.current = pathname;

    let cancelled = false;
    let userInterruptedRestore = false;
    let frame = 0;

    const interruptRestore = () => {
      userInterruptedRestore = true;
      restoringRef.current = false;
      lastPositionRef.current = window.scrollY;
      saveScrollPosition(key, lastPositionRef.current);
    };

    const removeRestoreInterruptListeners = () => {
      window.removeEventListener("wheel", interruptRestore);
      window.removeEventListener("touchstart", interruptRestore);
      window.removeEventListener("keydown", interruptRestore);
      document.removeEventListener("pointerdown", interruptRestore);
    };

    const scrollToHash = () => {
      let attempts = 0;
      const tryHash = () => {
        if (cancelled) return;
        const target = document.getElementById(hash.slice(1));
        if (target) {
          target.scrollIntoView({ block: "start" });
          return;
        }
        if (attempts < 120) {
          attempts += 1;
          frame = window.requestAnimationFrame(tryHash);
        }
      };
      tryHash();
    };

    const restorePosition = (targetPosition: number) => {
      const requiredHeight = targetPosition + window.innerHeight + 2;
      const startedAt = performance.now();
      restoringRef.current = true;
      window.addEventListener("wheel", interruptRestore, { passive: true });
      window.addEventListener("touchstart", interruptRestore, { passive: true });
      window.addEventListener("keydown", interruptRestore);
      document.addEventListener("pointerdown", interruptRestore);

      const finishWhenReady = () => {
        if (cancelled || userInterruptedRestore) return;
        const contentHeight = document.getElementById("root")?.scrollHeight ?? 0;
        const contentIsReady = contentHeight >= requiredHeight - 2;
        const timedOut = performance.now() - startedAt >= RESTORE_TIMEOUT;
        const currentMaxPosition = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

        // Никогда не прокручиваем ниже реального контента: именно искусственная
        // высота раньше показывала белой экран перед прыжком к футеру.
        window.scrollTo({ top: Math.min(targetPosition, currentMaxPosition), left: 0, behavior: "auto" });

        if (contentIsReady || timedOut) {
          const settleStartedAt = performance.now();
          const keepPositionStable = () => {
            if (cancelled || userInterruptedRestore) {
              restoringRef.current = false;
              removeRestoreInterruptListeners();
              return;
            }
            const maxPosition = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            const restoredPosition = Math.min(targetPosition, maxPosition);
            window.scrollTo({ top: restoredPosition, left: 0, behavior: "auto" });
            lastPositionRef.current = restoredPosition;
            if (performance.now() - settleStartedAt < RESTORE_SETTLE_TIME) {
              frame = window.requestAnimationFrame(keepPositionStable);
            } else {
              restoringRef.current = false;
              saveScrollPosition(key, restoredPosition);
              removeRestoreInterruptListeners();
            }
          };
          frame = window.requestAnimationFrame(keepPositionStable);
          return;
        }
        frame = window.requestAnimationFrame(finishWhenReady);
      };

      frame = window.requestAnimationFrame(finishWhenReady);
    };

    if (navigationType === "POP") {
      const savedPosition = getSavedScrollPosition(key);
      if (savedPosition !== undefined) {
        restorePosition(savedPosition);
      } else if (hash) {
        scrollToHash();
      }
    } else if (previousPath !== pathname || hash) {
      if (hash) scrollToHash();
      else window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      lastPositionRef.current = hash ? window.scrollY : 0;
      saveScrollPosition(key, lastPositionRef.current);
    } else {
      lastPositionRef.current = window.scrollY;
      saveScrollPosition(key, lastPositionRef.current);
    }

    return () => {
      cancelled = true;
      restoringRef.current = false;
      window.cancelAnimationFrame(frame);
      removeRestoreInterruptListeners();
    };
  }, [key, pathname, hash, navigationType]);

  return null;
};

export default ScrollRestoration;
