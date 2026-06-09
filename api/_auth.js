import { createHmac, timingSafeEqual } from "node:crypto";

const cookieName = "ds_ops_session";
const sessionHours = 12;

function env(name) {
  return process.env[name] || "";
}

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

function sign(value) {
  const secret = env("SESSION_SECRET");
  if (!secret) throw new Error("SESSION_SECRET is not configured.");
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && timingSafeEqual(a, b);
}

export function sendJson(response, status, data, headers = {}) {
  response.statusCode = status;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.setHeader("cache-control", "no-store");
  Object.entries(headers).forEach(([key, value]) => response.setHeader(key, value));
  response.end(JSON.stringify(data));
}

export function parseCookies(request) {
  const header = request.headers.cookie || "";
  return Object.fromEntries(header.split(";").map((part) => {
    const [name, ...rest] = part.trim().split("=");
    return [name, rest.join("=")];
  }).filter(([name]) => name));
}

export function readBody(request) {
  if (request.body && typeof request.body === "object") {
    return Promise.resolve(request.body);
  }
  return new Promise((resolve) => {
    let raw = "";
    request.on("data", (chunk) => {
      raw += chunk;
    });
    request.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
    request.on("error", () => resolve({}));
  });
}

export function verifyCredentials(email, password) {
  const allowedEmail = env("APP_EMAIL") || "ds@ascenddebtrelief.com";
  const allowedPassword = env("APP_PASSWORD");
  if (!allowedPassword) {
    throw new Error("APP_PASSWORD is not configured.");
  }
  return safeEqual(String(email || "").trim().toLowerCase(), allowedEmail.toLowerCase())
    && safeEqual(String(password || ""), allowedPassword);
}

function isSecureRequest(request) {
  return request.headers["x-forwarded-proto"] === "https"
    || request.headers.host?.endsWith(".vercel.app");
}

export function createSessionCookie(email, request) {
  const expiresAt = Date.now() + sessionHours * 60 * 60 * 1000;
  const payload = base64url(JSON.stringify({ email, expiresAt }));
  const signature = sign(payload);
  const secure = isSecureRequest(request) ? "; Secure" : "";
  return `${cookieName}=${payload}.${signature}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionHours * 60 * 60}${secure}`;
}

export function clearSessionCookie(request) {
  const secure = isSecureRequest(request) ? "; Secure" : "";
  return `${cookieName}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`;
}

export function getSession(request) {
  const cookie = parseCookies(request)[cookieName];
  if (!cookie || !cookie.includes(".")) return null;
  const [payload, signature] = cookie.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!session.expiresAt || session.expiresAt < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export function requireSession(request, response) {
  const session = getSession(request);
  if (!session) {
    sendJson(response, 401, { error: "Login required." });
    return null;
  }
  return session;
}
