import { useEffect } from "react";

export function useGlobalArrowNavigation() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (!arrowKeys.includes(e.key)) return;

      const isTyping =
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable;

      if (isTyping) return;
      if (document.querySelector(".modal-overlay")) return;

      const focusableSelectors =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

      const elements = Array.from(
        document.querySelectorAll(focusableSelectors),
      ).filter((el) => !el.disabled && el.offsetParent !== null);

      if (elements.length === 0) return;

      if (document.activeElement === document.body || !document.activeElement) {
        e.preventDefault();
        elements[0].focus();
        return;
      }

      const currentIndex = elements.indexOf(document.activeElement);
      const currentElement = elements[currentIndex];

      if (!currentElement) return;

      const findNearestInDirection = (direction) => {
        const currentRect = currentElement.getBoundingClientRect();
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
          const closestCenter = closestRect.left + closestRect.width / 2;

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
          const closestDistHorizontal = Math.abs(currentCenter - closestCenter);

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
        e.preventDefault();
        const next = findNearestInDirection("down");
        next
          ? next.focus()
          : elements[(currentIndex + 1) % elements.length]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = findNearestInDirection("up");
        prev
          ? prev.focus()
          : elements[
              (currentIndex - 1 + elements.length) % elements.length
            ]?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
