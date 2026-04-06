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
  if (!isOpen) return null;

  const modalSizeClass = size === "large" ? "size-large" : "size-small";

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-container ${modalSizeClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
        </div>

        <div className="modal-body">{children}</div>

        <button className="modal-close-btn" onClick={onClose}>
          {button}
        </button>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  button: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(["small", "large"]),
};
