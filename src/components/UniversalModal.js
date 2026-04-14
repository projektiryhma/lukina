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
      previousFocusRef.current = document.activeElement;

      const focusTimer = setTimeout(() => {
        modalBodyRef.current?.focus();
      }, 50);

      const handleKeyDown = (e) => {
        if (e.key === "Escape" || e.key === "Enter") {
          if (e.key === "Enter") {
            e.preventDefault();
          }
          onClose();
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
