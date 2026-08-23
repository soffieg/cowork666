/* 合阳木偶脸谱 · SVG 部件库
 * viewBox 0 0 200 235：脸廓 + 额纹 + 眉毛 + 眼睛 + 鼻 + 嘴 + 颊 分层组合
 * 每个部件独立配色（parts = {pattern,brow,eyes,nose,mouth,cheek}.color）
 */
const FaceKit = (() => {
  const PALETTE = {
    "红": "#d43020", "白": "#f5f2ed", "黑": "#20140f", "黄": "#d99a1f",
    "橙": "#d97b1f", "青": "#2a7d80", "金": "#c9a227", "粉": "#e04a3f",
    "浅黄": "#f0c9a8", "浅绿": "#8fb573", "橙棕": "#c56e35", "绿": "#3a8f56", "蓝": "#3a6aa0"
  };
  const PALETTE_LIST = Object.entries(PALETTE).map(([name, hex]) => ({ name, hex }));
  const EYEWHITE = "#f9f7f2";
  const PUPIL = "#241c16"; // 眼珠固定深色，保证任何底色上都有对比度

  function lum(hex) {
    const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function inkOf(base) { return lum(base) > 0.55 ? "#1c1512" : "#f6f2ea"; }

  // ---- 脸型轮廓（较开阔、去“过长”）----
  const SHAPES = {
    fang:  "M100 40 C138 40 158 60 158 96 L158 140 C158 172 138 194 100 194 C62 194 42 172 42 140 L42 96 C42 60 62 40 100 40 Z",
    yuan:  "M100 40 C144 40 160 66 160 108 C160 150 140 198 100 198 C60 198 40 150 40 108 C40 66 56 40 100 40 Z",
    chang: "M100 34 C132 34 148 56 148 90 L148 140 C148 176 128 200 100 200 C72 200 52 176 52 140 L52 90 C52 56 68 34 100 34 Z",
    chou:  "M100 44 C144 44 158 70 158 106 C158 144 140 192 100 192 C60 192 42 144 42 106 C42 70 56 44 100 44 Z",
    hou:   "M100 42 C142 42 160 70 160 104 C160 140 144 186 100 190 C56 186 40 140 40 104 C40 70 58 42 100 42 Z",
    zhu:   "M100 38 C136 38 152 58 152 84 C174 90 182 114 178 136 C172 140 158 130 152 122 C153 148 146 174 134 187 C122 194 112 195 100 195 C88 195 78 194 66 187 C54 174 47 148 48 122 C42 130 28 140 22 136 C18 114 26 90 48 84 C48 58 64 38 100 38 Z"
  };
  const shapePath = id => SHAPES[id];

  // ---- 额部纹样 ----
  function pattern(p, c) {
    const sw = a => `stroke="${c}" stroke-width="${a}"`;
    switch (p) {
      case "none": return "";
      case "tongtian": return `
        <path d="M100 46 C105 60 109 76 109 90 L109 104 C109 109 91 109 91 104 L91 90 C91 76 95 60 100 46 Z" fill="${c}"/>
        <path d="M86 64 C79 72 75 82 77 92" ${sw("3.4")} fill="none" stroke-linecap="round"/>
        <path d="M114 64 C121 72 125 82 123 92" ${sw("3.4")} fill="none" stroke-linecap="round"/>`;
      case "flame": return `
        <path d="M100 50 C105 59 111 63 111 71 C111 80 106 85 100 85 C94 85 89 80 89 71 C89 63 95 59 100 50 Z" fill="${c}"/>
        <path d="M82 62 C79 70 81 76 86 81 M118 62 C121 70 119 76 114 81" ${sw("3")} fill="none" stroke-linecap="round"/>`;
      case "crescent": return `
        <path d="M112 52 A27 27 0 1 0 112 104 A21 21 0 1 1 112 52 Z" fill="${c}"/>`;
      case "pearl": return `
        <g fill="${c}">
          <circle cx="100" cy="76" r="8"/>
          <circle cx="100" cy="60" r="6"/>
          <circle cx="114" cy="71" r="6"/>
          <circle cx="109" cy="88" r="6"/>
          <circle cx="91" cy="88" r="6"/>
          <circle cx="86" cy="71" r="6"/>
        </g>`;
      case "luoxuan": return `
        <path d="M100 80 L101.9 80.4 L102.0 80.9 L101.9 81.4 L101.7 81.9 L101.4 82.4 L100.9 82.8 L100.3 83.1 L99.7 83.3 L98.9 83.3 L98.2 83.2 L97.4 82.9 L96.7 82.4 L96.1 81.7 L95.7 80.9 L95.4 80.0 L95.3 79.0 L95.4 78.0 L95.8 76.9 L96.4 76.0 L97.2 75.2 L98.2 74.5 L99.4 74.1 L100.6 73.9 L102.0 74.0 L103.3 74.4 L104.5 75.0 L105.6 75.9 L106.5 77.1 L107.1 78.5 L107.5 80.0 L107.5 81.6 L107.2 83.2 L106.5 84.7 L105.5 86.1 L104.2 87.3 L102.7 88.2 L100.9 88.7 L99.1 88.9 L97.2 88.7 L95.3 88.1 L93.6 87.1 L92.1 85.7 L90.9 84.0 L90.1 82.1 L89.7 80.0 L89.7 77.8 L90.2 75.7 L91.2 73.6 L92.6 71.8 L94.4 70.3 L96.5 69.1 L98.8 68.4 L101.2 68.3 L103.7 68.6 L106.1 69.4 L108.3 70.8 L110.2 72.6 L111.7 74.8 L112.7 77.3 L113.1 80.0 L113.0 82.8 L112.3 85.5 L111.1 88.1 L109.3 90.3 L107.0 92.2 L104.4 93.6 L101.5 94.4 L98.5 94.6 L95.4 94.1 L92.5 93.0 L89.8 91.3 L87.5 89.1 L85.8 86.3 L84.6 83.3 L84.0 80.0 L84.2 76.6 L85.1 73.4 L86.6 70.3 L88.8 67.6 L91.5 65.4 L94.7 63.7 L98.2 62.8 L101.8 62.6 L105.5 63.2 L108.9 64.5 L112.1 66.6 L114.8 69.3 L116.8 72.5 L118.2 76.1 L118.8 80.0" fill="none" ${sw("3.4")} stroke-linecap="round"/>`;
      case "tianyan": return `
        <path d="M100 56 C95 68 95 94 100 102 C105 94 105 68 100 56 Z" fill="none" ${sw("3.2")} stroke-linejoin="round"/>
        <ellipse cx="100" cy="82" rx="3.4" ry="8" fill="${c}"/>`;
      case "juanyun": return `
        <path d="M100 62 C90 50 74 54 72 68 C70 80 82 86 88 78 C84 90 96 96 100 88 C104 96 116 90 112 78 C118 86 130 80 128 68 C126 54 110 50 100 62 Z" fill="none" ${sw("3.4")} stroke-linejoin="round"/>`;
      case "dieyun": return `
        <g fill="${c}">
          <path d="M100 56 C110 50 122 56 120 66 C126 64 132 70 128 78 C120 82 80 82 72 78 C68 70 74 64 80 66 C78 56 90 50 100 56 Z" opacity=".9"/>
          <path d="M100 74 C109 69 118 74 116 82 C122 80 126 86 122 92 C115 95 85 95 78 92 C74 86 78 80 84 82 C82 74 91 69 100 74 Z" opacity=".95"/>
        </g>`;
      case "bagua": return `
        <path d="M82 74 C74 84 79 95 95 100 M118 74 C126 84 121 95 105 100" fill="none" ${sw("3.2")} stroke-linecap="round"/>`;
      case "taiji": return `
        <path d="M100 60 a18 18 0 1 0 0 36 a9 9 0 1 1 0 -18 a9 9 0 1 0 0 -18 Z" fill="${c}"/>
        <circle cx="100" cy="69" r="2.4" fill="${c}"/>
        <circle cx="100" cy="87" r="2.4" fill="${c}"/>`;
      case "shou": return `
        <g fill="${c}">
          <circle cx="100" cy="68" r="2.6"/>
          <circle cx="100" cy="80" r="2.6"/>
          <circle cx="100" cy="92" r="2.6"/>
        </g>`;
      case "ruyi": return `
        <path d="M100 54 C112 54 118 62 114 70 C123 68 129 75 127 83 C131 89 124 95 116 93 C110 100 90 100 84 93 C76 95 69 89 73 83 C71 75 77 68 86 70 C82 62 88 54 100 54 Z" fill="none" ${sw("3.4")} stroke-linejoin="round"/>
        <path d="M100 93 L100 104" ${sw("3")} stroke-linecap="round"/>`;
      case "lotus": return `
        <g fill="${c}">
          <path d="M100 64 C106 73 106 88 100 97 C94 88 94 73 100 64 Z"/>
          <path d="M87 71 C93 78 94 89 89 95 C83 91 81 80 87 71 Z" opacity=".85"/>
          <path d="M113 71 C107 78 106 89 111 95 C117 91 119 80 113 71 Z" opacity=".85"/>
          <path d="M78 84 C82 88 82 94 78 97 C74 94 74 88 78 84 Z" opacity=".7"/>
          <path d="M122 84 C118 88 118 94 122 97 C126 94 126 88 122 84 Z" opacity=".7"/>
        </g>`;
      case "tiger": return `
        <path d="M88 66 L96 92 M100 64 L100 92 M112 66 L104 92" ${sw("4")} fill="none" stroke-linecap="round"/>
        <path d="M84 58 L116 58" ${sw("3")} stroke-linecap="round"/>`;
      case "hui": return `
        <g fill="none" ${sw("3")}>
          <rect x="87" y="64" width="26" height="26" rx="2"/>
          <rect x="93" y="70" width="14" height="14" rx="1"/>
        </g>`;
      case "bat": return `
        <path d="M100 70 C88 63 77 66 73 76 C69 84 76 88 84 84 C82 94 90 99 96 91 L100 85 L104 91 C110 99 118 94 116 84 C124 88 131 84 127 76 C123 66 112 63 100 70 Z" fill="${c}"/>`;
      case "xuanmao": return `
        <g fill="none" ${sw("2.6")} stroke-linecap="round">
          <path d="M80 56 Q100 42 120 56"/>
          <path d="M83 65 Q100 52 117 65"/>
          <circle cx="100" cy="76" r="5"/>
        </g>
        <path d="M73 52 C65 61 68 72 83 78 M127 52 C135 61 132 72 117 78" fill="none" stroke="#20140f" stroke-width="3" stroke-linecap="round"/>`;
      default: return "";
    }
  }

  // ---- 眉毛（独立于眼睛）----
  function brow(b, c) {
    const sw = a => `stroke="${c}" stroke-width="${a}"`;
    switch (b) {
      case "none": return "";
      case "jian": return `<path d="M50 108 Q69 111 88 117 M150 108 Q131 111 112 117" ${sw("3.8")} fill="none" stroke-linecap="round"/>`;
      case "wocan": return `<path d="M54 114 Q70 105 88 111 M146 114 Q130 105 112 111" ${sw("6")} fill="none" stroke-linecap="round"/>`;
      case "nu": return `<path d="M55 111 L84 120 M145 111 L116 120" ${sw("6")} fill="none" stroke-linecap="round"/>`;
      case "bazi": return `<path d="M60 108 Q72 118 84 115 M140 108 Q128 118 116 115" ${sw("5")} fill="none" stroke-linecap="round"/>`;
      case "changmei": return `<path d="M98 116 C82 112 66 108 50 110 M102 116 C118 112 134 108 150 110" ${sw("4")} fill="none" stroke-linecap="round"/>`;
      case "yunmei": return `<path d="M56 116 C68 108 84 110 88 118 M144 116 C132 108 116 110 112 118" ${sw("4")} fill="none" stroke-linecap="round"/>`;
      case "liuye": return `<path d="M88 117 Q70 111 54 117 M112 117 Q130 111 146 117" ${sw("3")} fill="none" stroke-linecap="round"/>`;
      default: return "";
    }
  }

  // ---- 眼睛 ----
  function eyes(e, c) {
    const sw = a => `stroke="${c}" stroke-width="${a}"`;
    const pupil = (cx, cy, r, hx, vy) => `
        <g class="pupil" data-hx="${hx}" data-vy="${vy}">
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="${PUPIL}"/>
          <circle cx="${(cx - r * 0.34).toFixed(1)}" cy="${(cy - r * 0.34).toFixed(1)}" r="${(r * 0.26).toFixed(2)}" fill="#ffffff" opacity=".9"/>
        </g>`;
    switch (e) {
      case "none": return "";
      case "ring": return `
        <circle cx="70" cy="132" r="12" fill="${EYEWHITE}" ${sw("3")}/>
        <circle cx="130" cy="132" r="12" fill="${EYEWHITE}" ${sw("3")}/>
        ${pupil(70, 132, 4.4, 5, 5)}
        ${pupil(130, 132, 4.4, 5, 5)}`;
      case "nu": return `
        <circle cx="70" cy="133" r="11" fill="${EYEWHITE}" ${sw("3.4")}/>
        <circle cx="130" cy="133" r="11" fill="${EYEWHITE}" ${sw("3.4")}/>
        ${pupil(70, 133, 4, 5, 4)}
        ${pupil(130, 133, 4, 5, 4)}`;
      case "heeye": return `
        <circle cx="70" cy="133" r="13" fill="${EYEWHITE}" ${sw("4.4")}/>
        <circle cx="130" cy="133" r="13" fill="${EYEWHITE}" ${sw("4.4")}/>
        ${pupil(70, 133, 6, 4, 4)}
        ${pupil(130, 133, 6, 4, 4)}`;
      case "diao": return `
        <path d="M50 120 Q72 116 90 133 Q72 144 50 120 Z" fill="${EYEWHITE}" ${sw("3.2")} stroke-linejoin="round"/>
        ${pupil(69, 129, 3.8, 6, 2)}
        <path d="M150 120 Q128 116 110 133 Q128 144 150 120 Z" fill="${EYEWHITE}" ${sw("3.2")} stroke-linejoin="round"/>
        ${pupil(131, 129, 3.8, 6, 2)}`;
      case "danfeng": return `
        <path d="M52 124 Q72 121 90 132 Q72 139 52 124 Z" fill="${EYEWHITE}" ${sw("2.8")} stroke-linejoin="round"/>
        ${pupil(71, 129, 3.2, 5, 1.5)}
        <path d="M148 124 Q128 121 110 132 Q128 139 148 124 Z" fill="${EYEWHITE}" ${sw("2.8")} stroke-linejoin="round"/>
        ${pupil(129, 129, 3.2, 5, 1.5)}`;
      case "baikuang": return `
        <ellipse cx="70" cy="133" rx="14" ry="12" fill="${EYEWHITE}" ${sw("2")}/>
        <ellipse cx="130" cy="133" rx="14" ry="12" fill="${EYEWHITE}" ${sw("2")}/>
        ${pupil(70, 133, 5, 6, 4)}
        ${pupil(130, 133, 5, 6, 4)}`;
      case "ximu": return `
        <path d="M56 130 Q70 127 84 130 Q70 136 56 130 Z" fill="${EYEWHITE}" ${sw("2.8")} stroke-linejoin="round"/>
        ${pupil(70, 131, 2.6, 3, 1.5)}
        <path d="M144 130 Q130 127 116 130 Q130 136 144 130 Z" fill="${EYEWHITE}" ${sw("2.8")} stroke-linejoin="round"/>
        ${pupil(130, 131, 2.6, 3, 1.5)}`;
      case "feng": return `
        <path d="M50 125 Q68 128 88 136 Q68 141 50 135 Z" fill="${EYEWHITE}" ${sw("3")} stroke-linejoin="round"/>
        ${pupil(66, 132, 4, 6, 2)}
        <path d="M150 125 Q132 128 112 136 Q132 141 150 135 Z" fill="${EYEWHITE}" ${sw("3")} stroke-linejoin="round"/>
        ${pupil(134, 132, 4, 6, 2)}`;
      case "hou": return `
        <ellipse cx="82" cy="121" rx="12" ry="8" fill="${EYEWHITE}" ${sw("2.6")} transform="rotate(9 82 121)"/>
        ${pupil(82, 119, 3.6, 3, 2.5)}
        <ellipse cx="118" cy="121" rx="12" ry="8" fill="${EYEWHITE}" ${sw("2.6")} transform="rotate(-9 118 121)"/>
        ${pupil(118, 119, 3.6, 3, 2.5)}`;
      case "danopen": return `
        <ellipse cx="68" cy="130" rx="17" ry="7.5" fill="${EYEWHITE}" ${sw("2.8")} transform="rotate(10 68 130)"/>
        ${pupil(66, 128, 3.8, 7, 2)}
        <ellipse cx="132" cy="130" rx="17" ry="7.5" fill="${EYEWHITE}" ${sw("2.8")} transform="rotate(-10 132 130)"/>
        ${pupil(134, 128, 3.8, 7, 2)}`;
      default: return "";
    }
  }

  // ---- 鼻子 ----
  function nose(n, c) {
    const sw = a => `stroke="${c}" stroke-width="${a}"`;
    switch (n) {
      case "none": return "";
      case "bridge": return `<path d="M97 120 L100 148 L103 120" fill="none" ${sw("3")}/><path d="M96 148 Q100 156 104 148" fill="none" ${sw("3")}/>`;
      case "dot": return `<ellipse cx="100" cy="150" rx="8" ry="7" fill="${c}"/>`;
      case "block": return `<path d="M92 142 L108 142 L108 154 L92 154 Z" fill="${c}"/>`;
      case "hook": return `<path d="M100 124 L100 150 Q100 158 90 158" fill="none" ${sw("3.4")} stroke-linecap="round"/>`;
      case "pig": return `<ellipse cx="100" cy="148" rx="15" ry="11" fill="none" ${sw("3")}/><circle cx="94" cy="148" r="2.8" fill="${c}"/><circle cx="106" cy="148" r="2.8" fill="${c}"/>`;
      default: return "";
    }
  }

  // ---- 嘴巴 ----
  function mouth(m, c) {
    const sw = a => `stroke="${c}" stroke-width="${a}"`;
    switch (m) {
      case "none": return "";
      case "min": return `<path d="M84 179 L116 179" ${sw("4")} stroke-linecap="round"/>`;
      case "wei": return `<path d="M82 176 Q100 189 118 176" fill="none" ${sw("4")} stroke-linecap="round"/>`;
      case "hong": return `<path d="M86 176 Q100 184 114 176 Q100 181 86 177 Z" fill="${c}"/>`;
      case "da": return `<path d="M78 172 Q100 189 122 172 Q100 180 78 172 Z" fill="${c}"/>`;
      case "chi": return `<path d="M78 176 Q100 180 122 176 Q113 183 100 184 Q87 183 78 176 Z" fill="${c}"/><path d="M84 178 Q100 181 116 178 L116 183 Q100 185 84 183 Z" fill="${EYEWHITE}"/><path d="M92 179 L92 183 M100 179 L100 184 M108 179 L108 183" stroke="${c}" stroke-width="1.1" opacity=".55" stroke-linecap="round"/>`;
      case "liao": return `<path d="M80 176 Q100 192 120 176 Q100 184 80 176 Z" fill="${c}"/><path d="M90 180 L94 189 L98 180 M102 180 L106 189 L110 180" fill="${EYEWHITE}"/>`;
      case "xiao": return `<path d="M68 168 C86 176 114 176 132 168 C125 183 112 187 100 187 C88 187 75 183 68 168 Z" fill="${c}"/><path d="M74 173 C88 178 112 178 126 173 L122 180 C109 183 91 183 78 180 Z" fill="${EYEWHITE}" opacity=".9"/>`;      case "tao": return `<path d="M90 180 Q94 176 97 178 Q100 181 103 178 Q106 176 110 180 Q111 185 100 187 Q89 185 90 180 Z" fill="${c}"/>`;
      default: return "";
    }
  }

  // ---- 脸颊 ----
  function cheek(k, c) {
    const sw = a => `stroke="${c}" stroke-width="${a}"`;
    switch (k) {
      case "none": return "";
      case "dian": return `<circle cx="56" cy="162" r="5" fill="${c}"/><circle cx="144" cy="162" r="5" fill="${c}"/>`;
      case "sai": return `<ellipse cx="58" cy="162" rx="9" ry="8" fill="${c}" opacity=".5"/><ellipse cx="142" cy="162" rx="9" ry="8" fill="${c}" opacity=".5"/>`;
      case "juan": return `<path d="M56 152 C48 156 48 168 56 172 C60 168 60 160 56 156 Z" fill="${c}" opacity=".85"/><path d="M144 152 C152 156 152 168 144 172 C140 168 140 160 144 156 Z" fill="${c}" opacity=".85"/>`;
      case "side": return `<path d="M50 150 L60 178 M150 150 L140 178" ${sw("4")} fill="none" stroke-linecap="round" opacity=".8"/>`;
      case "huadian": return `<circle cx="56" cy="160" r="5" fill="none" ${sw("2.4")}/><circle cx="144" cy="160" r="5" fill="none" ${sw("2.4")}/>`;
      default: return "";
    }
  }

  // ---- 主渲染 ----
  function render(state) {
    const hx = name => PALETTE[name] || name;    // 色名 → hex
    const base = hx(state.main);
    const ink = inkOf(base);
    const P = state.parts;
    const d = SHAPES[state.shape];
    return `<svg viewBox="0 0 200 235" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="合阳木偶脸谱">
      <defs><clipPath id="faceClip"><path d="${d}"/></clipPath></defs>
      <g id="faceRoot">
        <path d="${d}" fill="${base}" stroke="#20140f" stroke-width="3"/>
        <g clip-path="url(#faceClip)">
          ${state.shape === "hou" ? `<path d="M100 170 C72 150 54 118 62 96 C68 80 86 74 100 86 C114 74 132 80 138 96 C146 118 128 150 100 170 Z" fill="#c6392b" stroke="rgba(40,20,10,.25)" stroke-width="2"/>` : ""}
          ${pattern(P.pattern, hx(P.patternColor))}
          ${brow(P.brow, hx(P.browColor))}
          ${cheek(P.cheek, hx(P.cheekColor))}
        </g>
        <g id="eyeLayer">
          ${eyes(P.eyes, hx(P.eyesColor))}
          ${nose(P.nose, hx(P.noseColor))}
          ${mouth(P.mouth, hx(P.mouthColor))}
        </g>
      </g>
    </svg>`;
  }

  return {
    PALETTE, PALETTE_LIST, inkOf,
    render, shapePath,
    pattern, brow, drawEyes: eyes, nose, mouth, cheek,
    shapes: [
      { id: "fang",  label: "净 · 方正" },
      { id: "yuan",  label: "神将 · 圆脸" },
      { id: "chang", label: "文臣 · 长脸" },
      { id: "chou",  label: "丑角 · 圆脸" },
      { id: "hou",   label: "猴脸" },
      { id: "zhu",   label: "猪八戒 · 带耳" }
    ],
    patterns: [
      { id: "none",     label: "素面" },
      { id: "tongtian", label: "通天纹" },
      { id: "flame",    label: "火焰纹" },
      { id: "crescent", label: "月牙纹" },
      { id: "pearl",    label: "宝珠纹" },
      { id: "luoxuan",  label: "螺旋纹" },
      { id: "tianyan",  label: "天眼纹" },
      { id: "juanyun",  label: "卷云纹" },
      { id: "dieyun",   label: "叠云纹" },
      { id: "bagua",    label: "八卦纹" },
      { id: "taiji",    label: "太极纹" },
      { id: "shou",     label: "寿字纹" },
      { id: "ruyi",     label: "如意纹" },
      { id: "lotus",    label: "莲花纹" },
      { id: "tiger",    label: "白虎纹" },
      { id: "hui",      label: "回字纹" },
      { id: "bat",      label: "蝙蝠纹" },
      { id: "xuanmao",  label: "旋毛纹" }
    ],
    brows: [
      { id: "none",    label: "无眉" },
      { id: "jian",    label: "剑眉" },
      { id: "wocan",   label: "卧蚕眉" },
      { id: "nu",      label: "怒眉" },
      { id: "bazi",    label: "八字眉" },
      { id: "changmei",label: "长眉入鬓" },
      { id: "yunmei",  label: "云纹勾眉" },
      { id: "liuye",   label: "柳叶眉" }
    ],
    eyes: [
      { id: "none",    label: "无眼" },
      { id: "ring",    label: "环眼" },
      { id: "nu",      label: "怒目" },
      { id: "heeye",   label: "黑窝环眼" },
      { id: "diao",    label: "吊眼" },
      { id: "danfeng", label: "丹凤眼" },
      { id: "baikuang",label: "白眶眼" },
      { id: "ximu",    label: "细目" },
      { id: "feng",    label: "凤眼斜挑" },
      { id: "hou",    label: "猴眼" },
      { id: "danopen", label: "丹凤睁眼" }
    ],
    noses: [
      { id: "none",   label: "无鼻线" },
      { id: "bridge", label: "鼻梁" },
      { id: "dot",    label: "红鼻" },
      { id: "block",  label: "宽鼻块" },
      { id: "hook",   label: "勾鼻" },
      { id: "pig",    label: "猪鼻" }
    ],
    mouths: [
      { id: "none", label: "无嘴" },
      { id: "min",  label: "抿嘴" },
      { id: "wei",  label: "微笑" },
      { id: "hong", label: "红唇" },
      { id: "da",   label: "大笑" },
      { id: "chi",  label: "露齿" },
      { id: "liao", label: "獠牙" },
      { id: "xiao", label: "笑口" },
      { id: "tao", label: "樱桃小嘴" }
    ],
    cheeks: [
      { id: "none",    label: "素颊" },
      { id: "dian",    label: "点痣" },
      { id: "sai",     label: "颊红" },
      { id: "juan",    label: "卷纹" },
      { id: "side",    label: "侧纹" },
      { id: "huadian", label: "花钿" }
    ],
    // 各部件在按钮小图标里的取景框（viewBox）
    iconView: {
      shapes:  "22 34 156 172",
      patterns:"58 40 84 78",
      brows:   "42 104 116 26",
      eyes:    "44 118 112 30",
      noses:   "76 116 48 46",
      mouths:  "72 172 58 40",
      cheeks:  "32 140 136 58"
    },
    presets: [
      { id: "guan",   label: "关公 · 红面通天", state: { shape: "fang", main: "红", parts: { pattern: "tongtian", patternColor: "黑", brow: "nu", browColor: "黑", eyes: "ring", eyesColor: "黑", nose: "block", noseColor: "红", mouth: "hong", mouthColor: "红", cheek: "side", cheekColor: "黑" } } },
      { id: "bao",    label: "包公 · 黑面月牙", state: { shape: "fang", main: "黑", parts: { pattern: "crescent", patternColor: "红", brow: "yunmei", browColor: "白", eyes: "nu", eyesColor: "白", nose: "bridge", noseColor: "白", mouth: "hong", mouthColor: "红", cheek: "none", cheekColor: "白" } } },
      { id: "wukong", label: "悟空 · 猴脸旋毛", state: { shape: "hou", main: "橙棕", parts: { pattern: "xuanmao", patternColor: "白", brow: "changmei", browColor: "白", eyes: "ring", eyesColor: "黑", nose: "dot", noseColor: "红", mouth: "da", mouthColor: "红", cheek: "juan", cheekColor: "白" } } },
      { id: "yang",   label: "杨戬 · 天眼", state: { shape: "yuan", main: "橙", parts: { pattern: "tianyan", patternColor: "黑", brow: "jian", browColor: "黑", eyes: "diao", eyesColor: "黑", nose: "bridge", noseColor: "黑", mouth: "min", mouthColor: "红", cheek: "juan", cheekColor: "黑" } } },
      { id: "zhuguan",label: "悟空", state: { shape: "chou", main: "浅黄", parts: { pattern: "lotus", patternColor: "浅黄", brow: "jian", browColor: "黑", eyes: "danfeng", eyesColor: "黑", nose: "bridge", noseColor: "白", mouth: "hong", mouthColor: "红", cheek: "none", cheekColor: "白" } } }
    ]
  };
})();
