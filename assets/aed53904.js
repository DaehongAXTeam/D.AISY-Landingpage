// D.AISY web one-page (responsive)
const { useState, useEffect, useRef } = React;

// ─────────────────────────────────────────────────────────────
// Palettes
// ─────────────────────────────────────────────────────────────
const PALETTES = {
  violet: { a: '#8B5CF6', b: '#5B21B6', c: '#C4B5FD', glow: 'rgba(139,92,246,0.55)' },
  iris: { a: '#7C5CFF', b: '#3A1E9E', c: '#B5A3FF', glow: 'rgba(124,92,255,0.55)' },
  orchid: { a: '#A855F7', b: '#6B21A8', c: '#E9D5FF', glow: 'rgba(168,85,247,0.55)' },
  electric: { a: '#6366F1', b: '#312E81', c: '#A5B4FC', glow: 'rgba(99,102,241,0.55)' }
};

const HEADLINES = {
  partner: '업무 옆에서 함께 일하는 AI',
  seat: '당신의 옆자리에 앉은 AI 동료',
  speed: '생각의 속도로 일하는 AI',
  ready: '배우지 않아도 바로 함께',
  next: '기획자의 다음 한 수',
  light: '더 빠르게, 더 가볍게',
  with: '묻기 전에 먼저 고민하는 AI',
  oneline: '한 줄로 끝나는 업무'
};

// ─────────────────────────────────────────────────────────────
// SVG glyphs
// ─────────────────────────────────────────────────────────────
const Glyph = {
  seo: (c, s = 32) =>
  <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
      <circle cx="12" cy="12" r="7.5" stroke={c} strokeWidth="1.5" />
      <path d="M17.5 17.5L22 22" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.5 12H15.5M12 8.5V15.5" stroke={c} strokeWidth="1.3" strokeLinecap="round" />
    </svg>,

  sns: (c, s = 32) =>
  <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
      <path d="M5 7C5 5.9 5.9 5 7 5H21C22.1 5 23 5.9 23 7V17C23 18.1 22.1 19 21 19H13L8 23V19H7C5.9 19 5 18.1 5 17V7Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="10" cy="12" r="1.1" fill={c} />
      <circle cx="14" cy="12" r="1.1" fill={c} />
      <circle cx="18" cy="12" r="1.1" fill={c} />
    </svg>,

  fact: (c, s = 32) =>
  <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
      <path d="M6 5H17L22 10V22C22 22.55 21.55 23 21 23H6C5.45 23 5 22.55 5 22V6C5 5.45 5.45 5 6 5Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M17 5V10H22" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 14H18M9 17H18M9 20H14" stroke={c} strokeWidth="1.3" strokeLinecap="round" />
    </svg>,

  spark: (c, s = 16) =>
  <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M8 1L9.5 6.5L15 8L9.5 9.5L8 15L6.5 9.5L1 8L6.5 6.5L8 1Z" fill={c} />
    </svg>,

  arrow: (c, s = 16) =>
  <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,

  lock: (c, s = 14) =>
  <svg width={s} height={s} viewBox="0 0 14 14" fill="none">
      <rect x="3" y="6.5" width="8" height="6" rx="1.2" stroke={c} strokeWidth="1.3" />
      <path d="M4.5 6.5V4.5C4.5 3.12 5.62 2 7 2C8.38 2 9.5 3.12 9.5 4.5V6.5" stroke={c} strokeWidth="1.3" />
    </svg>,

  chat: (c, s = 16) =>
  <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M2.5 4C2.5 3.45 2.95 3 3.5 3H12.5C13.05 3 13.5 3.45 13.5 4V10C13.5 10.55 13.05 11 12.5 11H7.5L5 13.5V11H3.5C2.95 11 2.5 10.55 2.5 10V4Z" stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>

};

// ─────────────────────────────────────────────────────────────
// Viewport hook
// ─────────────────────────────────────────────────────────────
function useViewport() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return { w, mobile: w < 720, tablet: w < 1024 };
}

// ─────────────────────────────────────────────────────────────
// Backdrop
// ─────────────────────────────────────────────────────────────
function Backdrop({ palette, variant }) {
  const p = palette;
  if (variant === 'grid') {
    return (
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(80% 60% at 50% -10%, ${p.b} 0%, #0A0418 55%, #050208 100%)`
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.3,
          backgroundImage: `linear-gradient(${p.c}22 1px, transparent 1px), linear-gradient(90deg, ${p.c}22 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(70% 50% at 50% 25%, #000 0%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(70% 50% at 50% 25%, #000 0%, transparent 80%)'
        }} />
        <Orb x="80%" y="10%" size={520} color={p.glow} blur={100} />
        <Orb x="-5%" y="40%" size={420} color={p.glow} blur={120} opacity={0.5} />
      </div>);

  }
  if (variant === 'aurora') {
    return (
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, #0A0418 0%, #14082B 40%, #050208 100%)`
        }} />
        <div style={{
          position: 'absolute', inset: '-10%',
          background: `conic-gradient(from 220deg at 50% 30%, ${p.a}55, ${p.b}66, ${p.a}33, ${p.c}33, ${p.a}55)`,
          filter: 'blur(80px)', opacity: 0.6,
          animation: 'spin 40s linear infinite'
        }} />
      </div>);

  }
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, #0A0418 0%, #11062A 35%, #06030E 100%)`
      }} />
      <Orb x="78%" y="5%" size={560} color={p.glow} blur={100} />
      <Orb x="-10%" y="25%" size={520} color={p.glow} blur={120} opacity={0.55} />
      <Orb x="60%" y="55%" size={400} color={p.a + '88'} blur={100} opacity={0.4} />
      <Orb x="-10%" y="80%" size={440} color={p.glow} blur={120} opacity={0.45} />
    </div>);

}

function Orb({ x, y, size, color, blur = 60, opacity = 0.7 }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: size, height: size, borderRadius: '50%',
      background: color, filter: `blur(${blur}px)`, opacity,
      transform: 'translate(-30%, -30%)'
    }} />);

}

// ─────────────────────────────────────────────────────────────
// Glass card
// ─────────────────────────────────────────────────────────────
function Glass({ children, style = {}, onClick, disabled, hoverable = true }) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  return (
    <div
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {setHover(false);setPress(false);}}
      onPointerDown={() => onClick && !disabled && setPress(true)}
      onPointerUp={() => setPress(false)}
      style={{
        position: 'relative', borderRadius: 24, overflow: 'hidden',
        background: hoverable && hover && !disabled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(22px) saturate(160%)',
        WebkitBackdropFilter: 'blur(22px) saturate(160%)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: hoverable && hover && !disabled ?
        '0 1px 0 rgba(255,255,255,0.10) inset, 0 30px 60px -20px rgba(0,0,0,0.6)' :
        '0 1px 0 rgba(255,255,255,0.06) inset, 0 20px 40px -20px rgba(0,0,0,0.5)',
        transition: 'transform 0.18s ease, background 0.2s, box-shadow 0.2s',
        transform: press ? 'scale(0.99)' : hoverable && hover && !disabled ? 'translateY(-2px)' : 'translateY(0)',
        cursor: onClick && !disabled ? 'pointer' : 'default',
        opacity: disabled ? 0.65 : 1,
        ...style
      }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)'
      }} />
      {children}
    </div>);

}

// ─────────────────────────────────────────────────────────────
// Wordmark
// ─────────────────────────────────────────────────────────────
function Wordmark({ size = 24, palette, animated = false, beta = false }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'baseline', gap: size * 0.32,
      lineHeight: 1
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'baseline', gap: 1,
        fontFamily: '"Pretendard Variable", "Pretendard", -apple-system, system-ui, sans-serif',
        fontWeight: 600, fontSize: size, letterSpacing: '-0.02em',
        color: '#fff'
      }}>
        <span>D</span>
        <span style={{
          display: 'inline-block', width: size * 0.18, height: size * 0.18,
          borderRadius: '50%', background: palette.a,
          boxShadow: `0 0 ${size * 0.6}px ${palette.glow}`,
          transform: `translateY(${-size * 0.02}px)`,
          animation: animated ? 'pulse 2.4s ease-in-out infinite' : undefined
        }} />
        <span>AISY</span>
      </div>
      {beta &&
      <span style={{
        fontFamily: '"Pretendard Variable", "Pretendard", -apple-system, system-ui, sans-serif',
        fontWeight: 500,
        fontSize: size * 0.42,
        letterSpacing: '0.08em',
        color: palette.c,
        padding: `${size * 0.08}px ${size * 0.28}px`,
        borderRadius: 999,
        border: `1px solid ${palette.a}55`,
        background: `${palette.a}1a`,
        textTransform: 'uppercase',
        transform: `translateY(${-size * 0.12}px)`,
        whiteSpace: 'nowrap'
      }}>Beta</span>
      }
    </div>);

}

// ─────────────────────────────────────────────────────────────
// Service card
// ─────────────────────────────────────────────────────────────
function ServiceCard({ glyph, badge, title, desc, tags, palette, status = 'live', onTap, vp }) {
  const isComingSoon = status === 'soon';
  // Visual distinction: live cards POP with palette accents; coming-soon recedes (muted, desaturated)
  const live = !isComingSoon;
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {/* LIVE: ambient palette glow behind card */}
      {live &&
      <div style={{
        position: 'absolute', inset: -2, borderRadius: 26,
        background: `radial-gradient(60% 50% at 50% 0%, ${palette.a}55, transparent 70%)`,
        filter: 'blur(20px)', opacity: 0.6, pointerEvents: 'none', zIndex: 0
      }} />
      }
      <Glass onClick={onTap} disabled={false}
      style={{
        padding: vp.mobile ? 22 : 28,
        height: '100%', display: 'flex', flexDirection: 'column',
        position: 'relative', zIndex: 1,
        background: live ? `linear-gradient(180deg, ${palette.a}14, rgba(255,255,255,0.04) 60%)` : 'rgba(255,255,255,0.025)',
        border: live ? `1px solid ${palette.a}55` : '1px solid rgba(255,255,255,0.06)',
        boxShadow: live ?
        `0 1px 0 ${palette.c}33 inset, 0 24px 60px -20px ${palette.glow}` :
        '0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 30px -16px rgba(0,0,0,0.4)',
        filter: isComingSoon ? 'saturate(0.4)' : 'none'
      }}>
        {/* icon + title row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: live ?
            `linear-gradient(135deg, ${palette.a}, ${palette.b})` :
            'rgba(255,255,255,0.05)',
            border: `1px solid ${live ? palette.a + 'AA' : 'rgba(255,255,255,0.10)'}`,
            boxShadow: live ? `0 12px 36px -8px ${palette.glow}, 0 0 0 4px ${palette.a}1a` : 'none',
            position: 'relative'
          }}>
            {glyph(live ? '#fff' : 'rgba(255,255,255,0.4)', 26)}
            {isComingSoon &&
            <div style={{
              position: 'absolute', right: -5, bottom: -5,
              width: 20, height: 20, borderRadius: '50%',
              background: '#1a0d2e', border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>{Glyph.lock('rgba(255,255,255,0.6)', 10)}</div>
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
              color: live ? palette.c : 'rgba(255,255,255,0.35)',
              fontFamily: '"Pretendard Variable", "Pretendard", -apple-system, system-ui, sans-serif',
              marginBottom: 4
            }}>{badge}</div>
            <h3 style={{
              fontSize: vp.mobile ? 18 : 20, fontWeight: 700,
              color: live ? '#fff' : 'rgba(255,255,255,0.55)',
              letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0
            }}>{title}</h3>
          </div>
        </div>

        <p style={{
          fontSize: 14, lineHeight: 1.55,
          color: live ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)',
          margin: '0 0 20px', flex: 1,
          whiteSpace: 'pre-line'
        }}>{desc}</p>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          paddingTop: 18,
          borderTop: `1px solid ${live ? palette.a + '22' : 'rgba(255,255,255,0.04)'}`
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', flex: 1, minWidth: 0 }}>
            {tags.map((t, i) =>
            <span key={i} style={{
              fontSize: 11, fontWeight: 500,
              padding: '4px 10px', borderRadius: 999,
              background: live ? `${palette.a}1a` : 'rgba(255,255,255,0.025)',
              border: `1px solid ${live ? palette.a + '44' : 'rgba(255,255,255,0.06)'}`,
              color: live ? palette.c : 'rgba(255,255,255,0.45)',
              fontFamily: '"Pretendard Variable", "Pretendard", -apple-system, system-ui, sans-serif'
            }}>{t}</span>
            )}
          </div>
          {live ?
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: `${palette.a}22`,
            border: `1px solid ${palette.a}66`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 24px -4px ${palette.glow}`
          }}>{Glyph.arrow('#fff', 13)}</div> :
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
            fontFamily: '"Pretendard Variable", "Pretendard", -apple-system, system-ui, sans-serif',
            fontSize: 10, fontWeight: 600, letterSpacing: '0.14em',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase', whiteSpace: 'nowrap'
          }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
              <path d="M6 3.5V6L7.5 7" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Coming Soon
          </div>
          }
        </div>
      </Glass>
    </div>);

}

// ─────────────────────────────────────────────────────────────
// Service detail (modal)
// ─────────────────────────────────────────────────────────────
function ServiceDetail({ service, palette, onBack, vp }) {
  useEffect(() => {
    if (!service) return;
    const onKey = (e) => {if (e.key === 'Escape') onBack();};
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [service, onBack]);

  if (!service) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: vp.mobile ? 0 : 32,
      animation: 'fadeUp 0.25s ease'
    }}>
      <div onClick={onBack} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(5,2,14,0.7)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)'
      }} />
      <div style={{
        position: 'relative',
        width: vp.mobile ? '100%' : 'min(680px, 92vw)',
        maxHeight: vp.mobile ? '100%' : '88vh',
        background: 'linear-gradient(180deg, #1a0d2e 0%, #0e0521 100%)',
        borderRadius: vp.mobile ? 0 : 28,
        border: '1px solid rgba(255,255,255,0.10)',
        overflow: 'auto', boxSizing: 'border-box',
        padding: vp.mobile ? '32px 22px 60px' : '40px 44px 44px'
      }}>
        <button onClick={onBack} style={{
          position: 'absolute', top: vp.mobile ? 16 : 20, right: vp.mobile ? 16 : 20,
          width: 38, height: 38, borderRadius: 12,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.10)',
          color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 3L11 11M11 3L3 11" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
          color: palette.c, fontFamily: '"Pretendard Variable", "Pretendard", -apple-system, system-ui, sans-serif',
          marginBottom: 14
        }}>{service.badge}</div>
        <h1 style={{
          fontSize: vp.mobile ? 30 : 38, fontWeight: 700, color: '#fff',
          letterSpacing: '-0.025em', lineHeight: 1.12, margin: '0 0 18px',
          whiteSpace: 'pre-line'
        }}>{service.fullTitle}</h1>
        <p style={{
          fontSize: vp.mobile ? 15 : 16.5, lineHeight: 1.6,
          color: 'rgba(255,255,255,0.7)', margin: '0 0 28px'
        }}>{service.long.split(/(?<=[.!?다])\s+/).map((sentence, i, arr) =>
          <React.Fragment key={i}>
            {sentence}
            {i < arr.length - 1 && <br />}
          </React.Fragment>
          )}</p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
          {service.status === 'live' ?
          <a href={service.serviceUrl || '#'} target="_blank" rel="noopener noreferrer" style={{
            padding: '16px 30px', borderRadius: 14,
            background: `linear-gradient(135deg, ${palette.a}, ${palette.b})`,
            border: 'none', color: '#fff', textDecoration: 'none',
            fontSize: 15.5, fontWeight: 700, letterSpacing: '-0.01em',
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
            boxShadow: `0 18px 40px -10px ${palette.glow}`
          }}>
              바로 사용하기 {Glyph.arrow('#fff', 16)}
            </a> :

          <div style={{
            padding: '16px 22px 16px 18px', borderRadius: 14,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.10)',
            color: 'rgba(255,255,255,0.55)',
            fontSize: 14, fontWeight: 600, letterSpacing: '0.04em',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            cursor: 'not-allowed',
            fontFamily: '"Pretendard Variable", "Pretendard", -apple-system, system-ui, sans-serif'
          }}>
              {Glyph.lock('rgba(255,255,255,0.55)', 14)}
              COMING SOON
            </div>
          }
          {service.status !== 'soon' &&
          <a href={service.guideUrl || '#'} target="_blank" rel="noopener noreferrer" style={{
            padding: '16px 24px', borderRadius: 14,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#fff', textDecoration: 'none',
            fontSize: 15, fontWeight: 500, letterSpacing: '-0.01em',
            display: 'inline-flex', alignItems: 'center', gap: 8
          }}>
              이용 가이드
            </a>
          }
        </div>

        <div style={{
          fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)',
          letterSpacing: '0.08em', marginBottom: 14,
          fontFamily: '"Pretendard Variable", "Pretendard", -apple-system, system-ui, sans-serif'
        }}>주요 기능</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {service.examples.map((ex, i) =>
          <div key={i} style={{
            padding: 16, borderRadius: 14,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: 14
          }}>
              <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: `${palette.a}22`, color: palette.c,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
              fontFamily: '"Pretendard Variable", "Pretendard", -apple-system, system-ui, sans-serif'
            }}>0{i + 1}</div>
              <div style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{ex}</div>
            </div>
          )}
        </div>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────
// Main app
// ─────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "orchid",
  "background": "aurora",
  "headline": "light",
  "showStats": true
} /*EDITMODE-END*/;

function DaisyApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const palette = PALETTES[t.palette] || PALETTES.violet;
  const headline = HEADLINES[t.headline] || HEADLINES.partner;
  const vp = useViewport();

  const FEEDBACK_URL = 'https://forms.gle/VzGHyUDrSE7yWoiT6';
  const [detail, setDetail] = useState(null);

  const services = [
  {
    id: 'sns', guideUrl: 'https://drive.google.com/file/d/1S1RBC0Zd-I6vM6_bBWAk6WIVkO-xJOJz/view?usp=sharing', serviceUrl: 'https://copygenai.onrender.com/', glyph: Glyph.sns, badge: 'SERVICE / 01',
    title: 'SNS 카피 생성 AI',
    fullTitle: 'SNS 카피 생성 AI',
    desc: 'SNS 카피라이팅 기획·제작 시, 아이디어 초안과\n베리에이션을 즉시 생성합니다.',
    long: '채널별 최적화된 템플릿으로 SNS 카피를 다양하게 베리에이션 하여 초안을 작성합니다. 최신 트렌드와 밈을 적용하여 트렌디한 카피를 생성할 수 있습니다.',
    tags: ['#콘텐츠 생성'],
    examples: [
    '채널별 템플릿 선택 — 인스타, X, 숏폼, 유튜브, 커스텀',
    '키워드·해시태그·톤앤매너 — 카피 생성 상세 설정 지원',
    '트렌드·밈 선택 — 현 세대를 타겟하는 트렌디한 카피 생성 지원'],

    status: 'live'
  },
  {
    id: 'seo', guideUrl: '#', glyph: Glyph.seo, badge: 'SERVICE / 02',
    title: 'SEO/GEO 콘텐츠 생성 AI',
    fullTitle: 'SEO/GEO 콘텐츠 생성 AI',
    desc: '타겟 대상에 맞춰 SEO/GEO에 최적화된 콘텐츠를\n생성합니다.',
    long: '타겟 고객의 검색 의도를 예측하고, 검색 상위 노출에 최적화된 콘텐츠(블로그, 뉴스룸)를 빠르고 쉽게 생성할 수 있는 AI 솔루션입니다.',
    tags: ['#콘텐츠 생성', '#SEO/GEO'],
    examples: [
    '콘텐츠 진단 — 콘텐츠 URL 기반 SEO 상위노출 현황 및 진단 수행',
    '키워드 전략 — 타겟 고객의 검색의도에 부합한 페르소나 생성 및 키워드 추천',
    '콘텐츠 생성 — 키워드 전략에서 선정한 키워드 기반 콘텐츠 생성'],

    status: 'soon'
  },
  {
    id: 'fact', guideUrl: '#', glyph: Glyph.fact, badge: 'SERVICE / 03',
    title: '팩트북 생성 AI',
    fullTitle: '팩트북 생성 AI',
    long: 'PT 제안을 위한 사전 조사를 AI가 대신합니다. 시장·소비자·트렌드 데이터를 자동으로 수집하여 한눈에 보기 쉽게 구성합니다.',
    examples: [
    'RFP 기반 브랜드 분석 (기업정보 · 시장현황 · 자사 · 경쟁사 · 타겟)',
    '광고 유형별 커뮤니케이션 전략 분석 (ATL / BTL / PR)'],

    desc: 'PT 제안을 위한 사전 조사를 AI가 대신합니다.',
    tags: ['#리서치', '#제안 PT'],
    status: 'soon'
  }];


  const MAX_W = 1180;

  return (
    <div style={{
      position: 'relative', minHeight: '100vh', color: '#fff',
      fontFamily: '"Pretendard Variable", "Pretendard", -apple-system, system-ui, sans-serif',
      paddingBottom: vp.mobile ? 56 : 64
    }}>
      <Backdrop palette={palette} variant={t.background} />

      {/* HEADER */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        padding: vp.mobile ? '16px 20px' : '20px 32px',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        background: 'rgba(6,3,14,0.55)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{
          maxWidth: MAX_W, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <Wordmark size={vp.mobile ? 20 : 24} palette={palette} animated beta />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <a href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '7px 12px', borderRadius: 999,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: 'rgba(255,255,255,0.75)',
              fontSize: 12, fontWeight: 500, letterSpacing: '-0.01em',
              textDecoration: 'none'
            }}>
              {Glyph.chat(palette.c, 12)}
              <span>{vp.mobile ? '피드백' : '피드백 남기기'}</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginLeft: 2 }}>↗</span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: vp.mobile ? '60px 20px 40px' : '120px 32px 80px'
      }}>
        <div style={{ maxWidth: MAX_W, margin: '0 auto', textAlign: 'center' }}>
          {/* Editorial brand line */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: vp.mobile ? 12 : 16,
            marginBottom: vp.mobile ? 28 : 36
          }}>
            <span style={{
              width: vp.mobile ? 18 : 32, height: 1,
              background: `linear-gradient(90deg, transparent, ${palette.a}99)`
            }} />
            <span style={{
              fontFamily: '"Pretendard Variable", "Pretendard", -apple-system, system-ui, sans-serif',
              fontWeight: 600,
              fontSize: vp.mobile ? 28 : 40,
              letterSpacing: '0.8px',
              color: '#fff',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              lineHeight: 1.1
            }}>Daehong AI System For You</span>
            <span style={{
              width: vp.mobile ? 18 : 32, height: 1,
              background: `linear-gradient(270deg, transparent, ${palette.a}99)`
            }} />
          </div>

          <p style={{
            fontSize: vp.mobile ? 15 : 18, lineHeight: 1.6,
            color: 'rgba(255,255,255,0.65)',
            margin: '0 auto', maxWidth: 620
          }}>
            특별한 학습 없이도 누구나 즉시 활용할 수 있도록 설계된<br />
            DCG만의 AI 업무 파트너, <span style={{ color: '#fff', fontWeight: 600 }}>D.AISY</span>입니다.
          </p>

        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{
        position: 'relative', zIndex: 1,
        padding: vp.mobile ? '20px 20px 40px' : '20px 32px 40px'
      }}>
        <div style={{ maxWidth: MAX_W, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: vp.mobile ? '1fr' : vp.tablet ? '1fr 1fr' : '1fr 1fr 1fr',
            gap: vp.mobile ? 14 : 20
          }}>
            {services.map((s) =>
            <ServiceCard
              key={s.id}
              glyph={s.glyph}
              badge={s.badge}
              title={s.title}
              desc={s.desc}
              tags={s.tags}
              status={s.status}
              palette={palette}
              vp={vp}
              onTap={() => setDetail(s)} />

            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        padding: vp.mobile ? '12px 20px' : '16px 32px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(10,6,20,0.85)', backdropFilter: 'blur(12px)'
      }}>
        <div style={{
          maxWidth: MAX_W, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16
        }}>
          <Wordmark size={18} palette={palette} />
          <div style={{
            fontSize: 11, color: 'rgba(255,255,255,0.4)',
            fontFamily: '"Pretendard Variable", "Pretendard", -apple-system, system-ui, sans-serif',
            letterSpacing: '0.06em'
          }}>
            © 2026 Daehong INC. All rights reserved.
          </div>
        </div>
      </footer>

      <ServiceDetail service={detail} palette={palette} onBack={() => setDetail(null)} vp={vp} />

      {/* TWEAKS */}
      <TweaksPanel title="Tweaks">
        <TweakSection title="Theme">
          <TweakColor label="Accent palette" options={[
          ['#8B5CF6', '#5B21B6', '#C4B5FD'],
          ['#7C5CFF', '#3A1E9E', '#B5A3FF'],
          ['#A855F7', '#6B21A8', '#E9D5FF'],
          ['#6366F1', '#312E81', '#A5B4FC']]
          } value={[palette.a, palette.b, palette.c]}
          onChange={(v) => {
            const keys = ['violet', 'iris', 'orchid', 'electric'];
            const idx = [
            ['#8B5CF6', '#5B21B6', '#C4B5FD'],
            ['#7C5CFF', '#3A1E9E', '#B5A3FF'],
            ['#A855F7', '#6B21A8', '#E9D5FF'],
            ['#6366F1', '#312E81', '#A5B4FC']].
            findIndex((p) => p[0] === v[0]);
            setTweak('palette', keys[idx] || 'violet');
          }} />
          <TweakSelect label="Background" value={t.background}
          options={[
          { value: 'orbs', label: 'Glow orbs' },
          { value: 'grid', label: 'Grid + glow' },
          { value: 'aurora', label: 'Aurora mesh' }]
          } onChange={(v) => setTweak('background', v)} />
        </TweakSection>
        <TweakSection title="Copy">
          <TweakSelect label="Headline" value={t.headline}
          options={[
          { value: 'partner', label: '업무 옆에서 / 함께 일하는 AI' },
          { value: 'seat', label: '당신의 옆자리에 / AI 동료' },
          { value: 'speed', label: '생각의 속도로 / 일하는 AI' },
          { value: 'ready', label: '배우지 않아도 / 바로 함께' },
          { value: 'next', label: '기획자의 / 다음 한 수' },
          { value: 'light', label: '더 빠르게, 더 가볍게 / 일하다' },
          { value: 'with', label: '묻기 전에 / 먼저 함께 고민' },
          { value: 'oneline', label: '한 줄로 / 끝나는 업무' }]
          } onChange={(v) => setTweak('headline', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>);

}

function Stat({ n, label }) {
  return (
    <div style={{ flex: 1, textAlign: 'center', padding: '4px 8px' }}>
      <div style={{
        fontSize: 28, fontWeight: 700, color: '#fff',
        letterSpacing: '-0.025em', lineHeight: 1.1,
        fontFamily: '"Pretendard Variable", "Pretendard", -apple-system, system-ui, sans-serif'
      }}>{n}</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 6, letterSpacing: '-0.01em' }}>{label}</div>
    </div>);

}
function StatDivider() {
  return <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', alignSelf: 'stretch' }} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<DaisyApp />);