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
const storeInfo = {
  name: "Cakes Josy Silva",
  address: "Rua Antonio Feijo, Nº 30 - Loja C, 2725-223 Algueirao-Mem Martins",
  hours: "Segunda a sabado, das 10:00 as 18:00",
  whatsapp: "934555231",
  phone: "210162694",
  instagram: "https://www.instagram.com/cakesjosysilva/",
};

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
  return (
    findFirstString(payload, ["mensagem", "message", "body", "texto", "text", "content"]) ||
    (typeof rawBody === "string" && rawBody.trim() ? rawBody.trim() : null)
  );
}

function extractIncomingPhone(payload) {
  return findFirstString(payload, [
    "telefone_cliente",
    "telefone_contato",
    "telefone",
    "customerphone",
    "phone",
    "whatsapp",
    "from",
  ]);
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

function buildQuickReply(messageText) {
  const normalized = normalizeMessageText(messageText);
  const catalogLists = buildCatalogLists();

  if (!normalized) {
    return null;
  }

  if (matchesAny(normalized, [/\brecheio\b/, /\brecheios\b/, /\bsabores\b/])) {
    return {
      kind: "catalog_fillings",
      message: `${catalogLists.fillings}\n\nSe quiser, tambem posso ajudar a montar o seu orcamento.`,
    };
  }

  if (matchesAny(normalized, [/\bkit\b/, /\bkits\b/])) {
    return {
      kind: "catalog_kits",
      message: `${catalogLists.kits}\n\nSe quiser, diga a data, a massa e o recheio para eu montar o valor estimado.`,
    };
  }

  if (matchesAny(normalized, [/\bdoces\b/, /\bbrigadeiro\b/, /\bbrigadeiros\b/])) {
    return {
      kind: "catalog_sweets",
      message: `${catalogLists.sweets}\n\nSe quiser, posso continuar com o seu orcamento.`,
    };
  }

  if (matchesAny(normalized, [/\bsalgado\b/, /\bsalgados\b/, /\bempada\b/, /\bcoxinha\b/])) {
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
  const result = estimateQuote(parsed);
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

  const result = extractFromText(String(message), parsed.context || {});
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

  const result = buildAssistantReply(String(message), parsed.context || {});
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
  const customerPhone =
    payload.customerPhone ||
    payload.recipientPhone ||
    payload.telefone_cliente ||
    payload.telefone_destinatario ||
    extractIncomingPhone(payload);

  const context = payload.context && typeof payload.context === "object" ? payload.context : {};
  const result = messageText ? buildAssistantReply(messageText, context) : null;
  const autoReply =
    payload.autoReply !== undefined
      ? Boolean(payload.autoReply)
      : String(process.env.BOT_NINJA_AUTO_REPLY || "").toLowerCase() === "true";

  let sendResult = null;
  let sendError = null;

  if (autoReply && result?.message && customerPhone) {
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
