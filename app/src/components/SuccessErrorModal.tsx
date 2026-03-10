import './SuccessErrorModal.css';

interface SuccessErrorModalProps {
  isOpen: boolean;
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

const SuccessErrorModal = ({ isOpen, type, message, onClose }: SuccessErrorModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="success-error-overlay" onClick={onClose}>
      <div className="success-error-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`success-error-banner ${type}`}>
          <span className="banner-text">
            {type === 'success' ? 'SUCCESSFUL!' : 'ERROR'}
          </span>
          <button className="banner-close" onClick={onClose}>×</button>
        </div>
        <div className="success-error-content">
          <p className="success-error-message">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessErrorModal;
