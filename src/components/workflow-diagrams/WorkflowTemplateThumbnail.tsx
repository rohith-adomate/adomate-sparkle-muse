/**
 * Workflow template thumbnails.
 *
 * Each thumbnail visualizes "INPUT SOURCE → AD VARIATIONS".
 * The right-side ad variation stack is identical across all 4 — only the
 * left-side input changes (competitor ads, manual upload, reviews, Reddit).
 *
 * Pure SVG, no images. Palette uses brand coral/peach + neutral text tones,
 * scoped here to keep the design crisp and consistent.
 */

type Variant = "competitor" | "manual" | "reviews" | "reddit";

// ── Palette (Adomate brand: pink primary + cool neutrals, no coral) ──
const C = {
  cream: "#FAFAFA",
  border: "rgba(15, 23, 42, 0.10)",
  borderStrong: "rgba(15, 23, 42, 0.18)",
  textDark: "#0F172A",
  textMuted: "#94A3B8",
  coral: "#DB2777",        // primary pink
  coralSoft: "#FCE7F3",    // pink-100
  coralTint: "#FDF2F8",    // pink-50
  peach: "#F9A8D4",        // pink-300
  amber: "#64748B",        // slate-500 (replaces amber/star color)
  redditOrange: "#DB2777", // unify under brand pink
  white: "#FFFFFF",
};

// ── Layout constants ──
const VB_W = 320;
const VB_H = 180;

function AdVariationStack({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const gap = 6;
  const cardH = (h - gap * 2) / 3;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {[0, 1, 2].map((i) => {
        const cy = i * (cardH + gap);
        const imgPad = 4;
        const imgSize = cardH - imgPad * 2;
        const textX = imgSize + imgPad * 2 + 2;
        const textW = w - textX - 4;

        return (
          <g key={i} transform={`translate(0, ${cy})`}>
            <rect x={0} y={0} width={w} height={cardH} rx={4} fill={C.white} stroke={C.border} strokeWidth={0.5} />
            <rect x={imgPad} y={imgPad} width={imgSize} height={imgSize} rx={2.5} fill={C.coralTint} />
            {i === 0 && (<circle cx={imgPad + imgSize / 2} cy={imgPad + imgSize / 2} r={imgSize / 3.5} fill={C.coral} />)}
            {i === 1 && (<rect x={imgPad + imgSize * 0.22} y={imgPad + imgSize * 0.28} width={imgSize * 0.56} height={imgSize * 0.44} rx={2} fill={C.peach} />)}
            {i === 2 && (
              <polygon points={`${imgPad + imgSize / 2},${imgPad + imgSize * 0.22} ${imgPad + imgSize * 0.82},${imgPad + imgSize * 0.78} ${imgPad + imgSize * 0.18},${imgPad + imgSize * 0.78}`} fill={C.amber} />
            )}
            <rect x={textX} y={imgPad + 1} width={textW * 0.75} height={2.6} rx={1} fill={C.textDark} />
            <rect x={textX} y={imgPad + 6.5} width={textW * 0.95} height={1.8} rx={0.9} fill={C.textMuted} />
            <rect x={textX} y={imgPad + 10.5} width={textW * 0.6} height={1.8} rx={0.9} fill={C.textMuted} />
            <rect x={w - 22} y={cardH - 8} width={18} height={5} rx={2.5} fill={C.coral} />
          </g>
        );
      })}
    </g>
  );
}

function CurvedArrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const cx1 = x1 + (x2 - x1) * 0.45;
  const cy1 = y1 - 18;
  const cx2 = x1 + (x2 - x1) * 0.55;
  const cy2 = y2 + 14;

  return (
    <g fill="none" stroke={C.textDark} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`} />
      <path d={`M ${x2 - 5} ${y2 - 4} L ${x2} ${y2} L ${x2 - 5} ${y2 + 4}`} />
    </g>
  );
}

function CompetitorInput({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const cardW = w * 0.78;
  const cardH = h * 0.82;
  const cx = x + (w - cardW) / 2;
  const cy = y + (h - cardH) / 2;

  const renderCard = (offsetX: number, offsetY: number, rot: number, opacity = 1) => (
    <g transform={`translate(${cx + offsetX}, ${cy + offsetY}) rotate(${rot}, ${cardW / 2}, ${cardH / 2})`} opacity={opacity}>
      <rect width={cardW} height={cardH} rx={5} fill={C.white} stroke={C.border} strokeWidth={0.5} />
    </g>
  );

  return (
    <g>
      {renderCard(-6, 4, -6, 0.85)}
      {renderCard(4, -2, 4, 0.95)}
      <g transform={`translate(${cx}, ${cy})`}>
        <rect width={cardW} height={cardH} rx={5} fill={C.white} stroke={C.borderStrong} strokeWidth={0.6} />
        <circle cx={8} cy={8} r={4} fill={C.coral} />
        <rect x={14} y={5} width={28} height={2.2} rx={1} fill={C.textDark} />
        <rect x={14} y={9} width={18} height={1.6} rx={0.8} fill={C.textMuted} />
        <rect x={cardW - 26} y={5} width={22} height={6} rx={3} fill={C.coralTint} />
        <rect x={cardW - 23} y={7.2} width={16} height={1.6} rx={0.8} fill={C.coral} />
        <rect x={5} y={16} width={cardW - 10} height={cardH * 0.48} rx={3} fill={C.peach} />
        <circle cx={cardW * 0.35} cy={16 + cardH * 0.24} r={cardH * 0.13} fill={C.coral} opacity={0.85} />
        <rect x={cardW * 0.5} y={16 + cardH * 0.16} width={cardW * 0.32} height={cardH * 0.18} rx={2} fill={C.coralSoft} />
        <rect x={5} y={cardH - 22} width={cardW * 0.72} height={2.4} rx={1} fill={C.textDark} />
        <rect x={5} y={cardH - 17} width={cardW * 0.5} height={1.8} rx={0.9} fill={C.textMuted} />
        <rect x={5} y={cardH - 11} width={cardW * 0.3} height={6.5} rx={3.2} fill={C.coral} />
      </g>
    </g>
  );
}

function ManualInput({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const pad = 6;
  const zx = x + pad;
  const zy = y + pad;
  const zw = w - pad * 2;
  const zh = h - pad * 2;
  const small = zh * 0.42;
  const big = zh * 0.5;

  return (
    <g>
      <rect x={zx} y={zy} width={zw} height={zh} rx={6} fill={C.white} stroke={C.coral} strokeWidth={1.2} strokeDasharray="6 4" />
      <g transform={`translate(${zx + zw * 0.18}, ${zy + zh * 0.22}) rotate(-9)`}>
        <rect width={small} height={small} rx={2} fill={C.white} stroke={C.border} strokeWidth={0.5} />
        <rect x={1.5} y={1.5} width={small - 3} height={small - 3} rx={1.5} fill={C.coralTint} />
        <circle cx={small * 0.72} cy={small * 0.32} r={small * 0.12} fill={C.amber} />
        <path d={`M ${1.5} ${small * 0.7} Q ${small * 0.35} ${small * 0.5}, ${small * 0.6} ${small * 0.68} T ${small - 1.5} ${small * 0.72} L ${small - 1.5} ${small - 1.5} L ${1.5} ${small - 1.5} Z`} fill={C.peach} />
      </g>
      <g transform={`translate(${zx + zw * 0.58}, ${zy + zh * 0.2}) rotate(10)`}>
        <rect width={small} height={small} rx={2} fill={C.white} stroke={C.border} strokeWidth={0.5} />
        <rect x={1.5} y={1.5} width={small - 3} height={small - 3} rx={1.5} fill={C.coralSoft} />
        <circle cx={small / 2} cy={small * 0.42} r={small * 0.16} fill={C.coral} />
        <path d={`M ${small * 0.18} ${small - 2} Q ${small / 2} ${small * 0.6}, ${small * 0.82} ${small - 2} Z`} fill={C.coral} />
      </g>
      <g transform={`translate(${zx + (zw - big) / 2}, ${zy + zh * 0.32})`}>
        <rect width={big} height={big} rx={2.5} fill={C.white} stroke={C.borderStrong} strokeWidth={0.6} />
        <rect x={2} y={2} width={big - 4} height={big - 4} rx={1.8} fill={C.cream} />
        <rect x={big * 0.22} y={big * 0.36} width={big * 0.28} height={big * 0.42} rx={3} fill={C.coral} />
        <circle cx={big * 0.7} cy={big * 0.55} r={big * 0.16} fill={C.peach} />
      </g>
      <g transform={`translate(${zx + zw / 2}, ${zy + zh - 12})`}>
        <path d={`M -3 1 L 0 -2 L 3 1 M 0 -2 L 0 4`} stroke={C.coral} strokeWidth={1.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x={-14} y={6} width={28} height={1.6} rx={0.8} fill={C.coral} />
        <rect x={-10} y={9.5} width={20} height={1.4} rx={0.7} fill={C.coral} opacity={0.7} />
      </g>
    </g>
  );
}

function ReviewsInput({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const cardW = w * 0.78;
  const cardH = h * 0.62;
  const cx = x + (w - cardW) / 2;
  const cy = y + (h - cardH) / 2;

  const Star = ({ cx: sx, cy: sy, r }: { cx: number; cy: number; r: number }) => {
    const pts: string[] = [];
    for (let i = 0; i < 10; i++) {
      const ang = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 === 0 ? r : r * 0.45;
      pts.push(`${sx + Math.cos(ang) * rr},${sy + Math.sin(ang) * rr}`);
    }
    return <polygon points={pts.join(" ")} fill={C.amber} />;
  };

  const renderReview = (offX: number, offY: number, rot: number, highlight = false, elevated = false) => (
    <g transform={`translate(${cx + offX}, ${cy + offY}) rotate(${rot}, ${cardW / 2}, ${cardH / 2})`}>
      <rect width={cardW} height={cardH} rx={5} fill={C.white} stroke={elevated ? C.borderStrong : C.border} strokeWidth={elevated ? 0.6 : 0.5} />
      <circle cx={8} cy={8} r={3.5} fill={C.peach} />
      <rect x={14} y={6} width={36} height={2} rx={1} fill={C.textDark} />
      {[0, 1, 2, 3, 4].map((i) => (<Star key={i} cx={14 + i * 6} cy={13.5} r={2.4} />))}
      {!highlight && (
        <>
          <rect x={6} y={20} width={cardW - 12} height={1.6} rx={0.8} fill={C.textMuted} />
          <rect x={6} y={24} width={cardW - 16} height={1.6} rx={0.8} fill={C.textMuted} />
          <rect x={6} y={28} width={cardW * 0.6} height={1.6} rx={0.8} fill={C.textMuted} />
        </>
      )}
      {highlight && (
        <>
          <rect x={6} y={20} width={cardW - 12} height={1.6} rx={0.8} fill={C.textMuted} />
          <rect x={6} y={23} width={cardW * 0.62} height={4} rx={1.5} fill={C.coralSoft} />
          <rect x={8} y={24.2} width={cardW * 0.55} height={1.6} rx={0.8} fill={C.coral} />
          <rect x={6} y={29} width={cardW * 0.5} height={1.6} rx={0.8} fill={C.textMuted} />
        </>
      )}
    </g>
  );

  return (
    <g>
      {renderReview(-4, 8, -5, false)}
      {renderReview(2, -4, -2, true, true)}
      {renderReview(6, 12, 2, false)}
    </g>
  );
}

function RedditInput({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const pad = 6;
  const cw = w - pad * 2;
  const ch = h - pad * 2;

  return (
    <g transform={`translate(${x + pad}, ${y + pad})`}>
      <rect width={cw} height={ch} rx={5} fill={C.white} stroke={C.borderStrong} strokeWidth={0.6} />
      <g transform={`translate(6, 6)`}>
        <circle cx={5} cy={5} r={5} fill={C.redditOrange} />
        <text x={5} y={7.6} textAnchor="middle" fontSize={6} fontFamily="DM Sans, system-ui, sans-serif" fontWeight={700} fill={C.white}>r/</text>
        <rect x={14} y={3} width={42} height={1.8} rx={0.9} fill={C.textDark} />
        <rect x={14} y={6.6} width={28} height={1.4} rx={0.7} fill={C.textMuted} />
      </g>
      <rect x={6} y={20} width={cw - 12} height={1.8} rx={0.9} fill={C.textDark} />
      <rect x={6} y={23.5} width={cw * 0.7} height={1.8} rx={0.9} fill={C.textDark} />
      <g transform={`translate(6, 28.5)`}>
        <polygon points={`0,4 3,0 6,4`} fill={C.redditOrange} />
        <rect x={9} y={1.4} width={10} height={1.4} rx={0.7} fill={C.textMuted} />
        <rect x={23} y={1.4} width={14} height={1.4} rx={0.7} fill={C.textMuted} />
      </g>
      <line x1={6} y1={36} x2={cw - 6} y2={36} stroke={C.border} strokeWidth={0.5} />
      <g transform={`translate(6, 40)`}>
        <circle cx={2.5} cy={2.5} r={2.5} fill={C.peach} />
        <rect x={7} y={1.4} width={cw * 0.55} height={1.4} rx={0.7} fill={C.textMuted} />
        <rect x={7} y={4.2} width={cw * 0.4} height={1.4} rx={0.7} fill={C.textMuted} />
      </g>
      <g transform={`translate(14, 50)`}>
        <line x1={-3} y1={0} x2={-3} y2={9} stroke={C.border} strokeWidth={0.5} />
        <rect x={0} y={0} width={cw - 22} height={9.5} rx={2} fill={C.coralSoft} />
        <circle cx={3.5} cy={3.5} r={2} fill={C.coral} />
        <rect x={8} y={2.2} width={cw * 0.5} height={1.4} rx={0.7} fill={C.coral} />
        <rect x={8} y={5.4} width={cw * 0.42} height={1.4} rx={0.7} fill={C.coral} opacity={0.75} />
      </g>
      <g transform={`translate(6, 64)`}>
        <circle cx={2.5} cy={2.5} r={2.5} fill={C.amber} opacity={0.7} />
        <rect x={7} y={1.4} width={cw * 0.5} height={1.4} rx={0.7} fill={C.textMuted} />
        <rect x={7} y={4.2} width={cw * 0.35} height={1.4} rx={0.7} fill={C.textMuted} />
      </g>
    </g>
  );
}

export function WorkflowTemplateThumbnail({ variant }: { variant: Variant }) {
  const padX = 12;
  const padY = 10;
  const innerW = VB_W - padX * 2;
  const innerH = VB_H - padY * 2;
  const leftW = innerW * 0.46;
  const rightW = innerW * 0.4;
  const leftX = padX;
  const rightX = padX + innerW - rightW;
  const arrowFromX = leftX + leftW + 4;
  const arrowToX = rightX - 6;
  const midY = padY + innerH / 2;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block", background: C.cream }}
      role="img"
      aria-label={`${variant} workflow thumbnail`}
    >
      {variant === "competitor" && <CompetitorInput x={leftX} y={padY} w={leftW} h={innerH} />}
      {variant === "manual" && <ManualInput x={leftX} y={padY} w={leftW} h={innerH} />}
      {variant === "reviews" && <ReviewsInput x={leftX} y={padY} w={leftW} h={innerH} />}
      {variant === "reddit" && <RedditInput x={leftX} y={padY} w={leftW} h={innerH} />}
      <CurvedArrow x1={arrowFromX} y1={midY} x2={arrowToX} y2={midY} />
      <AdVariationStack x={rightX} y={padY + 6} w={rightW} h={innerH - 12} />
    </svg>
  );
}

export type WorkflowTemplateVariant = Variant;
