import React from "react";

/**
 * GamePlaque — Glossy Chrome & Jelly Header Ribbon / Nameplate
 * Used for modal titles, character nameplates, and game stage banners.
 *
 * @param {Object} props
 * @param {'gold'|'purple'|'pink'|'green'|'blue'|'red'} [props.variant='purple'] - Plaque color
 * @param {React.ReactNode} [props.icon] - Optional leading icon
 * @param {React.ReactNode} props.children - Plaque text
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Plaque size
 * @param {string} [props.className=''] - Extra classes
 * @param {Object} [props.style] - Inline styles
 */
export default function GamePlaque({
  variant = "purple",
  icon,
  children,
  size = "md",
  className = "",
  style = {},
  ...restProps
}) {
  const variantClass = `game-plaque--${variant}`;
  const sizeClass = `game-plaque--${size}`;

  return (
    <div
      className={`game-plaque ${variantClass} ${sizeClass} ${className}`.trim()}
      style={style}
      {...restProps}
    >
      <div className="game-plaque__inner">
        {/* Specular Highlight Streak */}
        <span className="game-plaque__gloss" aria-hidden="true" />

        {/* Content */}
        {icon && <span style={{ marginRight: "8px", fontSize: "1.2em", display: "inline-flex", verticalAlign: "middle" }}>{icon}</span>}
        <span style={{ position: "relative", zIndex: 3 }}>{children}</span>
      </div>
    </div>
  );
}
