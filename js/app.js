"use strict";

/* =========================================================================
 * SUSS MA/BA6 Gen4 · MA/BA8 Gen4 配置器
 * 数据模型 + 渲染 + 交互逻辑（纯静态，GitHub Pages 友好）
 * ========================================================================= */

const MODELS = [
  { id: "maba6", name: "MA/BA6 Gen4", en: "Mask & Bond Aligner", automation: "Semi-Automated", wafer: '6"', tag: "标准 · 半自动" },
  { id: "maba8", name: "MA/BA8 Gen4", en: "Mask & Bond Aligner", automation: "Semi-Automated", wafer: '8"', tag: "标准 · 半自动" },
];

const SECTIONS = [
  {
    id: "exposure_area", zh: "曝光范围", en: "Exposure Area", type: "radio",
    options: [
      { id: "6round", zh: "6英寸圆形", en: '6" Round', models: ["maba6"] },
      { id: "6sq", zh: "6英寸方形", en: '6" Squared', models: ["maba6"] },
      { id: "8round", zh: "8英寸圆形", en: '8" Round', models: ["maba8"] },
      { id: "8sq", zh: "8英寸方形", en: '8" Squared', models: ["maba8"] },
    ],
  },
  {
    id: "alignment", zh: "对准方式", en: "Alignment Type", type: "radio",
    notes:
      "a. 共有三种对准方式：TSA 正面、BSA 背面、IR 红外。<br/>" +
      "b. BSA 采用背面光学显微镜成像，IR 通过透射式红外成像；一般 BSA 比 IR 兼容性更强，成像不受衬底材料组成影响。仅做背面对位建议选 BSA。<br/>" +
      "c. 若对准标记从上方和下方都无法观察到，可增配 IR 模块。",
    options: [
      { id: "tsa", zh: "TSA（仅正面）", en: "Top Side Alignment" },
      { id: "tsa_bsa", zh: "TSA + BSA（正面 + 背面）", en: "Top + Bottom Side Alignment" },
      { id: "bsa", zh: "BSA（仅背面）", en: "Bottom Side Alignment" },
      { id: "tsa_bsa_ir", zh: "TSA + BSA + IR", en: "Top + Bottom + Infrared Alignment" },
      { id: "ir_tsa", zh: "IR Visualization via TSA（红外背面光源，正面观察）", en: "Infrared Alignment via TSA" },
      { id: "ir_bsa", zh: "IR Visualization via BSA（红外正面光源，背面观察）", en: "Infrared Alignment via BSA" },
      { id: "none", zh: "No Alignment（不做对准）", en: "No Alignment" },
    ],
  },
  {
    id: "tsa_objective", zh: "TSA 物镜", en: "Objective for TSA", type: "radio",
    notes:
      "a. 大多数应用采用 5 倍物镜即可，光学放大 112 倍，视场 1.56×2.07 mm。<br/>" +
      "b. 对准标记特别小（<50 µm）可加 10 倍物镜，放大一倍，视场 0.78×1.04 mm。<br/>" +
      "c. 标准 5 倍与 10 倍物镜最小间隙 29 mm；需靠得更近可选 11.25X Offset（8 mm）或 7.2X Offset（13 mm）。",
    options: [
      { id: "5x", zh: "5X Standard 标准物镜", en: "5X Standard" },
      { id: "10x", zh: "10X Standard 标准物镜", en: "10X Standard" },
      { id: "11_25x", zh: "11.25X Offset 标准物镜", en: "11.25X Offset" },
      { id: "7_2x", zh: "7.2X Offset 标准物镜", en: "7.2X Offset" },
    ],
  },
  {
    id: "light_source", zh: "曝光光源", en: "UV Light Source", type: "radio",
    notes:
      "a. LED 灯非曝光时关闭，约 5000 h 后光强衰减至 70%，期望寿命 20000 h。<br/>" +
      "b. 高压汞灯非曝光时也需开启，开机寿命约 600 h。<br/>" +
      "c. LED 将取代汞灯成为主流，SUSS 提供汞灯转 LED 技术支持。",
    options: [
      { id: "led", zh: "LED", en: "LED Light Source" },
      { id: "hg", zh: "HG 高压汞灯", en: "High-pressure Mercury Lamp" },
    ],
  },
  {
    id: "exposure_mode", zh: "曝光控制模式", en: "Exposure Dosage Control Mode", type: "radio",
    notes:
      "CPC 即恒定功率模式，通过曝光时间控制曝光量；CDC 即恒定剂量模式，可直接输入剂量，使用更方便。CDC 包含 CPC 功能。建议研发单位仅配置 CPC 模式。",
    options: [
      { id: "cpc", zh: "CPC 通过曝光时间控制", en: "Constant Power Mode (CPC)" },
      { id: "cdc", zh: "CDC 直接控制曝光剂量", en: "Constant Dose Mode (CDC)" },
    ],
  },
  {
    id: "auto_alignment", zh: "自动对准", en: "Automatic Alignment", type: "radio",
    notes:
      "MA6 / MA8 可配自动对位 Auto Alignment（对位精度 ±0.5 µm for TSA），或超高精度 Direct Alignment（对位精度 ±0.25 µm）。",
    options: [
      { id: "manual", zh: "手动对准 Full Manual Alignment", en: "Full Manual Alignment" },
      { id: "auto", zh: "自动对准 Auto Alignment（±0.5 µm）", en: "Auto Alignment" },
      { id: "direct", zh: "超高精度对准 Direct Alignment（±0.25 µm）", en: "Direct Alignment (DirectAlign®)" },
    ],
  },
  {
    id: "accessories", zh: "附属小部件", en: "Additional Accessories", type: "checkbox",
    options: [
      { id: "intensity_meter", zh: "原装光强计", en: "Intensity Meter" },
      { id: "vacuum_pump", zh: "厂务真空泵", en: "Facility Vacuum Pump" },
      { id: "sector_disk", zh: "分区曝光板", en: "Sector Exposure Disk" },
      { id: "filter_cda", zh: "压缩空气滤芯", en: "Filter Unit CDA" },
      { id: "cassette_tray", zh: "片盒托盘", en: "Cassette Tray" },
      { id: "tool_tray", zh: "工装夹具收纳托盘", en: "Tool Tray" },
    ],
  },
];

const CHUCK_OPTIONS = [
  { id: "vac_contact", zh: "支持真空接触", en: "Vacuum Contact" },
  { id: "bsa", zh: "支持背面对准", en: "BSA (Backside Alignment)" },
  { id: "teflon", zh: "支持抗反射涂层", en: "Teflon / Anti-reflection Coating" },
  { id: "pre_align", zh: "预对位顶针", en: "Pre-alignment Pins" },
  { id: "no_special", zh: "无特殊要求", en: "No Special Requirement" },
];

const CHUCK_WAFER_SIZES = ['2"', '3"', '4"', '6"', '8"'];

const CHUCK_NOTES =
  "1. 真空接触 Chuck 带用于形成真空腔体的橡胶圈；真空接触分辨率最高，掩模版损伤也最大。<br/>" +
  "2. 背面对准 Chuck 带背面显微镜观察窗。<br/>" +
  "3. 透明衬底建议配置抗反射涂层 Chuck，防止紫外光透射到 Chuck 反射造成二次曝光。<br/>" +
  "4. 特殊要求（大翘曲 >200 µm、超厚片 >3 mm、高精度平边对准）需配 LED 背光或镜面反射。";

const MASK_HOLDER_OPTIONS = [
  { id: "round", zh: "圆形开孔", en: "Round Exposure Opening" },
  { id: "square", zh: "方形开孔", en: "Square Exposure Opening" },
  { id: "non_contact", zh: "支持非接触式找平", en: "Non-contact Leveling" },
];

const MASK_HOLDER_NOTES =
  "1. 方形开孔方便首层掩模版寻边式对准，但吸附 Mask 的真空区较小；建议圆形晶圆选圆形开孔，方形晶圆选方形开孔。<br/>" +
  "2. 非接触式找平可减少掩模版损伤，但价格较高，科研教育或低产量单位可不选。<br/>" +
  "3. 9\" 与 14\" 因 Mask 价格较贵，无论是否选择，都会提供支持非接触式找平的掩模版架。";

/* ============================ 状态 ============================ */

const state = {
  model: "maba6",
  selection: {},       // { sectionId: optionId | [optionId,...] }
  chucks: [],          // [{ waferSize, options:Set }]
  maskHolders: [],     // [{ options:Set }]
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ============================ 渲染 ============================ */

function renderModelSelector() {
  const wrap = $("#model-selector");
  wrap.innerHTML = MODELS.map((m) => `
    <label class="model-card ${m.id === state.model ? "active" : ""}">
      <input type="radio" name="model" value="${m.id}" ${m.id === state.model ? "checked" : ""} />
      <div class="model-name">${m.name}</div>
      <div class="model-sub">${m.en} · ${m.automation} · 晶圆 ${m.wafer}</div>
      <span class="model-tag">${m.tag}</span>
    </label>`).join("");
}

function renderSections() {
  const wrap = $("#sections");
  let html = "";
  let idx = 0;
  SECTIONS.forEach((sec) => {
    idx++;
    html += renderSection(sec, idx);
    if (sec.id === "light_source") {
      html += renderChuckSection(++idx);
      html += renderMaskHolderSection(++idx);
    }
  });
  wrap.innerHTML = html;
}

function sectionHeader(sec, idx) {
  return `
    <div class="section-head">
      <span class="idx">${idx}</span>
      <div><h3>${sec.zh}</h3><p class="en">${sec.en}</p></div>
    </div>`;
}

function renderSection(sec, idx) {
  const visibleOpts = (sec.options || []).filter((o) => !o.models || o.models.includes(state.model));
  const cur = state.selection[sec.id];
  const isMulti = sec.type === "checkbox";

  const opts = visibleOpts.map((o) => {
    const checked = isMulti ? (Array.isArray(cur) && cur.includes(o.id)) : cur === o.id;
    return `
      <label class="option ${checked ? "selected" : ""}">
        <input type="${sec.type}" name="${sec.id}" value="${o.id}" ${checked ? "checked" : ""} />
        <span class="option-label"><span class="zh">${o.zh}</span><span class="en">${o.en}</span></span>
      </label>`;
  }).join("");

  const notes = sec.notes ? `<div class="notes hidden" data-notes="${sec.id}">${sec.notes}</div>` : "";

  return `
    <section class="section" data-section="${sec.id}">
      ${sectionHeader(sec, idx)}
      <div class="section-body">${opts}${notes}</div>
    </section>`;
}

function renderChuckSection(idx) {
  const rows = state.chucks.map((c, i) => `
    <div class="dyn-row">
      <div class="dyn-row-head">
        <span class="dyn-title">晶圆吸盘 Chuck #${i + 1}</span>
        <button class="btn" data-action="remove-chuck" data-i="${i}">删除</button>
      </div>
      <label class="chuck-wafer">晶圆尺寸 Wafer Size：
        <select data-action="chuck-wafer" data-i="${i}">
          ${CHUCK_WAFER_SIZES.map((s) => `<option value="${s}" ${c.waferSize === s ? "selected" : ""}>${s}</option>`).join("")}
        </select>
      </label>
      ${CHUCK_OPTIONS.map((o) => {
        const checked = c.options.has(o.id);
        return `
          <label class="option ${checked ? "selected" : ""}">
            <input type="checkbox" data-action="chuck-opt" data-i="${i}" value="${o.id}" ${checked ? "checked" : ""} />
            <span class="option-label"><span class="zh">${o.zh}</span><span class="en">${o.en}</span></span>
          </label>`;
      }).join("")}
    </div>`).join("");

  return `
    <section class="section" data-section="chuck">
      ${dynamicHeader(idx, "晶圆吸盘", "Chuck and Mask Holder — Chuck")}
      <div class="section-body">
        <div class="dyn-controls">
          <button class="btn" data-action="add-chuck">增加晶圆吸盘 Add Chuck</button>
          <button class="btn" data-action="reset-chucks">重置 Reset</button>
        </div>
        ${rows || '<p class="summary-empty">尚未添加晶圆吸盘，点击上方按钮添加。</p>'}
        <div class="notes hidden" data-notes="chuck">${CHUCK_NOTES}</div>
      </div>
    </section>`;
}

function renderMaskHolderSection(idx) {
  const rows = state.maskHolders.map((m, i) => `
    <div class="dyn-row">
      <div class="dyn-row-head">
        <span class="dyn-title">掩模版架 Mask Holder #${i + 1}</span>
        <button class="btn" data-action="remove-maskholder" data-i="${i}">删除</button>
      </div>
      ${MASK_HOLDER_OPTIONS.map((o) => {
        const checked = m.options.has(o.id);
        return `
          <label class="option ${checked ? "selected" : ""}">
            <input type="checkbox" data-action="maskholder-opt" data-i="${i}" value="${o.id}" ${checked ? "checked" : ""} />
            <span class="option-label"><span class="zh">${o.zh}</span><span class="en">${o.en}</span></span>
          </label>`;
      }).join("")}
    </div>`).join("");

  return `
    <section class="section" data-section="maskholder">
      ${dynamicHeader(idx, "掩模版架", "Chuck and Mask Holder — Mask Holder")}
      <div class="section-body">
        <div class="dyn-controls">
          <button class="btn" data-action="add-maskholder">增加掩模版架 Add Mask Holder</button>
          <button class="btn" data-action="reset-maskholders">重置 Reset</button>
        </div>
        ${rows || '<p class="summary-empty">尚未添加掩模版架，点击上方按钮添加。</p>'}
        <div class="notes hidden" data-notes="maskholder">${MASK_HOLDER_NOTES}</div>
      </div>
    </section>`;
}

function dynamicHeader(idx, zh, en) {
  return `
    <div class="section-head">
      <span class="idx">${idx}</span>
      <div><h3>${zh}</h3><p class="en">${en}</p></div>
    </div>`;
}

/* ============================ 高亮 ============================ */

function highlightSection(sectionId, type) {
  const sec = document.querySelector(`[data-section="${sectionId}"]`);
  if (!sec) return;
  sec.querySelectorAll(".option").forEach((lbl) => {
    const inp = lbl.querySelector("input");
    if (!inp) return;
    const on = type === "checkbox"
      ? (state.selection[sectionId] || []).includes(inp.value)
      : state.selection[sectionId] === inp.value;
    lbl.classList.toggle("selected", on);
  });
}

/* ============================ 交互（事件委托，绑定一次） ============================ */

function onSectionsChange(e) {
  const t = e.target;
  if (t.dataset.action) {
    // 动态行
    const i = parseInt(t.dataset.i, 10);
    const action = t.dataset.action;
    if (action === "chuck-wafer") state.chucks[i].waferSize = t.value;
    else if (action === "chuck-opt") { const s = state.chucks[i].options; t.checked ? s.add(t.value) : s.delete(t.value); }
    else if (action === "maskholder-opt") { const s = state.maskHolders[i].options; t.checked ? s.add(t.value) : s.delete(t.value); }
    updateSummary();
    return;
  }

  if (!t.name) return;
  const sec = SECTIONS.find((s) => s.id === t.name);
  if (!sec) return;
  if (sec.type === "checkbox") {
    const arr = new Set(state.selection[sec.id] || []);
    t.checked ? arr.add(t.value) : arr.delete(t.value);
    state.selection[sec.id] = [...arr];
  } else {
    state.selection[sec.id] = t.value;
  }
  highlightSection(sec.id, sec.type);
  updateSummary();
}

function onSectionsClick(e) {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  const i = parseInt(btn.dataset.i, 10);
  switch (action) {
    case "add-chuck": state.chucks.push({ waferSize: CHUCK_WAFER_SIZES[3], options: new Set() }); break;
    case "remove-chuck": state.chucks.splice(i, 1); break;
    case "reset-chucks": state.chucks = []; break;
    case "add-maskholder": state.maskHolders.push({ options: new Set() }); break;
    case "remove-maskholder": state.maskHolders.splice(i, 1); break;
    case "reset-maskholders": state.maskHolders = []; break;
    default: return;
  }
  renderSections();
  updateSummary();
}

function onModelClick(e) {
  const card = e.target.closest(".model-card");
  if (!card) return;
  state.model = card.querySelector("input").value;
  const area = state.selection.exposure_area;
  const areaOpt = SECTIONS.find((s) => s.id === "exposure_area").options.find((o) => o.id === area);
  if (areaOpt && areaOpt.models && !areaOpt.models.includes(state.model)) {
    delete state.selection.exposure_area;
  }
  renderModelSelector();
  renderSections();
  updateSummary();
}

/* ============================ 摘要 ============================ */

function optionLabel(secId, optId) {
  const sec = SECTIONS.find((s) => s.id === secId);
  const o = sec && sec.options.find((x) => x.id === optId);
  return o ? o.zh : optId;
}

function updateSummary() {
  const list = $("#summary-list");
  const items = [];
  const model = MODELS.find((m) => m.id === state.model);
  items.push({ key: "设备型号", val: model.name });

  SECTIONS.forEach((sec) => {
    const cur = state.selection[sec.id];
    if (sec.type === "checkbox") {
      if (Array.isArray(cur) && cur.length) {
        items.push({ key: sec.zh, val: cur.map((id) => optionLabel(sec.id, id)).join("、") });
      }
    } else if (cur) {
      items.push({ key: sec.zh, val: optionLabel(sec.id, cur) });
    }
  });

  state.chucks.forEach((c, i) => {
    const opts = [...c.options].map((id) => (CHUCK_OPTIONS.find((o) => o.id === id) || {}).zh || id);
    items.push({ key: `Chuck #${i + 1}`, val: [c.waferSize, ...opts].join(" · ") });
  });
  state.maskHolders.forEach((m, i) => {
    const opts = [...m.options].map((id) => (MASK_HOLDER_OPTIONS.find((o) => o.id === id) || {}).zh || id);
    items.push({ key: `Mask Holder #${i + 1}`, val: opts.join(" · ") || "未指定" });
  });

  list.innerHTML = items.length
    ? items.map((it) => `<div class="summary-item"><div class="s-key">${it.key}</div><div class="s-val">${it.val}</div></div>`).join("")
    : '<p class="summary-empty">尚未选择任何配置项</p>';
  $("#summary-count").textContent = items.length;
  updateSummaryMeta();
}

function updateSummaryMeta() {
  const c = $("#customer-name").value.trim();
  const o = $("#owner-name").value.trim();
  const d = $("#quote-date").value;
  const parts = [];
  if (c) parts.push(`客户：${c}`);
  if (o) parts.push(`负责人：${o}`);
  if (d) parts.push(`日期：${d}`);
  $("#summary-customer").textContent = parts.join("  ·  ");
}

/* ============================ 导入 / 导出 / 重置 ============================ */

function serializeState() {
  return {
    model: state.model,
    customer: $("#customer-name").value,
    owner: $("#owner-name").value,
    date: $("#quote-date").value,
    selection: state.selection,
    chucks: state.chucks.map((c) => ({ waferSize: c.waferSize, options: [...c.options] })),
    maskHolders: state.maskHolders.map((m) => ({ options: [...m.options] })),
  };
}

function deserializeState(data) {
  if (!data || typeof data !== "object") return;
  if (data.model && MODELS.some((m) => m.id === data.model)) state.model = data.model;
  $("#customer-name").value = data.customer || "";
  $("#owner-name").value = data.owner || "";
  $("#quote-date").value = data.date || "";
  state.selection = data.selection || {};
  state.chucks = (data.chucks || []).map((c) => ({ waferSize: c.waferSize, options: new Set(c.options || []) }));
  state.maskHolders = (data.maskHolders || []).map((m) => ({ options: new Set(m.options || []) }));
  renderModelSelector();
  renderSections();
  updateSummary();
}

function exportJSON() {
  const blob = new Blob([JSON.stringify(serializeState(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "suss-config.json"; a.click();
  URL.revokeObjectURL(url);
}

function resetAll() {
  state.model = "maba6";
  state.selection = {};
  state.chucks = [];
  state.maskHolders = [];
  $("#customer-name").value = "";
  $("#owner-name").value = "";
  $("#quote-date").valueAsDate = new Date();
  renderModelSelector();
  renderSections();
  updateSummary();
}

/* ============================ 报价单弹窗 ============================ */

function collectItems() {
  const items = [];
  SECTIONS.forEach((sec) => {
    const cur = state.selection[sec.id];
    if (sec.type === "checkbox" && Array.isArray(cur) && cur.length) {
      items.push({ k: sec.zh, v: cur.map((id) => optionLabel(sec.id, id)).join("、") });
    } else if (cur) {
      items.push({ k: sec.zh, v: optionLabel(sec.id, cur) });
    }
  });
  state.chucks.forEach((c, i) => {
    const opts = [...c.options].map((id) => (CHUCK_OPTIONS.find((o) => o.id === id) || {}).zh || id);
    items.push({ k: `Chuck #${i + 1}`, v: [c.waferSize, ...opts].join(" · ") });
  });
  state.maskHolders.forEach((m, i) => {
    const opts = [...m.options].map((id) => (MASK_HOLDER_OPTIONS.find((o) => o.id === id) || {}).zh || id);
    items.push({ k: `Mask Holder #${i + 1}`, v: opts.join(" · ") || "未指定" });
  });
  return items;
}

function showQuotation() {
  const model = MODELS.find((m) => m.id === state.model);
  const items = [{ k: "设备型号", v: model.name }, ...collectItems()];
  const meta = $("#summary-customer").textContent;
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-head"><h2>报价单摘要</h2><button class="modal-close">×</button></div>
      <div class="modal-body">
        <p class="modal-meta">${meta}</p>
        ${items.map((it) => `<div class="summary-item"><div class="s-key">${it.k}</div><div class="s-val">${it.v}</div></div>`).join("")}
      </div>
      <div class="modal-foot"><button class="btn" id="modal-print">打印</button></div>
    </div>`;
  document.body.appendChild(modal);
  modal.querySelector(".modal-close").addEventListener("click", () => modal.remove());
  modal.querySelector("#modal-print").addEventListener("click", () => window.print());
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
}

/* ============================ 初始化 ============================ */

document.addEventListener("DOMContentLoaded", () => {
  $("#quote-date").valueAsDate = new Date();

  renderModelSelector();
  renderSections();
  updateSummary();

  // 事件委托：只绑定一次
  $("#model-selector").addEventListener("click", onModelClick);
  $("#sections").addEventListener("change", onSectionsChange);
  $("#sections").addEventListener("click", onSectionsClick);

  ["customer-name", "owner-name", "quote-date"].forEach((id) => {
    $("#" + id).addEventListener("input", updateSummaryMeta);
  });

  $("#btn-export").addEventListener("click", exportJSON);
  $("#btn-reset").addEventListener("click", resetAll);
  $("#btn-spec").addEventListener("click", () => window.print());
  $("#btn-quote").addEventListener("click", showQuotation);
  $("#btn-print").addEventListener("click", () => window.print());

  $("#btn-import").addEventListener("click", () => $("#import-file").click());
  $("#import-file").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { deserializeState(JSON.parse(reader.result)); } catch (err) { alert("导入失败：JSON 格式错误"); }
    };
    reader.readAsText(file);
    e.target.value = "";
  });

  $("#btn-toggle-notes").addEventListener("click", () => {
    const notes = $$(".notes");
    const anyHidden = [...notes].some((n) => n.classList.contains("hidden"));
    notes.forEach((n) => n.classList.toggle("hidden", !anyHidden));
  });
});
