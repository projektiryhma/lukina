import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./UniversalModal.css";
import PropTypes from "prop-types";

export const Modal = ({
  isOpen,
  onClose,
  title,
  button,
  children,
  size = "small",
}) => {
  const modalBodyRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Tallennetaan aiemmin fokuksessa ollut elementti palautusta varten
      previousFocusRef.current = document.activeElement;

      const focusTimer = setTimeout(() => {
        modalBodyRef.current?.focus();
      }, 50);

      const handleKeyDown = (e) => {
        // Suljetaan modaali, jos painetaan Escape- tai Enter-näppäintä
        if (e.key === "Escape" || e.key === "Enter") {
          if (e.key === "Enter") {
            e.preventDefault(); // Estetään mahdolliset sivuvaikutukset, kuten lomakkeen lähetys
          }
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Estetään taustan skrollaus

      return () => {
        clearTimeout(focusTimer);
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "unset";

        // Palautetaan fokus elementtiin, joka oli valittuna ennen modaalin avaamista
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
        onClick={(e) => e.stopPropagation()} // Estetään sulkeutuminen sisältöä klikatessa
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
