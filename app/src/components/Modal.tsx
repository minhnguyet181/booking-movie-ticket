import { ReactNode, useEffect } from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  contentClassName?: string;
  overlayClassName?: string;
}

const Modal = ({ isOpen, onClose, children, title, contentClassName, overlayClassName }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close only when interacting directly with backdrop and block click-through.
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  };

  return (
    <div
      className={`modal-overlay ${overlayClassName || ''}`.trim()}
      onMouseDown={handleOverlayMouseDown}
      onClick={(e) => {
        // Keep backdrop from forwarding click events to content behind it.
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div
        className={`modal-content ${contentClassName || ''}`.trim()}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
