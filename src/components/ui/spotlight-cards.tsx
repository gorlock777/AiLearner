/**
 * SpotlightCards — adapted from KokonutUI (Lunar Space Titanium Edition)
 * @license MIT
 */

import type { LucideIcon } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

// ─── Constants ───────────────────────────────────────────────────────────────

const TILT_MAX = 7;
const TILT_SPRING = { stiffness: 300, damping: 28 } as const;
const GLOW_SPRING = { stiffness: 180, damping: 22 } as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SpotlightItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  badge?: string;
  onClick?: () => void;
  footer?: React.ReactNode;
}

// ─── Card ────────────────────────────────────────────────────────────────────

interface CardProps {
  item: SpotlightItem;
  dimmed: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

function SpotlightCard({ item, dimmed, onHoverStart, onHoverEnd }: CardProps) {
  const Icon = item.icon;
  const cardRef = useRef<HTMLDivElement>(null);

  const normX = useMotionValue(0.5);
  const normY = useMotionValue(0.5);

  const rawRotateX = useTransform(normY, [0, 1], [TILT_MAX, -TILT_MAX]);
  const rawRotateY = useTransform(normX, [0, 1], [-TILT_MAX, TILT_MAX]);

  const rotateX = useSpring(rawRotateX, TILT_SPRING);
  const rotateY = useSpring(rawRotateY, TILT_SPRING);
  const glowOpacity = useSpring(0, GLOW_SPRING);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    normX.set((e.clientX - rect.left) / rect.width);
    normY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseEnter = () => {
    glowOpacity.set(1);
    onHoverStart();
  };

  const handleMouseLeave = () => {
    normX.set(0.5);
    normY.set(0.5);
    glowOpacity.set(0);
    onHoverEnd();
  };

  const handleClick = () => {
    item.onClick?.();
  };

  return (
    <motion.div
      animate={{
        scale: dimmed ? 0.97 : 1,
        opacity: dimmed ? 0.55 : 1,
      }}
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden rounded-xl border p-5",
        "border-white/[0.1] bg-[#12141e]/50 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.3)]",
        "transition-[border-color,box-shadow,background-color] duration-300",
        "hover:border-white/25 hover:bg-[#161926]/70 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
        item.onClick && "cursor-pointer"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
      }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {/* Static accent tint */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          background: `radial-gradient(ellipse at 20% 20%, ${item.color}10, transparent 65%)`,
        }}
      />

      {/* Hover glow layer */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(ellipse at 20% 20%, ${item.color}24, transparent 65%)`,
        }}
      />

      {/* Icon badge + optional top badge */}
      <div className="relative z-10 flex items-start justify-between">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-white/10"
        >
          <Icon size={16} strokeWidth={1.9} style={{ color: item.color }} />
        </div>
        {item.badge && (
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 bg-zinc-900/80 text-zinc-300 font-medium"
          >
            {item.badge}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="relative z-10 flex flex-col gap-1.5">
        <h3 className="font-semibold text-[14px] text-white tracking-tight leading-snug font-heading">
          {item.title}
        </h3>
        <p className="text-[12px] text-zinc-400 leading-relaxed font-sans">
          {item.description}
        </p>
      </div>

      {/* Optional footer slot */}
      {item.footer && (
        <div className="relative z-10 mt-auto pt-2 border-t border-white/[0.08]">
          {item.footer}
        </div>
      )}

      {/* Accent bottom line */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full transition-all duration-500 group-hover:w-full"
        style={{
          background: `linear-gradient(to right, ${item.color}, transparent)`,
        }}
      />
    </motion.div>
  );
}

SpotlightCard.displayName = "SpotlightCard";

// ─── Main export ─────────────────────────────────────────────────────────────

export interface SpotlightCardsProps {
  items: SpotlightItem[];
  eyebrow?: string;
  heading?: string;
  className?: string;
  columns?: 2 | 3 | 4;
}

export function SpotlightCards({
  items,
  eyebrow,
  heading,
  className,
  columns = 3,
}: SpotlightCardsProps) {
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);

  const colClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className={cn("relative w-full", className)}>
      {(eyebrow || heading) && (
        <div className="mb-6 flex flex-col gap-1">
          {eyebrow && (
            <p className="font-semibold text-[10px] text-zinc-400 uppercase tracking-[0.22em] font-mono">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2 className="font-heading text-2xl text-white tracking-tight">
              {heading}
            </h2>
          )}
        </div>
      )}

      <div className={cn("grid gap-4", colClass)}>
        {items.map((item) => (
          <SpotlightCard
            dimmed={hoveredTitle !== null && hoveredTitle !== item.title}
            item={item}
            key={item.title}
            onHoverEnd={() => setHoveredTitle(null)}
            onHoverStart={() => setHoveredTitle(item.title)}
          />
        ))}
      </div>
    </div>
  );
}

export default SpotlightCards;
