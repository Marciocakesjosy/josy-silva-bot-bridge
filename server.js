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
const recentConversationContexts = new Map();
const maxRecentConversationContexts = 200;
const storeInfo = {
  name: "Cakes Josy Silva",
  address: "Rua Antonio Feijo, Nº 30 - Loja C, 2725-223 Algueirao-Mem Martins",
  hours: "Segunda a sabado, das 10:00 as 18:00",
  whatsapp: "934555231",
  phone: "210162694",
  instagram: "https://www.instagram.com/cakesjosysilva/",
};

let sharpModule = null;

function getSharp() {
  if (!sharpModule) {
    sharpModule = require("sharp");
  }

  return sharpModule;
}

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
