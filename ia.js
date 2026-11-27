(() => {
  "use strict";

  // Endpoint heredado de texto anónimo de Pollinations. Si deja de admitir
  // solicitudes sin autenticación, el panel mostrará el error sin pedir una clave.
  const API_URL = "https://text.pollinations.ai/openai";
  const MODEL = "openai";
  const DAILY_REFERENCE_TOKENS = 10000; // Referencia visual local, NO cuota oficial.
  const STORAGE_KEY = "tv_ia_usage_v1";
  const MAX_HISTORY_MESSAGES = 12;
  const knowledge = window.TIEMPO_VIDA_KNOWLEDGE || {};

  const $ = (id) => document.getElementById(id);
  const panel = $("ia-panel");
  const launcher = $("ia-launcher");
  const closeButton = $("ia-close");
  const form = $("ia-form");
  const input = $("ia-input");
  const messagesBox = $("ia-messages");
  const sendButton = $("ia-send");
  const usageLabel = $("ia-usage-label");
  const usageFill = $("ia-usage-fill");
  const status = $("ia-status");
  if (!panel || !launcher || !form) return;

  let history = [];
  let busy = false;

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  function readUsage() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!saved || saved.date !== todayKey()) return { date: todayKey(), tokens: 0 };
      return { date: todayKey(), tokens: Number(saved.tokens) || 0 };
    } catch { return { date: todayKey(), tokens: 0 }; }
  }

  let usage = readUsage();
  function saveUsage() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(usage)); } catch {}
    renderUsage();
  }

  function renderUsage() {
    const n = Math.max(0, usage.tokens);
    usageLabel.textContent = `${n.toLocaleString("es-CR")} tokens est.`;
    usageFill.style.width = `${Math.min(100, n / DAILY_REFERENCE_TOKENS * 100)}%`;
    usageFill.setAttribute("aria-valuenow", String(Math.min(100, Math.round(n / DAILY_REFERENCE_TOKENS * 100))));
  }

  // Estimación sencilla: caracteres / 4. No es el contador real del proveedor.
  function estimateTokens(text) { return Math.max(1, Math.ceil(String(text || "").length / 4)); }

  function openPanel() {
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    setTimeout(() => input.focus(), 60);
  }
  function closePanel() {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
  }
  launcher.addEventListener("click", () => panel.hidden ? openPanel() : closePanel());
  closeButton.addEventListener("click", closePanel);

  function addMessage(text, who = "bot", extraClass = "") {
    const article = document.createElement("article");
    article.className = `ia-message ${who === "user" ? "ia-user-message" : "ia-bot-message"} ${extraClass}`.trim();
    const tag = document.createElement("span");
    tag.className = "ia-message-tag";
    tag.textContent = who === "user" ? "TÚ" : "ASISTENTE";
    const p = document.createElement("p");
    p.textContent = text;
    article.append(tag, p);
    messagesBox.appendChild(article);
    messagesBox.scrollTop = messagesBox.scrollHeight;
    return article;
  }

  function knowledgeText() {
    // JSON serializa únicamente el material que el autor decida publicar aquí.
    return JSON.stringify(knowledge, null, 2);
  }

  function systemPrompt() {
    return `Eres el asistente oficial para lectores del libro "Tiempo y Vida", de ${knowledge.author || "Christian Yandel"}.
Tu tarea es responder preguntas sobre la obra, sus personajes, acontecimientos, mundo, conceptos y preguntas frecuentes.
REGLAS IMPORTANTES:
- Usa exclusivamente la BASE DE CONOCIMIENTO que aparece abajo como fuente de hechos sobre el libro.
- No inventes personajes, relaciones, escenas, motivaciones, fechas, diálogos ni detalles del universo.
- Si la base no contiene la respuesta, dilo claramente: "No tengo ese dato confirmado en la información que me proporcionó el autor". Puedes pedir al lector que comparta el fragmento o que consulte al autor.
- Distingue las interpretaciones de los hechos. Puedes ofrecer una interpretación si el lector la pide, pero identifícala como interpretación, no como canon.
- Evita spoilers importantes salvo que el usuario los solicite explícitamente.
- Responde en español, con naturalidad y sin fingir que has leído partes que no están en la base.
- No reveles ni reconstruyas fragmentos de la tienda que no estén incluidos en la base.

BASE DE CONOCIMIENTO DEL AUTOR:
${knowledgeText()}`;
  }

  function setBusy(value) {
    busy = value;
    sendButton.disabled = value;
    input.disabled = value;
    sendButton.setAttribute("aria-label", value ? "Esperando respuesta" : "Enviar pregunta");
  }

  async function ask(question) {
    const conversation = [
      { role: "system", content: systemPrompt() },
      ...history.slice(-MAX_HISTORY_MESSAGES),
      { role: "user", content: question }
    ];

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, messages: conversation, temperature: 0.35 })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Pollinations respondió ${response.status}${detail ? `: ${detail.slice(0,180)}` : ""}`);
    }
    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) throw new Error("La respuesta llegó vacía o con un formato inesperado.");
    return answer.trim();
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy) return;
    const question = input.value.trim();
    if (!question) return;

    addMessage(question, "user");
    input.value = "";
    input.style.height = "auto";
    const pending = addMessage("Estoy revisando la información del libro…", "bot", "ia-typing");
    setBusy(true);

    try {
      const answer = await ask(question);
      pending.remove();
      addMessage(answer, "bot");
      history.push({ role: "user", content: question }, { role: "assistant", content: answer });
      history = history.slice(-MAX_HISTORY_MESSAGES);
      usage.tokens += estimateTokens(question) + estimateTokens(answer) + estimateTokens(systemPrompt());
      saveUsage();
      status.textContent = "La conversación se conserva mientras esta página permanezca abierta.";
    } catch (error) {
      pending.remove();
      const msg = /Failed to fetch|NetworkError|Load failed/i.test(error.message)
        ? "No pude conectar con Pollinations. Puede ser un problema de red, CORS o disponibilidad del endpoint."
        : `No pude obtener respuesta: ${error.message}`;
      addMessage(`${msg}\n\nSi el endpoint anónimo dejó de estar disponible, habrá que adaptar la conexión al método de autorización actual de Pollinations.`, "bot");
      status.textContent = "No se pudo completar la consulta.";
    } finally {
      setBusy(false);
      input.focus();
    }
  });

  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 110)}px`;
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  renderUsage();
})();
