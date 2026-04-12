import { useEffect } from "react";

const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
const FOCUSABLE_SELECTORS =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function useGlobalArrowNavigation() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!ARROW_KEYS.includes(e.key)) return;

      const isTyping =
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable;

      if (isTyping) return;

      const modalContainer = document.querySelector(".modal-container");
      const root = modalContainer || document;

      const isScrollable = (el) => el.scrollHeight > el.clientHeight;
      const isAtBottom = (el) =>
        Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < 1;
      const isAtTop = (el) => el.scrollTop === 0;

      const elements = Array.from(
        root.querySelectorAll(FOCUSABLE_SELECTORS),
      ).filter((el) => !el.disabled && el.offsetParent !== null);

      if (elements.length === 0) return;

      const currentIndex = elements.indexOf(document.activeElement);
      const currentElement = elements[currentIndex];

      if (isScrollable(e.target)) {
        if (e.key === "ArrowDown" && !isAtBottom(e.target)) return;
        if (e.key === "ArrowUp" && !isAtTop(e.target)) return;
      }

      const findNearestInDirection = (direction) => {
        const currentRect = currentElement?.getBoundingClientRect();
        if (!currentRect) return null;
        const currentCenter = currentRect.left + currentRect.width / 2;

        return elements.reduce((closest, el) => {
          if (el === currentElement) return closest;
          const elRect = el.getBoundingClientRect();
          const elCenter = elRect.left + elRect.width / 2;

          const isAbove = elRect.bottom <= currentRect.top;
          const isBelow = elRect.top >= currentRect.bottom;

          if (direction === "up" && !isAbove) return closest;
          if (direction === "down" && !isBelow) return closest;

          if (!closest) return el;

          const closestRect = closest.getBoundingClientRect();
          const distVertical = Math.abs(
            direction === "up"
              ? currentRect.top - elRect.bottom
              : elRect.top - currentRect.bottom,
          );
          const closestDistVertical = Math.abs(
            direction === "up"
              ? currentRect.top - closestRect.bottom
              : closestRect.top - currentRect.bottom,
          );

          const distHorizontal = Math.abs(currentCenter - elCenter);
          const closestDistHorizontal = Math.abs(
            currentCenter - (closestRect.left + closestRect.width / 2),
          );

          if (
            distVertical < closestDistVertical ||
            (distVertical === closestDistVertical &&
              distHorizontal < closestDistHorizontal)
          ) {
            return el;
          }
          return closest;
        }, null);
      };

      if (e.key === "ArrowRight") {
        e.preventDefault();
        elements[(currentIndex + 1) % elements.length]?.focus();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        elements[
          (currentIndex - 1 + elements.length) % elements.length
        ]?.focus();
      } else if (e.key === "ArrowDown") {
        const next = findNearestInDirection("down");
        e.preventDefault();
        if (next) next.focus();
        else elements[(currentIndex + 1) % elements.length]?.focus();
      } else if (e.key === "ArrowUp") {
        const prev = findNearestInDirection("up");
        e.preventDefault();
        if (prev) prev.focus();
        else
          elements[
            (currentIndex - 1 + elements.length) % elements.length
          ]?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);
}
