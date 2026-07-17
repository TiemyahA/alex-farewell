import { useState, useEffect, useCallback, useRef, useId } from "react";
import { supabase } from "./supabase.js";

// ---------- Design tokens ----------
const T = {
  ink: "#0E2240",
  bg: "#F2F6FA",
  court: "#2A63C9",
  courtDark: "#1E4A99",
  line: "#FFFFFF",
  ball: "#E7F03C",
  muted: "#5B6B82",
  card: "#FFFFFF",
  warn: "#8A5A00",
  warnBg: "#FFF2CC",
};

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;600;700&display=swap');";
const DISPLAY = "'Archivo Black', 'Arial Black', system-ui, sans-serif";
const BODY = "'Archivo', system-ui, -apple-system, sans-serif";

// ---------- Themes ----------
const THEMES = {
  sport:   { label: "Racket sports",  bgColor: "#F2F7C2", tagline: "First serve of his next chapter." },
  gaming:  { label: "Ex-gamer",       bgColor: "#E4DAFF", tagline: "Respawning somewhere new." },
  scale:   { label: "Building Scale", bgColor: "#CFE3FF", tagline: "Up and to the right. Always." },
  ai:      { label: "AI builder",     bgColor: "#FFE3BE", tagline: "Already prompting his next move." },
  crystal: { label: "Future-teller",  bgColor: "#D3F0E8", tagline: "He saw this coming." },
};
const THEME_KEYS = Object.keys(THEMES);

// ---------- Avatar palette ----------
const SKIN = "#F0BE94";
const SKIN_SH = "#D9A272";
const HAIR = "#96723F";
const HAIR_HI = "#B4925E";
const TEE = "#182333";
const TEE_HI = "#26354D";
const FACE_INK = "#33220F";

function AlexHead({ accessory }) {
  return (
    <g>
      <rect x="-7" y="13" width="14" height="15" rx="6" fill={SKIN_SH} />
      <circle cx="-19" cy="2" r="4.2" fill={SKIN} />
      <circle cx="19" cy="2" r="4.2" fill={SKIN} />
      <ellipse cx="0" cy="0" rx="19" ry="21" fill={SKIN} />
      <ellipse cx="-10" cy="8.5" rx="3.6" ry="2" fill="#E6926A" opacity="0.45" />
      <ellipse cx="10" cy="8.5" rx="3.6" ry="2" fill="#E6926A" opacity="0.45" />
      <path d="M-17 5 Q-15 21 0 22.5 Q15 21 17 5 Q14 17.5 0 18.5 Q-14 17.5 -17 5 Z" fill={HAIR} opacity="0.5" />
      <path d="M-18.5 -1 Q-20 -20 0 -22.5 Q20.5 -21 18.5 -1 Q17.5 -12 8 -14.5 Q11 -10 4 -11 Q-6 -17.5 -13 -8 Q-17 -4.5 -18.5 -1 Z" fill={HAIR} />
      <path d="M-11 -14.5 Q0 -20 10 -13.5 Q0 -16.5 -11 -14.5 Z" fill={HAIR_HI} />
      <path d="M-13.5 -4.5 q5 -3.6 10.5 -1.1 l-1 2.7 q-4.6 -2 -8.4 0.6 Z" fill={FACE_INK} />
      <path d="M3 -5.6 q5.4 -2.5 10.4 1.1 l-1.3 2.5 q-4.2 -2.8 -8.2 -1 Z" fill={FACE_INK} />
      <path d="M-12.5 1.5 q4.2 -4.8 8.4 0 l-1.7 1.5 q-2.6 -2.9 -5 0 Z" fill={FACE_INK} />
      <path d="M4.1 1.5 q4.2 -4.8 8.4 0 l-1.7 1.5 q-2.6 -2.9 -5 0 Z" fill={FACE_INK} />
      <path d="M-1.3 2.5 q3 2.8 -0.2 5.4 q3.8 -0.3 3.3 -2.7 q-0.3 -1.7 -3.1 -2.7 Z" fill={SKIN_SH} />
      <path d="M-12 8 Q0 21.5 12 8 Q0 13 -12 8 Z" fill="#6E2F26" />
      <path d="M-9.4 8.7 Q0 13 9.4 8.7 Q0 15.6 -9.4 8.7 Z" fill="#FFFFFF" />
      {accessory === "sweatband" && (
        <path d="M-18.5 -7 Q0 -14 18.5 -7 L18.5 -1.5 Q0 -8.5 -18.5 -1.5 Z" fill={T.ball} stroke="#B9C41F" strokeWidth="0.8" />
      )}
      {accessory === "headset" && (
        <g>
          <path d="M-19 0 Q-21 -27 0 -27 Q21 -27 19 0" stroke="#43348A" strokeWidth="6.5" fill="none" strokeLinecap="round" />
          <rect x="-25" y="-5" width="9.5" height="16" rx="4.7" fill="#5A46B0" />
          <rect x="15.5" y="-5" width="9.5" height="16" rx="4.7" fill="#5A46B0" />
          <rect x="-23.5" y="-2.5" width="6.5" height="11" rx="3.2" fill="#6F5BD0" />
          <path d="M-20 10 q4 9.5 13 10.5" stroke="#5A46B0" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="-6.5" cy="21" r="2.8" fill="#5A46B0" />
        </g>
      )}
    </g>
  );
}

function AlexHeadAt({ x, y, accessory }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <AlexHead accessory={accessory} />
    </g>
  );
}

function Arm({ from, to, sleeveTo }) {
  return (
    <g>
      <path d={`M${from[0]} ${from[1]} L${to[0]} ${to[1]}`} stroke={SKIN} strokeWidth="11" strokeLinecap="round" fill="none" />
      {sleeveTo && (
        <path d={`M${from[0]} ${from[1]} L${sleeveTo[0]} ${sleeveTo[1]}`} stroke={TEE} strokeWidth="14" strokeLinecap="round" fill="none" />
      )}
    </g>
  );
}

// ---------- Memoji: Alex mid-activity ----------
// useId gives every instance its own SVG def ids, so repeated avatars
// never fight over duplicate clipPath/gradient ids in the document.
function Memoji({ variant = "crystal", size = 40 }) {
  const th = THEMES[variant] || THEMES.crystal;
  const rid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const cid = "clip" + rid;
  const glowId = "glow" + rid;
  const orbId = "orb" + rid;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <clipPath id={cid}>
          <circle cx="50" cy="50" r="48" />
        </clipPath>
        <radialGradient id={glowId} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#FFF6DF" />
          <stop offset="100%" stopColor="#FFC873" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={orbId} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#EAFBFF" />
          <stop offset="55%" stopColor="#9FD9EE" />
          <stop offset="100%" stopColor="#5FAECF" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={th.bgColor} />
      <g clipPath={`url(#${cid})`}>
        {variant === "sport" && (
          <g>
            <path d="M0 88 L100 78 L100 100 L0 100 Z" fill="#8FBF6A" opacity="0.55" />
            <path d="M0 88 L100 78" stroke="#FFFFFF" strokeWidth="2" opacity="0.8" />
            <path d="M60 16 q10 -4 20 0" stroke="#C7D22F" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.7" />
            <path d="M58 22 q9 -3.4 18 0" stroke="#C7D22F" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.45" />
            <circle cx="84" cy="17" r="7" fill="#DCE83B" />
            <path d="M78.5 13.5 q5.5 3.5 11 0 M78.5 20.5 q5.5 -3.5 11 0" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
            <g transform="rotate(-24 20 22)">
              <ellipse cx="20" cy="16" rx="11" ry="14" fill="#F1E9D5" stroke="#B7452B" strokeWidth="4.4" />
              <path d="M13 9 h14 M13 16 h14 M13 23 h14 M16 4.5 v23 M24 4.5 v23" stroke="#C9BFA6" strokeWidth="1" />
              <rect x="17.4" y="29" width="5.2" height="13" rx="2.6" fill="#7A4A2C" />
            </g>
            <Arm from={[38, 80]} to={[24, 40]} sleeveTo={[34, 68]} />
            <circle cx="23" cy="38" r="6" fill={SKIN} />
            <path d="M18 104 Q26 72 56 70 Q84 72 90 104 Z" fill={TEE} />
            <path d="M52 72 Q66 74 72 86 Q60 78 50 78 Z" fill={TEE_HI} />
            <Arm from={[76, 82]} to={[82, 94]} sleeveTo={[78, 88]} />
            <AlexHeadAt x={58} y={40} accessory="sweatband" />
          </g>
        )}
        {variant === "gaming" && (
          <g>
            <ellipse cx="50" cy="104" rx="46" ry="26" fill="#8F7BE8" opacity="0.28" />
            <rect x="14" y="24" width="6" height="6" rx="1.2" fill="#7BE0C3" transform="rotate(12 17 27)" />
            <rect x="80" y="34" width="5" height="5" rx="1" fill="#FF7A6B" transform="rotate(-14 82 36)" />
            <rect x="22" y="52" width="4" height="4" rx="1" fill="#E7F03C" transform="rotate(20 24 54)" />
            <path d="M16 104 Q24 70 50 68 Q76 70 84 104 Z" fill={TEE} />
            <path d="M46 70 Q60 71 68 82 Q56 75 46 76 Z" fill={TEE_HI} />
            <Arm from={[30, 82]} to={[42, 92]} sleeveTo={[34, 86]} />
            <Arm from={[70, 82]} to={[58, 92]} sleeveTo={[66, 86]} />
            <g transform="translate(50 92)">
              <path d="M-18 -4 Q-18 -12 -9 -12 L9 -12 Q18 -12 18 -4 Q19.5 7 12.5 7 Q8 7 5.6 1.5 L-5.6 1.5 Q-8 7 -12.5 7 Q-19.5 7 -18 -4 Z" fill="#43348A" />
              <path d="M-18 -4 Q-18 -12 -9 -12 L9 -12 Q13 -12 15 -10 Q0 -9 -14 -6 Z" fill="#5A46B0" />
              <circle cx="-10" cy="-4.5" r="3" fill="#2A2350" />
              <circle cx="-10" cy="-4.5" r="1.8" fill="#E7F03C" />
              <circle cx="9" cy="-7" r="2" fill="#FF7A6B" />
              <circle cx="13" cy="-3.5" r="2" fill="#7BE0C3" />
              <circle cx="6" cy="-2.5" r="2" fill="#F2B01E" />
            </g>
            <circle cx="42" cy="90" r="5.4" fill={SKIN} />
            <circle cx="58" cy="90" r="5.4" fill={SKIN} />
            <AlexHeadAt x={50} y={36} accessory="headset" />
          </g>
        )}
        {variant === "scale" && (
          <g>
            <g transform="translate(74 26)">
              <rect x="-2" y="4" width="6" height="12" rx="1.6" fill={T.court} />
              <rect x="6" y="-2" width="6" height="18" rx="1.6" fill={T.court} />
              <rect x="14" y="-9" width="6" height="25" rx="1.6" fill={T.court} />
              <path d="M-4 2 L18 -16 M18 -16 h-7 M18 -16 v7" stroke={T.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <path d="M20 96 Q28 68 52 66 Q78 68 86 96 Z" fill={TEE} />
            <path d="M48 68 Q62 70 70 82 Q58 74 48 74 Z" fill={TEE_HI} />
            <Arm from={[70, 76]} to={[84, 48]} sleeveTo={[76, 66]} />
            <circle cx="85" cy="46" r="5.6" fill={SKIN} />
            <rect x="84" y="36" width="4.6" height="10" rx="2.3" fill={SKIN} transform="rotate(14 86 41)" />
            <AlexHeadAt x={50} y={36} />
            <rect x="0" y="86" width="100" height="18" fill="#2E4160" />
            <rect x="0" y="86" width="100" height="3.5" fill="#48607F" />
            <g>
              <path d="M10 86 L13 62 L36 62 L38 86 Z" fill="#22314A" />
              <path d="M13.8 65 L34.6 65 L36.2 83 L12.2 83 Z" fill="#EAF2FF" />
              <path d="M17 79 l4.5 -4.5 3.5 2.5 6 -7" stroke={T.court} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M27.5 70 h3.6 v3.6" stroke={T.court} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="7" y="86" width="34" height="3.8" rx="1.9" fill="#31435F" />
            </g>
            <g transform="translate(62 82)">
              <rect x="-4" y="-6" width="9" height="10" rx="1.6" fill="#FFFFFF" />
              <path d="M5 -4 q4 1 0 5" stroke="#FFFFFF" strokeWidth="2" fill="none" />
              <path d="M-1 -9 q1.4 -2 0 -3.6" stroke="#B9C4D6" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </g>
          </g>
        )}
        {variant === "ai" && (
          <g>
            <path d="M8 30 h12 l6 6 M12 66 h10 l5 -5" stroke="#E0A45C" strokeWidth="1.6" fill="none" opacity="0.5" strokeLinecap="round" />
            <circle cx="8" cy="30" r="2" fill="#E0A45C" opacity="0.6" />
            <circle cx="12" cy="66" r="2" fill="#E0A45C" opacity="0.6" />
            <path d="M14 104 Q22 72 48 70 Q76 72 84 104 Z" fill={TEE} />
            <path d="M44 72 Q58 73 66 84 Q54 77 44 78 Z" fill={TEE_HI} />
            <Arm from={[62, 82]} to={[76, 66]} sleeveTo={[68, 76]} />
            <ellipse cx="78" cy="64" rx="7" ry="5" fill={SKIN} />
            <circle cx="78" cy="46" r="17" fill={`url(#${glowId})`} />
            <g transform="translate(78 46)">
              <path d="M-4 -11 v-4 M0 -11 v-4 M4 -11 v-4 M-4 11 v4 M0 11 v4 M4 11 v4 M-11 -4 h-4 M-11 0 h-4 M-11 4 h-4 M11 -4 h4 M11 0 h4 M11 4 h4" stroke="#C96A1E" strokeWidth="2" strokeLinecap="round" />
              <rect x="-9" y="-9" width="18" height="18" rx="3.6" fill="#C96A1E" />
              <rect x="-5" y="-5" width="10" height="10" rx="2" fill="#FFE3BE" />
              <circle cx="0" cy="0" r="2.2" fill="#C96A1E" />
            </g>
            <path d="M22 20 l2 4.8 4.8 2 -4.8 2 -2 4.8 -2 -4.8 -4.8 -2 4.8 -2 Z" fill="#E89A3C" />
            <path d="M62 16 l1.3 3.1 3.1 1.3 -3.1 1.3 -1.3 3.1 -1.3 -3.1 -3.1 -1.3 3.1 -1.3 Z" fill="#E89A3C" />
            <AlexHeadAt x={46} y={38} />
          </g>
        )}
        {variant === "crystal" && (
          <g>
            <path d="M18 22 l1.8 4.3 4.3 1.8 -4.3 1.8 -1.8 4.3 -1.8 -4.3 -4.3 -1.8 4.3 -1.8 Z" fill="#3AA08A" />
            <path d="M80 24 l1.3 3.1 3.1 1.3 -3.1 1.3 -1.3 3.1 -1.3 -3.1 -3.1 -1.3 3.1 -1.3 Z" fill="#3AA08A" />
            <path d="M86 58 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1 Z" fill="#3AA08A" />
            <path d="M16 104 Q24 72 50 70 Q76 72 84 104 Z" fill={TEE} />
            <path d="M46 72 Q60 73 68 84 Q56 77 46 78 Z" fill={TEE_HI} />
            <Arm from={[30, 84]} to={[38, 94]} sleeveTo={[33, 88]} />
            <Arm from={[70, 84]} to={[62, 94]} sleeveTo={[67, 88]} />
            <circle cx="50" cy="90" r="22" fill="#D3F0E8" opacity="0.9" />
            <circle cx="50" cy="90" r="16" fill={`url(#${orbId})`} />
            <path d="M42 83 q5 -5 12 -3" stroke="#FFFFFF" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.9" />
            <path d="M47 90 l1.6 3.8 3.8 1.6 -3.8 1.6 -1.6 3.8 -1.6 -3.8 -3.8 -1.6 3.8 -1.6 Z" fill="#3E8FB0" opacity="0.85" />
            <ellipse cx="37" cy="93" rx="6" ry="5" fill={SKIN} />
            <ellipse cx="63" cy="93" rx="6" ry="5" fill={SKIN} />
            <AlexHeadAt x={50} y={36} />
          </g>
        )}
      </g>
      <circle cx="50" cy="50" r="48" fill="none" stroke={T.ink} strokeWidth="2.5" />
    </svg>
  );
}

// ---------- Data layer (Supabase) ----------
const SEED_TILES = [
  { id: "padel_startup", text: "Founds a padel startup", theme: "sport" },
  { id: "ai_company", text: "Launches an AI company before Christmas", theme: "ai" },
  { id: "trend_caller", text: "Calls the next big tech trend months before everyone else", theme: "crystal" },
  { id: "scale_2", text: "Builds Scale 2.0 somewhere new", theme: "scale" },
  { id: "growth_pm", text: "Becomes a growth PM influencer", theme: "scale" },
  { id: "gaming_return", text: "Comes out of gaming retirement for one last ranked season", theme: "gaming" },
  { id: "workaholic", text: "Becomes a workaholic", theme: "scale" },
  { id: "squash_match", text: "Wins a \u201cfriendly\u201d squash match a little too seriously", theme: "sport" },
  { id: "ai_teammate", text: "Builds an AI teammate for his favourite game", theme: "gaming" },
  { id: "ai_weekend", text: "Ships an AI side project in one weekend", theme: "ai" },
  { id: "unpredicted", text: "Something none of us saw coming", theme: "crystal" },
  { id: "advisor", text: "Starts advising three startups at once", theme: "scale" },
  { id: "top_one_pct", text: "Ranks top 1% in a game he picked up last week", theme: "gaming" },
  { id: "beach_plan", text: "Turns a beach holiday into a business plan", theme: "scale" },
  { id: "hires_oyster", text: "Hires half of Oyster into his new venture", theme: "scale" },
  { id: "meta_predict", text: "Predicts this board's winning tile, obviously", theme: "crystal" },
].map((t) => ({ ...t, author: "the team" }));

const tileTheme = (tile) => {
  const th = (tile && tile.theme) || "crystal";
  return THEMES[th] ? th : "crystal";
};

const uid = (p) =>
  p + "_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7);

const rowToTile = (r) => ({ id: r.id, text: r.content, theme: r.theme, author: r.author });

// Postgres unique-violation code (duplicate tile text / double vote)
const DUPLICATE = "23505";

// Mix two hex colors: t = 0 → a, t = 1 → b.
function mixHex(a, b, t) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return (
    "#" +
    pa
      .map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, "0"))
      .join("")
  );
}

// Heatmap: cold (white) → hot (warm orange) as a tile gathers votes.
const HEAT_HOT = "#FFB03B";
const heatColor = (count, max) =>
  max === 0 ? T.card : mixHex(T.card, HEAT_HOT, count / max);

// Clipboard with legacy fallback; returns true when the text made it across.
async function copyText(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}


// ---------- App ----------
export default function AlexNextMove() {
  const [name, setName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [tab, setTab] = useState("board");
  const [tiles, setTiles] = useState([]);
  const [votes, setVotes] = useState({});
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [canSave, setCanSave] = useState(null); // null = checking
  const [busyTile, setBusyTile] = useState(null);
  const [savingTile, setSavingTile] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [status, setStatus] = useState("");
  const flashTimer = useRef(null);
  const loadingRef = useRef(false);

  const [newTile, setNewTile] = useState("");
  const [newTheme, setNewTheme] = useState("crystal");
  const [showTileForm, setShowTileForm] = useState(false);
  const [noteText, setNoteText] = useState("");

  // results modal
  const [resultsText, setResultsText] = useState(null);
  const [resultsCopied, setResultsCopied] = useState(false);

  // home-page spotlight
  const [spot, setSpot] = useState(0);
  const [spotPaused, setSpotPaused] = useState(false);

  useEffect(() => {
    if (name || spotPaused) return;
    const iv = setInterval(() => setSpot((s) => (s + 1) % THEME_KEYS.length), 2400);
    return () => clearInterval(iv);
  }, [name, spotPaused]);

  const flash = useCallback((msg) => {
    setStatus(msg);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setStatus(""), 3000);
  }, []);

  useEffect(() => () => flashTimer.current && clearTimeout(flashTimer.current), []);

  const loadAll = useCallback(async () => {
    if (loadingRef.current) return; // a refresh is already in flight
    loadingRef.current = true;
    try {
      setLoadError(false);
      if (!supabase) {
        // Env vars missing — render seeds read-only with a setup banner.
        setCanSave(false);
        setTiles(SEED_TILES);
        setVotes({});
        setNotes([]);
        return;
      }
      setCanSave(true);

      let { data: tileRows, error: tileErr } = await supabase
        .from("tiles")
        .select("id, content, theme, author")
        .order("created_at", { ascending: true });
      if (tileErr) throw tileErr;

      if (!tileRows || tileRows.length === 0) {
        // First ever visit: seed the board. ignoreDuplicates makes this safe
        // even if several first visitors race — the fixed ids collide harmlessly.
        await supabase.from("tiles").upsert(
          SEED_TILES.map((t) => ({ id: t.id, content: t.text, theme: t.theme, author: t.author })),
          { onConflict: "id", ignoreDuplicates: true }
        );
        const reread = await supabase
          .from("tiles")
          .select("id, content, theme, author")
          .order("created_at", { ascending: true });
        if (reread.error) throw reread.error;
        tileRows = reread.data || [];
      }
      setTiles(tileRows.map(rowToTile));

      const { data: voteRows, error: voteErr } = await supabase
        .from("votes")
        .select("tile_id, voter");
      if (voteErr) throw voteErr;
      const v = {};
      for (const row of voteRows || []) {
        (v[row.tile_id] = v[row.tile_id] || []).push(row.voter);
      }
      setVotes(v);

      const { data: noteRows, error: noteErr } = await supabase
        .from("notes")
        .select("id, name, content, created_at")
        .order("created_at", { ascending: false });
      if (noteErr) throw noteErr;
      setNotes(
        (noteRows || []).map((n) => ({ id: n.id, name: n.name, text: n.content }))
      );
    } catch {
      setLoadError(true);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
    const iv = setInterval(loadAll, 20000);
    return () => clearInterval(iv);
  }, [loadAll]);

  const requireSave = () => {
    if (canSave === false) {
      flash("The database isn't connected yet — add the Supabase env variables and redeploy.");
      return false;
    }
    return true;
  };

  // ---------- Actions ----------
  const toggleVote = async (tileId) => {
    if (busyTile || !requireSave()) return;
    setBusyTile(tileId);
    try {
      const mine = (votes[tileId] || []).includes(name);
      if (mine) {
        const { error } = await supabase
          .from("votes")
          .delete()
          .match({ tile_id: tileId, voter: name });
        if (error) throw error;
        setVotes((v) => ({ ...v, [tileId]: (v[tileId] || []).filter((n) => n !== name) }));
      } else {
        const { error } = await supabase
          .from("votes")
          .insert({ tile_id: tileId, voter: name });
        // Duplicate = we already voted (e.g. from another tab) — treat as success.
        if (error && error.code !== DUPLICATE) throw error;
        setVotes((v) => ({
          ...v,
          [tileId]: (v[tileId] || []).includes(name) ? v[tileId] : [...(v[tileId] || []), name],
        }));
      }
    } catch {
      flash("That vote didn't save — check your connection and try again.");
    } finally {
      setBusyTile(null);
    }
  };

  const addTile = async () => {
    const text = newTile.trim();
    if (!text || savingTile || !requireSave()) return;
    setSavingTile(true);
    try {
      // The DB's unique index on tile content makes duplicates and
      // simultaneous adds atomic — no read-modify-write races.
      const tile = { id: uid("t"), text, author: name, theme: newTheme };
      const { error } = await supabase
        .from("tiles")
        .insert({ id: tile.id, content: tile.text, theme: tile.theme, author: tile.author });
      if (error) {
        if (error.code === DUPLICATE) {
          flash("That prediction is already on the board — vote for it instead!");
        } else {
          flash("Couldn't add the tile — check your connection and try again.");
        }
        return;
      }
      setTiles((t) => [...t, tile]);
      setVotes((v) => ({ ...v, [tile.id]: [] }));
      setNewTile("");
      setShowTileForm(false);
      flash("Prediction added to the board.");
    } finally {
      setSavingTile(false);
    }
  };

  const addNote = async () => {
    const text = noteText.trim();
    if (!text || savingNote || !requireSave()) return;
    setSavingNote(true);
    try {
      const { data, error } = await supabase
        .from("notes")
        .insert({ name, content: text })
        .select("id")
        .single();
      if (error) throw error;
      setNotes((n) => [{ id: (data && data.id) || uid("n"), name, text }, ...n]);
      setNoteText("");
      flash("Note added. Alex will love it.");
    } catch {
      flash("Couldn't save the note — check your connection and try again.");
    } finally {
      setSavingNote(false);
    }
  };

  const buildResults = () => {
    const ranked = [...tiles].sort(
      (a, b) => (votes[b.id]?.length || 0) - (votes[a.id]?.length || 0)
    );
    return [
      "ALEX: THE NEXT MOVE — final board",
      "",
      "Predictions (by votes):",
      ...ranked.map((t) => {
        const n = votes[t.id]?.length || 0;
        return `  ${n} vote${n === 1 ? "" : "s"} — ${t.text} [${THEMES[tileTheme(t)].label}] (added by ${t.author})`;
      }),
      "",
      "Notes to Alex:",
      ...(notes.length
        ? notes.map((n) => `  \u201c${n.text}\u201d — ${n.name}`)
        : ["  (none yet)"]),
    ].join("\n");
  };

  const openResults = async () => {
    const text = buildResults();
    const copied = await copyText(text);
    setResultsCopied(copied);
    setResultsText(text);
  };

  // ---------- Home / name gate ----------
  if (!name) {
    const spotKey = THEME_KEYS[spot];
    const spotTheme = THEMES[spotKey];
    return (
      <div style={styles.page}>
        <style>{FONT_IMPORT + KEYFRAMES}</style>
        <div style={{ ...styles.shell, maxWidth: 560, marginTop: 32, textAlign: "center" }}>
          <div style={{ ...styles.eyebrow, animation: "fadeUp .5s ease both" }}>
            Farewell prediction board
          </div>
          <h1 style={{ ...styles.h1, animation: "fadeUp .5s .05s ease both" }}>
            ALEX: THE NEXT MOVE
          </h1>

          <div
            style={{
              margin: "26px auto 8px",
              width: 150,
              height: 150,
              animation: "bob 3.2s ease-in-out infinite",
            }}
          >
            <div key={spotKey} style={{ animation: "popIn .35s ease both" }}>
              <Memoji variant={spotKey} size={150} />
            </div>
          </div>
          <div key={spotKey + "-t"} style={{ minHeight: 52, animation: "fadeUp .35s ease both" }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 18, letterSpacing: "0.02em" }}>
              {spotTheme.label.toUpperCase()}
            </div>
            <div style={{ color: T.muted, fontSize: 14, marginTop: 2 }}>{spotTheme.tagline}</div>
          </div>

          <div
            style={{ display: "flex", gap: 10, justifyContent: "center", margin: "14px 0 26px", flexWrap: "wrap" }}
            onMouseLeave={() => setSpotPaused(false)}
          >
            {THEME_KEYS.map((k, i) => (
              <button
                key={k}
                title={THEMES[k].label}
                aria-label={THEMES[k].label}
                onMouseEnter={() => { setSpotPaused(true); setSpot(i); }}
                onClick={() => { setSpotPaused(true); setSpot(i); }}
                style={{
                  padding: 2,
                  borderRadius: "50%",
                  border: spot === i ? `3px solid ${T.ink}` : "3px solid transparent",
                  background: "transparent",
                  cursor: "pointer",
                  lineHeight: 0,
                  transform: spot === i ? "scale(1.12)" : "scale(1)",
                  transition: "transform .2s ease, border-color .2s ease",
                }}
              >
                <Memoji variant={k} size={46} />
              </button>
            ))}
          </div>

          <p style={{ color: T.muted, lineHeight: 1.5, margin: "0 0 22px", animation: "fadeUp .5s .1s ease both" }}>
            Alex always knew what would happen next. One last time — it's our serve.
            Vote on what he does next, add your own prediction, and leave him a note.
          </p>

          <div style={{ textAlign: "left", animation: "fadeUp .5s .15s ease both" }}>
            <label style={styles.label} htmlFor="playerName">Sign in with your name</label>
            <input
              id="playerName"
              style={styles.input}
              value={nameInput}
              placeholder="e.g. Maria G."
              maxLength={40}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && nameInput.trim() && setName(nameInput.trim())}
            />
            <button
              style={{
                ...styles.primaryBtn,
                opacity: nameInput.trim() ? 1 : 0.5,
                marginTop: 14,
                width: "100%",
              }}
              disabled={!nameInput.trim()}
              onClick={() => setName(nameInput.trim())}
            >
              Step onto the court
            </button>
            <p style={{ fontSize: 12, color: T.muted, marginTop: 16, textAlign: "center" }}>
              Your votes and notes are visible to everyone with this link (that's the point).
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalVotes = Object.values(votes).reduce((s, v) => s + (v ? v.length : 0), 0);
  const maxVotes = tiles.reduce((m, t) => Math.max(m, votes[t.id]?.length || 0), 0);
  const rankedTiles = [...tiles].sort(
    (a, b) => (votes[b.id]?.length || 0) - (votes[a.id]?.length || 0)
  );

  return (
    <div style={styles.page}>
      <style>{FONT_IMPORT + KEYFRAMES}</style>
      <div style={styles.shell}>
        <div style={styles.header}>
          <div>
            <div style={styles.eyebrow}>Farewell prediction board</div>
            <h1 style={styles.h1}>ALEX: THE NEXT MOVE</h1>
            <div style={{ display: "flex", gap: 4, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
              {THEME_KEYS.map((k) => (
                <span key={k} title={THEMES[k].label} style={{ display: "inline-flex" }}>
                  <Memoji variant={k} size={34} />
                </span>
              ))}
              <span style={{ fontSize: 12, color: T.muted, marginLeft: 6 }}>
                the many futures of Alex
              </span>
            </div>
          </div>
          <div style={styles.scoreboard}>
            <Score label="Predictions" value={tiles.length} />
            <Score label="Votes" value={totalVotes} />
            <Score label="Notes" value={notes.length} />
          </div>
        </div>

        {canSave === false && (
          <div style={styles.warnBanner}>
            Not connected to the database yet. Add
            <strong> VITE_SUPABASE_URL</strong> and
            <strong> VITE_SUPABASE_ANON_KEY</strong> as environment variables
            (in Vercel: Project → Settings → Environment Variables), then
            redeploy.
          </div>
        )}
        {loadError && (
          <div style={styles.warnBanner}>
            Couldn't load the board.{" "}
            <button style={{ ...styles.ghostBtn, padding: "4px 10px", fontSize: 12 }} onClick={loadAll}>
              Try again
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, margin: "20px 0 16px" }}>
          <TabBtn active={tab === "board"} onClick={() => setTab("board")}>
            The board
          </TabBtn>
          <TabBtn active={tab === "notes"} onClick={() => setTab("notes")}>
            Notes to Alex {notes.length > 0 ? `(${notes.length})` : ""}
          </TabBtn>
          <div style={{ flex: 1 }} />
          <button style={styles.ghostBtn} onClick={loadAll}>
            Refresh
          </button>
        </div>

        {status && <div style={styles.toast} role="status">{status}</div>}

        {loading ? (
          <div style={{ color: T.muted, padding: 40, textAlign: "center" }}>
            Warming up the court…
          </div>
        ) : tab === "board" ? (
          <>
            <p style={{ color: T.muted, fontSize: 14, margin: "0 0 12px" }}>
              Tap a tile to back it. Tap again to take your vote back. Playing
              as <strong style={{ color: T.ink }}>{name}</strong>.
            </p>

            <div style={styles.court}>
              <div style={styles.grid}>
                {rankedTiles.map((tile) => {
                  const v = votes[tile.id] || [];
                  const mine = v.includes(name);
                  const th = tileTheme(tile);
                  return (
                    <button
                      key={tile.id}
                      onClick={() => toggleVote(tile.id)}
                      disabled={busyTile === tile.id}
                      aria-pressed={mine}
                      title={v.length ? "Backed by: " + v.join(", ") : "No votes yet"}
                      style={{
                        ...styles.tile,
                        background: heatColor(v.length, maxVotes),
                        border: `2px solid ${mine ? T.ink : T.line}`,
                        opacity: busyTile === tile.id ? 0.7 : 1,
                        transform: busyTile === tile.id ? "scale(0.97)" : "none",
                      }}
                    >
                      <span style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <span style={{ flexShrink: 0, marginTop: 1 }}>
                          <Memoji variant={th} size={40} />
                        </span>
                        <span style={styles.tileText}>{tile.text}</span>
                      </span>
                      <span style={styles.tileMeta}>
                        <span
                          style={{
                            ...styles.ballChip,
                            background: mine ? T.ink : T.ball,
                            color: mine ? T.ball : T.ink,
                          }}
                        >
                          {v.length}
                        </span>
                        <span style={{ fontSize: 11, color: T.muted }}>
                          by {tile.author || "?"}
                        </span>
                      </span>
                    </button>
                  );
                })}

                {showTileForm ? (
                  <div style={{ ...styles.tile, cursor: "default", background: T.card }}>
                    <textarea
                      style={styles.tileInput}
                      value={newTile}
                      autoFocus
                      placeholder="Your prediction…"
                      onChange={(e) => setNewTile(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") { setShowTileForm(false); setNewTile(""); }
                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addTile(); }
                      }}
                    />
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {THEME_KEYS.map((k) => (
                        <button
                          key={k}
                          title={THEMES[k].label}
                          aria-label={THEMES[k].label}
                          onClick={() => setNewTheme(k)}
                          style={{
                            padding: 1,
                            borderRadius: "50%",
                            border: newTheme === k ? `2.5px solid ${T.ink}` : "2.5px solid transparent",
                            background: "transparent",
                            cursor: "pointer",
                            lineHeight: 0,
                          }}
                        >
                          <Memoji variant={k} size={28} />
                        </button>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        style={{ ...styles.primaryBtn, padding: "6px 10px", fontSize: 12, opacity: savingTile ? 0.6 : 1 }}
                        disabled={savingTile}
                        onClick={addTile}
                      >
                        {savingTile ? "Adding…" : "Add"}
                      </button>
                      <button
                        style={{ ...styles.ghostBtn, padding: "6px 10px", fontSize: 12 }}
                        onClick={() => { setShowTileForm(false); setNewTile(""); }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    style={{ ...styles.tile, ...styles.addTile }}
                    onClick={() => setShowTileForm(true)}
                  >
                    <span style={{ fontFamily: DISPLAY, fontSize: 26, lineHeight: 1 }}>+</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Call your own shot</span>
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={styles.noteForm}>
              <label style={styles.label} htmlFor="noteText">
                Leave Alex a note — signed {"\u201C" + name + "\u201D"}
              </label>
              <textarea
                id="noteText"
                style={{ ...styles.input, minHeight: 80, resize: "vertical", fontFamily: BODY }}
                value={noteText}
                placeholder="Gracias for everything, Alex…"
                onChange={(e) => setNoteText(e.target.value)}
              />
              <button
                style={{ ...styles.primaryBtn, marginTop: 10, opacity: noteText.trim() && !savingNote ? 1 : 0.5 }}
                disabled={!noteText.trim() || savingNote}
                onClick={addNote}
              >
                {savingNote ? "Posting…" : "Sign and post"}
              </button>
            </div>

            {notes.length === 0 ? (
              <p style={{ color: T.muted, textAlign: "center", padding: 24 }}>
                No notes yet — take the first serve.
              </p>
            ) : (
              <div style={styles.notesGrid}>
                {notes.map((n) => (
                  <div key={n.id} style={styles.noteCard}>
                    <p style={{ margin: 0, lineHeight: 1.55, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{n.text}</p>
                    <div style={styles.noteSig}>— {n.name}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div style={styles.footer}>
          <span style={{ color: T.muted, fontSize: 12 }}>
            Everything here is shared with the whole team. Auto-syncs every 20s.
          </span>
          <button style={styles.ghostBtn} onClick={openResults}>
            Copy final results
          </button>
        </div>

        {resultsText !== null && (
          <div style={styles.modalOverlay} onClick={() => setResultsText(null)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={{ fontFamily: DISPLAY, fontSize: 16, marginBottom: 6 }}>
                FINAL RESULTS
              </div>
              <p style={{ fontSize: 13, color: resultsCopied ? "#1E7A4F" : T.warn, margin: "0 0 10px", fontWeight: 600 }}>
                {resultsCopied
                  ? "Copied to your clipboard — and here's the text in case you need it:"
                  : "Clipboard was blocked by the browser — select and copy the text below:"}
              </p>
              <textarea
                readOnly
                value={resultsText}
                onFocus={(e) => e.target.select()}
                style={{ ...styles.input, minHeight: 220, fontSize: 12.5, fontFamily: "ui-monospace, monospace", resize: "vertical" }}
              />
              <button
                style={{ ...styles.primaryBtn, marginTop: 12, width: "100%" }}
                onClick={() => setResultsText(null)}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Score({ label, value }) {
  return (
    <div style={{ textAlign: "center", minWidth: 76 }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 26, color: T.ball, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#BFD2F2", marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: BODY,
        fontWeight: 700,
        fontSize: 14,
        padding: "8px 16px",
        borderRadius: 999,
        border: `2px solid ${T.ink}`,
        background: active ? T.ink : "transparent",
        color: active ? T.ball : T.ink,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

const KEYFRAMES = `
@keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes popIn { from { opacity: 0; transform: scale(.8); } to { opacity: 1; transform: scale(1); } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
`;

const styles = {
  page: {
    minHeight: "100vh",
    background: T.bg,
    fontFamily: BODY,
    color: T.ink,
    padding: "24px 16px 48px",
    boxSizing: "border-box",
  },
  shell: { maxWidth: 980, margin: "0 auto" },
  eyebrow: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: T.court,
    marginBottom: 6,
  },
  h1: {
    fontFamily: DISPLAY,
    fontSize: "clamp(28px, 5vw, 44px)",
    lineHeight: 1.02,
    margin: 0,
    letterSpacing: "-0.01em",
  },
  header: {
    display: "flex",
    flexWrap: "wrap",
    gap: 20,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  scoreboard: {
    display: "flex",
    gap: 4,
    background: T.ink,
    borderRadius: 12,
    padding: "12px 14px",
  },
  warnBanner: {
    background: T.warnBg,
    color: T.warn,
    border: "2px solid #E5C868",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 600,
    marginTop: 16,
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  court: {
    background: T.court,
    border: `3px solid ${T.courtDark}`,
    borderRadius: 16,
    padding: 10,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
    gap: 8,
  },
  tile: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 10,
    minHeight: 128,
    padding: 12,
    borderRadius: 10,
    border: `2px solid ${T.line}`,
    textAlign: "left",
    cursor: "pointer",
    fontFamily: BODY,
    color: T.ink,
    transition: "transform 0.1s ease, opacity 0.1s ease",
  },
  tileText: { fontSize: 14, fontWeight: 600, lineHeight: 1.35, overflowWrap: "anywhere" },
  tileMeta: { display: "flex", alignItems: "center", gap: 8 },
  ballChip: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 26,
    height: 26,
    borderRadius: "50%",
    fontWeight: 800,
    fontSize: 12,
    flexShrink: 0,
  },
  addTile: {
    background: "transparent",
    border: `2px dashed ${T.line}`,
    color: T.line,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  tileInput: {
    width: "100%",
    boxSizing: "border-box",
    border: `2px solid ${T.court}`,
    borderRadius: 8,
    padding: 8,
    fontSize: 13,
    fontFamily: BODY,
    minHeight: 50,
    resize: "none",
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: T.muted,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: `2px solid ${T.ink}`,
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 15,
    fontFamily: BODY,
    background: T.card,
    color: T.ink,
    outline: "none",
  },
  primaryBtn: {
    fontFamily: BODY,
    fontWeight: 800,
    fontSize: 14,
    padding: "12px 20px",
    borderRadius: 999,
    border: `2px solid ${T.ink}`,
    background: T.ball,
    color: T.ink,
    cursor: "pointer",
  },
  ghostBtn: {
    fontFamily: BODY,
    fontWeight: 600,
    fontSize: 13,
    padding: "8px 14px",
    borderRadius: 999,
    border: `2px solid ${T.ink}`,
    background: "transparent",
    color: T.ink,
    cursor: "pointer",
  },
  toast: {
    background: T.ink,
    color: T.ball,
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 12,
  },
  noteForm: {
    background: T.card,
    border: `2px solid ${T.ink}`,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  notesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 12,
  },
  noteCard: {
    background: T.card,
    border: `2px solid ${T.court}`,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
  },
  noteSig: {
    marginTop: 10,
    fontWeight: 700,
    color: T.court,
    fontSize: 13,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 24,
    flexWrap: "wrap",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(14,34,64,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 50,
  },
  modal: {
    background: T.card,
    borderRadius: 14,
    border: `2px solid ${T.ink}`,
    padding: 18,
    width: "min(560px, 100%)",
    maxHeight: "85vh",
    overflow: "auto",
    boxSizing: "border-box",
  },
};
