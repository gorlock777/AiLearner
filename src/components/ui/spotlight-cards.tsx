/**
 * SpotlightCards — adapted from KokonutUI
 * @author dorianbaffier — https://kokonutui.com
 * @license MIT
 * Adapted for Vite + React (removed "use client", uses framer-motion, always dark)
 */

import type { LucideIcon } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

// ─── Constants ───────────────────────────────────────────────────────────────

const TILT_MAX = 9;
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
        scale: dimmed ? 0.96 : 1,
        opacity: dimmed ? 0.45 : 1,
      }}
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden rounded-xl border p-5",
        "border-white/6 bg-white/3 shadow-none",
        "transition-[border-color] duration-300",
        "hover:border-white/14",
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
          background: `radial-gradient(ellipse at 20% 20%, ${item.color}14, transparent 65%)`,
        }}
      />

      {/* Hover glow layer */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(ellipse at 20% 20%, ${item.color}2e, transparent 65%)`,
        }}
      />

      {/* Shimmer sweep */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[55%] -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.045] to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[280%]"
      />

      {/* Icon badge + optional top badge */}
      <div className="relative z-10 flex items-start justify-between">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{
            background: `${item.color}18`,
            boxShadow: `inset 0 0 0 1px ${item.color}30`,
          }}
        >
          <Icon size={16} strokeWidth={1.9} style={{ color: item.color }} />
        </div>
        {item.badge && (
          <span
            className="text-[10px] font-mono px-1.5 py-0.5 rounded border"
            style={{
              color: item.color,
              borderColor: `${item.color}40`,
              background: `${item.color}10`,
            }}
          >
            {item.badge}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="relative z-10 flex flex-col gap-1.5">
        <h3 className="font-semibold text-[13px] text-white tracking-tight leading-snug" style={{ fontFamily: "'Merriweather', serif" }}>
          {item.title}
        </h3>
        <p className="text-[12px] text-white/40 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Optional footer slot */}
      {item.footer && (
        <div className="relative z-10 mt-auto pt-2 border-t border-white/6">
          {item.footer}
        </div>
      )}

      {/* Accent bottom line */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full transition-all duration-500 group-hover:w-full"
        style={{
          background: `linear-gradient(to right, ${item.color}80, transparent)`,
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
            <h2 className="font-heading text-xl text-white tracking-tight">
              {heading}
            </h2>
          )}
        </div>
      )}

      <div className={cn("grid gap-3", colClass)}>
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

