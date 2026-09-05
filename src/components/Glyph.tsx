import { GLYPHS, categoryById } from "@/lib/markers";

export function Glyph({ category, size = 16, className }: { category: string; size?: number; className?: string }) {
  const meta = categoryById.get(category);
  const d = GLYPHS[meta?.glyph ?? "circle"];
  const color = meta?.color ?? "#ddd";
  return (
    <svg width={size} height={size} viewBox="-1.25 -1.25 2.5 2.5" aria-hidden="true" className={className}>
      <path d={d} fill={color} stroke="#000" strokeWidth={0.12} fillRule="evenodd" />
    </svg>
  );
}
