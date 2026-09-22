import React from "react";
import { playGameClickSFX } from "../../engine/useSoundEffects";

/**
 * GameButton — Glossy Chrome & Jelly 2D Vector Game Button
 * Inspired by casual AAA game UIs (Candy Crush, Brawl Stars, Subway Surfers).
 *
 * @param {Object} props
 * @param {'gold'|'purple'|'pink'|'green'|'blue'|'red'|'slate'} [props.variant='gold'] - Jelly color palette
 * Role mapping (frozen): gold = primary CTA · blue = standard action/info ·
 * green = health/go · red = danger/risk · purple = science/lab ·
 * pink = guide/dialog · slate = neutral navigation/secondary
 * @param {'rect'|'square'|'circle'} [props.shape='rect'] - Button shape
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Dimensions preset
 * @param {React.ReactNode} [props.icon] - Optional leading icon
 * @param {React.ReactNode} [props.children] - Button label / content
 * @param {Function} [props.onClick] - Click handler
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean|'normal'|'confirm'|'cancel'} [props.sound='normal'] - Built-in tactile SFX
 * @param {string} [props.className=''] - Extra classes
 * @param {Object} [props.style] - Inline styles
 * @param {string} [props.type='button'] - Button type attribute
 */
export default function GameButton({
  variant = "gold",
  shape = "rect",
  size = "md",
  icon,
  children,
  onClick,
  disabled = false,
  sound = "normal",
  className = "",
  style = {},
  type = "button",
  ...restProps
}) {
  const handleClick = (e) => {
    if (disabled) return;

    if (sound) {
      const soundType = typeof sound === "string" ? sound : "normal";
      playGameClickSFX(soundType);
    }

    if (onClick) {
      onClick(e);
    }
  };

  const shapeClass = `game-btn--${shape}`;
  const variantClass = `game-btn--${variant}`;
  const sizeClass = `game-btn--${size}`;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`game-btn ${shapeClass} ${variantClass} ${sizeClass} ${className}`.trim()}
      style={style}
      {...restProps}
    >
      <div className="game-btn__jelly">
        {/* Curved Glass Dome Specular Reflection */}
        <span className="game-btn__gloss" aria-hidden="true" />

        {/* Bottom Rim Ambient Reflection */}
        <span className="game-btn__rim-shine" aria-hidden="true" />

        {/* Tactile Button Content */}
        <span className="game-btn__content">
          {icon && <span className="game-btn__icon">{icon}</span>}
          {children && <span className="game-btn__label">{children}</span>}
        </span>
      </div>
    </button>
  );
}
