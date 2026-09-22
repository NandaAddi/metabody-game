import React from "react";
import GamePlaque from "./GamePlaque";
import GameButton from "./GameButton";

/**
 * GameModal — Pop-up Dialog Window with Polished Chrome Bevel & Glossy Ribbon Plaque
 *
 * @param {Object} props
 * @param {boolean} [props.isOpen=true] - Whether modal is visible
 * @param {Function} [props.onClose] - Close handler (renders circular top-right close button)
 * @param {React.ReactNode} [props.title] - Modal title displayed in glossy plaque
 * @param {'gold'|'purple'|'pink'|'green'|'blue'|'red'} [props.headerVariant='purple'] - Title plaque color
 * @param {React.ReactNode} [props.headerIcon] - Optional icon inside header plaque
 * @param {'md'|'lg'|'xl'} [props.size='md'] - Dimensions preset
 * @param {React.ReactNode} props.children - Modal inner content
 * @param {React.ReactNode} [props.footer] - Bottom actions (usually GameButton elements)
 * @param {boolean} [props.backdropClose=false] - Whether clicking backdrop closes modal
 * @param {string} [props.className=''] - Custom class for frame
 * @param {Object} [props.cardStyle] - Style override for frame
 */
export default function GameModal({
  isOpen = true,
  onClose,
  title,
  headerVariant = "purple",
  headerIcon,
  size = "md",
  children,
  footer,
  backdropClose = false,
  className = "",
  cardStyle = {},
}) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && backdropClose && onClose) {
      onClose();
    }
  };

  const sizeClass = size === "lg" ? "game-modal-frame--lg" : size === "xl" ? "game-modal-frame--xl" : "";

  return (
    <div className="game-modal-backdrop" onClick={handleBackdropClick}>
      <div
        className={`game-modal-frame ${sizeClass} ${className}`.trim()}
        style={cardStyle}
        role="dialog"
        aria-modal="true"
      >
        {/* Floating Glossy Header Plaque */}
        {title && (
          <div className="game-modal-header-ribbon">
            <GamePlaque variant={headerVariant} icon={headerIcon} size="md">
              {title}
            </GamePlaque>
          </div>
        )}

        {/* Circular Chrome Close Button */}
        {onClose && (
          <div className="game-modal-close-btn">
            <GameButton
              variant="red"
              shape="circle"
              size="sm"
              onClick={onClose}
              sound="cancel"
              title="Tutup"
              aria-label="Tutup Dialog"
            >
              ✕
            </GameButton>
          </div>
        )}

        {/* Deep Slate High-Contrast Content Container */}
        <div className="game-modal-body">
          {children}

          {/* Action Footer */}
          {footer && <div className="game-modal-footer">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
