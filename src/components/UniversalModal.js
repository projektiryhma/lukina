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
  const closeBtnRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;

      const focusTimer = setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);

      const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
        if (e.key === "Tab") {
          e.preventDefault();
          closeBtnRef.current?.focus();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      return () => {
        clearTimeout(focusTimer);
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "unset";
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
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
        </div>

        <div className="modal-body">{children}</div>

        {/* TÄSSÄ ON MUUTOS: Nappi on nyt kääritty modal-footerin sisään */}
        <div className="modal-footer">
          <button
            ref={closeBtnRef}
            className="modal-close-btn"
            onClick={onClose}
            type="button"
          >
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
