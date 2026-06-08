const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");

const {
  catalog,
  settings,
  estimateQuote,
  extractFromText,
  buildCatalogLists,
} = require("./quote-engine");

const port = Number(process.env.PORT || 5173);
const root = __dirname;
const recentBotEvents = [];
const maxRecentBotEvents = 25;
const recentReceipts = new Map();
const maxRecentReceipts = 100;
const storeInfo = {
  name: "Cakes Josy Silva",
  address: "Rua Antonio Feijo, Nº 30 - Loja C, 2725-223 Algueirao-Mem Martins",
  hours: "Segunda a sabado, das 10:00 as 18:00",
  whatsapp: "934555231",
  phone: "210162694",
  instagram: "https://www.instagram.com/cakesjosysilva/",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

function sendJson(response, statusCode, payload, extraHeaders = {}) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    ...extraHeaders,
  });
  response.end(JSON.stringify(payload, null, 2));
}

function sendText(response, statusCode, text, extraHeaders = {}) {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    ...extraHeaders,
  });
  response.end(text);
}

function sendOptions(response) {
  response.writeHead(204, {
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  response.end();
}

function parseRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;

    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > 1024 * 1024) {
        reject(new Error("Corpo do pedido excede 1 MB."));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });

    request.on("end", () => {
      if (!chunks.length) {
        resolve({
          raw: "",
          parsed: {},
        });
        return;
      }

      const raw = Buffer.concat(chunks).toString("utf8");
      const contentType = String(request.headers["content-type"] || "").toLowerCase();

      try {
        if (contentType.includes("application/json")) {
          resolve({ raw, parsed: JSON.parse(raw) });
          return;
        }

        if (contentType.includes("application/x-www-form-urlencoded")) {
          resolve({ raw, parsed: querystring.parse(raw) });
          return;
        }

        resolve({ raw, parsed: { rawBody: raw } });
      } catch (error) {
        reject(new Error("Nao foi possivel interpretar o corpo do pedido."));
      }
    });

    request.on("error", reject);
  });
}

function sanitizeSecrets(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeSecrets);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => {
        const normalizedKey = key.toLowerCase();
        if (
          normalizedKey.includes("token") ||
          normalizedKey.includes("authorization") ||
          normalizedKey.includes("senha") ||
          normalizedKey.includes("password")
        ) {
          return [key, "[redacted]"];
        }

        return [key, sanitizeSecrets(entryValue)];
      }),
    );
  }

  return value;
}

function rememberBotEvent(event) {
  recentBotEvents.unshift({
    receivedAt: new Date().toISOString(),
    ...sanitizeSecrets(event),
  });

  if (recentBotEvents.length > maxRecentBotEvents) {
    recentBotEvents.length = maxRecentBotEvents;
  }
}

function findFirstString(value, keysToMatch) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value.trim() || null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findFirstString(item, keysToMatch);
      if (found) {
        return found;
      }
    }
    return null;
  }

  if (typeof value === "object") {
    for (const [key, entryValue] of Object.entries(value)) {
      const normalizedKey = key.toLowerCase();
      if (keysToMatch.some((candidate) => normalizedKey.includes(candidate))) {
        const direct = findFirstString(entryValue, []);
        if (direct) {
          return direct;
        }
      }
    }

    for (const entryValue of Object.values(value)) {
      const found = findFirstString(entryValue, keysToMatch);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

function extractIncomingMessage(payload, rawBody) {
  const conversation = payload.conversa && typeof payload.conversa === "object" ? payload.conversa : null;
  const descriptiveMessage =
    payload.desc_ultima_mensagem ||
    payload.ultima_mensagem ||
    conversation?.desc_ultima_mensagem ||
    conversation?.ultima_mensagem ||
    null;

  if (descriptiveMessage) {
    return String(descriptiveMessage)
      .replace(/^\*[^*]+\*:\s*/u, "")
      .trim();
  }

  return (
    findFirstString(payload, ["mensagem", "message", "body", "texto", "text", "content"]) ||
    (typeof rawBody === "string" && rawBody.trim() ? rawBody.trim() : null)
  );
}

function normalizePhoneNumber(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits || null;
}

function extractIncomingPhone(payload) {
  const conversation = payload.conversa && typeof payload.conversa === "object" ? payload.conversa : null;
  const rawPhone =
    payload.customerPhone ||
    payload.recipientPhone ||
    payload.telefone_cliente ||
    payload.telefone_destinatario ||
    conversation?.id_cliente ||
    conversation?.origem ||
    payload.origem ||
    findFirstString(payload, [
      "telefone_cliente",
      "telefone_contato",
      "telefone",
      "customerphone",
      "phone",
      "whatsapp",
      "from",
    ]);

  return normalizePhoneNumber(rawPhone);
}

function extractMessageSource(payload) {
  const conversation = payload.conversa && typeof payload.conversa === "object" ? payload.conversa : null;
  return String(
    payload.origem_ultima_mensagem ||
      conversation?.origem_ultima_mensagem ||
      payload.source ||
      payload.origem ||
      "",
  )
    .trim()
    .toLowerCase();
}

function buildCatalogPayload() {
  return {
    types: catalog.types,
    masses: catalog.masses,
    fillingCategories: catalog.fillingCategories,
    fillings: catalog.fillings,
    weights: catalog.weights,
    decorations: catalog.decorations,
    formats: catalog.formats,
    fruits: catalog.fruits,
    kits: catalog.kits,
    savories: catalog.savories,
    sweets: catalog.sweets,
    products: catalog.products,
    settings,
  };
}

function buildBaseUrl(request) {
  const forwardedProto = String(request.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  const protocol = forwardedProto || (request.socket.encrypted ? "https" : "http");
  const host = request.headers.host || `127.0.0.1:${port}`;
  return `${protocol}://${host}`;
}

function createReceiptId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function getQuotePayload(result) {
  if (!result) {
    return null;
  }

  if (result.quote?.ok) {
    return result.quote;
  }

  if (result.ok && Array.isArray(result.summaryRows)) {
    return result;
  }

  return null;
}

function buildReceiptHtml(quotePayload) {
  const requestData = quotePayload.request || {};
  const dateInfo = (() => {
    const dateValue = requestData.date || "";
    if (!dateValue) {
      return { weekday: "", date: "" };
    }

    const [year, month, day] = String(dateValue).split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const weekday = new Intl.DateTimeFormat("pt-PT", { weekday: "long" }).format(date);
    return {
      weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
      date: `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`,
    };
  })();

  const rows = (quotePayload.summaryRows || [])
    .filter(([label]) => label !== "Tipo de orcamento")
    .map(
      ([label, value]) => `
        <div class="receipt-row">
          <span>${escapeHtml(label)}:</span>
          <strong>${escapeHtml(value)}</strong>
        </div>
      `,
    )
    .join("");

  const total = quotePayload.total ?? 0;
  const title = requestData.typeName || "Orcamento";
  const customerName = requestData.customerName || "Cliente";
  const customerPhone = requestData.customerPhone || "";
  const hour = requestData.time || "";

  return `<!doctype html>
<html lang="pt">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Talao do cliente - Cakes Josy Silva</title>
    <style>
      :root {
        color-scheme: light;
        --ink: #111111;
        --line: #1f1f1f;
        --muted: #5e5e5e;
        --paper: #ffffff;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 24px;
        font-family: Arial, Helvetica, sans-serif;
        background: #f5f1ef;
        color: var(--ink);
      }

      .sheet {
        max-width: 900px;
        margin: 0 auto;
      }

      .receipt {
        padding: 26px;
        background: var(--paper);
        border: 2px solid var(--line);
      }

      .copy-label {
        margin-bottom: 8px;
        font-size: 13px;
        font-weight: 900;
      }

      .receipt-top {
        display: grid;
        grid-template-columns: 220px 1fr;
        gap: 12px;
      }

      .brand-card {
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 2px solid var(--line);
      }

      .brand-card img {
        width: 150px;
        height: 82px;
        display: block;
        object-fit: contain;
        margin-bottom: 6px;
      }

      .store-info {
        margin: 0;
        text-align: center;
        font-size: 11px;
        font-weight: 800;
        line-height: 1.25;
      }

      .store-info span {
        display: block;
      }

      .form-header {
        border: 2px solid var(--line);
        padding: 12px;
      }

      .form-grid {
        display: grid;
        grid-template-columns: 1.4fr 0.8fr 0.7fr;
        gap: 8px 18px;
      }

      .field {
        min-height: 30px;
        display: flex;
        align-items: baseline;
        gap: 6px;
        font-size: 20px;
        font-weight: 900;
      }

      .field strong {
        flex: 1;
        min-height: 24px;
        border-bottom: 2px solid var(--line);
      }

      .phone {
        grid-column: span 2;
      }

      .content {
        margin-top: 18px;
      }

      .section {
        padding: 14px;
        border: 2px solid var(--line);
      }

      .receipt-row {
        display: grid;
        grid-template-columns: 220px 1fr;
        gap: 12px;
        padding: 8px 0;
        border-bottom: 1px solid #ede1dc;
      }

      .receipt-row:last-child {
        border-bottom: 0;
      }

      .receipt-row span {
        font-weight: 800;
      }

      .receipt-row strong {
        font-weight: 800;
      }

      .total-box {
        margin-top: 14px;
        padding: 16px;
        display: flex;
        justify-content: space-between;
        border: 2px solid var(--line);
        font-size: 24px;
        font-weight: 900;
      }

      .meta {
        margin-top: 14px;
        padding: 14px;
        border: 2px solid var(--line);
      }

      .meta p {
        margin: 0 0 8px;
        font-size: 14px;
        line-height: 1.45;
      }

      .meta p:last-child {
        margin-bottom: 0;
      }

      .footer-note {
        margin-top: 14px;
        padding: 10px 12px;
        border: 1px solid var(--line);
        text-align: center;
      }

      .footer-note p {
        margin: 0;
        font-size: 13px;
      }

      @media print {
        body {
          padding: 0;
          background: white;
        }

        .sheet {
          max-width: none;
        }

        .receipt {
          border: 0;
        }
      }
    </style>
  </head>
  <body>
    <main class="sheet">
      <section class="receipt">
        <div class="copy-label">Via do cliente</div>
        <div class="receipt-top">
          <div class="brand-card">
            <img src="/assets/logo-cakes-josy-silva-recibo.png" alt="Cakes Josy Silva">
            <p class="store-info">
              <span>Rua Antonio Feijo, Nº 30</span>
              <span>Loja C, 2725-223</span>
              <span>Algueirao-Mem Martins</span>
              <span>Tel: ${escapeHtml(storeInfo.phone)}</span>
            </p>
          </div>
          <div class="form-header">
            <div class="form-grid">
              <div class="field">
                <span>Nome:</span>
                <strong>${escapeHtml(customerName)}</strong>
              </div>
              <div class="field">
                <span>Dia:</span>
                <strong>${escapeHtml(dateInfo.weekday)}</strong>
              </div>
              <div class="field">
                <span>Hrs:</span>
                <strong>${escapeHtml(hour)}</strong>
              </div>
              <div class="field">
                <span>Data:</span>
                <strong>${escapeHtml(dateInfo.date)}</strong>
              </div>
              <div class="field phone">
                <span>Tel:</span>
                <strong>${escapeHtml(customerPhone)}</strong>
              </div>
            </div>
          </div>
        </div>
        <div class="content">
          <div class="section">
            <div class="receipt-row">
              <span>Tipo:</span>
              <strong>${escapeHtml(title)}</strong>
            </div>
            ${rows}
          </div>
          <div class="total-box">
            <span>Total estimado</span>
            <strong>${escapeHtml(new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(total))}</strong>
          </div>
          <div class="meta">
            <p>Este talao corresponde a uma via unica do cliente.</p>
            <p>O valor apresentado e um orcamento estimado e a confirmacao final depende sempre da equipa da loja.</p>
            <p>Pedidos e confirmacoes exigem no minimo ${settings.minimumLeadDays} dias de antecedencia.</p>
          </div>
          <div class="footer-note">
            <p>Pois, que adianta ao homem ganhar o mundo inteiro e perder a sua alma?</p>
            <p><strong>Marcos 8:36</strong></p>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>`;
}

function buildReceiptSvg(quotePayload) {
  const requestData = quotePayload.request || {};
  const total = quotePayload.total ?? 0;
  const rows = [
    ["Tipo", requestData.typeName || "Orcamento"],
    ...(quotePayload.summaryRows || []).filter(([label]) => label !== "Tipo de orcamento"),
  ];
  const dateValue = requestData.date || "";
  let weekday = "";
  let formattedDate = "";

  if (dateValue) {
    const [year, month, day] = String(dateValue).split("-").map(Number);
    const date = new Date(year, month - 1, day);
    weekday = new Intl.DateTimeFormat("pt-PT", { weekday: "long" }).format(date);
    weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
    formattedDate = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
  }

  const customerName = requestData.customerName || "Cliente";
  const customerPhone = requestData.customerPhone || "";
  const customerHour = requestData.time || "";
  const width = 1200;
  const lineHeight = 34;
  const headerHeight = 200;
  const totalHeight = 84;
  const footerHeight = 130;
  const topOffset = 250;
  const rowsHeight = rows.length * lineHeight + 30;
  const height = topOffset + rowsHeight + totalHeight + footerHeight;

  const rowBlocks = rows
    .map(([label, value], index) => {
      const y = topOffset + index * lineHeight;
      return `
        <text x="52" y="${y}" font-size="20" font-weight="700" fill="#111111">${escapeHtml(label)}:</text>
        <text x="330" y="${y}" font-size="20" font-weight="700" fill="#111111">${escapeHtml(value)}</text>
        <line x1="40" y1="${y + 12}" x2="1160" y2="${y + 12}" stroke="#eaded8" stroke-width="1" />
      `;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#f5f1ef" />
  <rect x="24" y="24" width="${width - 48}" height="${height - 48}" rx="0" fill="#ffffff" stroke="#111111" stroke-width="3" />

  <text x="48" y="68" font-size="24" font-weight="800" fill="#111111">Via do cliente</text>

  <rect x="40" y="86" width="260" height="${headerHeight - 32}" fill="#ffffff" stroke="#111111" stroke-width="3" />
  <text x="170" y="128" text-anchor="middle" font-size="30" font-weight="900" fill="#7e2148">Cakes Josy Silva</text>
  <text x="170" y="156" text-anchor="middle" font-size="15" font-weight="700" fill="#111111">Rua Antonio Feijo, Nº 30</text>
  <text x="170" y="178" text-anchor="middle" font-size="15" font-weight="700" fill="#111111">Loja C, 2725-223</text>
  <text x="170" y="200" text-anchor="middle" font-size="15" font-weight="700" fill="#111111">Algueirao-Mem Martins</text>
  <text x="170" y="222" text-anchor="middle" font-size="15" font-weight="700" fill="#111111">Tel: ${escapeHtml(storeInfo.phone)}</text>

  <rect x="320" y="86" width="840" height="${headerHeight - 32}" fill="#ffffff" stroke="#111111" stroke-width="3" />
  <text x="344" y="126" font-size="18" font-weight="800" fill="#111111">Nome:</text>
  <text x="424" y="126" font-size="20" font-weight="800" fill="#111111">${escapeHtml(customerName)}</text>
  <line x1="424" y1="132" x2="760" y2="132" stroke="#111111" stroke-width="2" />

  <text x="784" y="126" font-size="18" font-weight="800" fill="#111111">Dia:</text>
  <text x="838" y="126" font-size="19" font-weight="800" fill="#111111">${escapeHtml(weekday)}</text>
  <line x1="838" y1="132" x2="1128" y2="132" stroke="#111111" stroke-width="2" />

  <text x="344" y="178" font-size="18" font-weight="800" fill="#111111">Data:</text>
  <text x="412" y="178" font-size="20" font-weight="800" fill="#111111">${escapeHtml(formattedDate)}</text>
  <line x1="412" y1="184" x2="660" y2="184" stroke="#111111" stroke-width="2" />

  <text x="700" y="178" font-size="18" font-weight="800" fill="#111111">Hrs:</text>
  <text x="752" y="178" font-size="20" font-weight="800" fill="#111111">${escapeHtml(customerHour)}</text>
  <line x1="752" y1="184" x2="860" y2="184" stroke="#111111" stroke-width="2" />

  <text x="344" y="228" font-size="18" font-weight="800" fill="#111111">Tel:</text>
  <text x="396" y="228" font-size="20" font-weight="800" fill="#111111">${escapeHtml(customerPhone)}</text>
  <line x1="396" y1="234" x2="860" y2="234" stroke="#111111" stroke-width="2" />

  <rect x="40" y="${topOffset - 28}" width="1120" height="${rowsHeight}" fill="#ffffff" stroke="#111111" stroke-width="3" />
  ${rowBlocks}

  <rect x="40" y="${topOffset + rowsHeight + 18}" width="1120" height="72" fill="#ffffff" stroke="#111111" stroke-width="3" />
  <text x="62" y="${topOffset + rowsHeight + 62}" font-size="28" font-weight="900" fill="#111111">Total estimado</text>
  <text x="1128" y="${topOffset + rowsHeight + 62}" text-anchor="end" font-size="30" font-weight="900" fill="#111111">${escapeHtml(
    new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(total),
  )}</text>

  <rect x="40" y="${topOffset + rowsHeight + totalHeight + 18}" width="1120" height="94" fill="#ffffff" stroke="#111111" stroke-width="2" />
  <text x="58" y="${topOffset + rowsHeight + totalHeight + 52}" font-size="18" font-weight="700" fill="#111111">Este talao corresponde a uma via unica do cliente.</text>
  <text x="58" y="${topOffset + rowsHeight + totalHeight + 80}" font-size="18" font-weight="700" fill="#111111">O valor apresentado e um orcamento estimado e a confirmacao final depende da loja.</text>
  <text x="58" y="${topOffset + rowsHeight + totalHeight + 108}" font-size="18" font-weight="700" fill="#111111">Pedidos e confirmacoes exigem no minimo ${settings.minimumLeadDays} dias de antecedencia.</text>

  <rect x="40" y="${height - 88}" width="1120" height="46" fill="#ffffff" stroke="#111111" stroke-width="1.5" />
  <text x="600" y="${height - 58}" text-anchor="middle" font-size="16" font-weight="700" fill="#111111">Pois, que adianta ao homem ganhar o mundo inteiro e perder a sua alma? - Marcos 8:36</text>
</svg>`;
}

function rememberReceipt(quotePayload) {
  const id = createReceiptId();
  recentReceipts.set(id, {
    createdAt: new Date().toISOString(),
    html: buildReceiptHtml(quotePayload),
    svg: buildReceiptSvg(quotePayload),
    total: quotePayload.total ?? 0,
    typeName: quotePayload.request?.typeName || "Orcamento",
    customerName: quotePayload.request?.customerName || "",
  });

  while (recentReceipts.size > maxRecentReceipts) {
    const firstKey = recentReceipts.keys().next().value;
    recentReceipts.delete(firstKey);
  }

  return id;
}

function attachReceiptToReply(result, baseUrl) {
  const quotePayload = getQuotePayload(result);
  if (!quotePayload) {
    return result;
  }

  const receiptId = rememberReceipt(quotePayload);
  const receiptUrl = `${baseUrl}/api/receipts/${receiptId}`;
  const receiptImageUrl = `${baseUrl}/api/receipts/${receiptId}/image.svg`;
  const appendedMessage = `${result.message}\n\nTalao do cliente (imagem):\n${receiptImageUrl}\n\nTalao do cliente (pagina):\n${receiptUrl}`;

  return {
    ...result,
    message: appendedMessage,
    receipt: {
      id: receiptId,
      url: receiptUrl,
      imageUrl: receiptImageUrl,
    },
  };
}

function normalizeMessageText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s/+.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function isLikelyQuoteRequest(normalized) {
  const hasProductIntent = matchesAny(normalized, [
    /\bbolo\b/,
    /\bkit\b/,
    /\borcamento\b/,
    /\borçamento\b/,
    /\bpedido\b/,
    /\bquero\b/,
    /\bpreciso\b/,
  ]);
  const hasOrderDetails = matchesAny(normalized, [
    /\bpessoas?\b/,
    /\bkg\b/,
    /\bdata\b/,
    /\bmassa\b/,
    /\brecheio\b/,
    /\bdecoracao\b/,
    /\bdecoração\b/,
    /\bformato\b/,
    /\bpara\s+\d+\b/,
    /\b20\d{2}-\d{2}-\d{2}\b/,
  ]);

  return hasProductIntent && hasOrderDetails;
}

function buildQuickReply(messageText) {
  const normalized = normalizeMessageText(messageText);
  const catalogLists = buildCatalogLists();
  const quoteIntent = isLikelyQuoteRequest(normalized);
  const explicitListRequest = matchesAny(normalized, [
    /\blista\b/,
    /\bquais\b/,
    /\bopcoes\b/,
    /\bopções\b/,
    /\bme manda\b/,
    /\bme envia\b/,
  ]);

  if (!normalized) {
    return null;
  }

  if (!quoteIntent && matchesAny(normalized, [/\brecheio\b/, /\brecheios\b/, /\bsabores\b/])) {
    return {
      kind: "catalog_fillings",
      message: `${catalogLists.fillings}\n\nSe quiser, tambem posso ajudar a montar o seu orcamento.`,
    };
  }

  if (!quoteIntent && matchesAny(normalized, [/\bkit\b/, /\bkits\b/])) {
    return {
      kind: "catalog_kits",
      message: `${catalogLists.kits}\n\nSe quiser, diga a data, a massa e o recheio para eu montar o valor estimado.`,
    };
  }

  if (
    !quoteIntent &&
    (explicitListRequest || matchesAny(normalized, [/\bdoces\b/, /\bbrigadeiros?\b/]))
  ) {
    return {
      kind: "catalog_sweets",
      message: `${catalogLists.sweets}\n\nSe quiser, posso continuar com o seu orcamento.`,
    };
  }

  if (
    !quoteIntent &&
    (explicitListRequest || matchesAny(normalized, [/\bsalgado\b/, /\bsalgados\b/, /\bempada\b/, /\bcoxinha\b/]))
  ) {
    return {
      kind: "catalog_savories",
      message: `${catalogLists.savories}\n\nSe quiser, posso continuar com o seu orcamento.`,
    };
  }

  if (matchesAny(normalized, [/\bfatia\b/, /\bfatias\b/])) {
    return {
      kind: "slice_info",
      message: [
        "As fatias de bolo custam 6,00 € cada.",
        "",
        "Importante:",
        "- E necessario confirmar quais as fatias disponiveis no momento",
        "- A disponibilidade final e validada pela loja",
      ].join("\n"),
    };
  }

  if (matchesAny(normalized, [/\bmorada\b/, /\bendereco\b/, /\bonde fica\b/, /\blocalizacao\b/])) {
    return {
      kind: "address",
      message: [
        `${storeInfo.name}`,
        "",
        `Morada: ${storeInfo.address}`,
        `Horario: ${storeInfo.hours}`,
      ].join("\n"),
    };
  }

  if (matchesAny(normalized, [/\bhorario\b/, /\baberto\b/, /\bfecha\b/, /\bfunciona\b/])) {
    return {
      kind: "hours",
      message: [
        `Horario de atendimento: ${storeInfo.hours}`,
        "Domingo: fechado",
        "Retiradas apenas em horario comercial",
      ].join("\n"),
    };
  }

  if (matchesAny(normalized, [/\bdomingo\b/])) {
    return {
      kind: "sunday_policy",
      message: [
        "Estamos fechados aos domingos.",
        "Nao fazemos atendimento nem retiradas aos domingos.",
        "Se necessario, podemos orientar o levantamento no sabado, dentro do horario comercial.",
      ].join("\n"),
    };
  }

  if (matchesAny(normalized, [/\bentrega\b/, /\bdelivery\b/, /\bentregam\b/])) {
    return {
      kind: "delivery_policy",
      message: [
        "Nao temos entregador.",
        "As encomendas sao levantadas em loja, dentro do horario comercial.",
      ].join("\n"),
    };
  }

  if (matchesAny(normalized, [/\binstagram\b/, /\binsta\b/])) {
    return {
      kind: "instagram",
      message: `Instagram oficial: ${storeInfo.instagram}`,
    };
  }

  if (matchesAny(normalized, [/\btelefone\b/, /\bwhatsapp\b/, /\bcontacto\b/, /\bcontato\b/])) {
    return {
      kind: "contacts",
      message: [
        "Contactos da Cakes Josy Silva:",
        `- WhatsApp: ${storeInfo.whatsapp}`,
        `- Telefone: ${storeInfo.phone}`,
      ].join("\n"),
    };
  }

  if (
    matchesAny(normalized, [
      /\breserva\b/,
      /\breservar\b/,
      /\bconfirmar\b/,
      /\bconfirmacao\b/,
      /\bdisponibilidade\b/,
      /\bestoque\b/,
      /\bstock\b/,
    ])
  ) {
    return {
      kind: "handoff",
      message: [
        "Sou o assistente virtual da Cakes Josy Silva e consigo ajudar com informacoes rapidas, precos base e orcamentos simples.",
        "Para reservas, confirmacoes, disponibilidade exata ou atendimento mais aprofundado, e necessario falar diretamente com a loja ou aguardar atendimento humano.",
      ].join("\n"),
    };
  }

  return null;
}

function buildAssistantReply(messageText, context = {}) {
  const quickReply = buildQuickReply(messageText);
  if (quickReply) {
    return {
      ok: true,
      status: "quick_reply",
      message: quickReply.message,
      quickReply,
    };
  }

  const quoteResult = extractFromText(messageText, context);
  return {
    ok: quoteResult.ok,
    status: quoteResult.status,
    message: quoteResult.message,
    quote: quoteResult,
  };
}

function createBotNinjaSendUrl({
  mode,
  endpointPath,
  senderPhone,
  recipientPhone,
  text,
  textFieldName,
  extraQuery,
}) {
  const pathName =
    endpointPath ||
    (String(mode || "").toLowerCase() === "api"
      ? "/external_api/mensagens/whatsapp_api"
      : "/external_api/mensagens/whatsapp_qr_code");
  const url = new URL(`https://botninja.chat${pathName}`);
  url.searchParams.set("telefone_remetente", String(senderPhone));
  url.searchParams.set("telefone_destinatario", String(recipientPhone));
  url.searchParams.set(textFieldName || "mensagem", String(text));

  if (extraQuery && typeof extraQuery === "object") {
    Object.entries(extraQuery).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url;
}

function sendBotNinjaMessage({
  token,
  mode,
  endpointPath,
  senderPhone,
  recipientPhone,
  text,
  textFieldName,
  extraQuery,
}) {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error("Falta o token do Bot Ninja."));
      return;
    }

    if (!senderPhone || !recipientPhone || !text) {
      reject(new Error("Faltam telefone_remetente, telefone_destinatario ou mensagem."));
      return;
    }

    const targetUrl = createBotNinjaSendUrl({
      mode,
      endpointPath,
      senderPhone,
      recipientPhone,
      text,
      textFieldName,
      extraQuery,
    });

    const request = https.request(
      targetUrl,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf8");
          try {
            resolve({
              statusCode: response.statusCode || 0,
              data: raw ? JSON.parse(raw) : {},
            });
          } catch (error) {
            resolve({
              statusCode: response.statusCode || 0,
              data: raw,
            });
          }
        });
      },
    );

    request.on("error", reject);
    request.end();
  });
}

async function handleQuoteEstimate(request, response) {
  const { parsed } = await parseRequestBody(request);
  const result = attachReceiptToReply(estimateQuote(parsed), buildBaseUrl(request));
  sendJson(response, 200, {
    ok: true,
    result,
  });
}

async function handleQuoteFromText(request, response) {
  const { parsed, raw } = await parseRequestBody(request);
  const message = parsed.message || parsed.text || parsed.mensagem || raw;

  if (!message || !String(message).trim()) {
    sendJson(response, 400, {
      ok: false,
      error: "Envie um campo 'message', 'text' ou 'mensagem' com o texto do cliente.",
    });
    return;
  }

  const result = attachReceiptToReply(extractFromText(String(message), parsed.context || {}), buildBaseUrl(request));
  sendJson(response, 200, {
    ok: true,
    inputMessage: String(message),
    result,
  });
}

async function handleAssistantReply(request, response) {
  const { parsed, raw } = await parseRequestBody(request);
  const message = parsed.message || parsed.text || parsed.mensagem || raw;

  if (!message || !String(message).trim()) {
    sendJson(response, 400, {
      ok: false,
      error: "Envie um campo 'message', 'text' ou 'mensagem' com o texto do cliente.",
    });
    return;
  }

  const result = attachReceiptToReply(buildAssistantReply(String(message), parsed.context || {}), buildBaseUrl(request));
  sendJson(response, 200, {
    ok: true,
    inputMessage: String(message),
    result,
  });
}

async function handleBotNinjaSend(request, response) {
  const { parsed } = await parseRequestBody(request);
  const sendResult = await sendBotNinjaMessage({
    token: parsed.token || process.env.BOT_NINJA_TOKEN,
    mode: parsed.mode || process.env.BOT_NINJA_MODE || "qr",
    endpointPath: parsed.endpointPath || process.env.BOT_NINJA_ENDPOINT_PATH,
    senderPhone: parsed.senderPhone || parsed.telefone_remetente || process.env.BOT_NINJA_SENDER_PHONE,
    recipientPhone: parsed.recipientPhone || parsed.telefone_destinatario,
    text: parsed.text || parsed.message || parsed.mensagem,
    textFieldName: parsed.textFieldName || process.env.BOT_NINJA_TEXT_FIELD || "mensagem",
    extraQuery: parsed.extraQuery,
  });

  sendJson(response, 200, {
    ok: true,
    sendResult,
  });
}

async function handleBotNinjaWebhook(request, response) {
  const { parsed, raw } = await parseRequestBody(request);
  const payload = parsed && typeof parsed === "object" ? parsed : {};
  const messageText = extractIncomingMessage(payload, raw);
  const customerPhone = extractIncomingPhone(payload);
  const messageSource = extractMessageSource(payload);
  const isBotMessage = messageSource === "bot";

  const context = payload.context && typeof payload.context === "object" ? payload.context : {};
  const result =
    messageText && !isBotMessage
      ? attachReceiptToReply(buildAssistantReply(messageText, context), buildBaseUrl(request))
      : {
          ok: true,
          status: isBotMessage ? "ignored_bot_message" : "ignored_empty_message",
          message: isBotMessage
            ? "Evento ignorado porque a ultima mensagem foi enviada pelo proprio bot."
            : "Evento recebido sem mensagem utilizavel.",
        };
  const autoReply =
    payload.autoReply !== undefined
      ? Boolean(payload.autoReply)
      : String(process.env.BOT_NINJA_AUTO_REPLY || "").toLowerCase() === "true";

  let sendResult = null;
  let sendError = null;

  if (autoReply && result?.message && customerPhone && !isBotMessage) {
    try {
      sendResult = await sendBotNinjaMessage({
        token: payload.token || process.env.BOT_NINJA_TOKEN,
        mode: payload.mode || process.env.BOT_NINJA_MODE || "qr",
        endpointPath: payload.endpointPath || process.env.BOT_NINJA_ENDPOINT_PATH,
        senderPhone:
          payload.senderPhone ||
          payload.telefone_remetente ||
          process.env.BOT_NINJA_SENDER_PHONE,
        recipientPhone: customerPhone,
        text: result.message,
        textFieldName: payload.textFieldName || process.env.BOT_NINJA_TEXT_FIELD || "mensagem",
        extraQuery: payload.extraQuery,
      });
    } catch (error) {
      sendError = error.message;
    }
  }

  rememberBotEvent({
    path: "/api/botninja/webhook",
    payload,
    extracted: {
      customerPhone,
      messageText,
      messageSource,
      isBotMessage,
    },
    autoReply,
    sendError,
  });

  sendJson(response, 200, {
    ok: true,
    received: true,
    extracted: {
      customerPhone,
      messageText,
      messageSource,
      isBotMessage,
    },
    result,
    sendResult,
    sendError,
    note:
      "Se o payload real do Bot Ninja usar campos com nomes diferentes, consulte /api/botninja/events para ver o ultimo corpo recebido e ajustar o parser.",
  });
}

function serveStaticFile(request, response) {
  const url = new URL(request.url, "http://localhost");
  const requestedPath =
    url.pathname === "/"
      ? "/index.html"
      : url.pathname.endsWith("/")
        ? `${url.pathname}index.html`
        : url.pathname;
  const filePath = path.join(root, decodeURIComponent(requestedPath));

  if (!filePath.startsWith(root)) {
    sendText(response, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendText(response, 404, "Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": types[path.extname(filePath)] || "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    });
    response.end(content);
  });
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    sendOptions(response);
    return;
  }

  const url = new URL(request.url, "http://localhost");

  try {
    if (request.method === "GET" && url.pathname === "/api/health") {
      sendJson(response, 200, {
        ok: true,
        service: "cakes-josy-silva-bot-bridge",
        port,
        minimumLeadDays: settings.minimumLeadDays,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/catalog") {
      sendJson(response, 200, {
        ok: true,
        catalog: buildCatalogPayload(),
      });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/catalog/lists") {
      sendJson(response, 200, {
        ok: true,
        lists: buildCatalogLists(),
      });
      return;
    }

    if (request.method === "GET" && url.pathname.startsWith("/api/receipts/")) {
      const imageSuffix = "/image.svg";
      const isImageRequest = url.pathname.endsWith(imageSuffix);
      const receiptId = decodeURIComponent(
        url.pathname
          .replace("/api/receipts/", "")
          .replace(imageSuffix, ""),
      );
      const receipt = recentReceipts.get(receiptId);

      if (!receipt) {
        sendText(response, 404, "Talão não encontrado.");
        return;
      }

      if (isImageRequest) {
        response.writeHead(200, {
          "Content-Type": "image/svg+xml; charset=utf-8",
          "Cache-Control": "no-store",
        });
        response.end(receipt.svg);
        return;
      }

      response.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      });
      response.end(receipt.html);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/quote/estimate") {
      await handleQuoteEstimate(request, response);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/quote/from-text") {
      await handleQuoteFromText(request, response);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/assistant/reply") {
      await handleAssistantReply(request, response);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/botninja/send") {
      await handleBotNinjaSend(request, response);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/botninja/webhook") {
      await handleBotNinjaWebhook(request, response);
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/botninja/events") {
      sendJson(response, 200, {
        ok: true,
        events: recentBotEvents,
      });
      return;
    }

    serveStaticFile(request, response);
  } catch (error) {
    sendJson(response, 500, {
      ok: false,
      error: error.message || "Erro interno no servidor.",
    });
  }
});

server.listen(port, () => {
  console.log(`Aplicacoes locais: http://localhost:${port}`);
  console.log(`API de orcamentos: http://localhost:${port}/api/health`);
});
