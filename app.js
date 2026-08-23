/* 合阳木偶脸谱 · 交互逻辑 */
(() => {
  const faceBox = document.getElementById("faceBox");
  const controls = document.getElementById("controls");
  const cardGrid = document.getElementById("cardGrid");
  const roleFilter = document.getElementById("roleFilter");
  const colorFilter = document.getElementById("colorFilter");
  const galleryCount = document.getElementById("galleryCount");

  const hex = name => FaceKit.PALETTE[name];
  const lum = hex => FaceKit.inkOf(hex) === "#f6f2ea" ? 1 : 0; // not used directly

  // ---------- 经典模板 ----------
  const TEMPLATES = [
    { id: "guan",     label: "关公 · 红面",   state: { shape: "fang", main: "红",   parts: { pattern: "tongtian", patternColor: "黑", brow: "nu", browColor: "黑", eyes: "diao", eyesColor: "黑", nose: "block", noseColor: "红", mouth: "hong", mouthColor: "红", cheek: "side", cheekColor: "黑" } } },
    { id: "bao",      label: "包拯 · 黑面",   state: { shape: "fang", main: "黑",   parts: { pattern: "crescent", patternColor: "红", brow: "jian", browColor: "白", eyes: "diao", eyesColor: "白", nose: "bridge", noseColor: "白", mouth: "min", mouthColor: "红", cheek: "none", cheekColor: "白" } } },
    { id: "xiaochou", label: "小丑 · 橙面",   state: { shape: "chou", main: "橙",   parts: { pattern: "flame", patternColor: "红", brow: "bazi", browColor: "黑", eyes: "baikuang", eyesColor: "黑", nose: "dot", noseColor: "红", mouth: "chi", mouthColor: "红", cheek: "dian", cheekColor: "黑" } } },
    { id: "guizu",    label: "鬼卒 · 青面",   state: { shape: "yuan", main: "青",   parts: { pattern: "luoxuan", patternColor: "红", brow: "nu", browColor: "红", eyes: "heeye", eyesColor: "黑", nose: "block", noseColor: "红", mouth: "liao", mouthColor: "红", cheek: "juan", cheekColor: "红" } } },
    { id: "xiaosheng",label: "小生 · 普通人", state: { shape: "fang", main: "白",   parts: { pattern: "none", patternColor: "黑", brow: "jian", browColor: "黑", eyes: "danfeng", eyesColor: "黑", nose: "bridge", noseColor: "白", mouth: "min", mouthColor: "红", cheek: "none", cheekColor: "白" } } },
    { id: "wukong",   label: "孙悟空",        state: { shape: "hou", main: "橙棕", parts: { pattern: "xuanmao", patternColor: "白", brow: "none", browColor: "白", eyes: "hou", eyesColor: "黑", nose: "dot", noseColor: "红", mouth: "xiao", mouthColor: "红", cheek: "juan", cheekColor: "白" } } },
    { id: "bajie",    label: "猪八戒",        state: { shape: "zhu", main: "绿",   parts: { pattern: "bagua", patternColor: "浅绿", brow: "diao", browColor: "黑", eyes: "feng", eyesColor: "黑", nose: "pig", noseColor: "浅绿", mouth: "chi", mouthColor: "红", cheek: "none", cheekColor: "白" } } },
    { id: "yang",     label: "杨戬 · 天眼",    state: { shape: "yuan", main: "橙",   parts: { pattern: "tianyan", patternColor: "黑", brow: "jian", browColor: "黑", eyes: "diao", eyesColor: "黑", nose: "dot", noseColor: "黑", mouth: "min", mouthColor: "红", cheek: "juan", cheekColor: "黑" } } },
    { id: "nvd",      label: "女娃旦",        state: { shape: "yuan", main: "浅黄", parts: { pattern: "shou", patternColor: "黑", brow: "liuye", browColor: "黑", eyes: "danfeng", eyesColor: "黑", nose: "bridge", noseColor: "浅黄", mouth: "tao", mouthColor: "红", cheek: "sai", cheekColor: "粉" } } }
  ];

  // ---------- 状态（默认＝关公）----------
  const DEFAULT = JSON.parse(JSON.stringify(TEMPLATES[0].state));
  let state = JSON.parse(JSON.stringify(DEFAULT));

  // 撤销栈：每次改动前压入，↺ 返回上一个脸谱；栈空则回默认关公
  const history = [];
  function pushHistory() {
    history.push(JSON.parse(JSON.stringify(state)));
    if (history.length > 20) history.shift();
  }
  function undo() {
    state = history.length ? history.pop() : JSON.parse(JSON.stringify(DEFAULT));
    renderControls();
    renderFace();
  }

  function renderFace() {
    faceBox.innerHTML = FaceKit.render(state);
  }

  // ---------- 部件分组定义 ----------
  const PART_KEYS = ["pattern", "brow", "eyes", "nose", "mouth", "cheek"];
  const GROUPS = [
    { key: "shape",   name: "脸形", colorOnly: false, part: null,  colorPart: null,      list: () => FaceKit.shapes,  icon: "shapes" },
    { key: "main",    name: "主色", colorOnly: true,  part: null,  colorPart: null,      list: null,                  icon: null },
    { key: "pattern", name: "额纹", colorOnly: false, part: "pattern", colorPart: "patternColor", list: () => FaceKit.patterns, icon: "patterns", draw: (i, c) => FaceKit.pattern(i, c) },
    { key: "brow",    name: "眉毛", colorOnly: false, part: "brow",  colorPart: "browColor",  list: () => FaceKit.brows, icon: "brows", draw: (i, c) => FaceKit.brow(i, c) },
    { key: "eyes",    name: "眼睛", colorOnly: false, part: "eyes",  colorPart: "eyesColor",  list: () => FaceKit.eyes, icon: "eyes", draw: (i, c) => FaceKit.drawEyes(i, c) },
    { key: "nose",    name: "鼻子", colorOnly: false, part: "nose",  colorPart: "noseColor",  list: () => FaceKit.noses, icon: "noses", draw: (i, c) => FaceKit.nose(i, c) },
    { key: "mouth",   name: "嘴巴", colorOnly: false, part: "mouth", colorPart: "mouthColor", list: () => FaceKit.mouths, icon: "mouths", draw: (i, c) => FaceKit.mouth(i, c) },
    { key: "cheek",   name: "脸颊", colorOnly: false, part: "cheek", colorPart: "cheekColor", list: () => FaceKit.cheeks, icon: "cheeks", draw: (i, c) => FaceKit.cheek(i, c) }
  ];

  function iconSVG(g, id) {
    const vb = FaceKit.iconView[g.icon];
    if (g.key === "shape") {
      return `<svg viewBox="${vb}"><path d="${FaceKit.shapePath(id)}" fill="${hex(state.main)}" stroke="#241c16" stroke-width="4"/></svg>`;
    }
    return `<svg viewBox="${vb}">${g.draw(id, hex(state.parts[g.colorPart]))}</svg>`;
  }

  function colorDots(activeName) {
    return FaceKit.PALETTE_LIST.map(p =>
      `<button class="col${p.name === activeName ? " active" : ""}" data-color="${p.name}" style="background:${p.hex}" title="${p.name}"></button>`
    ).join("");
  }

  function blockHTML(g) {
    if (g.colorOnly) {
      return `<div class="blk" data-g="${g.key}">
        <div class="blk-head"><span class="blk-name">${g.name} · 底色</span></div>
        <div class="cols">${colorDots(state.main)}</div>
      </div>`;
    }
    const cur = g.key === "shape" ? state.shape : state.parts[g.part];
    const opts = g.list().map(it =>
      `<button class="opt${it.id === cur ? " active" : ""}" data-id="${it.id}" title="${it.label}">${iconSVG(g, it.id)}</button>`
    ).join("");
    const colRow = g.part
      ? `<div class="cols">${colorDots(state.parts[g.colorPart])}</div>`
      : "";
    return `<div class="blk" data-g="${g.key}">
      <div class="blk-head"><span class="blk-name">${g.name}</span>${g.part ? `<span class="blk-color">${state.parts[g.colorPart]}</span>` : ""}</div>
      <div class="opts">${opts}</div>
      ${colRow}
    </div>`;
  }

  function renderControls() {
    const st = controls.scrollTop;
    const tplBlock = `<div class="blk"><div class="blk-head"><span class="blk-name">经典谱式</span></div><div class="opts tpls">${TEMPLATES.map(t => `<button class="tpl" data-template="${t.id}">${t.label}</button>`).join("")}</div></div>`;
    controls.innerHTML = tplBlock + GROUPS.map(blockHTML).join("");
    controls.scrollTop = st;
  }

  // 事件（委托 + 一次性绑定）
  controls.addEventListener("click", e => {
    const tpl = e.target.closest(".tpl");
    if (tpl) {
      const t = TEMPLATES.find(x => x.id === tpl.dataset.template);
      pushHistory();
      state = JSON.parse(JSON.stringify(t.state));
      renderControls();
      renderFace();
      return;
    }
    const blk = e.target.closest(".blk");
    if (!blk) return;
    const g = GROUPS.find(x => x.key === blk.dataset.g);
    const col = e.target.closest(".col");
    const opt = e.target.closest(".opt");
    if (col && g) {
      pushHistory();
      const c = col.dataset.color;
      if (g.colorOnly) state.main = c;
      else state.parts[g.colorPart] = c;
    } else if (opt && g) {
      pushHistory();
      const id = opt.dataset.id;
      if (g.key === "shape") state.shape = id;
      else state.parts[g.part] = id;
    } else {
      return;
    }
    renderControls();
    renderFace();
  });

  // ---------- 随机 / 复原 ----------
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  function contrastPaint(baseName) {
    const dark = FaceKit.inkOf(hex(baseName)) === "#f6f2ea"; // base is light
    const opts = dark ? ["黑", "红", "金", "青", "绿", "蓝"] : ["白", "红", "金", "橙", "青"];
    return pick(opts);
  }
  function randomize() {
    pushHistory();
    state.shape = pick(FaceKit.shapes).id;
    state.main = pick(FaceKit.PALETTE_LIST).name;
    const paint = contrastPaint(state.main);
    PART_KEYS.forEach(part => {
      const g = GROUPS.find(x => x.part === part);
      const opts = g.list().filter(x => x.id !== "none");   // 避免拼出空脸
      state.parts[part] = pick(opts).id;
      state.parts[part + "Color"] = paint;
    });
    renderControls();
    renderFace();
  }
  document.getElementById("btnRandom").addEventListener("click", randomize);
  document.getElementById("btnReset").addEventListener("click", undo);

  // ---------- 导出 ----------
  function download(blob, name) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
  }
  document.getElementById("btnSvg").addEventListener("click", () => {
    const svg = faceBox.querySelector("svg");
    download(new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml;charset=utf-8" }), "合阳木偶脸谱.svg");
  });
  document.getElementById("btnPng").addEventListener("click", async () => {
    const svg = faceBox.querySelector("svg");
    const xml = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(svg));
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = xml; });
    const W = 800, H = 940, canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, W, H);
    ctx.drawImage(img, 0, 0, W, H);
    canvas.toBlob(b => download(b, "合阳木偶脸谱.png"), "image/png");
  });

  // ---------- 图鉴 ----------
  const ROLE_GROUPS = [
    { id: "all",   label: "全部",     test: () => true },
    { id: "jing",  label: "净 · 花脸", test: f => /净/.test(f.role) },
    { id: "chou",  label: "丑角",     test: f => /丑/.test(f.role) },
    { id: "sheng", label: "生角",     test: f => /生/.test(f.role) },
    { id: "dan",   label: "旦角",     test: f => /旦/.test(f.role) },
    { id: "huxi",  label: "猴戏",     test: f => /悟空|八戒/.test(f.name) }
  ];
  const filter = { role: "all", color: "" };

  function buildRoleFilter() {
    ROLE_GROUPS.forEach(g => {
      const b = document.createElement("button");
      b.className = "chip" + (g.id === "all" ? " active" : "");
      b.textContent = g.label;
      b.addEventListener("click", () => {
        filter.role = g.id;
        roleFilter.querySelectorAll(".chip").forEach(el => el.classList.toggle("active", el === b));
        renderGallery();
      });
      roleFilter.appendChild(b);
    });
  }
  function buildColorFilter() {
    const colors = [...new Set(FACES.map(f => f.main))];
    colors.forEach(c => {
      const o = document.createElement("option");
      o.value = c; o.textContent = c;
      colorFilter.appendChild(o);
    });
    colorFilter.addEventListener("change", () => {
      filter.color = colorFilter.value;
      renderGallery();
    });
  }
  function currentFaces() {
    const g = ROLE_GROUPS.find(x => x.id === filter.role);
    return FACES.filter(f => (filter.role === "all" || g.test(f)) && (!filter.color || f.main === filter.color));
  }
  function renderGallery() {
    const list = currentFaces();
    cardGrid.innerHTML = list.map(f => `
      <div class="card" data-id="${f.id}">
        <div class="card-inner">
          <div class="card-face card-front">
            <span class="card-no">${f.id}</span>
            <img src="${f.img}" alt="${f.name}" loading="lazy">
          </div>
          <div class="card-face card-back">
            <h4>${f.name}</h4>
            <div class="meta">行当：${f.role} · 主色：${f.main} · 配色：${f.accent}</div>
            ${f.story ? `<div class="story"><b>人物介绍</b><br>${f.story}</div>` : ""}
            ${f.tag ? `<div class="tag">${f.tag}</div>` : ""}
          </div>
        </div>
      </div>`).join("");
    galleryCount.textContent = `共 ${list.length} 式`;
  }
  cardGrid.addEventListener("click", e => {
    const card = e.target.closest(".card");
    if (card) card.classList.toggle("flipped");
  });

  // ---------- Tab 切换 ----------
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t === tab));
      document.querySelectorAll(".panel").forEach(p => p.classList.toggle("active", p.id === tab.dataset.tab));
    });
  });

  // ---------- 初始化 ----------
  renderControls();
  buildRoleFilter();
  buildColorFilter();
  renderGallery();
  renderFace();

  // ---------- 眼部 + 头部随鼠标三维追踪（柔和弹簧，参考 bloub） ----------
  (function followMouse() {
    let target = { x: 0, y: 0 };
    let cur = { x: 0, y: 0 }, vel = { x: 0, y: 0 };
    document.addEventListener("mousemove", e => {
      const r = faceBox.getBoundingClientRect();
      if (!r.width) return;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      target.x = Math.max(-1, Math.min(1, ((e.clientX - cx) / r.width) * 2.2));
      target.y = Math.max(-1, Math.min(1, ((e.clientY - cy) / r.height) * 2.5));
    });
    document.addEventListener("mouseleave", () => { target.x = 0; target.y = 0; });
    function frame() {
      // 阻尼弹簧：平滑带一点轻微回弹，接近 bloub 的"手感"
      vel.x = (vel.x + (target.x - cur.x) * 0.06) * 0.82;
      vel.y = (vel.y + (target.y - cur.y) * 0.06) * 0.82;
      cur.x += vel.x;
      cur.y += vel.y;
      // 瞳孔在眼眶内跟随，椭圆约束不越界
      const pupils = faceBox.querySelectorAll(".pupil");
      pupils.forEach(p => {
        const hx = +p.dataset.hx || 6, vy = +p.dataset.vy || 3;
        let dx = cur.x * hx, dy = cur.y * vy;
        const m = (dx / hx) * (dx / hx) + (dy / vy) * (dy / vy);
        if (m > 1) { const s = 1 / Math.sqrt(m); dx *= s; dy *= s; }
        p.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      });
      // 头轻柔转向，跟随鼠标：小幅 yaw + pitch 的三维倾斜
      const head = faceBox.querySelector("#faceRoot");
      if (head) {
        head.style.transform = `rotateY(${(cur.x * 9).toFixed(1)}deg) rotateX(${(-cur.y * 6).toFixed(1)}deg)`;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();
})();
