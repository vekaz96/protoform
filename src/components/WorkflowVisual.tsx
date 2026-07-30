/*
 * The workflow panel used to cycle photographs of past projects, which both
 * duplicated the Projects page and made the section feel like a slideshow.
 * These are drawn instead: one vector scene per phase, showing the deliverable
 * itself rather than a product. Pure SVG — no photography, sharp at any size,
 * a few kB, and it animates on phase change instead of cross-fading bitmaps.
 */

const STROKE = "rgba(255,255,255,.34)";
const FAINT = "rgba(255,255,255,.14)";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 400 300" className="wf-svg" role="presentation" focusable="false">
      <defs>
        <pattern id="wfGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke={FAINT} strokeWidth=".5" />
        </pattern>
        <linearGradient id="wfStress" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#2f6bff" />
          <stop offset=".5" stopColor="#28c2a0" />
          <stop offset="1" stopColor="var(--accent)" />
        </linearGradient>
        {/* legend runs top-down, so it needs its own vertical ramp — reusing the
            diagonal one above put MAX at the bottom under a MAX label on top. */}
        <linearGradient id="wfStressV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" />
          <stop offset=".5" stopColor="#28c2a0" />
          <stop offset="1" stopColor="#2f6bff" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#wfGrid)" />
      {/* corner ticks — drawing-sheet furniture */}
      <g stroke={STROKE} strokeWidth="1.2" fill="none">
        <path d="M14 26V14h12M374 14h12v12M386 274v12h-12M26 286H14v-12" />
      </g>
      {children}
    </svg>
  );
}

/** 01 — sketch resolved into dimensioned CAD geometry */
function SceneDesign() {
  return (
    <Frame>
      <g className="wf-draw" stroke="var(--accent)" strokeWidth="2" fill="none" strokeLinejoin="round">
        <path pathLength={1} d="M120 210V120a30 30 0 0 1 30-30h60a30 30 0 0 1 30 30v20h40v70z" />
      </g>
      <g className="wf-draw wf-d1" stroke="var(--accent)" strokeWidth="2" fill="none">
        <circle pathLength={1} cx="180" cy="130" r="22" />
      </g>
      {/* centre lines */}
      <g stroke={STROKE} strokeWidth=".8" strokeDasharray="10 4 2 4" className="wf-fade wf-d2">
        <path d="M180 96v68M146 130h68" />
      </g>
      {/* dimensions */}
      <g className="wf-fade wf-d3" stroke={STROKE} strokeWidth="1" fill="none">
        <path d="M120 236h160M120 230v12M280 230v12" />
        <path d="M300 90v120M294 90h12M294 210h12" />
      </g>
      <g className="wf-fade wf-d3" fill="rgba(255,255,255,.62)" fontSize="12" fontFamily="var(--font-mono, monospace)">
        <text x="200" y="252" textAnchor="middle">160.0</text>
        <text x="316" y="154">120.0</text>
        <text x="210" y="112">⌀44</text>
      </g>
    </Frame>
  );
}

/** 02 — the same part, now shaped by how it gets manufactured */
function SceneDfm() {
  return (
    <Frame>
      <g className="wf-draw" stroke={STROKE} strokeWidth="1.6" fill="none">
        <path pathLength={1} d="M110 220V110h180v110z" />
      </g>
      {/* ribs */}
      <g className="wf-fade wf-d1" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round">
        {[140, 170, 200, 230, 260].map((x) => (
          <path key={x} d={`M${x} 214V132`} />
        ))}
      </g>
      {/* draft angle wedge — kept neutral so orange stays the "we changed this"
          signal rather than competing with the ribs */}
      <g className="wf-fade wf-d2" stroke="rgba(255,255,255,.45)" strokeWidth="1.2" fill="none">
        <path d="M110 220 96 96M110 220V96" strokeDasharray="4 3" />
      </g>
      {/* wall thickness */}
      <g className="wf-fade wf-d3" stroke={STROKE} strokeWidth="1">
        <path d="M300 110h26M300 132h26M320 110v22" />
      </g>
      {/* parting line */}
      <g className="wf-fade wf-d3" stroke="rgba(255,255,255,.5)" strokeWidth="1" strokeDasharray="8 5">
        <path d="M80 132h240" />
      </g>
      <g className="wf-fade wf-d3" fill="rgba(255,255,255,.62)" fontSize="12" fontFamily="var(--font-mono, monospace)">
        <text x="332" y="126">2.5</text>
        <text x="72" y="176">2°</text>
        <text x="82" y="126" fill="rgba(255,255,255,.45)">PL</text>
      </g>
    </Frame>
  );
}

/** 03 — every part, material and weight accounted for */
function SceneBom() {
  const rows = [
    ["01", "Housing", "PA6 GF30", "1"],
    ["02", "Insert", "AISI 304", "2"],
    ["03", "Seal", "TPU 60A", "1"],
    ["04", "Fastener", "M6 × 20", "4"],
  ];
  return (
    <Frame>
      <g className="wf-fade" stroke={STROKE} strokeWidth="1" fill="none">
        <path d="M56 84h288M56 84v140h288V84" />
        <path d="M56 108h288" />
        <path d="M100 84v140M232 84v140M296 84v140" />
      </g>
      <g fill="rgba(255,255,255,.55)" fontSize="10" fontFamily="var(--font-mono, monospace)" className="wf-fade">
        <text x="66" y="101">NO</text>
        <text x="110" y="101">PART</text>
        <text x="242" y="101">MATERIAL</text>
        <text x="306" y="101">QTY</text>
      </g>
      {rows.map((r, i) => (
        <g key={r[0]} className={`wf-row wf-d${i + 1}`}>
          <circle cx="78" cy={129 + i * 27} r="9" fill="none" stroke="var(--accent)" strokeWidth="1.4" />
          <text x="78" y={133 + i * 27} textAnchor="middle" fill="var(--accent)" fontSize="10" fontFamily="var(--font-mono, monospace)">
            {r[0]}
          </text>
          <text x="110" y={133 + i * 27} fill="rgba(255,255,255,.8)" fontSize="12">{r[1]}</text>
          <text x="242" y={133 + i * 27} fill="rgba(255,255,255,.55)" fontSize="11" fontFamily="var(--font-mono, monospace)">{r[2]}</text>
          <text x="312" y={133 + i * 27} fill="rgba(255,255,255,.55)" fontSize="11" fontFamily="var(--font-mono, monospace)">{r[3]}</text>
        </g>
      ))}
    </Frame>
  );
}

/** 04 — loads, stresses and fit proven before anything is cut */
function SceneSim() {
  return (
    <Frame>
      <g className="wf-grow">
        <path d="M120 210V120a30 30 0 0 1 30-30h60a30 30 0 0 1 30 30v20h40v70z" fill="url(#wfStress)" opacity=".85" />
      </g>
      <g className="wf-draw" stroke="rgba(255,255,255,.5)" strokeWidth="1.4" fill="none">
        <path pathLength={1} d="M120 210V120a30 30 0 0 1 30-30h60a30 30 0 0 1 30 30v20h40v70z" />
      </g>
      {/* load arrows */}
      <g className="wf-fade wf-d2" stroke="var(--accent)" strokeWidth="2" fill="none" strokeLinecap="round">
        {[150, 180, 210].map((x) => (
          <path key={x} d={`M${x} 52v26M${x - 5} 71l5 7 5-7`} />
        ))}
      </g>
      {/* fixed constraint hatching */}
      <g className="wf-fade wf-d3" stroke={STROKE} strokeWidth="1">
        <path d="M112 226h176" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M${116 + i * 15} 226l-8 10`} />
        ))}
      </g>
      {/* legend */}
      <g className="wf-fade wf-d3">
        <rect x="330" y="96" width="12" height="110" rx="3" fill="url(#wfStressV)" />
        <text x="348" y="104" fill="rgba(255,255,255,.55)" fontSize="10" fontFamily="var(--font-mono, monospace)">MAX</text>
        <text x="348" y="208" fill="rgba(255,255,255,.55)" fontSize="10" fontFamily="var(--font-mono, monospace)">MIN</text>
      </g>
    </Frame>
  );
}

/** 05 — print-ready model plus the files that go with it */
function SceneProto() {
  const layers = Array.from({ length: 9 });
  return (
    <Frame>
      {/* nozzle */}
      <g className="wf-fade" stroke={STROKE} strokeWidth="1.6" fill="none">
        <path d="M186 40h28v22l-8 12h-12l-8-12z" />
        <path d="M200 74v10" stroke="var(--accent)" strokeWidth="2" />
      </g>
      {/* layer stack */}
      <g className="wf-stack">
        {layers.map((_, i) => {
          const w = 150 - Math.abs(i - 4) * 9;
          return (
            <rect
              key={i}
              className={`wf-layer wf-l${i}`}
              x={200 - w / 2}
              y={196 - i * 13}
              width={w}
              height="10"
              rx="2.5"
              fill={i === layers.length - 1 ? "var(--accent)" : "rgba(255,255,255,.22)"}
              stroke="rgba(255,255,255,.3)"
              strokeWidth=".8"
            />
          );
        })}
      </g>
      {/* build plate */}
      <g className="wf-fade wf-d1" stroke={STROKE} strokeWidth="1.6" fill="none">
        <path d="M104 210h192l16 14H88z" />
      </g>
      {/* file chips */}
      <g className="wf-fade wf-d3" fontSize="11" fontFamily="var(--font-mono, monospace)">
        {["STEP", "STL", "DWG"].map((t, i) => (
          <g key={t}>
            <rect x={112 + i * 62} y="248" width="54" height="22" rx="11" fill="none" stroke="var(--accent)" strokeWidth="1" opacity=".8" />
            <text x={139 + i * 62} y="263" textAnchor="middle" fill="var(--accent)">{t}</text>
          </g>
        ))}
      </g>
    </Frame>
  );
}

const SCENES = [SceneDesign, SceneDfm, SceneBom, SceneSim, SceneProto];

export default function WorkflowVisual() {
  return (
    <>
      {SCENES.map((Scene, i) => (
        <div key={i} className={`wf-scene${i === 0 ? " active" : ""}`} data-phase={i}>
          <Scene />
        </div>
      ))}
    </>
  );
}
