
(function() {
  if (document.getElementById('bugatti-root')) return;

  const style = document.createElement('style');
  style.textContent = `
    ::-webkit-scrollbar { width: 0 !important; display: none !important; }
    * { scrollbar-width: none !important; }
    html { overflow-y: scroll; }

    #bugatti-root {
      position: fixed;
      right: 0; top: 0;
      width: 14px;
      height: 100%;
      z-index: 2147483646;
      pointer-events: none;
      overflow: visible !important;
    }
    #b-track {
      position: absolute;
      right: 2px; top: 4px; bottom: 4px;
      width: 10px;
      background: rgba(255,255,255,0.07);
      border-radius: 5px;
    }
    #b-thumb {
      position: absolute;
      right: 2px;
      width: 10px;
      background: linear-gradient(180deg, #1e2125 0%, #2a2d32 40%, #1e2125 100%);
      border-radius: 5px;
      min-height: 32px;
      transition: opacity 0.15s;
      border: 1px solid rgba(0,200,220,0.5);
      box-shadow: 0 0 6px rgba(0,200,220,0.3), inset 0 0 4px rgba(0,0,0,0.5);
      overflow: hidden;
    }
    /* Teal center stripe on thumb */
    #b-thumb::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 2px;
      height: 60%;
      background: linear-gradient(180deg, transparent, #00ccdd, transparent);
      border-radius: 1px;
      opacity: 0.8;
    }
    #b-thumb.hidden { opacity: 0; }
    #b-wrap {
      position: absolute;
      right: 7px; top: 0;
      width: 0; height: 0;
      overflow: visible;
      z-index: 2147483647;
      opacity: 0;
      transition: opacity 0.2s;
    }
    #b-wrap.on { opacity: 1; }

    /* Top-view car: 52px wide x 110px tall, centered on wrap origin */
    #b-car {
      position: absolute;
      width: 52px; height: 110px;
      left: -26px; top: -55px;
      overflow: visible;
      transform: rotate(180deg);   /* front faces DOWN by default */
      transform-origin: 26px 55px;
    }
    #b-beam {
      position: absolute;
      width: 52px; height: 110px;
      left: -26px; top: -55px;
      overflow: visible;
      transform: rotate(180deg);
      transform-origin: 26px 55px;
      opacity: 0;
    }
    #b-beam.on { opacity: 1; }
    #b-exhaust {
      position: absolute;
      width: 52px; height: 60px;
      left: -26px; top: -30px;
      overflow: visible;
      transform-origin: 26px 0px;
      opacity: 0;
    }
    #b-exhaust.on { opacity: 1; }
  `;
  document.head.appendChild(style);

  const root  = document.createElement('div'); root.id='bugatti-root'; document.body.appendChild(root);
  const track = document.createElement('div'); track.id='b-track';     root.appendChild(track);
  const thumb = document.createElement('div'); thumb.id='b-thumb';     root.appendChild(thumb);
  const wrap  = document.createElement('div'); wrap.id='b-wrap';       root.appendChild(wrap);

  // ── BEAM (fires upward = forward when car faces down) ──────────────────
  const beamEl = document.createElement('div'); beamEl.id='b-beam';
  beamEl.innerHTML = `<svg viewBox="0 0 52 110" width="52" height="110" overflow="visible" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="hcT" cx="50%" cy="0%" r="160%" fy="0%">
      <stop offset="0%"   stop-color="#ffffff" stop-opacity="1"/>
      <stop offset="20%"  stop-color="#ddeeff" stop-opacity="0.65"/>
      <stop offset="60%"  stop-color="#aaccff" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#00ccdd" stop-opacity="0"/>
    </radialGradient>
    <filter id="bfT"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="bfT2"><feGaussianBlur stdDeviation="2"/></filter>
  </defs>
  <polygon points="26,8 26,8 120,-180 -68,-180" fill="url(#hcT)" filter="url(#bfT)" opacity="0.9"/>
  <ellipse cx="13" cy="9" rx="5" ry="4" fill="white" opacity="0.95" filter="url(#bfT2)"/>
  <ellipse cx="39" cy="9" rx="5" ry="4" fill="white" opacity="0.95" filter="url(#bfT2)"/>
  <ellipse cx="13" cy="9" rx="2" ry="1.5" fill="white"/>
  <ellipse cx="39" cy="9" rx="2" ry="1.5" fill="white"/>
  <ellipse cx="26" cy="-170" rx="80" ry="10" fill="rgba(200,225,255,0.25)" filter="url(#bfT)"/>
</svg>`;
  wrap.appendChild(beamEl);

  // ── EXHAUST ────────────────────────────────────────────────────────────
  const exhaustEl = document.createElement('div'); exhaustEl.id='b-exhaust';
  exhaustEl.innerHTML = `<svg viewBox="0 0 52 60" width="52" height="60" overflow="visible" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="exT" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="rgba(0,210,255,0.8)"/>
      <stop offset="100%" stop-color="rgba(0,210,255,0)"/>
    </linearGradient>
  </defs>
  <line x1="26" y1="0" x2="26" y2="55" stroke="url(#exT)" stroke-width="2.5" stroke-dasharray="8,5" stroke-linecap="round"/>
  <line x1="17" y1="0" x2="15" y2="42" stroke="url(#exT)" stroke-width="1.2" stroke-dasharray="5,8" stroke-linecap="round" opacity="0.45"/>
  <line x1="35" y1="0" x2="37" y2="42" stroke="url(#exT)" stroke-width="1.2" stroke-dasharray="5,8" stroke-linecap="round" opacity="0.45"/>
</svg>`;
  wrap.appendChild(exhaustEl);

  // ── TOP-VIEW CAR SVG ───────────────────────────────────────────────────
  // Viewed from DIRECTLY ABOVE. Front = TOP (y=0), Rear = BOTTOM (y=110)
  // Car is 52px wide, 110px tall
  // Bugatti Divo: dark matte grey + teal accents
  const carEl = document.createElement('div'); carEl.id='b-car';
  carEl.innerHTML = `
<svg id="carSVG" viewBox="0 0 52 110" width="52" height="110" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bodyT" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#2a2d32"/>
      <stop offset="50%"  stop-color="#1c1f23"/>
      <stop offset="100%" stop-color="#111315"/>
    </linearGradient>
    <linearGradient id="roofT" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#1a1c20"/>
      <stop offset="50%"  stop-color="#0f1114"/>
      <stop offset="100%" stop-color="#080a0c"/>
    </linearGradient>
    <linearGradient id="tealT" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#00ccdd"/>
      <stop offset="100%" stop-color="#007a8a"/>
    </linearGradient>
    <linearGradient id="glassT" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#99bbcc" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#223344" stop-opacity="0.8"/>
    </linearGradient>
    <radialGradient id="tireT" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="#222"/>
      <stop offset="70%"  stop-color="#111"/>
      <stop offset="100%" stop-color="#060606"/>
    </radialGradient>
    <radialGradient id="rimT" cx="40%" cy="35%" r="65%">
      <stop offset="0%"   stop-color="#999"/>
      <stop offset="50%"  stop-color="#444"/>
      <stop offset="100%" stop-color="#111"/>
    </radialGradient>
    <filter id="glowT" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="shadowT">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="rgba(0,0,0,0.6)"/>
    </filter>
  </defs>

  <!-- Ground shadow -->
  <ellipse cx="26" cy="108" rx="22" ry="3" fill="rgba(0,0,0,0.4)"/>

  <!-- ═══ FRONT SPLITTER (top) ═══ -->
  <path d="M16,6 Q26,1 36,6 L38,11 Q26,8 14,11 Z" fill="#0a0c0e"/>
  <!-- Teal splitter edge -->
  <path d="M17,6 Q26,2 35,6 L36,8 Q26,5 16,8 Z" fill="url(#tealT)" opacity="0.8"/>
  <!-- Splitter fins -->
  <line x1="19" y1="7" x2="19" y2="10" stroke="#00ccdd" stroke-width="0.7" opacity="0.6"/>
  <line x1="23" y1="6" x2="23" y2="10" stroke="#00ccdd" stroke-width="0.7" opacity="0.6"/>
  <line x1="26" y1="5" x2="26" y2="10" stroke="#00ccdd" stroke-width="0.7" opacity="0.6"/>
  <line x1="29" y1="6" x2="29" y2="10" stroke="#00ccdd" stroke-width="0.7" opacity="0.6"/>
  <line x1="33" y1="7" x2="33" y2="10" stroke="#00ccdd" stroke-width="0.7" opacity="0.6"/>

  <!-- ═══ MAIN BODY ═══ -->
  <path d="M13,11 Q10,30 10,55 Q10,78 13,94 L19,100 Q26,103 33,100 L39,94 Q42,78 42,55 Q42,30 39,11 Q26,8 13,11 Z"
    fill="url(#bodyT)" filter="url(#shadowT)"/>

  <!-- ═══ SIDE PANELS (left/right depth) ═══ -->
  <path d="M10,15 Q8,55 10,93 L13,94 Q11,55 13,11 Z" fill="#0d0f12"/>
  <path d="M42,15 Q44,55 42,93 L39,94 Q41,55 39,11 Z" fill="#0d0f12"/>

  <!-- ═══ TEAL SIDE STRIPES ═══ -->
  <path d="M10,20 L11,20 L11,88 L10,88 Z" fill="url(#tealT)" opacity="0.7"/>
  <path d="M42,20 L41,20 L41,88 L42,88 Z" fill="url(#tealT)" opacity="0.7"/>

  <!-- ═══ HORSESHOE GRILLE (top front) ═══ -->
  <path d="M18,9 Q26,4 34,9 L33,13 Q26,8 19,13 Z" fill="#050710"/>
  <path d="M19,9 Q26,5 33,9 L32,12 Q26,7 20,12 Z" fill="#080a14" opacity="0.9"/>
  <line x1="20" y1="9"  x2="32" y2="9"  stroke="#0044aa" stroke-width="0.6" opacity="0.6"/>
  <line x1="20" y1="11" x2="32" y2="11" stroke="#0044aa" stroke-width="0.6" opacity="0.6"/>

  <!-- ═══ HEADLIGHTS ═══ -->
  <!-- Left housing -->
  <path d="M8,9 L14,7 L16,14 L10,16 Z" fill="#08080f"/>
  <ellipse cx="12" cy="12" rx="3.5" ry="3" fill="#0d0d1a"/>
  <ellipse id="hl-l-off" cx="12" cy="12" rx="3"   ry="2.5" fill="#1a1a2e" opacity="1"/>
  <ellipse id="hl-l-on"  cx="12" cy="12" rx="3"   ry="2.5" fill="white"   opacity="0"/>
  <ellipse id="hl-l-hot" cx="12" cy="12" rx="1.3" ry="1"   fill="white"   opacity="0" filter="url(#glowT)"/>
  <line id="drl-l" x1="8" y1="9" x2="14" y2="7" stroke="#003355" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>
  <!-- Right housing -->
  <path d="M44,9 L38,7 L36,14 L42,16 Z" fill="#08080f"/>
  <ellipse cx="40" cy="12" rx="3.5" ry="3" fill="#0d0d1a"/>
  <ellipse id="hl-r-off" cx="40" cy="12" rx="3"   ry="2.5" fill="#1a1a2e" opacity="1"/>
  <ellipse id="hl-r-on"  cx="40" cy="12" rx="3"   ry="2.5" fill="white"   opacity="0"/>
  <ellipse id="hl-r-hot" cx="40" cy="12" rx="1.3" ry="1"   fill="white"   opacity="0" filter="url(#glowT)"/>
  <line id="drl-r" x1="44" y1="9" x2="38" y2="7" stroke="#003355" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>

  <!-- ═══ WINDSHIELD (top view: narrow band near front) ═══ -->
  <path d="M15,17 Q26,14 37,17 L36,30 Q26,28 16,30 Z" fill="url(#glassT)"/>
  <path d="M16,18 Q21,15 26,16 L25,26 Q20,25 16,24 Z" fill="white" opacity="0.12"/>
  <path d="M36,18 Q31,15 26,16 L27,26 Q32,25 36,24 Z" fill="white" opacity="0.07"/>

  <!-- ═══ ROOF PANEL ═══ -->
  <path d="M16,30 Q26,28 36,30 L35,72 Q26,74 17,72 Z" fill="url(#roofT)"/>
  <!-- Carbon weave lines on roof -->
  <line x1="17" y1="36" x2="35" y2="36" stroke="rgba(0,180,200,0.15)" stroke-width="0.6"/>
  <line x1="17" y1="42" x2="35" y2="42" stroke="rgba(0,180,200,0.15)" stroke-width="0.6"/>
  <line x1="17" y1="48" x2="35" y2="48" stroke="rgba(0,180,200,0.15)" stroke-width="0.6"/>
  <line x1="17" y1="54" x2="35" y2="54" stroke="rgba(0,180,200,0.15)" stroke-width="0.6"/>
  <line x1="17" y1="60" x2="35" y2="60" stroke="rgba(0,180,200,0.15)" stroke-width="0.6"/>
  <line x1="17" y1="66" x2="35" y2="66" stroke="rgba(0,180,200,0.15)" stroke-width="0.6"/>
  <!-- Roof center teal stripe -->
  <line x1="26" y1="30" x2="26" y2="72" stroke="#00aacc" stroke-width="0.8" opacity="0.3"/>

  <!-- ═══ REAR WINDOW ═══ -->
  <path d="M17,72 Q26,70 35,72 L34,82 Q26,84 18,82 Z" fill="url(#glassT)" opacity="0.75"/>
  <path d="M18,73 Q22,71 26,72 L25,80 Q21,79 18,77 Z" fill="white" opacity="0.1"/>

  <!-- ═══ SIDE VENTS (top view: slots on body sides) ═══ -->
  <!-- Left front vent -->
  <path d="M10,32 L12,30 L12,40 L10,39 Z" fill="#050710"/>
  <line x1="10.5" y1="31" x2="10.5" y2="39" stroke="#00aacc" stroke-width="0.7" opacity="0.6"/>
  <line x1="11.5" y1="31" x2="11.5" y2="39" stroke="#00aacc" stroke-width="0.7" opacity="0.4"/>
  <!-- Right front vent -->
  <path d="M42,32 L40,30 L40,40 L42,39 Z" fill="#050710"/>
  <line x1="41.5" y1="31" x2="41.5" y2="39" stroke="#00aacc" stroke-width="0.7" opacity="0.6"/>
  <line x1="40.5" y1="31" x2="40.5" y2="39" stroke="#00aacc" stroke-width="0.7" opacity="0.4"/>
  <!-- Left rear vent -->
  <path d="M10,64 L12,62 L12,72 L10,71 Z" fill="#050710"/>
  <line x1="10.5" y1="63" x2="10.5" y2="71" stroke="#cc3300" stroke-width="0.7" opacity="0.5"/>
  <line x1="11.5" y1="63" x2="11.5" y2="71" stroke="#cc3300" stroke-width="0.7" opacity="0.4"/>
  <!-- Right rear vent -->
  <path d="M42,64 L40,62 L40,72 L42,71 Z" fill="#050710"/>
  <line x1="41.5" y1="63" x2="41.5" y2="71" stroke="#cc3300" stroke-width="0.7" opacity="0.5"/>
  <line x1="40.5" y1="63" x2="40.5" y2="71" stroke="#cc3300" stroke-width="0.7" opacity="0.4"/>

  <!-- ═══ BUGATTI BADGE ═══ -->
  <ellipse cx="26" cy="51" rx="6" ry="4" fill="#cc0000"/>
  <ellipse cx="26" cy="51" rx="5.2" ry="3.2" fill="#ee0000"/>
  <text x="26" y="53.2" text-anchor="middle" fill="white" font-size="3.2" font-family="Arial" font-weight="900">BUGATTI</text>

  <!-- ═══ DOOR HANDLES ═══ -->
  <rect x="11" y="47" width="1.5" height="5" rx="0.75" fill="#556677" opacity="0.8"/>
  <rect x="39.5" y="47" width="1.5" height="5" rx="0.75" fill="#556677" opacity="0.8"/>

  <!-- ═══ REAR WING (top view: wide horizontal bar) ═══ -->
  <!-- Wing span extends beyond body -->
  <path d="M4,78 L48,78 L48,82 L4,82 Z" fill="#1a1c20"/>
  <!-- Wing teal top edge -->
  <line x1="4" y1="78" x2="48" y2="78" stroke="#00ccdd" stroke-width="1.2" opacity="0.8"/>
  <!-- Wing mounting to body -->
  <rect x="16" y="82" width="4" height="6" rx="1" fill="#0d0f12"/>
  <rect x="32" y="82" width="4" height="6" rx="1" fill="#0d0f12"/>
  <!-- Wing end plates (from above: small squares at tips) -->
  <rect x="4"  y="77" width="5" height="6" rx="0.5" fill="#141618"/>
  <rect x="43" y="77" width="5" height="6" rx="0.5" fill="#141618"/>
  <!-- Teal wing end stripe -->
  <line x1="4"  y1="77" x2="4"  y2="83" stroke="#00ccdd" stroke-width="1" opacity="0.7"/>
  <line x1="48" y1="77" x2="48" y2="83" stroke="#00ccdd" stroke-width="1" opacity="0.7"/>

  <!-- ═══ REAR DIFFUSER ═══ -->
  <path d="M15,94 Q26,99 37,94 L39,100 Q26,106 13,100 Z" fill="#07080a"/>
  <line x1="18" y1="95" x2="17" y2="100" stroke="#0044aa" stroke-width="0.8" opacity="0.5"/>
  <line x1="21" y1="96" x2="21" y2="101" stroke="#0044aa" stroke-width="0.8" opacity="0.5"/>
  <line x1="24" y1="97" x2="24" y2="102" stroke="#0044aa" stroke-width="0.8" opacity="0.5"/>
  <line x1="26" y1="97" x2="26" y2="102" stroke="#0044aa" stroke-width="0.8" opacity="0.5"/>
  <line x1="28" y1="97" x2="28" y2="102" stroke="#0044aa" stroke-width="0.8" opacity="0.5"/>
  <line x1="31" y1="96" x2="31" y2="101" stroke="#0044aa" stroke-width="0.8" opacity="0.5"/>
  <line x1="34" y1="95" x2="35" y2="100" stroke="#0044aa" stroke-width="0.8" opacity="0.5"/>

  <!-- ═══ TAIL LIGHTS (top view: thin bars at rear corners) ═══ -->
  <path d="M8,88 L13,86 L14,95 L8,96 Z" fill="#110000"/>
  <rect x="9" y="87" width="4" height="8" rx="0.4" fill="#cc1100" opacity="0.9"/>
  <line x1="10.5" y1="88" x2="10.5" y2="94" stroke="#ff2200" stroke-width="0.7" opacity="0.8"/>
  <line x1="12"   y1="88" x2="12"   y2="94" stroke="#ff2200" stroke-width="0.7" opacity="0.6"/>

  <path d="M44,88 L39,86 L38,95 L44,96 Z" fill="#110000"/>
  <rect x="39" y="87" width="4" height="8" rx="0.4" fill="#cc1100" opacity="0.9"/>
  <line x1="40.5" y1="88" x2="40.5" y2="94" stroke="#ff2200" stroke-width="0.7" opacity="0.8"/>
  <line x1="42"   y1="88" x2="42"   y2="94" stroke="#ff2200" stroke-width="0.7" opacity="0.6"/>

  <!-- ═══ EXHAUST PIPES (top view: two circles at rear center) ═══ -->
  <ellipse cx="22" cy="100" rx="2.5" ry="2" fill="#111"/>
  <ellipse cx="22" cy="100" rx="1.8" ry="1.4" fill="#1a1a1a"/>
  <ellipse cx="30" cy="100" rx="2.5" ry="2" fill="#111"/>
  <ellipse cx="30" cy="100" rx="1.8" ry="1.4" fill="#1a1a1a"/>

  <!-- ═══ WHEELS — top view shows only outer edge of tyre ═══ -->
  <!-- From above: tyre is a thick ellipse, rim visible as inner circle -->
  <!-- Front Left -->
  <g id="wfl">
    <ellipse cx="8"  cy="22" rx="6"   ry="9"   fill="url(#tireT)"/>
    <ellipse cx="8"  cy="22" rx="4.5" ry="7.5" fill="url(#rimT)"/>
    <ellipse cx="8"  cy="22" rx="2.5" ry="4.5" fill="#111"/>
    <g id="spk-fl" stroke="#777" stroke-width="1" stroke-linecap="round">
      <line x1="8" y1="13.5" x2="8" y2="16"/>
      <line x1="8" y1="28"   x2="8" y2="30.5"/>
      <line x1="3.5" y1="16.5" x2="5" y2="18.5"/>
      <line x1="11"  y1="25.5" x2="12.5" y2="27.5"/>
      <line x1="12.5" y1="16.5" x2="11" y2="18.5"/>
      <line x1="5"    y1="25.5" x2="3.5" y2="27.5"/>
    </g>
    <ellipse cx="8" cy="22" rx="1.5" ry="2.5" fill="#888"/>
    <!-- Brake caliper (red dot visible from top) -->
    <ellipse cx="8" cy="18" rx="1.5" ry="1.2" fill="#cc2200" opacity="0.9"/>
  </g>
  <!-- Front Right -->
  <g id="wfr">
    <ellipse cx="44" cy="22" rx="6"   ry="9"   fill="url(#tireT)"/>
    <ellipse cx="44" cy="22" rx="4.5" ry="7.5" fill="url(#rimT)"/>
    <ellipse cx="44" cy="22" rx="2.5" ry="4.5" fill="#111"/>
    <g id="spk-fr" stroke="#777" stroke-width="1" stroke-linecap="round">
      <line x1="44" y1="13.5" x2="44" y2="16"/>
      <line x1="44" y1="28"   x2="44" y2="30.5"/>
      <line x1="39.5" y1="16.5" x2="41" y2="18.5"/>
      <line x1="47"   y1="25.5" x2="48.5" y2="27.5"/>
      <line x1="48.5" y1="16.5" x2="47"   y2="18.5"/>
      <line x1="41"   y1="25.5" x2="39.5" y2="27.5"/>
    </g>
    <ellipse cx="44" cy="22" rx="1.5" ry="2.5" fill="#888"/>
    <ellipse cx="44" cy="18" rx="1.5" ry="1.2" fill="#cc2200" opacity="0.9"/>
  </g>
  <!-- Rear Left (slightly wider) -->
  <g id="wrl">
    <ellipse cx="8"  cy="84" rx="6.5" ry="10"  fill="url(#tireT)"/>
    <ellipse cx="8"  cy="84" rx="5"   ry="8.2" fill="url(#rimT)"/>
    <ellipse cx="8"  cy="84" rx="2.8" ry="5"   fill="#111"/>
    <g id="spk-rl" stroke="#777" stroke-width="1.1" stroke-linecap="round">
      <line x1="8" y1="74"   x2="8" y2="76.5"/>
      <line x1="8" y1="91.5" x2="8" y2="94"/>
      <line x1="3"   y1="77.5" x2="4.8" y2="79.8"/>
      <line x1="11.2" y1="88.2" x2="13" y2="90.5"/>
      <line x1="13"   y1="77.5" x2="11.2" y2="79.8"/>
      <line x1="4.8"  y1="88.2" x2="3"    y2="90.5"/>
    </g>
    <ellipse cx="8" cy="84" rx="1.8" ry="3" fill="#888"/>
    <ellipse cx="8" cy="80" rx="1.5" ry="1.2" fill="#cc2200" opacity="0.9"/>
  </g>
  <!-- Rear Right -->
  <g id="wrr">
    <ellipse cx="44" cy="84" rx="6.5" ry="10"  fill="url(#tireT)"/>
    <ellipse cx="44" cy="84" rx="5"   ry="8.2" fill="url(#rimT)"/>
    <ellipse cx="44" cy="84" rx="2.8" ry="5"   fill="#111"/>
    <g id="spk-rr" stroke="#777" stroke-width="1.1" stroke-linecap="round">
      <line x1="44" y1="74"   x2="44" y2="76.5"/>
      <line x1="44" y1="91.5" x2="44" y2="94"/>
      <line x1="39"   y1="77.5" x2="40.8" y2="79.8"/>
      <line x1="47.2" y1="88.2" x2="49"   y2="90.5"/>
      <line x1="49"   y1="77.5" x2="47.2" y2="79.8"/>
      <line x1="40.8" y1="88.2" x2="39"   y2="90.5"/>
    </g>
    <ellipse cx="44" cy="84" rx="1.8" ry="3" fill="#888"/>
    <ellipse cx="44" cy="80" rx="1.5" ry="1.2" fill="#cc2200" opacity="0.9"/>
  </g>
</svg>`;
  wrap.appendChild(carEl);

  // ── Wheel spin (top-view: rotate spoke groups around wheel centers) ──────
  let wheelAngle = 0;
  let wheelSpeed = 0;

  function updateWheels() {
    wheelAngle = (wheelAngle + wheelSpeed) % 360;
    [['spk-fl',8,22],['spk-fr',44,22],['spk-rl',8,84],['spk-rr',44,84]].forEach(([id,cx,cy]) => {
      const el = carEl.querySelector(`#${id}`);
      if (el) el.setAttribute('transform', `rotate(${wheelAngle},${cx},${cy})`);
    });
  }

  // ── Dark mode ────────────────────────────────────────────────────────────
  let isDark = false, lightsOverride = null;

  function detectDark() {
    if (lightsOverride !== null) return lightsOverride;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return true;
    try {
      const bg = window.getComputedStyle(document.documentElement).backgroundColor;
      const m = bg.match(/[\d.]+/g);
      if (m && m.length >= 3) {
        const lum = (parseInt(m[0])*299+parseInt(m[1])*587+parseInt(m[2])*114)/1000;
        if (lum < 80) return true;
      }
    } catch(e){}
    return false;
  }

  function applyMode() {
    isDark = detectDark();
    ['l','r'].forEach(s => {
      carEl.querySelector(`#hl-${s}-on`).setAttribute('opacity',  isDark ? '0.9':'0');
      carEl.querySelector(`#hl-${s}-hot`).setAttribute('opacity', isDark ? '1':'0');
      carEl.querySelector(`#hl-${s}-off`).setAttribute('opacity', isDark ? '0':'1');
      carEl.querySelector(`#drl-${s}`).setAttribute('stroke',     isDark ? 'white':'#003355');
      carEl.querySelector(`#drl-${s}`).setAttribute('opacity',    isDark ? '1':'0.7');
    });
    if (wrap.classList.contains('on'))
      isDark ? beamEl.classList.add('on') : beamEl.classList.remove('on');
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyMode);
  setTimeout(applyMode,400); setTimeout(applyMode,1200);
  chrome.storage.local.get(['lightsOn'],({lightsOn})=>{
    if(lightsOn===true) lightsOverride=true;
    if(lightsOn===false) lightsOverride=false;
    applyMode();
  });
  applyMode();

  // ── Scroll ───────────────────────────────────────────────────────────────
  let lastScroll=window.pageYOffset, currentRot=180, targetRot=180;
  let scrollTimer=null, isActive=false, raf=null, spinRaf=null;

  function applyRot(deg) {
    carEl.style.transform  = `rotate(${deg}deg)`;
    beamEl.style.transform = `rotate(${deg}deg)`;
    exhaustEl.style.transform = `rotate(${deg+180}deg)`;
  }

  function spinLoop() {
    updateWheels();
    spinRaf = requestAnimationFrame(spinLoop);
  }

  function updatePos() {
    const scrollTop = window.pageYOffset||document.documentElement.scrollTop;
    const docH = document.documentElement.scrollHeight-window.innerHeight;
    const pct  = docH>0 ? Math.min(1,Math.max(0,scrollTop/docH)) : 0;
    const vh   = window.innerHeight;
    const pad  = 65;
    wrap.style.top = (pad+pct*(vh-pad*2))+'px';

    const thumbH = Math.max(28,(vh/document.documentElement.scrollHeight)*vh);
    thumb.style.height = thumbH+'px';
    thumb.style.top    = (pct*(vh-thumbH))+'px';

    const delta = scrollTop-lastScroll;
    if (Math.abs(delta)>0.5) {
      targetRot   = delta>0 ? 180 : 0;
      wheelSpeed  = Math.min(Math.abs(delta)*1.8, 20);
    } else {
      wheelSpeed = Math.max(wheelSpeed-0.5,0);
    }
    lastScroll = scrollTop;
    currentRot = targetRot;
    applyRot(currentRot);
  }

  function startScrolling() {
    if (isActive) return;
    isActive=true; applyMode();
    wrap.classList.add('on');
    thumb.classList.add('hidden');
    exhaustEl.classList.add('on');
    document.body.classList.add('bugatti-active');
    if (isDark) beamEl.classList.add('on');
    if (!spinRaf) spinLoop();
  }

  function stopScrolling() {
    isActive=false;
    wrap.classList.remove('on');
    thumb.classList.remove('hidden');
    exhaustEl.classList.remove('on');
    beamEl.classList.remove('on');
    document.body.classList.remove('bugatti-active');
    wheelSpeed=0;
    if (spinRaf){cancelAnimationFrame(spinRaf);spinRaf=null;}
  }

  window.addEventListener('scroll',function(){
    if (!gearScrollRaf) {
      startScrolling();
      if(raf) cancelAnimationFrame(raf);
      raf=requestAnimationFrame(updatePos);
      clearTimeout(scrollTimer);
      scrollTimer=setTimeout(stopScrolling,900);
    } else {
      if(raf) cancelAnimationFrame(raf);
      raf=requestAnimationFrame(updatePos);
    }
  },{passive:true});

  // ── GEAR SELECTOR ──────────────────────────────────────────────────────
  const GEAR_SPEEDS = { '1':2, '2':5, '3':10, '4':18, '5':28 };
  let activeGear = null, gearScrollRaf = null, gearPopupOpen = false;
  let reverseMode = false;  // R is a toggle — when ON, gears go in reverse direction

  const gearStyle = document.createElement('style');
  gearStyle.textContent = `
    #bugatti-gear-popup {
      position: fixed;
      z-index: 2147483647;
      background: linear-gradient(160deg,#1a1c20 0%,#0d0f12 100%);
      border: 1px solid rgba(0,200,220,0.5);
      border-radius: 14px;
      padding: 14px 12px 10px;
      box-shadow: 0 0 24px rgba(0,200,220,0.25),0 8px 32px rgba(0,0,0,0.8);
      pointer-events: all;
      user-select: none;
      min-width: 130px;
    }
    #bugatti-gear-popup .gear-title {
      color:#00ccdd;font:700 10px/1 Arial,sans-serif;
      letter-spacing:2px;text-align:center;margin-bottom:10px;text-transform:uppercase;
    }
    #bugatti-gear-popup .gear-grid {
      display:grid;grid-template-columns:repeat(3,1fr);gap:6px;
    }
    #bugatti-gear-popup .gear-btn {
      background:#1e2125;border:1px solid rgba(0,200,220,0.3);border-radius:8px;
      color:#aaa;font:700 16px/1 Arial;padding:9px 0;text-align:center;cursor:pointer;
      transition:all 0.15s;
    }
    #bugatti-gear-popup .gear-btn:hover {
      background:#252830;border-color:#00ccdd;color:#00ccdd;
      box-shadow:0 0 8px rgba(0,200,220,0.4);
    }
    #bugatti-gear-popup .gear-btn.active {
      background:linear-gradient(135deg,#003344,#005566);
      border-color:#00ccdd;color:#00ffee;
      box-shadow:0 0 14px rgba(0,200,220,0.7);
    }
    #bugatti-gear-popup .gear-btn.gear-r { color:#ff4422;border-color:rgba(255,60,20,0.4); }
    #bugatti-gear-popup .gear-btn.gear-r:hover,
    #bugatti-gear-popup .gear-btn.gear-r.active {
      background:linear-gradient(135deg,#330a00,#550e00);
      border-color:#ff3300;color:#ff6644;
      box-shadow:0 0 12px rgba(255,60,20,0.5);
    }
    #bugatti-gear-popup .gear-reverse-row {
      margin-bottom:8px;
    }
    #bugatti-gear-popup .gear-reverse-row .gear-btn {
      width:100%;box-sizing:border-box;letter-spacing:2px;font-size:13px;
      padding:8px 0;
    }

    #bugatti-gear-popup .gear-speed-bar {
      margin-top:10px;height:4px;background:#111;border-radius:2px;overflow:hidden;
    }
    #bugatti-gear-popup .gear-speed-fill {
      height:100%;border-radius:2px;
      background:linear-gradient(90deg,#005566,#00ccdd);
      transition:width 0.3s ease;width:0%;
    }
    #bugatti-gear-popup .gear-label {
      color:#445;font:500 9px/1 Arial;text-align:center;margin-top:6px;letter-spacing:1px;
    }
  `;
  document.head.appendChild(gearStyle);

  const popup = document.createElement('div');
  popup.id = 'bugatti-gear-popup';
  popup.style.display = 'none';
  popup.innerHTML = `
    <div class="gear-title">&#9881; GEARBOX</div>
    <div class="gear-reverse-row">
      <div class="gear-btn gear-r" id="gear-reverse-toggle">R &nbsp;OFF</div>
    </div>
    <div class="gear-grid">
      <div class="gear-btn" data-gear="1">1</div>
      <div class="gear-btn" data-gear="2">2</div>
      <div class="gear-btn" data-gear="3">3</div>
      <div class="gear-btn" data-gear="4">4</div>
      <div class="gear-btn" data-gear="5">5</div>
    </div>
    <div class="gear-speed-bar"><div class="gear-speed-fill" id="gear-speed-fill"></div></div>
    <div class="gear-label" id="gear-label-txt">CLICK CAR TO SHIFT</div>
  `;
  document.body.appendChild(popup);

  function positionPopup() {
    const popW=154, popH=195;
    let top = parseInt(wrap.style.top||'200') - popH/2;
    top = Math.max(8, Math.min(top, window.innerHeight - popH - 8));
    popup.style.left = (window.innerWidth - popW - 22) + 'px';
    popup.style.top  = top + 'px';
  }

  function openPopup()  { gearPopupOpen=true;  positionPopup(); popup.style.display='block'; }
  function closePopup() { gearPopupOpen=false; popup.style.display='none'; }

  function setGear(gear) {
    popup.querySelectorAll('.gear-btn').forEach(b=>b.classList.remove('active'));
    if (gear) {
      const btn = popup.querySelector('[data-gear="'+gear+'"]');
      if (btn) btn.classList.add('active');
    }
    const fill = document.getElementById('gear-speed-fill');
    const label = document.getElementById('gear-label-txt');
    if (fill) {
      const gears=['1','2','3','4','5'];
      const pct = gear==='R' ? 20 : gear ? (gears.indexOf(gear)+1)/5*100 : 0;
      fill.style.width = pct+'%';
      fill.style.background = gear==='R'
        ? 'linear-gradient(90deg,#550000,#ff3300)'
        : 'linear-gradient(90deg,#005566,#00ccdd)';
    }
    if (label) {
      const names={'1':'1ST GEAR','2':'2ND GEAR','3':'3RD GEAR','4':'4TH GEAR','5':'5TH GEAR'};
      const rev = reverseMode ? ' ↑ REV' : '';
      label.textContent = gear ? (names[gear]+rev) : 'CLICK CAR TO SHIFT';
    }

    activeGear = gear;
    if (gearScrollRaf) { cancelAnimationFrame(gearScrollRaf); gearScrollRaf=null; }
    if (!gear) { stopScrolling(); return; }

    const baseSpeed = GEAR_SPEEDS[gear];
    const speed = reverseMode ? -baseSpeed : baseSpeed;
    targetRot = speed>0 ? 180 : 0;
    currentRot = targetRot;
    applyRot(currentRot);
    wheelSpeed = Math.abs(speed)*1.2;
    startScrolling();
    if (!spinRaf) spinLoop();

    function gearScroll() {
      const scrollTop = window.pageYOffset||document.documentElement.scrollTop;
      const docH = document.documentElement.scrollHeight-window.innerHeight;
      if ((speed>0 && scrollTop>=docH)||(speed<0 && scrollTop<=0)) {
        setGear(null); return;
      }
      window.scrollBy(0,speed);
      updatePos();
      gearScrollRaf = requestAnimationFrame(gearScroll);
    }
    gearScrollRaf = requestAnimationFrame(gearScroll);
    closePopup();
  }

  function toggleReverse() {
    reverseMode = !reverseMode;
    const btn = document.getElementById('gear-reverse-toggle');
    if (reverseMode) {
      btn.classList.add('active');
      btn.textContent = 'R  ON';
    } else {
      btn.classList.remove('active');
      btn.textContent = 'R  OFF';
    }
    // If currently moving, flip direction immediately
    if (activeGear) setGear(activeGear);
  }

  popup.querySelectorAll('.gear-btn[data-gear]').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); setGear(btn.dataset.gear); });
  });
  document.getElementById('gear-reverse-toggle').addEventListener('click', e => {
    e.stopPropagation(); toggleReverse();
  });


  // Make car clickable
  wrap.style.pointerEvents = 'all';
  wrap.addEventListener('click', e => {
    e.stopPropagation();
    if (gearScrollRaf) { setGear(null); return; }  // clicking while moving = stop
    gearPopupOpen ? closePopup() : openPopup();
  });
  // Any click outside popup/car stops auto-scroll and closes popup
  document.addEventListener('click', e => {
    if (gearPopupOpen && !popup.contains(e.target)) closePopup();
    if (gearScrollRaf && !popup.contains(e.target) && !wrap.contains(e.target)) {
      setGear(null);
    }
  });

  // Any keypress stops auto-scroll
  document.addEventListener('keydown', () => {
    if (gearScrollRaf) setGear(null);
  });

  // Manual wheel/trackpad scroll stops auto-scroll
  window.addEventListener('wheel', () => {
    if (gearScrollRaf) setGear(null);
  }, { passive: true });

  updatePos();
  setTimeout(()=>startScrolling(),500);
  setTimeout(()=>stopScrolling(),1800);
})();
