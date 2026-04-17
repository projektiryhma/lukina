import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./UniversalModal.css";
import PropTypes from "prop-types";

// Valitsimet kaikille fokusoitaville elementeille
const FOCUSABLE_SELECTORS =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export const Modal = ({
  isOpen,
  onClose,
  title,
  button,
  children,
  size = "small",
}) => {
  const modalBodyRef = useRef(null);
  const modalContainerRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;

      // Fokusoidaan joko ensimmäinen input tai modaalin runko
      const focusTimer = setTimeout(() => {
        const firstInput = modalContainerRef.current?.querySelector(
          "input, button:not(.modal-close-btn)",
        );
        if (firstInput) {
          firstInput.focus();
        } else {
          modalBodyRef.current?.focus();
        }
      }, 50);

      const handleKeyDown = (e) => {
        // Sulkemislogiikka
        if (e.key === "Escape" || e.key === "Enter") {
          if (e.target.tagName === "TEXTAREA") return; // Sallitaan Enter tekstialueissa
          if (e.key === "Enter") e.preventDefault();
          onClose();
        }

        // TAB-LUKKO (Focus Trap)
        if (e.key === "Tab") {
          const focusableElements = Array.from(
            modalContainerRef.current.querySelectorAll(FOCUSABLE_SELECTORS),
          ).filter((el) => !el.disabled && el.offsetParent !== null);

          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            // Shift + Tab (taaksepäin)
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            // Pelkkä Tab (eteenpäin)
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      return () => {
        clearTimeout(focusTimer);
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "unset";

        // Palautetaan fokus sinne missä se oli ennen modaalia
        setTimeout(() => previousFocusRef.current?.focus(), 50);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalSizeClass = size === "large" ? "size-large" : "size-small";

  return ReactDOM.createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`modal-container ${modalSizeClass}`}
        ref={modalContainerRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
        </div>

        <div
          className="modal-body"
          ref={modalBodyRef}
          tabIndex="0"
          style={{
            outline: "none",
            overflowY: "auto",
            maxHeight: "60vh",
          }}
        >
          {children}
        </div>

        <div className="modal-footer">
          <button className="modal-close-btn" onClick={onClose} type="button">
            {button}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  button: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(["small", "large"]),
};

export default Modal;
